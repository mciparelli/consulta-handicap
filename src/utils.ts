export function hexToRGB(hex: string, alpha?: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  if (alpha !== undefined) {
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  } else {
    return `rgb(${r}, ${g}, ${b})`;
  }
}

export const date = {
  getLastThurs(): Date {
    const lastThurs = new Date();
    while (lastThurs.getDay() !== 4) {
      lastThurs.setDate(lastThurs.getDate() - 1);
    }
    lastThurs.setHours(4, 0, 0, 0);
    return lastThurs;
  },

  secondsToNextThursday(): number {
    const now = new Date();
    const nextThurs = date.getLastThurs();
    nextThurs.setDate(nextThurs.getDate() + 7);
    return Math.floor((nextThurs.getTime() - now.getTime()) / 1000);
  },

  format(d: Date): string {
    const formatter = new Intl.DateTimeFormat("es-AR", {
      day: "numeric",
      month: "long",
    });
    return formatter.format(d);
  },

  make7Am(auxDate: Date): Date {
    const timezoneHours = 3;
    const timeOfChange = 7;
    auxDate.setHours(auxDate.getHours() + timezoneHours + timeOfChange);
    return auxDate;
  },

  formatShort(d: Date): string {
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  },
};
