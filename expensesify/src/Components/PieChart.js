import Chart from "react-apexcharts";
import React, { useState, useEffect } from "react";

const PieChart = ({ statsCategory }) => {

  // State per la larghezza dinamica del chart
  const [chartWidth, setChartWidth] = useState(500);

  useEffect(() => {
    // Funzione per aggiornare la larghezza del chart in base alla dimensione della finestra
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setChartWidth(300);
      } else {
        setChartWidth(350);
      }
    };

    // Aggiungi l'event listener per il resize
    window.addEventListener("resize", handleResize);

    // Chiamata iniziale per impostare la larghezza
    handleResize();

    // Cleanup dell'event listener al momento del dismount del componente
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  //config dati, etichette
  const chartData = {
    series: Object.values(statsCategory).map(
      (category) => Math.abs(category.revenue) + Math.abs(category.outflows)
    ),
    options: {
      chart: {
        type: "pie"
      },
      labels: Object.keys(statsCategory), //per le etichette prendo categorie
      responsive: [
        {
          breakpoint: 600,
          options: {
            chart: {
              width: 300
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ],
      colors: [
        "#cb9cf2",
        "#E2E3F4",
        "#b5e2fa",
        "#eddea4",
        "#f7a072",
        "#FBA69D",
        "#45B350",
        "#392f5a"
      ]
    }
  };

  return (
    <>
      <div id="pie">
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="pie"
          width={chartWidth}
        />
      </div>
    </>
  );
};

export default PieChart;
