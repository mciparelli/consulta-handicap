import cheerio from "cheerio";
import cache from "~/cache";
import { daysToSeconds } from "~/utils";
import { saveHistorico } from "./db.js";

async function findPlayersFromVista(searchString) {
  const cacheKey = `hcp:search:${searchString}`;
  const cacheValue = await cache.json.get(cacheKey);
  if (cacheValue) return cacheValue;
  const url = "http://www.vistagolf.com.ar/handicap/FiltroArg.asp";
  const isOnlyNumbers = /^\d+$/.test(searchString);
  const params = new URLSearchParams();
  const paramKey = isOnlyNumbers ? "TxtNroMatricula" : "TxtApellido";
  params.append(paramKey, searchString);
  const response = await fetch(url, { method: "POST", body: params });
  const result = await response.textConverted();
  const $ = cheerio.load(result);
  const players = $("#table19 tr")
    .slice(2)
    .map((index, element) => {
      const [matricula, fullName, handicapIndex, club] = $("td", element)
        .map((index, el) =>
          $(el)
            .text()
            .trim()
        )
        .get();
      return {
        matricula,
        fullName,
        handicapIndex: handicapIndex.replace(",", "."),
        club,
      };
    })
    .get();

  for (const player of players) {
    await saveHistorico(player.matricula, player.handicapIndex);
  }
  await cache.json.setex(cacheKey, daysToSeconds(0.4), players);
  return players;
}

export { findPlayersFromVista };
