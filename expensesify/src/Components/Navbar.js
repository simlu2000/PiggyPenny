import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRectangleXmark, faPlus, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import AddExpense from './AddExpense';
import 'reactjs-popup/dist/index.css';
import Popup from "reactjs-popup";
import { onAuthStateChanged } from "firebase/auth";
import { signOut } from "firebase/auth";
import { auth } from "../Utils/firebaseConfig";

const Navbar = ({ addNewExpense }) => {
    const [popupOpen, setPopupOpen] = useState(false);
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
                <h2 id="nav-text">Expensisify</h2>
                <div>
                    <button className="nav-btn" onClick={() => setPopupOpen(true)}>
                        <FontAwesomeIcon icon={faPlus} />
                    </button>
                    {user && (
                        <button className="nav-btn" onClick={handleLogout}>
                            <FontAwesomeIcon icon={faRightFromBracket} />
                        </button>
                    )}
                </div>
            </header>

            {/* Popup che contiene il form per aggiungere spesa */}
            <Popup
                className="popup"
                open={popupOpen}
                onClose={() => setPopupOpen(false)}
                modal closeOnDocumentClick
                contentStyle={{ backgroundColor: '#E2E3F4', height: '45%', minWidth: '70%', maxWidth: '100%', maxHeight: '90vh' }}
            >
                <button className="close-popup" onClick={() => setPopupOpen(false)}>
                    <FontAwesomeIcon icon={faRectangleXmark} />
                </button>
                <AddExpense AddNewExpense={addNewExpense} />
            </Popup>
        </>
    );
};

export default Navbar;
