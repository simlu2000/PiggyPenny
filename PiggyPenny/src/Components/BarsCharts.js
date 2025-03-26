import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

const BarsChart = ({ expenses = [], selectedYear }) => {
    selectedYear = selectedYear || new Date().getFullYear();

    const [chartData, setChartData] = useState({
        series: [{ name: "Your Balance", data: Array(12).fill(0) }],
        options: {
            chart: { type: 'bar', height: 350 },
            plotOptions: { bar: { borderRadius: 5, horizontal: false } },
            colors: ['#FF5733'],
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                labels: { style: { colors: '#000000', fontSize: '1rem' } }
            },
            yaxis: {
                labels: {
                    style: { colors: '#000000', fontSize: '1rem' },
                    formatter: function (value) { return value.toFixed(2); }
                }
            },
        }
    });

    useEffect(() => {
        if (!expenses || expenses.length === 0) {
            return;
        }

        const monthBalance = Array(12).fill(0); // Array per i 12 mesi

        // Raggruppo spese per mese
        expenses.forEach((expense) => {
            const expDate = new Date(expense.date); // Prende la data della spesa

            if (expDate.getFullYear() === selectedYear) { // Controlla se l'anno corrisponde
                const expMonth = expDate.getMonth(); // Ottiene il mese (0-11)

                // Verifica il tipo di spesa
                if (expense.type === "Outflows") {
                    monthBalance[expMonth] += expense.amount;
                } else if (expense.type === "Revenue") {
                    monthBalance[expMonth] -= expense.amount;
                }
            }
        });

        // Aggiorna i dati del grafico
        setChartData((prevData) => ({
            ...prevData,
            series: [{
                name: "Your Balance",
                data: monthBalance
            }]
        }));
    }, [expenses, selectedYear]);

    return (
        <div id="bars">
            <ReactApexChart
                options={chartData.options}
                series={chartData.series}
                type="bar"
                height={350}
                width={'100%'}
            />
        </div>
    );
};

export default BarsChart;
