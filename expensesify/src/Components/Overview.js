import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faScaleBalanced, faScaleUnbalanced, faRemove, faEdit, faRectangleXmark, faSave, faPlus } from "@fortawesome/free-solid-svg-icons";
import AddExpense from './AddExpense';
import 'reactjs-popup/dist/index.css';
import Popup from "reactjs-popup";
import Navbar from './Navbar';

const Overview = () => {
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

    const addNewExpense = (newExpense) => {
        // Aggiorna lo stato con la nuova spesa
        setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
    };

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
    const sortedExpenses = [...filteredExpenses].sort((a, b) => new Date(b.date) - new Date(a.date)); //ordinamento spese fltrate

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

    const { revenues, outflows, totbalance } = statsByPeriod(filteredExpenses, period);
    const statsCategory = statsByCategory(filteredExpenses);


    return (
        <>
            <Navbar addNewExpense={addNewExpense} />  {/* Passiamo addNewExpense a Navbar */}

            {/*Filtro periodo*/}
            <div id="filter-area">
                <label>Day:</label>
                <select onChange={(e) => setSelectedDay(parseInt(e.target.value))} value={selectedDay || ''}>
                    <option value="">All</option>
                    {/* 
                        Al posto di scrivere tutti i giorni: 
                        Array(31) :serie di numeri da 1 a 31, una option per ogni elem 
                        Array(31).keys(): oggetto iterabile che contiene le chiavi dell'array (indici = giorni 0-30)
                        .map( (day) => ( ... )) : per trasformare ogni elem dell'array
                    */}
                    {[...Array(31).keys()].map((day) => (
                        <option key={day + 1} value={day + 1}>{day + 1}</option>
                    ))}
                </select>

                <label>Month:</label>
                <select onChange={(e) => setSelectedMonth(parseInt(e.target.value))} value={selectedMonth || ''}>
                    <option value="">All</option>
                    {[...Array(12).keys()].map((month) => (
                        <option key={month + 1} value={month + 1}>{month + 1}</option>
                    ))}
                </select>

                <label>Year:</label>
                <select onChange={(e) => setSelectedYear(parseInt(e.target.value))} value={selectedYear || ''}>
                    <option value="">All</option>
                    {Array.from(new Set(expenses.map((expense) => new Date(expense.date).getFullYear()))).map((year) => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>


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

                        {Object.keys(statsCategory).map((category) => (
                            <div className="stats-container" id="category-stats" key={category}>
                                <h3>{category}</h3>
                                <div>
                                    <FontAwesomeIcon icon={faThumbsUp} />
                                    <br></br>
                                    Revenue: {statsCategory[category].revenue} € 
                                </div>
                                <div>
                                    <FontAwesomeIcon icon={faThumbsDown} />
                                    <br></br>
                                    Outflows: {statsCategory[category].outflows} €
                                </div>
                            </div>
                        ))}



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
                                            onChange={(e) => setEditedExpense({ ...editedExpense, amount: e.target.value })}
                                        />
                                    </div>
                                    <div className="field-area">
                                        <label>Date:</label>
                                        <input
                                            type="date"
                                            value={editedExpense.date}
                                            onChange={(e) => setEditedExpense({ ...editedExpense, date: e.target.value })}
                                        />
                                    </div>
                                    <div className="field-area">
                                        <label>Description:</label>
                                        <input
                                            type="text"
                                            value={editedExpense.description}
                                            onChange={(e) => setEditedExpense({ ...editedExpense, description: e.target.value })}
                                        />
                                    </div>
                                    <button className="edit btn-exp" type="button" onClick={handleSaveEdit}>
                                        <FontAwesomeIcon icon={faSave} />
                                    </button>
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
                            {sortedExpenses.map((expense) => (
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
