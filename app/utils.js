function hexToRGB(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);

  if (alpha) {
    return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
  } else {
    return "rgb(" + r + ", " + g + ", " + b + ")";
  }
}

const date = {
  getLastThurs() {
    const lastThurs = new Date();
    while (lastThurs.getDay() !== 4) {
      lastThurs.setDate(lastThurs.getDate() - 1);
    }
    lastThurs.setHours(4, 0, 0);
    return lastThurs;
  },
  secondsToNextThursday() {
    const now = new Date();
    const nextThurs = date.getLastThurs();
    nextThurs.setDate(nextThurs.getDate() + 7);
    return Math.floor((nextThurs - now) / 1000);
  },
  format(date) {
    const formatter = new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'long' });
    return formatter.format(date);
  },
};

export { date, hexToRGB };
