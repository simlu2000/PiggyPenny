import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faScaleBalanced, faScaleUnbalanced, faRemove, faEdit, faRectangleXmark, faSave, faPlus, faCar, faHome, faLightbulb, faFilm, faHeartbeat, faPlane, faMoneyBillWave, faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import 'reactjs-popup/dist/index.css';
import Popup from "reactjs-popup";
import Navbar from './Navbar';
import Filters from "./Filters";
import PieChart from "./PieChart";
import LinesChart from "./LinesChart";
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from '../Utils/firebaseConfig';
import BarsChart from "./BarsCharts";
import logo from '../Utils/logo-192x192.png'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Overview = () => {
    const [user, setUser] = useState(null);
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
    const navigate = useNavigate();

    // Caricamento spese da local storage
    useEffect(() => {
        const storedExpenses = localStorage.getItem("expenses");
        if (storedExpenses) {
            setExpenses(JSON.parse(storedExpenses));
        }
    }, []);

    // Quando lista spese cambia, aggiorno localStorage
    useEffect(() => {
        if (expenses.length > 0) {
            localStorage.setItem("expenses", JSON.stringify(expenses));
        }
    }, [expenses]);

    // Funzione filtro spese in base al periodo dato
    const filterExpensesByPeriod = (expenses, day, month, year) => {
        return expenses.filter((expense) => {
            const expenseDate = new Date(expense.date);

            const isSameDay = day ? expenseDate.getDate() === day : true;
            const isSameMonth = month ? expenseDate.getMonth() + 1 === month : true;
            const isSameYear = year ? expenseDate.getFullYear() === year : true;

            return isSameDay && isSameMonth && isSameYear;
        });
    };

    const filteredExpenses = filterExpensesByPeriod(expenses, selectedDay, selectedMonth, selectedYear) || [];

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
        setEditedExpense({ ...expense });
        setPopupOpen(true);
    };

    // Funzione per salvare le modifiche
    const handleSaveEdit = () => {
        if (!editedExpense || !editedExpense.category || !editedExpense.amount) {
            alert("Please complete all fields.");
            return;
        }

        const updatedExpenses = expenses.map((expense) =>
            expense.id === editedExpense.id ? editedExpense : expense
        );
        setExpenses(updatedExpenses);
        setEditMode(false);
        setEditedExpense(null);
    };

    const addNewExpense = (newExpense) => {
        setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
    };

    useEffect(() => {
        console.log("Selected filters:", selectedDay, selectedMonth, selectedYear);
    }, [selectedDay, selectedMonth, selectedYear]);

    const statsByPeriod = (expenses, period) => {
        const revenues = filteredExpenses
            .filter((expense) => expense.type === "Revenue")
            .reduce((acc, expense) => acc + expense.amount, 0);

        const outflows = filteredExpenses
            .filter((expense) => expense.type === "Outflows")
            .reduce((acc, expense) => acc + expense.amount, 0);

        const totbalance = revenues - outflows;

        return { revenues, outflows, totbalance };
    };

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


    const sortedExpenses = [...filteredExpenses].sort((a, b) => new Date(b.date) - new Date(a.date));
    const { revenues, outflows, totbalance } = statsByPeriod(filteredExpenses, period);
    const statsCategory = statsByCategory(filteredExpenses);

    // Aggiornamento stato utente
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

    //richiesta permesso invio notifiche
    const requestNotificationPermission = async () => {
        if ("Notification" in window) {
            const permission = await Notification.requestPermission();
            if (permission === "granted") {
                console.log("Notification permission granted.");
            } else {
                console.log("Notification permission denied.");
            }
        } else {
            console.log("This browser does not support notifications.");
        }
    };

    useEffect(() => {
        requestNotificationPermission();
    }, []);

    //Invio notifiche se il saldo è negativo
    useEffect(() => {
        if (totbalance < 0) {
            console.log("Negative balance!");

            // Mostra notifica con toast
            toast.error(`Balance alarm! Your balance is negative: ${totbalance} €`);

            // Mostra notifica di sistema se permesso
            if (Notification.permission === "granted") {
                new Notification("Balance Alarm", {
                    body: `Your balance is negative: ${totbalance} €`,
                    icon: logo
                });
            }
        }
    }, [totbalance]);



    return (
        <>
            {user && <Navbar addNewExpense={addNewExpense} />}

            <ToastContainer />

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
                    <img id="logo-intro" src={logo} />
                    <h1 id="intro-title">PiggyPenny</h1>
                    <h2 id="intro-subtitle">Sign in and manage your wallet</h2>
                    <button id="continueGoogle">
                        <p>
                            Continue
                        </p>
                    </button>
                </div>
            ) : (
                <>
                    {expenses.length > 0 ? (
                        <>
                            <h2 id="text-overview" className="title">Overview</h2>
                            <div className="user-situation">
                                <LinesChart expenses={filteredExpenses} />
                                <PieChart statsCategory={statsCategory} />
                            </div>

                            <h2 id="text-balance" className="title">Your balance</h2>
                            <div id="bar-container" className="user-situation">
                                <BarsChart expenses={filteredExpenses || []} selectedYear={selectedYear} />
                            </div>

                            {popupOpen && editedExpense && (
                                <Popup
                                    className="popup"
                                    open={popupOpen}
                                    onClose={() => setPopupOpen(false)}
                                    modal
                                    nested
                                >
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Category"
                                            value={editedExpense.category || ""}
                                            onChange={(e) =>
                                                setEditedExpense((prev) => ({ ...prev, category: e.target.value }))
                                            }
                                        />
                                        <input
                                            type="number"
                                            placeholder="Amount"
                                            value={editedExpense.amount || ""}
                                            onChange={(e) =>
                                                setEditedExpense((prev) => ({ ...prev, amount: parseFloat(e.target.value) }))
                                            }
                                        />
                                        <button onClick={handleSaveEdit}>
                                            <FontAwesomeIcon icon={faSave} />
                                        </button>
                                    </div>
                                </Popup>
                            )}

                            <h2 id="text-expenses" className="title">Your expenses</h2>
                            <div id="expenses-list" className="user-situation">
                                <ul>
                                    {sortedExpenses.map((expense) => (
                                        <li key={expense.id}>
                                            <span>{expense.category}</span> - <span>{expense.amount} €</span> - <span>{expense.date}</span>
                                            <button onClick={() => handleEdit(expense)}>
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                            <button onClick={() => handleRemove(expense.id)}>
                                                <FontAwesomeIcon icon={faRemove} />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    ) : (
                        <div id="no-expenses-message">
                            <h2>No expenses found. Start by adding some!</h2>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default Overview;
