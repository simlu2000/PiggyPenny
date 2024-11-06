import React, {useState,useEffect} from "react";

const ExpenseList = ({ expenses }) => {

    const[balance,setBalance]=useState(0);
    const[entry,setEntry]=useState(0);
    const[exit,setExit]=useState(0);

    useEffect( () => {
        const balanceTot = expenses.reduce( (acc, expense) => acc + expense.amount, 0);
        setBalance(balanceTot);
    }, [expenses]);

    useEffect( () => {
        const entryTot = expenses
        .filter( (expenses) => expenses.type === "Entry")
        .reduce( (acc, expense) => acc + expense.amount, 0);
        setEntry(entryTot);
    }, [expenses]);

    useEffect( () => {
        const exitTot = expenses
        .filter( (expenses) => expenses.type === "Exit")
        .reduce( (acc, expense) => acc + expense.amount, 0);
        setExit(exitTot);
    }, [expenses]);



    const sortedExpensesByDay = [...expenses].sort( (a,b) => new Date(b.date) - new Date(a.date));
    
    if(expenses.length === 0){
        return <p>No expenses.</p>
    }

    return(
        <>
            <h3>Balance: {balance >= 0 ? `${balance}€` : `-${Math.abs(balance)}€`}</h3>
            <h3>Entry: {`+${entry}€`}</h3>
            <h3>Exit: {`${exit}€`}</h3>

            <table>
                <thead> {/*colonne*/}
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
                            <td>{expense.type}</td>
                            <td>{expense.category}</td>
                            <td>{expense.amount}</td>
                            <td>{expense.date}</td>
                            <td>{expense.description}</td>
                            
                        </tr>
                        
                    ))}
                </tbody>

            </table>
        </>
    );
};
export default ExpenseList;