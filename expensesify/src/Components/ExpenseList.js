import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faScaleBalanced, faScaleUnbalanced, faRemove, faEdit, faRectangleXmark, faSave } from "@fortawesome/free-solid-svg-icons";
import AddExpense from './AddExpense';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

const ExpenseList = () => {

    const [expenses, setExpenses] = useState([]);
    const [balance, setBalance] = useState(0);
    const [Revenue, setRevenue] = useState(0);
    const [Outflows, setOutflows] = useState(0);
    const [editMode, setEditMode] = useState(false);
    const [editedExpense, setEditedExpense] = useState(null);

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


    useEffect(() => {
        const balanceTot = expenses.reduce((acc, expense) => acc + expense.amount, 0);
        setBalance(balanceTot);
    }, [expenses]);


    useEffect(() => {
        const RevenueTot = expenses
            .filter((expense) => expense.type === "Revenue")
            .reduce((acc, expense) => acc + expense.amount, 0);
        setRevenue(RevenueTot);
    }, [expenses]);


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

    // Funzione per aggiungere spesa
    const addNewExpense = (newExpense) => {
        const updatedExpenses = [...expenses, newExpense];
        setExpenses(updatedExpenses); // Aggiunge nuova spesa alla lista
    };

    // Ordinamento spese per giorno
    const sortedExpensesByDay = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Funzione per entrare in modalità di modifica
    const handleEdit = (expense) => {
        setEditedExpense(expense);  // Imposto spesa da modificare
        setEditMode(true);  // Attivo modalità di modifica
    };

    // Funzione per salvare le modifiche
    const handleSaveEdit = (updatedExpense) => {
        const updatedExpenses = expenses.map((expense) =>
            expense.id === updatedExpense.id ? updatedExpense : expense
        );
        setExpenses(updatedExpenses);
        setEditMode(false);  // Disattivo la modalità di modifica
        setEditedExpense(null);  // Resetto la spesa in modifica
    };

    // Funzione per annullare la modifica
    const handleCancelEdit = () => {
        setEditMode(false);  // Disattivo modifica
        setEditedExpense(null);  // Resetta spesa n modifica
    };

    if (expenses.length === 0) {
        return <p>No expenses.</p>;
    }



    return (
        <>
            {expenses.length === 0 ? (
                <div>
                    <p>No expenses.</p>
                    <h2 id="text-add" className="title">Add a new Expense</h2>
                    <AddExpense AddNewExpense={addNewExpense} />
                </div>
            ) : (
                <>
                    <h2 id="text-your" className="title">Your Expenses</h2>
                    <div id="user-situation">
                        <div className="user-container" id="balance">
                            {balance >= 0 ?
                                <h3>
                                    <FontAwesomeIcon icon={faScaleBalanced} /> {balance} €
                                </h3>
                                :
                                <h3>
                                    <FontAwesomeIcon icon={faScaleUnbalanced} /> -{Math.abs(balance)} €
                                </h3>
                            }
                        </div>
                        <div className="user-container" id="revenue">
                            <h3>
                                <FontAwesomeIcon icon={faThumbsUp} /> + {Revenue} €
                            </h3>
                        </div>
                        <div className="user-container" id="outflow">
                            <h3>
                                <FontAwesomeIcon icon={faThumbsDown} /> {Outflows < 0 ? `- ${Math.abs(Outflows)} €` : `${Outflows} €`}
                            </h3>

                        </div>
                    </div>

                    {/*----------------EDIT MODE----------------*/}
                    {editMode && editedExpense && (
                        <div className="edit-form">
                            <h2>Edit Expense</h2>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                handleSaveEdit(editedExpense);
                            }}>
                                <label>
                                    Category:
                                    <input
                                        type="text"
                                        value={editedExpense.category}
                                        onChange={(e) => setEditedExpense({ ...editedExpense, category: e.target.value })}
                                    />
                                </label>
                                <label>
                                    Amount:
                                    <input
                                        type="number"
                                        value={editedExpense.amount}
                                        onChange={(e) => setEditedExpense({ ...editedExpense, amount: e.target.value })}
                                    />
                                </label>
                                <label>
                                    Date:
                                    <input
                                        type="date"
                                        value={editedExpense.date}
                                        onChange={(e) => setEditedExpense({ ...editedExpense, date: e.target.value })}
                                    />
                                </label>
                                <label>
                                    Description:
                                    <input
                                        type="text"
                                        value={editedExpense.description}
                                        onChange={(e) => setEditedExpense({ ...editedExpense, description: e.target.value })}
                                    />
                                </label>
                                <button className="edit btn-exp" type="submit"><FontAwesomeIcon icon={faSave}/></button>
                                <button className="remove btn-exp" type="button" onClick={handleCancelEdit}><FontAwesomeIcon icon={faRectangleXmark}/></button>
                            </form>
                        </div>
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


            <h2 id="text-add" className="title">Add a new Expense</h2>
            <AddExpense AddNewExpense={addNewExpense} />
        </>
    );
};

export default ExpenseList;
