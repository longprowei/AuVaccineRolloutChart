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
            let dayDataSevenAvg = [];
            let nswDayDataSevenAvg = [];

            data.forEach(element => {
                labels.push(element.DATE_AS_AT);
                dayData.push(element.TOTALS_NATIONAL_LAST_24HR);
                totalData.push(element.TOTALS_NATIONAL_TOTAL);
                nswDayData.push(element.STATE_CLINICS_NSW_LAST_24HR ? element.STATE_CLINICS_NSW_LAST_24HR : 0 + element.CWTH_AGED_CARE_NSW_LAST_24HR ? element.CWTH_AGED_CARE_NSW_LAST_24HR : 0 + element.CWTH_PRIMARY_CARE_NSW_LAST_24HR ? element.CWTH_PRIMARY_CARE_NSW_LAST_24HR : 0);
                nswTotalData.push(element.STATE_CLINICS_NSW_TOTAL ? element.STATE_CLINICS_NSW_TOTAL : 0  + element.CWTH_AGED_CARE_NSW_TOTAL ? element.CWTH_AGED_CARE_NSW_TOTAL : 0 + element.CWTH_PRIMARY_CARE_NSW_TOTAL ? element.CWTH_PRIMARY_CARE_NSW_TOTAL : 0);
            });


            for (let i = 0; i < dayData.length; i++) {
                let currIndex = i;
                let count = 0;
                let sumAu = 0;
                let sumNsw = 0;
                while (i - currIndex <= 6 && currIndex >= 0) {
                    sumAu += dayData[currIndex];
                    sumNsw += nswDayData[currIndex];
                    currIndex--;
                    count++;
                }
                dayDataSevenAvg.push(count < 6 ? undefined : Math.floor(sumAu / count));
                nswDayDataSevenAvg.push(count < 6 ? undefined : Math.floor(sumNsw / count));
            }

            createGraph(dayData, totalData, dayDataSevenAvg, labels, 'myChart1', 'rgba(0, 0, 255, 0.3)');
            createGraph(nswDayData, nswTotalData, nswDayDataSevenAvg, labels, 'myChart2', 'rgba(0, 255, 0, 0.3)');
        });
})();

function createGraph(dayData, totalData, sevenDayData, labels, chartId, barChartBg) {
    let ctx = document.getElementById(chartId).getContext('2d');
    new Chart(ctx, {
        data: {
            datasets: [{
                type: 'bar',
                label: 'Everyday rollout',
                data: dayData,
                order: 2,
                yAxisID: 'y',
                backgroundColor: barChartBg,
            }, {
                type: 'line',
                label: 'Total rollout',
                data: totalData,
                yAxisID: 'y1',
                order: 0,
                backgroundColor: 'red',
            }, {
                type: 'line',
                label: '7 Days Average',
                data: sevenDayData,
                yAxisID: 'y',
                order: 1,
                backgroundColor: 'blue',
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
