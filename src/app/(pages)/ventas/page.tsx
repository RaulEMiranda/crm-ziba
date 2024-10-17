import { Box, Typography } from "@mui/material";
import Image from "next/image";

export default function UnderConstruction() {
  return (
    <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      p: 3,
    }}
    className="min-w-[750px]"
  >
    <Typography variant="h4" gutterBottom mb={5}>
      Estamos trabajando en esto...
    </Typography>
    <Image
      src="/images/working.jpg"
      alt="En construcción"
      width={500}
      height={500}
      className="rounded-full z-50 relative w-1/3 min-w-[275px]"
    />
  </Box>
  );
}
