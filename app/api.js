import cheerio from "cheerio";

const baseUrl = "https://www.aag.org.ar/cake/Usuarios/getTarjetas";

const getSelectedIds = (tarjetas) => {
  const all9Holes = tarjetas
    .filter((tarjeta) => tarjeta.is9Holes)
    .sort((a, b) => a.diferencial - b.diferencial);
  let selected9Holes = [];
  for (let i = 0; i < all9Holes.length; i += 2) {
    if (all9Holes[i + 1]) {
      selected9Holes = [
        ...selected9Holes,
        {
          ids: [all9Holes[i], all9Holes[i + 1]],
          is9: true,
          diferencial: all9Holes[i].diferencial + all9Holes[i + 1].diferencial,
        },
      ];
    }
  }
  let tarjetas18Holes = tarjetas.filter((tarjeta) => !tarjeta.is9Holes);
  const tarjetasToConsider = [...selected9Holes, ...tarjetas18Holes];
  return tarjetasToConsider
    .sort((a, b) => a.diferencial - b.diferencial)
    .map((t) => (t.is9 ? t.ids : t.id))
    .flat()
    .slice(0, 8);
};

const calcHandicapIndex = (tarjetas) => {
  const allDiferenciales9Holes = tarjetas
    .filter((tarjeta) => tarjeta.is9Holes)
    .map((tarjeta) => tarjeta.diferencial)
    .sort((a, b) => a - b);
  let diferenciales9Holes = [];
  for (let i = 0; i < allDiferenciales9Holes.length; i += 2) {
    if (allDiferenciales9Holes[i + 1]) {
      diferenciales9Holes = [
        ...diferenciales9Holes,
        allDiferenciales9Holes[i] + allDiferenciales9Holes[i + 1],
      ];
    }
  }

  let tarjetas18Holes = tarjetas.filter((tarjeta) => !tarjeta.is9Holes);

  const diferenciales18Holes = tarjetas18Holes.map(
    (tarjeta) => tarjeta.diferencial
  );

  const diferencialesToConsider = [
    ...diferenciales9Holes,
    ...diferenciales18Holes,
  ];
  return (
    diferencialesToConsider
      .sort((a, b) => a - b)
      .slice(0, 8)
      .reduce((acc, diferencial) => diferencial + acc, 0) / 8
  ).toFixed(1);
};

const getTarjetas = async (matricula) => {
  const response = await fetch(`${baseUrl}/${matricula}`);
  const result = await response.json();

  const allTarjetas = result.map((tarjeta) => {
    const [clubId, clubName] = tarjeta.NombreClub.split(" - ");
    const slopeRating = tarjeta.SlopeRating;
    const adjustedScore = tarjeta.ScoreAjustado;
    const courseRating = tarjeta.CourseRating;
    const PCC = tarjeta.PCC;
    const diferencial = tarjeta.Diferencial;
    const date = new Date(tarjeta.FechaTorneo);
    const formattedDate = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;
    const idTarjeta = `${clubId}-${formattedDate}-${diferencial}`;
    return {
      id: idTarjeta,
      isoDate: date.toISOString(),
      formattedDate,
      clubId,
      clubName,
      diferencial,
      score: tarjeta.Score,
      PCC,
      adjustedScore,
      courseRating,
      slopeRating,
      is9Holes: tarjeta.TipoTarjeta === "9",
      processed: tarjeta.Procesado,
    };
  });

  const [processed, unprocessed] = [[], []];

  for (let tarjeta of allTarjetas) {
    if (tarjeta.processed) {
      processed.push(tarjeta);
    } else {
      unprocessed.push(tarjeta);
    }
  }
  // dont care about older ones
  let last20Tarjetas = processed.slice(0, 20);
  const selectedIds = getSelectedIds(last20Tarjetas);
  last20Tarjetas = last20Tarjetas.map((tarjeta) => ({
    ...tarjeta,
    selected: selectedIds.includes(tarjeta.id),
  }));
  return [...unprocessed, ...last20Tarjetas];
};

const findPlayersFromVista = async (searchString) => {
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
        .map((index, el) => $(el).text().trim())
        .get();
      return {
        matricula,
        fullName,
        handicapIndex: handicapIndex.replace(",", "."),
        club,
      };
    })
    .get();
  return players;
};

export { getTarjetas, findPlayersFromVista };
