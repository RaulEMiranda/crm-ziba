"use client";
import React, { useEffect, useState } from "react";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/config";
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
  Button,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import { Product } from "@/types/product";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useRouter } from "next/navigation";
import FullScreenLoader from "@/components/Loader";
import ConfirmDialog from "@/components/ConfirmDialog";


export default function ProductTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<keyof Product>("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el filtro de búsqueda
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false); // Estado para el modal de confirmación
  const [productToDelete, setProductToDelete] = useState<string | null>(null); // Estado para el producto a eliminar
  const [loading, setLoading] = useState(false); // Estado para controlar el loader
  const router = useRouter(); // Obtén el enrutador

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const productsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      setProducts(productsData);
    });
    return () => unsubscribe();
  }, []);

  const handleSort = (property: keyof Product) => {
    const isAsc = orderBy === property && orderDirection === "asc";
    setOrderDirection(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Filtrar los productos según el término de búsqueda
  const filteredProducts = products.filter((product) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      product.category.toLowerCase().includes(lowerCaseSearchTerm) ||
      product.color.toLowerCase().includes(lowerCaseSearchTerm)
    );
  });

  const sortedProducts = filteredProducts.sort((a, b) => {
    const aValue = a[orderBy];
    const bValue = b[orderBy];
    if (aValue === undefined) return 1;
    if (bValue === undefined) return -1;
    if (orderDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  // Filtrar los productos para mostrar solo los de la página actual
  const paginatedProducts = sortedProducts.slice(
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

  const handleOpenConfirm = (id: string) => {
    setProductToDelete(id);
    setOpenConfirmDelete(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirmDelete(false);
    setProductToDelete(null);
  };

  const handleDelete = async () => {
    if (productToDelete) {
      handleCloseConfirm(); // Cerrar el modal de confirmación
      setLoading(true); // Mostrar el loader antes de eliminar
      try {
        await deleteDoc(doc(db, "products", productToDelete));
        setProducts(
          products.filter((product) => product.id !== productToDelete)
        );
      } catch (error) {
        console.error("Error al eliminar el producto:", error);
      } finally {
        setLoading(false); // Ocultar el loader después de eliminar
      }
    }
  };

  const handleEdit = (id: string) => {
    console.log("Editar producto con id:", id);
  };

  const handleView = (id: string) => {
    router.push(`/inventario/productos/${id}`);
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
          Listado de Productos
        </Typography>
        <TextField
          label="Buscar"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: "300px", backgroundColor: "white", marginTop: "12px" }}
        />
      </Box>
      <TableContainer
        component={Paper}
        className="max-w-[1500px] mx-auto mt-5 border-[1px] bg-transparent"
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  maxWidth: "300px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }} // Estilo para limitar el ancho
              >
                <TableSortLabel
                  active={orderBy === "name"}
                  direction={orderBy === "name" ? orderDirection : "asc"}
                  onClick={() => handleSort("name")}
                >
                  Nombre
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "price"}
                  direction={orderBy === "price" ? orderDirection : "asc"}
                  onClick={() => handleSort("price")}
                >
                  Precio
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "category"}
                  direction={orderBy === "category" ? orderDirection : "asc"}
                  onClick={() => handleSort("category")}
                >
                  Categoría
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "barcode"}
                  direction={orderBy === "barcode" ? orderDirection : "asc"}
                  onClick={() => handleSort("barcode")}
                >
                  Stock
                </TableSortLabel>
              </TableCell>
              <TableCell>Color</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell
                  sx={{
                    maxWidth: "200px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }} // Estilo para limitar el ancho
                >
                  {product.name}
                </TableCell>
                <TableCell>S/{product.price}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.barcode.length}</TableCell>
                <TableCell>{product.color}</TableCell>
                <TableCell sx={{ minWidth: "390px" }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(product.id)}
                    sx={{ marginRight: "10px" }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleOpenConfirm(product.id)}
                    sx={{ marginRight: "10px" }}
                  >
                    Eliminar
                  </Button>
                  <Button
                    variant="outlined"
                    color="info"
                    startIcon={<VisibilityIcon />}
                    onClick={() => handleView(product.id)}
                  >
                    Ver
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={filteredProducts.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[8, 15, 30]}
      />

      {/* Componente de diálogo de confirmación para eliminar */}
      <ConfirmDialog
        open={openConfirmDelete}
        onClose={handleCloseConfirm}
        onConfirm={handleDelete}
        title="Confirmar eliminación"
        description="¿Estás seguro de que deseas eliminar este producto?"
      />

      {/* FullScreenLoader */}
      <FullScreenLoader loading={loading} />
    </>
  );
}
