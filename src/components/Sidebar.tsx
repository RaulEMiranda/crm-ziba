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
import StoreIcon from "@mui/icons-material/Store";
import LogoutIcon from "@mui/icons-material/Logout"; 
import Link from "next/link";
import { Collapse } from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import CategoryIcon from "@mui/icons-material/Category";
import { usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useRouter } from "next/navigation";

const drawerWidth = 240;

export default function ClippedDrawer() {
  const pathname = usePathname();
  const router = useRouter();
  const isInventarioOpen = pathname.startsWith("/inventario");
  const isVentasOpen = pathname.startsWith("/ventas");

  const [openInventario, setOpenInventario] = React.useState(isInventarioOpen);
  const [openVentas, setOpenVentas] = React.useState(isVentasOpen);

  const handleInventarioClick = () => {
    setOpenInventario(!openInventario);
  };

  const handleVentasClick = () => {
    setOpenVentas(!openVentas);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/iniciar-sesion");
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
            justifyContent: "space-between",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto", flexGrow: 1 }}>
          <List>
            {[{
              text: "Dashboard",
              icon: <DashboardIcon />,
              path: "/",
            },
            {
              text: "Clientes",
              icon: <PeopleIcon />,
              path: "/clientes",
            }].map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton component={Link} href={item.path}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}

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

            {/* Ventas con submenú */}
            <ListItem disablePadding>
              <ListItemButton onClick={handleVentasClick}>
                <ListItemIcon>
                  <MonetizationOnIcon />
                </ListItemIcon>
                <ListItemText primary="Ventas" />
                {openVentas ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItemButton>
            </ListItem>
            <Collapse in={openVentas} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    href="/ventas/generar-venta"
                    sx={{ pl: 4 }}
                  >
                    <ListItemIcon>
                      <MonetizationOnIcon />
                    </ListItemIcon>
                    <ListItemText primary="Generar Venta" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    href="/ventas/historial"
                    sx={{ pl: 4 }}
                  >
                    <ListItemIcon>
                      <MonetizationOnIcon />
                    </ListItemIcon>
                    <ListItemText primary="Historial de Ventas" />
                  </ListItemButton>
                </ListItem>
              </List>
            </Collapse>
          </List>
        </Box>
        <Divider />
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
