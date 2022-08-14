import cache from "~/cache";

let threeMonthsAgoDate = new Date();
threeMonthsAgoDate.setMonth(threeMonthsAgoDate.getMonth() - 3);
const threeMonthsAgoMs = threeMonthsAgoDate.getTime();

const todayMs = (new Date()).getTime();

async function saveHistorico(matricula, handicapIndex) {
  let lastThurs = new Date();
  while (lastThurs.getDay() !== 4) {
    lastThurs.setDate(lastThurs.getDate() - 1);
  }
  lastThurs.setUTCHours(0, 0, 0, 0);
  const lastThursMs = lastThurs.getTime();
  const setKey = `hcp:historic:${matricula}`;
  const value = `${handicapIndex}:${lastThursMs}`;
  const score = await cache.db.ZSCORE(setKey, value);
  if (score) return null;
  return cache.db.ZADD(setKey, {
    score: lastThursMs,
    value,
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
