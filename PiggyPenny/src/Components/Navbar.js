import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../Utils/firebaseConfig";
import AddExpense from './AddExpense';

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Box,
  Tooltip,
  useMediaQuery
} from "@mui/material";

import { Add, Home, Logout, AccountCircle } from "@mui/icons-material";
import logo from '../Utils/logo-48x48.png';

const Navbar = ({ addNewExpense }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUser(user);
      else setUser(null);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        navigate('/');
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  return (
    <>
      <AppBar position="fixed" elevation={4} sx={{backgroundColor:'#ffffff',width:'100%',bottom:'0',top:'auto', color:'#000000'}}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/*<Box display="flex" alignItems="center">
            <Avatar src={logo} alt="logo" sx={{ mr: 1 }} />
          </Box>*/}

          <Box display="flex" alignItems="center" gap={10}>
            <Tooltip title="Home">
              <IconButton component={Link} to="/" color="inherit">
                <Home />
              </IconButton>
            </Tooltip>

            {location.pathname === "/" && user && (
              <Tooltip title="Add Expense">
                <IconButton color="inherit" onClick={() => setDialogOpen(true)}>
                  <Add />
                </IconButton>
              </Tooltip>
            )}

            {location.pathname === "/UserProfile" && user && (
              <Tooltip title="Logout">
                <IconButton color="inherit" onClick={handleLogout}>
                  <Logout />
                </IconButton>
              </Tooltip>
            )}

            {user && (
              <Tooltip title="Profile">
                <IconButton component={Link} to="/UserProfile" color="inherit">
                  <AccountCircle />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <AddExpense openDialog={dialogOpen} setOpenDialog={setDialogOpen} AddNewExpense={addNewExpense} />
    </>
  );
};

export default Navbar;
