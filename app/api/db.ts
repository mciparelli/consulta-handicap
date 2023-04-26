import { Kysely, SqliteDialect } from "kysely";
import { LibsqlDialect } from "@libsql/kysely-libsql";
import Database from "better-sqlite3";

interface handicap {
  date: string;
  handicapIndex: number;
  matricula: number;
}
interface jugador {
  matricula: number;
  fullName: string;
  clubName: string;
}
interface DB {
  handicap: handicap;
  jugadores: jugador;
}

const dialect = process.env.NODE_ENV === "production"
  ? new LibsqlDialect({
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_TOKEN,
  })
  : new SqliteDialect({
    database: new Database(process.env.DATABASE_URL as string),
  });

const db = new Kysely<DB>({
  dialect
});

const jugadores = {
  upsertMany(jugadores: jugador[]) {
    return db.insertInto("jugadores").values(jugadores).onConflict((oc) =>
      oc.column("matricula").doUpdateSet((eb) => ({
        fullName: eb.ref("excluded.fullName"),
        clubName: eb.ref("excluded.clubName"),
      }))
    ).execute();
  },
  async findWithLatestHandicap(matricula: jugador["matricula"]) {
    const player = await db.selectFrom(
      [
        "jugadores",
        (eb) =>
          eb.selectFrom("handicap").selectAll().orderBy("date", "desc").limit(1)
            .where("matricula", "is", matricula).as("handicap"),
      ],
    )
      .select([
        "jugadores.fullName",
        "jugadores.clubName",
        "handicap.date as handicapDate",
        "handicap.handicapIndex",
      ])
      .where("jugadores.matricula", "is", matricula)
      .executeTakeFirst();
    if (
      !player || !player.fullName || !player.clubName || !player.handicapIndex
    ) return null;
    return player;
  },
};

const handicap = {
  getHistorico(matricula: handicap["matricula"], monthsBack: number) {
    const date = new Date();
    date.setMonth(date.getMonth() - monthsBack);
    const dateString = date.toISOString().split("T")[0];
    return db.selectFrom("handicap").where("matricula", "is", matricula).where(
      "date",
      ">=",
      dateString,
    ).select(["date", "handicapIndex"]).execute();
  },
  upsertMany(handicaps: handicap[]) {
    return db.insertInto("handicap").values(handicaps).onConflict((oc) =>
      oc.columns(["date", "matricula"]).doUpdateSet((eb) => ({
        handicapIndex: eb.ref("excluded.handicapIndex"),
      }))
    ).executeTakeFirst();
  },
};

export { handicap, jugadores };
