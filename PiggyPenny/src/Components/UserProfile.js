import React, { useEffect, useState } from "react";
import { auth } from "../Utils/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, deleteUser } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        navigate("/"); // se non autenticato, rimanda alla home
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
    <div className="user-profile-container">
      <ToastContainer />
      <h2>User Profile</h2>
      {user && (
        <div className="profile-info">
          <p><strong>Name:</strong> {user.displayName}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <img src={user.photoURL} alt="Profile" width={100} style={{ borderRadius: "50%" }} />
          <button className="delete-button" onClick={handleDeleteAccount}>
            Delete Account
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
