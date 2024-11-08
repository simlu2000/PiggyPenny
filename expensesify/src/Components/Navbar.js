import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRectangleXmark, faPlus } from "@fortawesome/free-solid-svg-icons";
import AddExpense from './AddExpense';
import 'reactjs-popup/dist/index.css';
import Popup from "reactjs-popup";

const Navbar = ({ addNewExpense }) => {
    const [popupOpen, setPopupOpen] = useState(false);

    return (
        <>
            <header className="navbar">
                <h2 id="nav-text">Expensify</h2>
                <button className="add-expense-btn" onClick={() => setPopupOpen(true)}>
                    <FontAwesomeIcon icon={faPlus} />
                </button>
            </header>

            {/* Popup che contiene il form per aggiungere spesa */}
            <Popup
                className="popup"
                open={popupOpen}
                onClose={() => setPopupOpen(false)}
                modal closeOnDocumentClick
                contentStyle={{ backgroundColor:'#E2E3F4', height: '45%', minWidth:'35%', maxWidth:'30%', maxHeight:'80vh' }}
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
