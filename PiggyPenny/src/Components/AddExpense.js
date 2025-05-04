import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import {
  Snackbar,
  Alert,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Slide,
  Box,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AddExpense = ({ AddNewExpense, openDialog, setOpenDialog }) => {
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

    AddNewExpense(newExpense);

    // Reset campi
    setType('');
    setAmount('');
    setDate('');
    setDescription('');
    setCategory('');
    setOpenDialog(false);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  return (
    <>
      <Dialog
        fullScreen
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative', bgcolor:'#9c24b4'}}>
          <Toolbar >
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setOpenDialog(false)}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Add New Expense
            </Typography>
          </Toolbar>
        </AppBar>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            maxWidth: '80vw', 
            width: '80%',
            mx: 'auto',
            mt: 5,
          }}
        >
          <TextField
            select
            label="Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            fullWidth
            required
          >
            <MenuItem value="">Select + or -</MenuItem>
            <MenuItem value="Revenue">+</MenuItem>
            <MenuItem value="Outflows">-</MenuItem>
          </TextField>

          <TextField
            type="number"
            label="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            required
          />

          <TextField
            select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            fullWidth
            required
          >
            {["Car", "Rent", "Utilities", "Entertainment", "Health", "Travel", "Salary", "Other"].map((cat) => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </TextField>

          <TextField
            type="date"
            label="Date"
            InputLabelProps={{ shrink: true }}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            inputProps={{ maxLength: 25 }}
            required
          />

          <Button type="submit" variant="contained" color="secondary" startIcon={<FontAwesomeIcon icon={faAdd} />}>
            Add
          </Button>
        </Box>
      </Dialog>

      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          <CheckCircleIcon sx={{ mr: 1 }} />
          Expense added successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddExpense;
