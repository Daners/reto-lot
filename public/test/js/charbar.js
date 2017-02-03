$scope.barChart={};
        
        /* legend: {
                display: true
            },*/
        $scope.barChart.options = {
            legend: {
                display: false
            },
           
            responsive: true,
            tooltips: {
            enabled: false,
         /*   
            custom: customTooltips
            position:'average',
            titleFontSize:8,
            bodyFontSize:9*/
            
        },
           
            scales: {
               xAxes: [{
                            display: false}],
                             yAxes: [{
                            display: false}]
         
            }
        };
        $scope.barChart.colors = ['#45b7cd', '#ff6384', '#ff8e72'];
        $scope.barChart.labels = ['0:00', '0:04', '0:08', '0:08', '0:12', '0:16', '0:20'];
        $scope.barChart.series = ['X', 'Y', 'Z'];
        $scope.barChart.data = [
            [65, 59, 80, 81, 56, 55, 40],
            [28, 48, 40, 19, 86, 27, 90],
            [44, 12, 72, 98, 11, 5, 40]
        ];
        $scope.barChart.datasetOverride = [{
            label: "X",
            tension:0.2,
            type: 'line',
            fill:false,
            pointBorderWidth: 0,
            pointHoverRadius: 3,
            pointHoverBorderWidth: 1,
            pointRadius: 3,
            pointHitRadius: 10
         
        }, {
            label: "Y",
         //   hoverBackgroundColor: "rgba(255,99,132,0.4)",
           // hoverBorderColor: "rgba(255,99,132,1)",
            tension:0.2,
            type: 'line',
            fill:false,
            pointBorderWidth: 0,
            pointHoverRadius: 3,
            pointHoverBorderWidth: 1,
            pointRadius: 3,
            pointHitRadius: 10
        
        },
        {
            label: "Z",
            //borderColor:'rgb(75, 192, 192,1)',
            tension:0.2,
            //backgroundColor:'rgb(75, 192, 192,1)',
            type: 'line',
            fill:false,
            pointBorderWidth: 0,
            pointHoverRadius: 3,
            pointHoverBorderWidth: 1,
            pointRadius: 3,
            pointHitRadius: 10
        }];