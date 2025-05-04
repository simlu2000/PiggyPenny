import React, { useEffect, useState } from "react";
import { auth } from "../Utils/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { onAuthStateChanged, deleteUser } from "firebase/auth";
import Navbar from "./Navbar";

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Container,
} from "@mui/material";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleDeleteAccount = async () => {
    if (!user) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      await deleteUser(user);
      toast.success("Account successfully deleted.");
      navigate("/");
    } catch (error) {
      console.error("Error deleting user:", error);
      if (error.code === "auth/requires-recent-login") {
        toast.error("You need to re-authenticate before deleting your account.");
      } else {
        toast.error("An error occurred while deleting your account.");
      }
    }
  };

  return (
    <>
      {user && <Navbar />}
      <ToastContainer />
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        {user && (
          <Card sx={{ boxShadow: 3, borderRadius: 3 }}>
            {user.photoURL && (
              <CardMedia
                component="img"
                image={user.photoURL}
                alt="Profile"
                sx={{
                  height: 200,
                  width: 200,
                  objectFit: "cover",
                  borderRadius: "50%",
                  mx: "auto",
                  mt: 2,
                }}
              />
            )}
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom align="center">
                {user.displayName || "No Name"}
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center">
                {user.email}
              </Typography>

              <Box mt={3} display="flex" justifyContent="center">
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}
      </Container>
    </>
  );
};

export default UserProfile;
