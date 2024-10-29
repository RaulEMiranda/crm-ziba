import { Box, Typography } from "@mui/material";
import SalesTable from "./components/SalesTable";

export default async function Historial() {
  return (
    <Box sx={{ p: 3 }} mt={10}>
      <Box sx={{ p: 3, mb: 4, backgroundColor: "#f5f5f5", borderRadius: 2 }}>
        <Typography variant="h2">Historial de ventas</Typography>
        <SalesTable />
      </Box>
  
    </Box>
  );
}
