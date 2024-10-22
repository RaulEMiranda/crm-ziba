import { Box, Typography } from "@mui/material";
import GenBoletaForm from "./components/GenBoletaForm";

export default function GenBoleta() {
  return (
    <Box sx={{ p: 3 }} mt={10}>
      <Box sx={{ p: 3, mb: 4, backgroundColor: "#f5f5f5", borderRadius: 2 }}>
        <Typography variant="h6">Generar venta</Typography>
        <GenBoletaForm />
      </Box>
    </Box>
  );
}
