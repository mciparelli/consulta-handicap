import cache from "~/cache";

let lastThurs = new Date();
lastThurs.setDate(
  lastThurs.getDate() - (lastThurs.getDay() + 3) % 7,
  0,
  0,
  0,
);
lastThurs.setUTCHours(0, 0, 0, 0);
const lastThursMs = lastThurs.getTime();

let threeMonthsAgoDate = new Date();
threeMonthsAgoDate.setMonth(threeMonthsAgoDate.getMonth() - 3);
const threeMonthsAgoMs = threeMonthsAgoDate.getTime();

const todayMs = (new Date()).getTime();

function saveHistorico(matricula, handicapIndex) {
  return cache.db.ZADD(`hcp:historic:${matricula}`, {
    score: lastThursMs,
    value: `${handicapIndex}:${lastThursMs}`,
  });
}

async function getHistorico(matricula) {
  const values = await cache.db.ZRANGEBYSCORE(
    `hcp:historic:${matricula}`,
    threeMonthsAgoMs,
    todayMs,
  );
  return values.map((value) => {
    const [handicapIndex, dateMs] = value.split(":").map(Number);
    return { handicapIndex, dateMs };
  });
}

export { getHistorico, saveHistorico };
