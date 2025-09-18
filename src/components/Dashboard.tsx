import { Outlet, Link } from 'react-router-dom';
import { Fragment } from 'react/jsx-runtime';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import { Divider, ListItem, ListItemIcon } from '@mui/material';
// import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
// import CategoryIcon from '@mui/icons-material/Category';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const routes = [
  // {
  //   path: '/service',
  //   name: 'Service',
  //   icon: <MiscellaneousServicesIcon/>
  // },
  // {
  //   path: '/product',
  //   name: 'Products',
  //   icon: <CategoryIcon/>
  // },
  {
    path: '/proposal',
    name: 'Proposal',
    icon: <AddBusinessIcon/>
  },
  {
    path: '/employee',
    name: 'Employee',
    icon: <ManageAccountsIcon/>
  }
]

const drawerWidth = 240;

export default function Layout() {
  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
         <ToastContainer position="top-right" autoClose={3000} />
        <Box sx={{ overflow: 'auto', 
           backgroundColor: '#1f2937',
           color: 'white',
           height: '100vh'
           }}>
            <div>
          {/* <div className="text-3xl px-4 py-4 font7 gap-2 font-bold flex flex-row justify-start items-center">
            <img src="/archvid.svg" alt="ArchVid" className="w-10 h-10" /> */}
            <span className='text-3xl px-4 py-4 font7 gap-2 font-bold flex flex-row justify-start items-center'>DashBoard</span>

          </div>
          <Divider/>
          <List>
            {routes.map((route, index)=> (
               <Fragment key={route.path}>
               <ListItem component={Link} to={route.path}>
                 <ListItemIcon sx={{color: "white"}}>
                   {route.icon}
                 </ListItemIcon>
                 {route.name}
               </ListItem>
               {/* Divider after each item */}
               {index < routes.length - 1 && <Divider variant='middle' className='py-1' />}
             </Fragment>
              
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, }}>
        <Outlet/>
      </Box>
    </Box>
  );
}


