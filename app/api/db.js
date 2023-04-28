import { createClient } from "@libsql/client/web"

const db = createClient({
  url: Deno.env.get("DATABASE_URL"),
  authToken: Deno.env.get("DATABASE_TOKEN"),
});

const jugadores = {
  async upsertMany(jugadores) {
    for (let jugador of jugadores) {
      await db.execute({
        sql: 'insert into jugadores (matricula, clubName, fullName) values (:matricula, :clubName, :fullName) on conflict (matricula) do update set fullName = excluded.fullName, clubName = excluded.clubName',
        args: jugador
      })
    }
  },
  async findWithLatestHandicap(matricula) {
    const { rows: [player] } = await db.execute({
      sql: 'select h.date as handicapDate, h.handicapIndex, h.matricula, j.fullName, j.clubName from handicap h inner join jugadores j on h.matricula = j.matricula where h.matricula = :matricula order by date desc limit 1;',
      args: { matricula }
    });
    if (!player || !player.fullName || !player.clubName) return null;
    return player;
  },
};

const handicap = {
  async getHistorico(matricula, monthsBack) {
    const date = new Date();
    date.setMonth(date.getMonth() - monthsBack);
    const dateString = date.toISOString().split("T")[0];
    const result = await db.execute({
      sql: 'select date, handicapIndex from handicap where matricula is :matricula and date >= :dateString',
      args: { matricula, dateString }
    });
    return result.rows;
  },
  async upsertMany(handicaps) {
    for (let handicap of handicaps) {
      await db.execute({
        sql: 'insert into handicap (matricula, handicapIndex, date) values (:matricula, :handicapIndex, :date) on conflict (date, matricula) do update set handicapIndex = excluded.handicapIndex',
        args: handicap
      })
    }
  },
};

export { handicap, jugadores };
