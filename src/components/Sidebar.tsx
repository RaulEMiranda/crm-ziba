"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InventoryIcon from "@mui/icons-material/Inventory";
import PeopleIcon from "@mui/icons-material/People";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import DashboardIcon from "@mui/icons-material/Dashboard";
// import CategoryIcon from "@mui/icons-material/Category";
import StoreIcon from "@mui/icons-material/Store";
import LogoutIcon from "@mui/icons-material/Logout"; // Icono para el botón de Cerrar sesión
import Link from "next/link";
import { Collapse } from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { usePathname } from "next/navigation";
import { signOut } from "firebase/auth"; // Importa signOut de Firebase
import { auth } from "@/firebase/config"; // Asegúrate de que esté correctamente importado
import { useRouter } from "next/navigation"; // Para la redirección después del logout

const drawerWidth = 240;

export default function ClippedDrawer() {
  const pathname = usePathname();
  const router = useRouter(); // Para la redirección
  const isInventarioOpen = pathname.startsWith("/inventario");

  const [openInventario, setOpenInventario] = React.useState(isInventarioOpen);

  const handleInventarioClick = () => {
    setOpenInventario(!openInventario);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); // Cierra sesión de Firebase
      router.push("/iniciar-sesion"); // Redirige a la página de inicio de sesión
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Sistema de Gestión Comercial
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between", // Esto asegura que el contenido del sidebar esté entre el contenido superior y el botón inferior
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto", flexGrow: 1 }}>
          <List>
            {[
              {
                text: "Dashboard",
                icon: <DashboardIcon />,
                path: "/",
              },
              {
                text: "Clientes",
                icon: <PeopleIcon />,
                path: "/clientes",
              },
              {
                text: "Ventas",
                icon: <MonetizationOnIcon />,
                path: "/ventas",
              },
            ].map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton component={Link} href={item.path}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
            <Divider />
            {/* Inventario con submenú */}
            <ListItem disablePadding>
              <ListItemButton onClick={handleInventarioClick}>
                <ListItemIcon>
                  <InventoryIcon />
                </ListItemIcon>
                <ListItemText primary="Inventario" />
                {openInventario ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItemButton>
            </ListItem>
            <Collapse in={openInventario} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    href="/inventario/productos"
                    sx={{ pl: 4 }}
                  >
                    <ListItemIcon>
                      <StoreIcon />
                    </ListItemIcon>
                    <ListItemText primary="Productos" />
                  </ListItemButton>
                </ListItem>
                {/* <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    href="/inventario/categorias"
                    sx={{ pl: 4 }}
                  >
                    <ListItemIcon>
                      <CategoryIcon />
                    </ListItemIcon>
                    <ListItemText primary="Categorías" />
                  </ListItemButton>
                </ListItem> */}
              </List>
            </Collapse>
          </List>
        </Box>
        <Divider />
        {/* Botón de Cerrar sesión */}
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Cerrar sesión" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
}
