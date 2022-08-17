import {
  AppBar as AppBarMui,
  Box,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Link } from "@remix-run/react";
import PlayerChooser from "./player-chooser";

export default function AppBar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(() => theme.breakpoints.down("xs"));
  return (
    <AppBarMui position="static" sx={{ position: "sticky", top: 0, zIndex: 3 }}>
      <Toolbar sx={{ py: 2 }}>
        <Box
          flexDirection={{ xs: "column", sm: "row" }}
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography component={Link} sx={{ py: 1 }} variant="h5" to="/">
            Consulta de Hándicap
          </Typography>
          <PlayerChooser />
        </Box>
      </Toolbar>
    </AppBarMui>
  );
}
