import cheerio from "cheerio";

async function findPlayers(searchString) {
  const isOnlyNumbers = /^\d+$/.test(searchString);
  const params = new URLSearchParams();
  const paramKey = isOnlyNumbers ? "TxtNroMatricula" : "TxtApellido";
  params.append(paramKey, searchString);
  const response = await fetch(
    "http://www.vistagolf.com.ar/handicap/FiltroArg.asp",
    { method: "POST", body: params },
  );
  const buffer = await response.arrayBuffer();
  const result = new TextDecoder("ISO-8859-1").decode(buffer);
  const $ = cheerio.load(result);
  const untilDateText = $("#table31 tr:eq(1)").text().split(" ").pop().trim();
  const [untilDate, untilMonth, untilYear] = untilDateText.split("/").map(
    Number,
  );
  const hour = 4;
  const handicapDate = new Date(untilYear, untilMonth - 1, untilDate - 7, hour);
  return $("#table19 tr")
    .slice(2)
    .map((index, element) => {
      const [matricula, fullName, handicapIndex, clubName] = $("td", element)
        .map((index, el) =>
          $(el)
            .text()
            .trim()
        )
        .get();
      return {
        matricula: Number(matricula),
        fullName: fullName.replace(/\s\s+/g, " ").toLowerCase().trim(),
        handicapIndex: Number(handicapIndex.replace(",", ".")),
        handicapDate,
        clubName: clubName.toLowerCase().trim(),
      };
    })
    .get();
}

export { findPlayers };
