import cheerio from "cheerio";
import cache from "~/cache";
import { daysToSeconds } from "~/utils";
import { saveHistorico } from "./db.js";

async function savePlayersFound(players) {
  for (const player of players) {
    await saveHistorico(player.matricula, player.handicapIndex);
  }
}

async function findPlayersFromVista(searchString) {
  if (searchString.length < 3) return [];
  const cacheKey = `hcp:search:${searchString}`;
  const cacheValue = await cache.json.get(cacheKey);
  if (cacheValue) return cacheValue;
  const url = "http://www.vistagolf.com.ar/handicap/FiltroArg.asp";
  const isOnlyNumbers = /^\d+$/.test(searchString);
  const params = new URLSearchParams();
  const paramKey = isOnlyNumbers ? "TxtNroMatricula" : "TxtApellido";
  params.append(paramKey, searchString);
  const response = await fetch(url, { method: "POST", body: params });
  const buffer = await response.arrayBuffer();
  const result = new TextDecoder('ISO-8859-1').decode(buffer);
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
  savePlayersFound(players);
  cache.json.setex(cacheKey, daysToSeconds(0.4), players);
  return players;
}

export { findPlayersFromVista };
