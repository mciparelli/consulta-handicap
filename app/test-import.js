import { date, hexToRGB } from "./utils";

// Test importing from utils.js
console.log("Import successful!");

// Test date function
const lastThursday = date.getLastThurs();
console.log(`Last Thursday was: ${date.format(lastThursday)}`);

// Test hexToRGB function
const rgbColor = hexToRGB("#FF5733", 0.8);
console.log(`Converted color: ${rgbColor}`);

export default function testImport() {
  return {
    success: true,
    message: "Successfully imported from ~/utils",
    importedFunctions: {
      date: typeof date === "object",
      hexToRGB: typeof hexToRGB === "function",
    },
  };
}
