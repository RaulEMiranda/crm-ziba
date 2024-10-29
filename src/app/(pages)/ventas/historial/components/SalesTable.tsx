"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  TablePagination,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import { api } from "@/lib/utils";
import { Sale } from "@/types/sale";

export default function SalesTable() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<keyof Sale>("createdAt");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  console.log(loading);
  
  useEffect(() => {
    const fetchSales = async () => {
      setLoading(true);

      try {
        const response = await api.get("/sales");

        const salesData = response.data.map((sale: Sale) => {
          // Verificar si createdAt es un Timestamp
          const createdAtDate =
            sale.createdAt && sale.createdAt.seconds !== undefined
              ? new Date(sale.createdAt.seconds * 1000) // Convertir a Date usando seconds
              : sale.createdAt; // Si no es un Timestamp, se asume que ya es un Date o se usa como está

          console.log(createdAtDate);
          return {
            ...sale,
            createdAt: createdAtDate,
          };
        });

        setSales(salesData);
      } catch (error) {
        console.error("Error fetching sales:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  const handleSort = (property: keyof Sale) => {
    const isAsc = orderBy === property && orderDirection === "asc";
    setOrderDirection(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const filteredSales = sales.filter((sale) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      sale.clientId.toLowerCase().includes(lowerCaseSearchTerm) ||
      sale.priceTotal.toString().includes(lowerCaseSearchTerm)
    );
  });

  const sortedSales = filteredSales.sort((a, b) => {
    const aValue = a[orderBy];
    const bValue = b[orderBy];
    if (aValue === undefined) return 1;
    if (bValue === undefined) return -1;
    if (orderDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  const paginatedSales = sortedSales.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          mb: 2,
          textAlign: "center",
        }}
        className="max-w-[1500px] mx-auto"
      >
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Listado de Ventas
        </Typography>
        <TextField
          label="Buscar por Cliente o Precio"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: "300px", backgroundColor: "white", marginTop: "12px" }}
        />
      </Box>
      <TableContainer
        component={Paper}
        className="max-w-[1500px] mx-auto mt-5 border-[1px]"
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "clientId"}
                  direction={orderBy === "clientId" ? orderDirection : "asc"}
                  onClick={() => handleSort("clientId")}
                >
                  Cliente
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "priceTotal"}
                  direction={orderBy === "priceTotal" ? orderDirection : "asc"}
                  onClick={() => handleSort("priceTotal")}
                >
                  Total
                </TableSortLabel>
              </TableCell>
              <TableCell>Productos</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "createdAt"}
                  direction={orderBy === "createdAt" ? orderDirection : "asc"}
                  onClick={() => handleSort("createdAt")}
                >
                  Fecha
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedSales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>{sale.clientId}</TableCell>
                <TableCell>S/{sale.priceTotal}</TableCell>
                <TableCell sx={{ minWidth: "450px" }}>
                  {sale.products.map((product, index) => (
                    <div key={index}>
                      Producto ID: {product.productId} - Cantidad:{" "}
                      {product.quantity}
                      <br />
                      Códigos de Barras: {product.barcodes.join(", ")}
                    </div>
                  ))}
                </TableCell>
                <TableCell sx={{ minWidth: "230px" }}>
                  {sale.createdAt.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={filteredSales.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[8, 15, 30]}
      />
    </>
  );
}
