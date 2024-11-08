import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faScaleBalanced, faScaleUnbalanced, faRemove, faEdit, faRectangleXmark, faSave, faPlus } from "@fortawesome/free-solid-svg-icons";
import AddExpense from './AddExpense';
import 'reactjs-popup/dist/index.css';
import Popup from "reactjs-popup";



const Overview = () => {

    const [expenses, setExpenses] = useState([]);
    const [balance, setBalance] = useState(0);
    const [Revenue, setRevenue] = useState(0);
    const [Outflows, setOutflows] = useState(0);
    const [editMode, setEditMode] = useState(false);
    const [editedExpense, setEditedExpense] = useState(null);
    const [popupOpen, setPopupOpen] = useState(false);

    // Caricamento spese da local storage
    useEffect(() => {
        const storedExpenses = localStorage.getItem("expenses");
        if (storedExpenses) {
            setExpenses(JSON.parse(storedExpenses)); // Se trovate spese, aggiorno stato spese con quelle trovate
        }
    }, []); //si esegue solo una volta al caricamento del componente

    // Quando lista spese cambia, aggiorno localStorage
    useEffect(() => {
        if (expenses.length > 0) {
            localStorage.setItem("expenses", JSON.stringify(expenses));
        }
    }, [expenses]);

    // Calcolo del saldo totale
    useEffect(() => {
        const balanceTot = expenses.reduce((acc, expense) => acc + expense.amount, 0);
        setBalance(balanceTot);
    }, [expenses]);

    // Calcolo del totale delle entrate
    useEffect(() => {
        const RevenueTot = expenses
            .filter((expense) => expense.type === "Revenue")
            .reduce((acc, expense) => acc + expense.amount, 0);
        setRevenue(RevenueTot);
    }, [expenses]);

    // Calcolo delle uscite
    useEffect(() => {
        const OutflowsTot = expenses
            .filter((expense) => expense.type === "Outflows")
            .reduce((acc, expense) => acc + expense.amount, 0);
        setOutflows(OutflowsTot);
    }, [expenses]);

    // Funzione per rimuovere spesa
    const handleRemove = (expenseId) => {
        const updatedExpenses = expenses.filter((expense) => expense.id !== expenseId);
        setExpenses(updatedExpenses);
    };

    // Ordinamento spese per giorno
    const sortedExpensesByDay = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Funzione per entrare in modalità di modifica/popup
    const handleEdit = (expense) => {
        setEditedExpense({ ...expense });  // Imposto spesa da modificare (copia dell'oggetto)
        setPopupOpen(true);  // Attivo popup modifica
    };

    // Funzione per salvare le modifiche
    const handleSaveEdit = () => {
        // Verifica se 'editedExpense' ha valori validi
        if (!editedExpense || !editedExpense.category || !editedExpense.amount) {
            alert("Please complete all fields.");
            return;
        }

        const updatedExpenses = expenses.map((expense) =>
            expense.id === editedExpense.id ? editedExpense : expense
        );
        setExpenses(updatedExpenses);
        setEditMode(false);  // Disattivo la modalità di modifica
        setEditedExpense(null);  // Resetto la spesa in modifica
    };

    // Funzione per annullare la modifica
    const handleCancelEdit = () => {
        setPopupOpen(false);  // Disattivo popup
        setEditedExpense(null);  // Resetta spesa in modifica
    };

    return (
        <>
            {/* Condizione per visualizzare quando non ci sono spese */}
            {expenses.length === 0 ? (
                <div>
                    <p>No expenses.</p>
                    <h2 id="text-add" className="title">Add a new Expense</h2>
                </div>
            ) : (
                <>
                    <h2 id="text-overview" className="title">Overview</h2>
                    <div id="user-situation">
                        <div className="user-container" id="balance">
                            {balance >= 0 ? (
                                <h3>
                                    <FontAwesomeIcon icon={faScaleBalanced} /> <br></br> {balance} €
                                </h3>
                            ) : (
                                <h3>
                                    <FontAwesomeIcon icon={faScaleUnbalanced} /> <br></br> -{Math.abs(balance)} €
                                </h3>
                            )}
                        </div>
                        <div className="user-container" id="revenue">
                            <h3>
                                <FontAwesomeIcon icon={faThumbsUp} /> <br></br> + {Revenue} €
                            </h3>
                        </div>
                        <div className="user-container" id="outflow">
                            <h3>
                                <FontAwesomeIcon icon={faThumbsDown} /> <br></br> {Outflows < 0 ? `- ${Math.abs(Outflows)} €` : `${Outflows} €`}
                            </h3>
                        </div>
                    </div>

                    {/*----------------EDIT MODE----------------*/}
                    {popupOpen && editedExpense && (
                        <Popup
                            className="popup"
                            open={popupOpen}
                            onClose={() => setPopupOpen(false)}
                            modal closeOnDocumentClick
                            contentStyle={{ backgroundColor: '#E2E3F4', height: '40%', minWidth: '25%', maxWidth: '30%', maxHeight: '80vh' }}
                        >
                            <button className="close-popup" onClick={() => setPopupOpen(false)}>
                                <FontAwesomeIcon icon={faRectangleXmark} />
                            </button>

                            <div className="edit-form">
                                <h2>
                                    Edit Expense
                                </h2>
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSaveEdit();
                                }}>
                                    <div className="field-area">

                                        <label>
                                            Category:
                                            <input
                                                type="text"
                                                value={editedExpense.category}
                                                onChange={(e) => setEditedExpense({ ...editedExpense, category: e.target.value })}
                                            />
                                        </label>
                                    </div>

                                    <div className="field-area">
                                        <label>
                                            Amount:
                                            <input
                                                type="number"
                                                value={editedExpense.amount}
                                                onChange={(e) => setEditedExpense({ ...editedExpense, amount: e.target.value })}
                                            />
                                        </label>
                                    </div>

                                    <div className="field-area">
                                        <label>
                                            Date:
                                            <input
                                                type="date"
                                                value={editedExpense.date}
                                                onChange={(e) => setEditedExpense({ ...editedExpense, date: e.target.value })}
                                            />
                                        </label>
                                    </div>

                                    <div className="field-area">
                                        <label>
                                            Description:
                                            <input
                                                type="text"
                                                value={editedExpense.description}
                                                onChange={(e) => setEditedExpense({ ...editedExpense, description: e.target.value })}
                                            />
                                        </label>
                                    </div>
                                    <br></br>
                                    <button className="edit btn-exp" type="button" onClick={handleSaveEdit}><FontAwesomeIcon icon={faSave} /></button>
                                </form>
                            </div>
                        </Popup>
                    )}

                    <table id="exp-table">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Category</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Description</th>
                            </tr>
                        </thead>

                        <tbody>
                            {sortedExpensesByDay.map((expense) => (
                                <tr key={expense.id}>
                                    {expense.type === "Revenue"
                                        ? <td className="positive">{expense.type}</td>
                                        : <td className="negative">{expense.type}</td>
                                    }
                                    <td>{expense.category}</td>
                                    {expense.type === "Revenue"
                                        ? <td className="positive">{expense.amount}</td>
                                        : <td className="negative">{expense.amount}</td>
                                    }
                                    <td>{expense.date}</td>
                                    <td>{expense.description}
                                        <button className="edit" onClick={() => handleEdit(expense)}>
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button className="remove" onClick={() => handleRemove(expense.id)}>
                                            <FontAwesomeIcon icon={faRemove} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}

        </>
    );
};

export default Overview;
