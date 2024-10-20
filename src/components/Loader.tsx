import React from "react";
import { CircularProgress, Backdrop } from "@mui/material";

interface LoaderProps {
  loading: boolean;
}

const FullScreenLoader: React.FC<LoaderProps> = ({ loading }) => {
  return (
    <Backdrop
      open={loading}
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 1300, // asegúrate de que esté en el frente
        backgroundColor: "rgba(0, 0, 0, 0.7)", // color semi-transparente
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress size={60} thickness={5} color="primary" />
    </Backdrop>
  );
};

export default FullScreenLoader;
