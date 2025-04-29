import React, { useState } from "react";
import './Styles/style.css';
import './Styles/styleOverview.css';
import './Styles/styleNavbar.css';
import AddExpense from './Components/AddExpense';
import Overview from './Components/Overview';
import Navbar from "./Components/Navbar";
import UserProfile from "./Components/UserProfile";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  const [expenses, setExpenses] = useState([]);

  //funzione aggiunta spesa
  const handleAddExpense = (newExpense) => {
    setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Overview expenses={expenses} />} />
          <Route path="/UserProfile" element={<UserProfile/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
