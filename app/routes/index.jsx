import { Box, Typography } from "@mui/material";
import { yearsToSeconds } from "~/utils";

export function headers() {
  return {
    "Cache-Control": `max-age=${yearsToSeconds(1)}, s-maxage=${yearsToSeconds(1)}`,
  };
}

export default function App() {
  return (
    <Box sx={{ m: "auto", p: 2, textAlign: "center" }}>
      <Typography variant="h4">Elija un jugador para consultar sus últimas 20 tarjetas.</Typography>
    </Box>
  );
}
