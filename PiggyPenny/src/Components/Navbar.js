import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import AddExpense from './AddExpense';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../Utils/firebaseConfig";
import logo from '../Utils/logo-48x48.png';

const Navbar = ({ addNewExpense }) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [user, setUser] = useState(null);
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
            <header className="navbar">
                {user ? (
                    <Link to="/UserProfile" id="nav-text" style={{ textDecoration: "none", color: "inherit" }}>
                        <img id="logo" src={logo} alt="logo" /> Hi {user.displayName}
                    </Link>
                ) : (
                    <div id="nav-text"><img id="logo" src={logo} /> Hi, you are not logged</div>
                )}
                <div>
                    <button className="nav-btn" onClick={() => setDialogOpen(true)}>
                        <FontAwesomeIcon icon={faPlus} />
                    </button>
                    {user && (
                        <button className="nav-btn" onClick={handleLogout}>
                            <FontAwesomeIcon icon={faRightFromBracket} />
                        </button>
                    )}
                </div>
            </header>

            {/* Dialog spesa */}
            <AddExpense openDialog={dialogOpen} setOpenDialog={setDialogOpen} AddNewExpense={addNewExpense} />
        </>
    );
};

export default Navbar;
