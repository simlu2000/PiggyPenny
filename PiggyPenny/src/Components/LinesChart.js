import Chart from "react-apexcharts";
import React, { useState, useEffect } from "react";

const LinesChart = ({ expenses }) => {
  // Raggruppo spese per data
  const expensesByDate = (expenses) => {
    const expensesDate = {}; // oggetto vuoto per salvare le spese

    expenses.forEach(expense => {
      // data in formato iso e prendo tutto ma non orario
      const date = new Date(expense.date).toISOString().split('T')[0]; // prendo la data

      if (!expensesDate[date]) { // se data non esiste nell'oggetto, entrate/uscite 0
        expensesDate[date] = { revenue: 0, outflows: 0 };
      }

      if (expense.type === "Revenue") { // se entrata aggiungiamo importo nell'entrate di quella data
        expensesDate[date].revenue += expense.amount;
      } else {
        expensesDate[date].outflows += expense.amount;
      }
    });
    return expensesDate;
  };

  const expensesOk = expensesByDate(expenses); // raggruppiamo spese con funzione

  // dati grafico
  const dates = Object.keys(expensesOk); // prendiamo tutte le date (chiavi di expensesOk) come array
  const revenues = dates.map(date => expensesOk[date].revenue); // array con entrate di ogni data
  const outflows = dates.map(date => expensesOk[date].outflows);

  // State per la larghezza dinamica del grafico
  const [chartWidth, setChartWidth] = useState('100%');

  useEffect(() => {
    //Funzione per aggiornare la larghezza del chart in base allo schermo
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setChartWidth('90%'); 
      } else if (window.innerWidth < 1024) {
        setChartWidth('100%');
      } else {
        setChartWidth('100%');
      }
    };

    //event listener per il resize
    window.addEventListener("resize", handleResize);

    // Chiamata per impostare la larghezza
    handleResize();

    // Cleanup dell'event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const chartData = {
    series: [
      {
        name: 'Revenue',
        data: revenues,
      },
      {
        name: 'Outflows',
        data: outflows,
      }
    ],
    options: {
      chart: {
        type: 'line',
        height: '100%',
        width: chartWidth,
        responsive: [
          {
            breakpoint: 600,
            options: {
              chart: {
                height: 300,
                width: '90%'
              },
              markers: {
                size: 3
              }
            }
          },
          {
            breakpoint: 1024,
            options: {
              chart: {
                height: 500,
                width: '100%'
              }
            }
          }
        ]
      },
      xaxis: {
        categories: dates,  // asse x -> date
        type: 'datetime',
      },
      yaxis: {
        title: {
          text: 'Amount (€)'
        }
      },
      stroke: {
        curve: 'smooth'
      },
      colors: ['#A1E5AB', '#FBA69D'],
      markers: {
        size: 4 // dimensione dei punti
      },
      tooltip: {
        shared: true, // dati linee in contemporanea
        intersect: false // no intersezione punti linea per mostrare tooltip
      }
    }
  };

  return (
    <div id="lines">
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="line"
        height="100%"
        width={chartWidth}
      />
    </div>
  );
};

export default LinesChart;
