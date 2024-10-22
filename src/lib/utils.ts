import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api", // Cambia esto según tu API
  timeout: 10000, // Tiempo de espera en milisegundos
  headers: {
    "Content-Type": "application/json",
  },
});
