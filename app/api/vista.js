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
  const [domUnparsed, monthString, yearUnparsed] = $("#table31 tr:eq(0)").text().split("/");
  const domString = domUnparsed.slice(-2);
  const yearString = yearUnparsed.slice(0, 4);
  const [untilDom, untilMonth, untilYear] = [domString, monthString, yearString].map(
    Number,
  );
  const handicapDate = new Date(untilYear, untilMonth - 1, untilDom - 7);
  return $("#table19 tr")
    .slice(2)
    .map((_index, element) => {
      const [matricula, fullName, handicapIndexString, clubName] = $(
        "td",
        element,
      )
        .map((_index, el) =>
          $(el)
            .text()
            .trim()
        )
        .get();
      let handicapIndex = Number(handicapIndexString.replace(",", "."));
      if (handicapIndexString === "+50") {
        handicapIndex = 54;
      } else if (handicapIndexString.startsWith("+")) {
        handicapIndex = handicapIndex * -1;
      }
      return {
        matricula: Number(matricula),
        fullName: fullName.replace(/\s\s+/g, " ").toLowerCase().trim(),
        handicapIndex,
        handicapDate: handicapDate.toISOString().split("T")[0],
        clubName: clubName.toLowerCase().trim(),
      };
    })
    .get();
}

export { findPlayers };
