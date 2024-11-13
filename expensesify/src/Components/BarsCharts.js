import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

const BarsChart = ({ expenses, selectedYear }) => {
    if(!selectedYear){
        selectedYear = new Date().getFullYear();
    }
    const [chartData, setChartData] = useState({
        series: [],
        options: {}
    });

    useEffect(() => {
        if (!expenses || expenses.length === 0) {
            return; 
        }
        const monthBalance = Array(12).fill(0); //Array 12 mesi
        //raggruppo spese per mese
        expenses.forEach((expense) => {
            const ExpDate = new Date(expense.date); // Prendo la data della spesa

            if (selectedYear && ExpDate.getFullYear() === selectedYear) { //vedo se l'anno corrisponde
                const ExpMonth = ExpDate.getMonth(); //ottengo il mese (0-11)

                // Verifico tipo di spesa
                if (expense.type === "Outflows") {
                    monthBalance[ExpMonth] += expense.amount;
                } else if (expense.type === "Revenue") {
                    monthBalance[ExpMonth] -= expense.amount;
                }
            }
        });

        //aggiorno dati grafico
        setChartData({
            series: [{
                name: "Your Balance",
                data: monthBalance ? monthBalance : []
            }],
            options: {
                chart: {
                    type: 'bar',
                    height: 350,

                },
                plotOptions: {
                    bar: {
                        borderRadius: 5,
                        horizontal: false,
                    }
                },
                colors: ['#FF5733'],
                xaxis: { //asse X mesi
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] ,
                    labels: {
                        style: {
                            colors: '#000000', 
                            fontSize: '1rem'
                        }
                    }
                },
                yaxis: {
                    labels: {
                        style: {
                            colors: '#000000', 
                            fontSize: '1rem'
                        },
                        formatter: function (value) {
                            return value.toFixed(2);
                        }
                    }
                },
            }
        });
    }, [expenses, selectedYear]); 

    return (
        <div id="bars">
            <ReactApexChart
                options={chartData.options}
                series={chartData.series}
                type="bar"
                height={350}

            />
        </div>
    );
};

export default BarsChart;
