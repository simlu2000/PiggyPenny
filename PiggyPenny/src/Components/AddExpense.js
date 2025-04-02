import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { Button, Snackbar, Alert } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const AddExpense = ({ AddNewExpense }) => {
    const [type, setType] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!amount || !date || !description || !type || !category) {
            alert("Fill all the data fields, please!");
            return;
        }

        const correctedAmount = type === 'Outflows' ? -Math.abs(parseFloat(amount)) : Math.abs(parseFloat(amount));

        const newExpense = {
            id: Date.now(),
            type,
            amount: correctedAmount,
            date,
            description,
            category,
        };

        AddNewExpense(newExpense); // Passa la nuova spesa al componente padre

        // Ripulisce i campi dopo l'invio
        setType('');
        setAmount('');
        setDate('');
        setDescription('');
        setCategory('');

        // Mostra il feedback visivo
        setOpenSnackbar(true);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    return (
        <div>
            <form id="add" onSubmit={handleSubmit}>
                <div className="field-area">
                    <label htmlFor="type">Type: </label>
                    <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="">Select + or -</option>
                        <option value="Revenue">+</option>
                        <option value="Outflows">-</option>
                    </select>
                </div>

                <div className="field-area">
                    <label htmlFor="amount">Amount: </label>
                    <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                </div>

                <div className="field-area">
                    <label htmlFor="category">Category: </label>
                    <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="">Select Category</option>
                        <option value="Car">Car</option>
                        <option value="Rent">Rent</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Health">Health</option>
                        <option value="Travel">Travel</option>
                        <option value="Salary">Salary</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="field-area">
                    <label htmlFor="date">Date: </label>
                    <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>

                <div className="field-area">
                    <label htmlFor="description">Description: </label>
                    <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} maxLength="25" required />
                </div>

                <Button type="submit" sx={{marginTop:'5%'}}variant="contained" color="secondary" startIcon={<FontAwesomeIcon icon={faAdd} />}>
                    Add
                </Button>
            </form>

            <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    <CheckCircleIcon style={{ marginRight: '8px' }} />
                    Expense added successfully!
                </Alert>
            </Snackbar>
        </div>
    );
};

export default AddExpense;