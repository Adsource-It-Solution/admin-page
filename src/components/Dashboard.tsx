import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import {
  Divider,
  ListItem,
  ListItemIcon,
  IconButton,
  Typography,
  Toolbar,
  AppBar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChecklistIcon from "@mui/icons-material/Checklist";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import RecyclingIcon from "@mui/icons-material/Recycling";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const routes = [
  { path: "/proposal", name: "Proposal", icon: <AddBusinessIcon /> },
  { path: "/proposallist", name: "Proposal List", icon: <ChecklistIcon /> },
  { path: "/recycle", name: "Recycle Bin", icon: <RecyclingIcon /> },
  { path: "/ourclient", name: "Our Client", icon: <ListAltIcon /> },
  { path: "/employee", name: "Employee", icon: <ManageAccountsIcon /> },
  { path: "/employeeclient", name: "Employee Work", icon: <ManageAccountsIcon /> },
];



const drawerWidth = 240;

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box
      sx={{
        overflow: "auto",
        backgroundColor: "#1f2937",
        color: "white",
        height: "100%",
      }}
    >
      <Typography
        variant="h5"
        fontWeight="bold"
        textAlign="center"
        sx={{ py: 2 }}
      >
        Dashboard
      </Typography>
      <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)" }} />

      <List>
        {routes.map((route, index) => (
          <Box key={route.path}>
            <ListItem
              component={Link}
              to={route.path}
              sx={{
                color: "white",
                "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
              }}
              onClick={() => setMobileOpen(false)} // close drawer on mobile after click
            >
              <ListItemIcon sx={{ color: "white" }}>{route.icon}</ListItemIcon>
              {route.name}
            </ListItem>
            {index < routes.length - 1 && (
              <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)" }} />
            )}
          </Box>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* ✅ Top App Bar for mobile */}
      <AppBar
        position="fixed"
        sx={{
          display: { sm: "none" },
          backgroundColor: "#1f2937",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* ✅ Sidebar Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Temporary Drawer for mobile */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Permanent Drawer for desktop */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* ✅ Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        {/* Add space for the AppBar on mobile */}
        <Toolbar sx={{ display: { sm: "none" } }} />
        <Outlet />
      </Box>
    </Box>
  );
}
