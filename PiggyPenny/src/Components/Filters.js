import React from "react";

const Filters = ({ selectedDay, selectedMonth, selectedYear, setSelectedDay, setSelectedMonth, setSelectedYear, expenses }) => {
    return (
        <div id="filter-area">
            <label>Day:</label>
            <select  onChange={(e) => setSelectedDay(parseInt(e.target.value))} value={selectedDay || ''}>
                <option value=""> ... </option>
                {[...Array(31).keys()].map((day) => (
                    <option key={day + 1} value={day + 1}>{day + 1}</option>
                ))}
            </select>

            <label>Month:</label>
            <select onChange={(e) => setSelectedMonth(parseInt(e.target.value))} value={selectedMonth || ''}>
                <option value=""> ... </option>
                {[...Array(12).keys()].map((month) => (
                    <option key={month + 1} value={month + 1}>{month + 1}</option>
                ))}
            </select>

            <label>Year:</label>
            <select onChange={(e) => setSelectedYear(parseInt(e.target.value))} value={selectedYear || ''}>
                <option value=""> ... </option>
                {Array.from(new Set(expenses.map((expense) => new Date(expense.date).getFullYear()))).map((year) => (
                    <option key={year} value={year}>{year}</option>
                ))}
            </select>
        </div>
    );
};

export default Filters;
