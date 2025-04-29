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
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { auth, googleProvider } from '../Utils/firebaseConfig';
import BarsChart from "./BarsCharts";
import logo from '../Utils/logo-192x192.png'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Lottie from 'react-lottie';
import animationData from '../animations/Animation - 1742988499597.json';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';


const Overview = () => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        }
    }

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
    const [windowSize, setWindowSize] = useState(window.innerWidth);

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

    // Accesso Google
    const navigate = useNavigate();
    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            console.log("User logged in: ", user);
            setUser(user);
            navigate('/');
        } catch (error) {
            console.error("Error sign in with Google: ", error);
        }
    };

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


    useEffect(() => {
        const handleResize = () => {
            setWindowSize(window.innerWidth);
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

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
                <div id="intro-container" >
                    <Lottie options={defaultOptions} height={windowSize < 390 ? '250' : '400'} width={windowSize < 390 ? '250' : '400'} />
                    <h1 id="intro-title">PiggyPenny</h1>
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
                                    modal closeOnDocumentClick
                                    contentStyle={{ backgroundColor: '#E2E3F4', height: 'auto', minWidth: '80%', maxWidth: '90%', maxHeight: '80vh', overflowY: 'auto' }}
                                >
                                    <button className="close-popup" onClick={() => setPopupOpen(false)}>
                                        <FontAwesomeIcon icon={faRectangleXmark} />
                                    </button>

                                    <div className="edit-form">
                                        <h2>Edit Expense</h2>
                                        <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }}>
                                            <input type="text" placeholder="Expense category" value={editedExpense.category} onChange={(e) => setEditedExpense({ ...editedExpense, category: e.target.value })} />
                                            <input type="number" placeholder="Amount" value={editedExpense.amount} onChange={(e) => setEditedExpense({ ...editedExpense, amount: Number(e.target.value) })} />
                                            <input type="text" placeholder="Description" value={editedExpense.description} onChange={(e) => setEditedExpense({ ...editedExpense, description: e.target.value })} />
                                            <button type="submit" className="save-edit"><FontAwesomeIcon icon={faSave} /> Save</button>
                                        </form>
                                    </div>
                                </Popup>
                            )}

                            <h2 id="text-table" className="title">All your expenses</h2>
                            <div id="data-area">
                                <div className="user-container" id="balance">
                                    {balance >= 0 ? (
                                        <h3><FontAwesomeIcon icon={faScaleBalanced} /> {balance} €</h3>
                                    ) : (
                                        <h3><FontAwesomeIcon icon={faScaleUnbalanced} /> -{Math.abs(balance)} €</h3>
                                    )}
                                </div>
                                <div className="user-container" id="revenue">
                                    <h3><FontAwesomeIcon icon={faThumbsUp} /> + {Revenue} €</h3>
                                </div>
                                <div className="user-container" id="outflow">
                                    <h3><FontAwesomeIcon icon={faThumbsDown} /> {Outflows < 0 ? `- ${Math.abs(Outflows)} €` : `${Outflows} €`}</h3>
                                </div>
                            </div>

                            <button
                                style={{
                                    margin: '1rem',
                                    padding: '0.5rem 1rem',
                                    backgroundColor: '#6C63FF',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                }}
                                onClick={() => navigate('/profile')}
                            >
                                Your profile
                            </button>
                            <TableContainer component={Paper}>
                                <Table id="exp-table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>+/-</TableCell>
                                            <TableCell>Category</TableCell>
                                            <TableCell>Amount</TableCell>
                                            <TableCell>Date</TableCell>
                                            <TableCell>Description</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {sortedExpenses.map((expense) => (
                                            <TableRow key={expense.id}>
                                                <TableCell>{expense.type === "Revenue" ? <FontAwesomeIcon icon={faThumbsUp} /> : <FontAwesomeIcon icon={faThumbsDown} />}</TableCell>
                                                <TableCell>
                                                    {expense.category === "Car" && <FontAwesomeIcon icon={faCar} />}
                                                    {expense.category === "Rent" && <FontAwesomeIcon icon={faHome} />}
                                                    {expense.category === "Utilities" && <FontAwesomeIcon icon={faLightbulb} />}
                                                    {expense.category === "Entertainment" && <FontAwesomeIcon icon={faFilm} />}
                                                    {expense.category === "Health" && <FontAwesomeIcon icon={faHeartbeat} />}
                                                    {expense.category === "Travel" && <FontAwesomeIcon icon={faPlane} />}
                                                    {expense.category === "Salary" && <FontAwesomeIcon icon={faMoneyBillWave} />}
                                                    {expense.category === "Other" && <FontAwesomeIcon icon={faEllipsisH} />}
                                                </TableCell>
                                                <TableCell>{expense.type === "Revenue" ? expense.amount : expense.amount}</TableCell>
                                                <TableCell>{expense.date}</TableCell>
                                                <TableCell>
                                                    {expense.description}
                                                    <button className="edit" onClick={() => handleEdit(expense)}><FontAwesomeIcon icon={faEdit} /></button>
                                                    <button className="remove" onClick={() => handleRemove(expense.id)}><FontAwesomeIcon icon={faRemove} /></button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </>
                    ) : (
                        <div className="empty">
                            <h2 id="text-no-expenses">No expenses for this period</h2>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default Overview;