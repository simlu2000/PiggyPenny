import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faScaleBalanced, faScaleUnbalanced, faRemove, faEdit, faRectangleXmark, faSave, faPlus, faCar, faHome, faLightbulb, faFilm, faHeartbeat, faPlane, faMoneyBillWave, faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import 'reactjs-popup/dist/index.css';
import Popup from "reactjs-popup";
import Navbar from './Navbar';
import Filters from "./Filters";
import PieChart from "./PieChart";
import LinesChart from "./LinesChart";
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { auth, googleProvider } from '../Utils/firebaseConfig';
import { onAuthStateChanged } from "firebase/auth";

const Overview = () => {

    const [user, setUser] = useState(null); // Stato per gestire l'utente
    const [expenses, setExpenses] = useState([]);
    const [balance, setBalance] = useState(0);
    const [Revenue, setRevenue] = useState(0);
    const [Outflows, setOutflows] = useState(0);
    const [editMode, setEditMode] = useState(false);
    const [editedExpense, setEditedExpense] = useState(null);
    const [popupOpen, setPopupOpen] = useState(false);
    const [period, setPeriod] = useState("day");
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);

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

    /*Fuzione filtro spese in base al periodo dato*/
    const filterExpensesByPeriod = (expenses, day, month, year) => {
        return expenses.filter((expense) => {
            const expenseDate = new Date(expense.date);

            const isSameDay = day ? expenseDate.getDate() === day : true;
            const isSameMonth = month ? expenseDate.getMonth() + 1 === month : true;
            const isSameYear = year ? expenseDate.getFullYear() === year : true;

            return isSameDay && isSameMonth && isSameYear;
        });
    };

    const filteredExpenses = filterExpensesByPeriod(expenses, selectedDay, selectedMonth, selectedYear);

    // Calcolo del saldo totale
    useEffect(() => {
        const balanceTot = filteredExpenses.reduce((acc, expense) => acc + expense.amount, 0);
        setBalance(balanceTot);
    }, [filteredExpenses]);

    // Calcolo entrate
    useEffect(() => {
        const RevenueTot = filteredExpenses
            .filter((expense) => expense.type === "Revenue")
            .reduce((acc, expense) => acc + expense.amount, 0);
        setRevenue(RevenueTot);
    }, [filteredExpenses]);

    // Calcolo uscite
    useEffect(() => {
        const OutflowsTot = filteredExpenses
            .filter((expense) => expense.type === "Outflows")
            .reduce((acc, expense) => acc + expense.amount, 0);
        setOutflows(OutflowsTot);
    }, [filteredExpenses]);

    // Funzione per rimuovere spesa
    const handleRemove = (expenseId) => {
        const updatedExpenses = expenses.filter((expense) => expense.id !== expenseId);
        setExpenses(updatedExpenses);
    };

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

    const addNewExpense = (newExpense) => {
        // Aggiorna lo stato con la nuova spesa
        setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
    };



    useEffect(() => {
        console.log("Selected filters:", selectedDay, selectedMonth, selectedYear);
    }, [selectedDay, selectedMonth, selectedYear]);


    /*Calcolo statistiche periodo*/
    const statsByPeriod = (expenses, period) => {

        /*tot entrate*/
        const revenues = filteredExpenses
            .filter((expense) => expense.type === "Revenue")
            .reduce((acc, expense) => acc + expense.amount, 0);

        /*tot uscite*/
        const outflows = filteredExpenses
            .filter((expense) => expense.type === "Outflows")
            .reduce((acc, expense) => acc + expense.amount, 0);

        /*bilancio*/
        const totbalance = revenues - outflows;

        return {
            revenues, outflows, balance,
        };
    };

    /*Calcolo statistiche per categoria*/
    const statsByCategory = (expenses) => {
        return expenses.reduce((acc, expense) => {
            const { category, amount, type } = expense;

            if (!acc[category]) {
                acc[category] = { revenue: 0, outflows: 0 };
            }

            if (type === "Revenue") {
                acc[category].revenue += amount;
            } else if (type === "Outflows") {
                acc[category].outflows += amount;
            }
            return acc;
        }, {});
    };

    const sortedExpenses = [...filteredExpenses].sort((a, b) => new Date(b.date) - new Date(a.date)); //ordinamento spese fltrate

    const { revenues, outflows, totbalance } = statsByPeriod(filteredExpenses, period);
    const statsCategory = statsByCategory(filteredExpenses);

    // Accesso Google
    const navigate = useNavigate();
    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            console.log("User logged in: ", user);
            setUser(user);  // Aggiorna lo stato utente
            navigate('/');
        } catch (error) {
            console.error("Error sign in with Google: ", error);
        }
    };

    //Aggiornamento stato utente
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


    return (
        <>

            {user && (
                <Navbar addNewExpense={addNewExpense} />

            )}

            <div id="actions">
                {user && (
                    <Filters
                        selectedDay={selectedDay}
                        selectedMonth={selectedMonth}
                        selectedYear={selectedYear}
                        setSelectedDay={setSelectedDay}
                        setSelectedMonth={setSelectedMonth}
                        setSelectedYear={setSelectedYear}
                        expenses={expenses}
                    />
                )}
            </div>

            {!user ? (
                <div id="intro-container">
                    <h1 id="intro-title">Expensisify</h1>
                    <h2 id="intro-subtitle">Sign in and manage your wallet</h2>
                    <button id="continueGoogle" onClick={handleGoogleSignIn}>
                        <p>
                            <FontAwesomeIcon icon={faGoogle} style={{ color: "#FFFFFF" }} />
                            &nbsp;Continue with Google
                        </p>
                    </button>
                </div>
            ) : (
                <>
                    {expenses.length > 0 ? (
                        <>
                            <h2 id="text-overview" className="title">Overview</h2>
                            <div id="user-situation">
                                <LinesChart expenses={filteredExpenses} />
                                <PieChart statsCategory={statsCategory} />
                            </div>


                            {/* Popup per modifica spesa */}
                            {popupOpen && editedExpense && (
                                <Popup
                                    className="popup"
                                    open={popupOpen}
                                    onClose={() => setPopupOpen(false)}
                                    modal closeOnDocumentClick
                                    contentStyle={{ backgroundColor: '#E2E3F4', height: '50%', minWidth: '80%', maxWidth: '100%', maxHeight: '80vh' }}
                                >
                                    <button className="close-popup" onClick={() => setPopupOpen(false)}>
                                        <FontAwesomeIcon icon={faRectangleXmark} />
                                    </button>

                                    <div className="edit-form">
                                        <h2>Edit Expense</h2>
                                        <form onSubmit={(e) => {
                                            e.preventDefault();
                                            handleSaveEdit();
                                        }}>
                                            <div className="field-area">
                                                <label>Category:</label>
                                                <input
                                                    type="text"
                                                    value={editedExpense.category}
                                                    onChange={(e) => setEditedExpense({ ...editedExpense, category: e.target.value })}
                                                />
                                            </div>
                                            <div className="field-area">
                                                <label>Amount:</label>
                                                <input
                                                    type="number"
                                                    value={editedExpense.amount}
                                                    onChange={(e) => setEditedExpense({ ...editedExpense, amount: parseFloat(e.target.value) })}
                                                />
                                            </div>
                                            <button className="action-btn" type="submit">
                                                <FontAwesomeIcon icon={faSave} />
                                                &nbsp; Save changes
                                            </button>
                                        </form>
                                    </div>
                                </Popup>
                            )}

                            <h2 id="text-table" className="title">Your expenses</h2>
                            <div id="data-area">
                                <div className="user-container" id="balance">
                                    {balance >= 0 ? (
                                        <h3>
                                            <FontAwesomeIcon icon={faScaleBalanced} /> {balance} €
                                        </h3>
                                    ) : (
                                        <h3>
                                            <FontAwesomeIcon icon={faScaleUnbalanced} /> -{Math.abs(balance)} €
                                        </h3>
                                    )}
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

                            <table id="exp-table">

                                <thead>
                                    <tr>
                                        <th>+/-</th>
                                        <th>Category</th>
                                        <th>Amount</th>
                                        <th>Date</th>
                                        <th>Description</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {sortedExpenses.map((expense) => (
                                        <tr key={expense.id}>
                                            {expense.type === "Revenue"
                                                ? <td className="positive"><FontAwesomeIcon icon={faThumbsUp} /></td>
                                                : <td className="negative"><FontAwesomeIcon icon={faThumbsDown} /></td>
                                            }
                                            <td>
                                                {expense.category === "Car" && <FontAwesomeIcon icon={faCar} />}
                                                {expense.category === "Rent" && <FontAwesomeIcon icon={faHome} />}
                                                {expense.category === "Utilities" && <FontAwesomeIcon icon={faLightbulb} />}
                                                {expense.category === "Entertainment" && <FontAwesomeIcon icon={faFilm} />}
                                                {expense.category === "Health" && <FontAwesomeIcon icon={faHeartbeat} />}
                                                {expense.category === "Travel" && <FontAwesomeIcon icon={faPlane} />}
                                                {expense.category === "Salary" && <FontAwesomeIcon icon={faMoneyBillWave} />}
                                                {expense.category === "Other" && <FontAwesomeIcon icon={faEllipsisH} />}
                                            </td>
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
                    ) : (
                        <p>Enter new expenses to started!</p>
                    )}
                </>
            )}
        </>
    );
};

export default Overview;
