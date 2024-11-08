import React, {useState} from "react";
import './Styles/style.css';
import './Styles/styleOverview.css';
import './Styles/styleNavbar.css';
import AddExpense from './Components/AddExpense';
import Overview from './Components/Overview';
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
      <Overview expenses={expenses}/>
    </div>
  );
};

export default App;
