import { sql } from "kysely";
import { getKyselyClient } from "./client";
import type { Handicap, Jugadores } from "./schema";

export function makeDb(env: Env) {
	const db = getKyselyClient(env);
	const jugadores = {
		async upsertMany(jugadores: Jugadores[]) {
			for (const jugador of jugadores) {
				await db
						.insertInto("jugadores")
						.values({
							matricula: jugador.matricula,
							clubName: jugador.clubName,
							fullName: jugador.fullName,
						})
						.onConflict((oc) =>
							oc.column("matricula").doUpdateSet((eb) => ({
								fullName: eb.ref("excluded.fullName"),
								clubName: eb.ref("excluded.clubName"),
							})),
						)
						.execute();
			}
		},
		async findWithLatestHandicap(matricula: Jugadores.matricula) {
			const player = await db
				.selectFrom("handicap as h")
				.innerJoin("jugadores as j", "h.matricula", "j.matricula")
				.select([
					"h.date as handicapDate",
					"h.handicapIndex",
					"h.matricula",
					"j.fullName",
					"j.clubName",
				])
				.where("h.matricula", "=", matricula)
				.orderBy("date", "desc")
				.limit(1)
				.executeTakeFirst();

			if (!player || !player.fullName || !player.clubName) return null;
			return player;
		},
	};

	const handicap = {
		async getHistorico(matricula, monthsBack) {
			const date = new Date();
			date.setMonth(date.getMonth() - monthsBack);
			const dateString = date.toISOString().split("T")[0];

			const result = await db
				.selectFrom("handicap")
				.select(["date", "handicapIndex"])
				.where("matricula", "=", matricula)
				.where("date", ">=", dateString)
				.execute();

			return result;
		},
		async upsertMany(handicaps) {
			for (const handicap of handicaps) {
				await db
					.insertInto("handicap")
					.values({
						matricula: handicap.matricula,
						handicapIndex: handicap.handicapIndex,
						date: handicap.date,
					})
					.onConflict((oc) =>
						oc.columns(["date", "matricula"]).doUpdateSet((eb) => ({
							handicapIndex: eb.ref("excluded.handicapIndex"),
						})),
					)
					.execute();
			}
		},
	};

	return { handicap, jugadores };
}
