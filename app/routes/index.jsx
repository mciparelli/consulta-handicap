import { Box, Typography } from "@mui/material";

export default function App() {
  return (
    <Box sx={{ m: "auto", p: 2, textAlign: "center" }}>
      <Typography variant="h4">
        Elija un jugador para consultar sus últimas 20 tarjetas.
      </Typography>
    </Box>
  );
}
