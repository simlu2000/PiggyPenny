import Chart from "react-apexcharts";
import React from "react";

const PieChart = ({ statsCategory }) => {

    //config dati, etichette
    const chartData = {
        series: Object.values(statsCategory).map(category => Math.abs(category.revenue) + Math.abs(category.outflows)),
        options: {
            chart: {
                type: 'pie'
            },
            labels: Object.keys(statsCategory), //per le etichette prendo categorie
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 300
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }],
            colors: ['#cb9cf2','#E2E3F4','#b5e2fa','#eddea4','#f7a072','#FBA69D','#45B350','#392f5a']
        }
    };

    return (
        <>
            <div className="stats-container">

                <Chart
                    options={chartData.options}
                    series={chartData.series}
                    type='pie'
                    width="500"
                />
            </div>
        </>
    )
}
export default PieChart;