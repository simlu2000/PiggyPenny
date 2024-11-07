import React, {useState} from "react";
import './Styles/style.css';
import './Styles/styleNavbar.css';
import AddExpense from './Components/AddExpense';
import ExpenseList from './Components/ExpenseList';
import Navbar from "./Components/Navbar";

const App = () => {
  const[expenses,setExpenses] = useState([]);

  //funzione aggiunta spesa
  const handleAddExpense = (newExpense) => {
    setExpenses( (prevExpenses) => [...prevExpenses, newExpense]);
  };
  
  return (
    <div className="App">
      <Navbar/>
      <ExpenseList expenses={expenses}></ExpenseList>
    </div>
  );
};

export default App;
