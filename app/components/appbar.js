import {
  Box,
  AppBar as AppBarMui,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function AppBar({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(() => theme.breakpoints.down("xs"));
  return (
    <AppBarMui position="static" sx={{position: 'sticky', top: 0, zIndex: 3}}>
      <Toolbar sx={{ py: 2 }}>
        <Box
          flexDirection={{xs: 'column', sm: 'row'}}
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography sx={{ py: 1 }} variant="h5">
            Consulta de Hándicap
          </Typography>
          {children}
        </Box>
      </Toolbar>
    </AppBarMui>
  );
}
