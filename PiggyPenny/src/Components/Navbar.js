import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRectangleXmark, faPlus, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import AddExpense from './AddExpense';
import Popup from "reactjs-popup";
import { onAuthStateChanged } from "firebase/auth";
import { signOut } from "firebase/auth";
import { auth } from "../Utils/firebaseConfig";
import logo from '../Utils/logo-48x48.png';
import { AppBar, Toolbar, IconButton, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Add, Logout } from '@mui/icons-material';

const Navbar = ({ addNewExpense }) => {
    const [popupOpen, setPopupOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [value, setValue] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                console.log("User signed out");
                setUser(null);
                navigate('/');
            })
            .catch((error) => {
                console.error("Error signing out: ", error);
            });
    };

    return (
        <>
            {/*Navbar per desktops*/}
            <AppBar position="static" color="transparent" elevation={0} className="navbar" sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Toolbar style={{ justifyContent: "space-between" }}>
                    <div id="nav-text">
                        <img id="logo" src={logo} alt="Logo" />
                        {user ? ` Hi ${user.displayName}` : " Hi, you are not logged"}
                    </div>
                    <div>
                        <IconButton className="nav-btn" onClick={() => setPopupOpen(true)}>
                            <FontAwesomeIcon icon={faPlus} />
                        </IconButton>
                        {user && (
                            <IconButton className="nav-btn" onClick={handleLogout}>
                                <FontAwesomeIcon icon={faRightFromBracket} />
                            </IconButton>
                        )}
                    </div>
                </Toolbar>
            </AppBar>

            {/* Popup aggiunta spesa */}
            <Popup
                className="popup"
                open={popupOpen}
                onClose={() => setPopupOpen(false)}
                modal
                closeOnDocumentClick
                contentStyle={{ backgroundColor: '#E2E3F4', height: '45%', minWidth: '70%', maxWidth: '100%', maxHeight: '90vh' }}
            >
                <button className="close-popup" onClick={() => setPopupOpen(false)}>
                    <FontAwesomeIcon icon={faRectangleXmark} />
                </button>
                <AddExpense AddNewExpense={addNewExpense} />
            </Popup>

            {/* Bottom App Bar per mobile */}
            <BottomNavigation
                className="mobile-bottom-nav"
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
                sx={{ display: { xs: 'flex', sm: 'none' }, position: 'fixed', bottom: 0, width: '100vw', left:0 }}
            >
                <BottomNavigationAction
                    label="Add"
                    icon={<Add />}
                    onClick={() => setPopupOpen(true)}
                />
                {user && (
                    <BottomNavigationAction
                        label="Logout"
                        icon={<Logout />}
                        onClick={handleLogout}
                    />
                )}
            </BottomNavigation>
        </>
    );
};

export default Navbar;