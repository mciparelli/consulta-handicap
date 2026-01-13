import * as cheerio from "cheerio";
import type { Player } from "~/types";

export async function findPlayers(searchString: string): Promise<Player[]> {
  const isOnlyNumbers = /^\d+$/.test(searchString);
  const params = new URLSearchParams();
  const paramKey = isOnlyNumbers ? "TxtNroMatricula" : "TxtApellido";
  params.append(paramKey, searchString);

  const response = await fetch(
    "http://www.vistagolf.com.ar/handicap/FiltroArg.asp",
    { method: "POST", body: params }
  );

  const buffer = await response.arrayBuffer();
  const result = new TextDecoder("ISO-8859-1").decode(buffer);
  const $ = cheerio.load(result);

  const [domUnparsed, monthString, yearUnparsed] = $("#table31 tr:eq(0)")
    .text()
    .split("/");
  const domString = domUnparsed.slice(-2);
  const yearString = yearUnparsed.slice(0, 4);
  const [untilDom, untilMonth, untilYear] = [domString, monthString, yearString].map(
    Number
  );
  const handicapDate = new Date(untilYear, untilMonth - 1, untilDom - 7);

  const players: Player[] = [];

  $("#table19 tr")
    .slice(2)
    .each((_index, element) => {
      const cells = $("td", element)
        .map((_i, el) => $(el).text().trim())
        .get();

      const [matriculaStr, fullNameRaw, handicapIndexString, clubNameRaw] = cells;

      let handicapIndex = Number(handicapIndexString.replace(",", "."));
      if (handicapIndexString === "+50") {
        handicapIndex = 54;
      } else if (handicapIndexString.startsWith("+")) {
        handicapIndex = handicapIndex * -1;
      }

      players.push({
        matricula: Number(matriculaStr.replace(/\D/g, "")),
        fullName: fullNameRaw.replace(/\s\s+/g, " ").toLowerCase().trim(),
        handicapIndex,
        handicapDate: handicapDate.toISOString().split("T")[0],
        clubName: clubNameRaw.toLowerCase().trim(),
      });
    });

  return players;
}
