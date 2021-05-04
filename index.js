'use strict'

const url = "https://vaccinedata.covid19nearme.com.au/data/all.json";

(function getData() {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            let dayData = [];
            let totalData = [];
            let labels = [];
            let nswDayData = [];
            let nswTotalData = [];

            data.forEach(element => {
                labels.push(element.DATE_AS_AT);
                dayData.push(element.TOTALS_NATIONAL_LAST_24HR);
                totalData.push(element.TOTALS_NATIONAL_TOTAL);
                nswDayData.push(element.STATE_CLINICS_NSW_LAST_24HR + element.CWTH_AGED_CARE_NSW_LAST_24HR + element.CWTH_PRIMARY_CARE_NSW_LAST_24HR);
                nswTotalData.push(element.STATE_CLINICS_NSW_TOTAL + element.CWTH_AGED_CARE_NSW_TOTAL + element.CWTH_PRIMARY_CARE_NSW_TOTAL);
            });
            createGraph(dayData, totalData, labels, 'myChart1', 'rgba(0, 0, 255, 0.3)');
            createGraph(nswDayData, nswTotalData, labels, 'myChart2', 'rgba(0, 255, 0, 0.3)');
        });
})();

function createGraph(dayData, totalData, labels, chartId, barChartBg) {
    let ctx = document.getElementById(chartId).getContext('2d');
    new Chart(ctx, {
        data: {
            datasets: [{
                type: 'bar',
                label: 'Everyday rollout',
                data: dayData,
                order: 1,
                yAxisID: 'y',
                backgroundColor: barChartBg,
            }, {
                type: 'line',
                label: 'Total rollout',
                data: totalData,
                yAxisID: 'y1',
                order: 0,
                backgroundColor: 'red',
            }],
            labels: labels
        },
        options: {
            scales: {
                y: {
                    type: 'linear',
                    position: 'left',
                },
                y1: {
                    type: 'linear',
                    position: 'right',
                }
            }
        }
    });
}
