import { query, withTransaction, type DbContext } from "~/db/libsql-client";
import type { Player, HandicapRecord } from "~/types";

export const jugadores = {
  async upsertMany(
    players: Array<{ matricula: number; clubName: string; fullName: string }>,
    context: DbContext
  ): Promise<void> {
    await withTransaction(context, async (client) => {
      for (const jugador of players) {
        await client.execute({
          sql: `INSERT INTO jugadores (matricula, clubName, fullName)
                VALUES (?, ?, ?)
                ON CONFLICT (matricula)
                DO UPDATE SET fullName = excluded.fullName, clubName = excluded.clubName`,
          args: [jugador.matricula, jugador.clubName, jugador.fullName],
        });
      }
    });
  },

  async findWithLatestHandicap(matricula: number, context: DbContext): Promise<Player | null> {
    const result = await query(
      context,
      `SELECT h.date AS handicapDate, h.handicapIndex, h.matricula, j.fullName, j.clubName
       FROM handicap h
       INNER JOIN jugadores j ON h.matricula = j.matricula
       WHERE h.matricula = ?
       ORDER BY date DESC LIMIT 1`,
      [matricula]
    );

    const row = result.rows[0];
    if (!row || !row.fullName || !row.clubName) return null;

    return {
      matricula: Number(row.matricula),
      fullName: String(row.fullName),
      clubName: String(row.clubName),
      handicapIndex: Number(row.handicapIndex),
      handicapDate: String(row.handicapDate),
    };
  },
};

export const handicap = {
  async getHistorico(
    matricula: number,
    monthsBack: number,
    context: DbContext
  ): Promise<Array<{ date: string; handicapIndex: number }>> {
    const d = new Date();
    d.setMonth(d.getMonth() - monthsBack);
    const dateString = d.toISOString().split("T")[0];

    const result = await query(
      context,
      `SELECT date, handicapIndex
       FROM handicap
       WHERE matricula = ? AND date >= ?`,
      [matricula, dateString]
    );

    return result.rows.map((row) => ({
      date: String(row.date),
      handicapIndex: Number(row.handicapIndex),
    }));
  },

  async upsertMany(handicaps: HandicapRecord[], context: DbContext): Promise<void> {
    await withTransaction(context, async (client) => {
      for (const h of handicaps) {
        await client.execute({
          sql: `INSERT INTO handicap (matricula, handicapIndex, date)
                VALUES (?, ?, ?)
                ON CONFLICT (date, matricula)
                DO UPDATE SET handicapIndex = excluded.handicapIndex`,
          args: [h.matricula, h.handicapIndex, h.date],
        });
      }
    });
  },
};

export async function createSchema(context: DbContext): Promise<void> {
  await withTransaction(context, async (client) => {
    await client.execute({
      sql: `CREATE TABLE IF NOT EXISTS jugadores (
        matricula TEXT PRIMARY KEY,
        fullName TEXT NOT NULL,
        clubName TEXT NOT NULL
      )`,
      args: [],
    });

    await client.execute({
      sql: `CREATE TABLE IF NOT EXISTS handicap (
        matricula TEXT NOT NULL,
        handicapIndex REAL NOT NULL,
        date TEXT NOT NULL,
        PRIMARY KEY (matricula, date),
        FOREIGN KEY (matricula) REFERENCES jugadores(matricula)
      )`,
      args: [],
    });

    console.log("Database schema created successfully");
  });
}
