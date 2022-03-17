function hexToRGB(hex, alpha) {
  var r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);

  if (alpha) {
    return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
  } else {
    return "rgb(" + r + ", " + g + ", " + b + ")";
  }
}

function daysToSeconds(days) {
  return 60 * 60 * 24 * days;
}

function yearsToSeconds(years) {
  return daysToSeconds(years * 365);
}

export { hexToRGB, yearsToSeconds, daysToSeconds };
