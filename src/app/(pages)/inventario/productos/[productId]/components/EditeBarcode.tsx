import React, { useState } from "react";
import { Modal, Box, Button, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { db } from "@/firebase/config";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import FullScreenLoader from "@/components/Loader";

interface EditBarcodeModalProps {
  open: boolean;
  handleClose: () => void;
  barcode: string;
  productId: string;
}

const EditBarcodeModal: React.FC<EditBarcodeModalProps> = ({
  open,
  handleClose,
  barcode,
  productId,
}) => {
  const { control, handleSubmit, reset } = useForm<{ barcode: string }>({
    defaultValues: { barcode },
  });

  const [loading, setLoading] = useState(false);

  const handleEditBarcode = async (data: { barcode: string }) => {
    setLoading(true);
    handleClose(); // Cierra la modal para mostrar el FullScreenLoader

    try {
      const productRef = doc(db, "products", productId);
      const productSnapshot = await getDoc(productRef); // Use getDoc to fetch the document

      if (productSnapshot.exists()) {
        const productData = productSnapshot.data();
        const updatedBarcodes = productData.barcode.map((code: string) =>
          code === barcode ? data.barcode : code
        );

        await updateDoc(productRef, { barcode: updatedBarcodes });
      }

      reset();
      // Note: No es necesario llamar a handleClose() aquí
    } catch (error) {
      console.error("Error updating barcode:", error);
    } finally {
      setLoading(false);
      // Aquí puedes volver a abrir modal si deseas o indicar que ha terminado la edición si fuera necesario
    }
  };

  return (
    <>
      {loading ? (
        <FullScreenLoader loading={loading} /> // Muestra el loader si está cargando
      ) : (
        <Modal open={open} onClose={handleClose}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" component="h2" gutterBottom>
              Editar Código de Barras
            </Typography>

            <Box component="form" onSubmit={handleSubmit(handleEditBarcode)}>
              <Controller
                name="barcode"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nuevo Código de Barras"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                  />
                )}
              />

              <Box display="flex" justifyContent="space-between" mt={2}>
                <Button variant="contained" color="primary" type="submit">
                  Guardar
                </Button>
                <Button variant="outlined" onClick={handleClose}>
                  Cancelar
                </Button>
              </Box>
            </Box>
          </Box>
        </Modal>
      )}
    </>
  );
};

export default EditBarcodeModal;
