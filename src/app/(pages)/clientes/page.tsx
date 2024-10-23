'use client';
import { Client } from "@/types/client";
import { Box, Table,Paper, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, TableSortLabel } from "@mui/material";
import { useEffect, useState } from "react";
import { collection, onSnapshot} from "firebase/firestore";
import { db } from "@/firebase/config";

export default function UnderConstruction() {
  const [clients, setClients] = useState<Client[]>([]);
  const [orderBy, setOrderBy] = useState<keyof Client>("name");
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "clients"), (snapshot) => {
      const clientsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Client[];
      setClients(clientsData);
      console.log(clientsData);
      
    });
    return () => unsubscribe();
  }, []);

  const handleSort = (property: keyof Client) => {
    const isAsc = orderBy === property && orderDirection === "asc";
    setOrderDirection(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Filtrar los clientes según el término de búsqueda
  const filteredClients = clients.filter((client) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      client.name.toLowerCase().includes(lowerCaseSearchTerm)
      
    );
  });

  const sortedClients = filteredClients.sort((a, b) => {
    const aValue = a[orderBy];
    const bValue = b[orderBy];
    if (aValue === undefined) return 1;
    if (bValue === undefined) return -1;
    if (orderDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });


  const paginatedClients = sortedClients.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 3 }} mt={10}>
      {/*Contenedor para clientes*/}
      <Box sx={{ p: 3, mb: 4, backgroundColor: "#f5f5f5", borderRadius: 2 }}>
        <Box 
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          mb: 2,
          textAlign: "center",
        }}
        className="max-w-[1500px] mx-auto">
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Listado de Clientes
          </Typography>
        </Box>
        <TableContainer
        component={Paper}
        className="max-w-[1500px] mx-auto mt-5 border-[1px] bg-transparent">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                sx={{
                  maxWidth: "300px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontWeight: "bold",
                }}>
                  DNI
                </TableCell>
                <TableCell
                sx={{
                  fontWeight: "bold",
                }}>
                  <TableSortLabel
                  active={orderBy === "name"}
                  direction={orderBy === "name" ? orderDirection : "asc"}
                  onClick={() => handleSort("name")}>
                    Nombre
                  </TableSortLabel>
                </TableCell>
                <TableCell
                sx={{
                  fontWeight: "bold",
                }}>
                  Correo
                </TableCell>
                <TableCell
                sx={{
                  fontWeight: "bold",
                }}>
                  Teléfono
                </TableCell>
                <TableCell
                sx={{
                  fontWeight: "bold",
                }}>
                  Dirección
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {paginatedClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell
                  sx={{
                    maxWidth: "200px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }} // Estilo para limitar el ancho
                >
                  {client.dni}
                </TableCell>
                <TableCell>S/{client.name}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.phone}</TableCell>
                <TableCell>{client.address}</TableCell>
              </TableRow>
            ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {/*Contenedor extra, por definir*/}
    </Box>
  );
}
