"use client";

import { useForm } from "react-hook-form";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/config";
import { setPersistence, browserLocalPersistence } from "firebase/auth";
import { useEffect, useState } from "react";
import { Box, TextField, Button, Typography, Container } from "@mui/material";

interface FormData {
  email: string;
  password: string;
}

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }, // Obtener `isSubmitting`
    reset,
  } = useForm<FormData>();
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null); // Estado local para gestionar el error

  useEffect(() => {
    const setAuthPersistence = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
      } catch (e) {
        console.error("Error setting auth persistence:", e);
      }
    };
    setAuthPersistence();
  }, []);

  const handleSignIn = async (data: FormData) => {
    setAuthError(null); // Limpiar error antes de intentar el login
    const { email, password } = data;
    try {
      const res = await signInWithEmailAndPassword(email, password);
      if (res && res.user) {
        reset();
        router.push("/inventario/productos");
      }
    } catch (e) {
      console.error("Error en la contraseña o correo", e);
      setAuthError("Login failed"); // Solo establecer el error si falla
    }
  };

  return (
    <Container
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1a202c",
      }}
      maxWidth=""
    >
      <Box
        sx={{
          backgroundColor: "#2d3748",
          p: 5,
          borderRadius: 2,
          boxShadow: 3,
          width: 1,
          maxWidth: 400,
        }}
      >
        <Typography component="h1" variant="h5" color="white" mb={2}>
          Iniciar Sesion
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(handleSignIn)}
          sx={{ width: "100%" }}
        >
          <TextField
            margin="normal"
            fullWidth
            label="correo"
            type="email"
            {...register("email", { required: true })}
            error={!!errors.email}
            helperText={errors.email ? "Ingresa un correo válido" : ""}
            sx={{
              mb: 2,
              "& .MuiInputBase-root": {
                backgroundColor: "#ff00000", // Fondo del input
                color: "white", // Color del texto
              },
              "& .MuiInputLabel-root": {
                color: "#cbd5e0", // Color del label cuando no está en focus
              },
              "& .Mui-focused .MuiInputLabel-root": {
                color: "#63b3ed", // Color del label cuando está en focus
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#a0aec0", // Color del borde cuando no está en focus
                },
                "&:hover fieldset": {
                  borderColor: "#cbd5e0", // Color del borde al hacer hover
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#63b3ed", // Color del borde cuando está en focus
                },
              },
            }}
          />

          <TextField
            margin="normal"
            fullWidth
            label="contraseña"
            type="password"
            {...register("password", { required: true })}
            error={!!errors.password}
            helperText={errors.password ? "Contraseña es requerida" : ""}
            sx={{
              mb: 2,
              "& .MuiInputBase-root": {
                backgroundColor: "#4a5568",
                color: "white",
              },
              "& .MuiInputLabel-root": {
                color: "#cbd5e0", // Color del label cuando no está en focus
              },
              "& .Mui-focused .MuiInputLabel-root": {
                color: "#63b3ed", // Color del label cuando está en focus
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#a0aec0", // Color del borde cuando no está en focus
                },
                "&:hover fieldset": {
                  borderColor: "#cbd5e0", // Color del borde al hacer hover
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#63b3ed", // Color del borde cuando está en focus
                },
              },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: "#4c51bf",
              "&:hover": { backgroundColor: "#5a67d8" },
              color: "white",
              py: 1.5,
            }}
            disabled={isSubmitting} // Usar `isSubmitting` de react-hook-form
          >
            <Typography
              variant="button" // Utiliza el variant adecuado para el estilo de botón
              sx={{ fontWeight: "bold", fontSize: "1rem" }} // Aplica estilos adicionales si es necesario
            >
              {isSubmitting ? "Ingresando..." : "Inicio de sesión"}
            </Typography>
          </Button>
        </Box>
        {authError && (
          <Typography color="error" variant="body2" mt={2}>
            {authError}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default SignIn;
