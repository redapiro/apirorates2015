'use strict';

angular.module('ratesUiApp')
  .directive('headerCharts', ['statusService', 'socketWatcherService', function (statusService, socketWatcherService) {
    return {

    //  <div class="btn-header pull-right">
    //<div header-charts=""></div>
    //</div>
      template:
        '<charts >' +
          '<div class="btn-header pull-right" >' +
            '<div class="rawChart" style="align: right; margin-top:9px;width: 40px; height: 32px; padding: 0" title=""></div>' +
          '</div>' +
          '<div class="btn-header pull-right">' +
            '<div class="aggregatedChart" style="align: right; margin-top:9px;width: 40px; height: 32px; padding: 0" title=""></div>' +
          '</div>'+
        '</charts>',
      restrict: 'EA',
      scope: {
        type: '='
      },
      replace: true,
      compile: function compile() {
        return {
          pre: function preLink(scope) {

          },
          post: function postLink(scope, element) {


            $(element).find('.rawChart').powerTip({
              placement: 's', // north-east tooltip position
              followMouse: false
            });

            $(element).find('.aggregatedChart').powerTip({
              placement: 's', // north-east tooltip position
              followMouse: false
            });


            var chartData = {
              rawChartData: null,
              aggregatedChartData: null
            };
            var previousChartData = {
              rawData: [],
              aggregatedData: []
            };

            /**
             * Render the pie rawChart
             */
            function renderChart(statisticsData, className, chartDataVarName, previousChartDataVarName, title) {
              // if the data hasn't change, don't update graphs
              if (_.isEqual(previousChartData[previousChartDataVarName], statisticsData)) {
                return;
              }

              var theData = [];
              theData.push({
                y: statisticsData.total - statisticsData.init - statisticsData.violations,
                color:{
                    radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
                    stops: [
                      [0, '#8EBC00'],
                      [1, Highcharts.Color('#8EBC00').brighten(0.1).get('rgb')] // darken
                    ]
                  }
              });

              theData.push({
                y: statisticsData.violations,
                color:{
                  radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
                  stops: [
                    [0, '#FF0000'],
                    [1, Highcharts.Color('#FF0000').brighten(0.1).get('rgb')] // darken
                  ]
                }
              });

              theData.push({
                y: statisticsData.init,
                color:{
                  radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
                  stops: [
                    [0, '#dfb56c'],
                    [1, Highcharts.Color('#dfb56c').brighten(0.1).get('rgb')] // darken
                  ]
                }
              });

              // Create the rawChart
              if (!chartData[chartDataVarName]) {
                chartData[chartDataVarName] = $(element).find(className).highcharts({
                  legend: {
                    enabled: true
                  },
                  tooltip: { enabled: false },
                  chart: {
                    spacingTop: 0,
                    spacingBottom: 5,
                    spacingLeft:0,
                    spacingRight: 0,
                    type: 'pie',
                    margin: 0
                  },
                  title: {
                    verticalAlign: 'middle',
                    text: null,
                    useHtml: true,
                    floating: false,
                    style: {
                      cursor: 'pointer',
                      color: '#FFFFFF',
                      fontSize: '10px',
                      'font-family': '"Helvetica Neue", Helvetica, Arial, sans-serif !important',
                      'padding-top': '3px'
                    }
                  },
                  plotOptions: {
                    series: {
                      states: {
                        hover: {
                          enabled: false
                        }
                      }
                    },
                    pie: {
                      slicedOffset: 0,
                      //innerSize: '50%',
                      size: '95%',
                      dataLabels: {
                        enabled: false
                      }
                    }
                  },
                  credits:{
                    enabled: false
                  },
                  series: [{
                    name: 'Count',
                    data: theData
                  }]
                });

                var comment = '';
                if(className === '.rawChart') {
                  comment = '<b>Raw</b></br></br>';
                } else {
                  comment = '<b>Aggregated</b></br></br>';
                }
                comment =  comment + 'Valid: ' + (statisticsData.total - statisticsData.init - statisticsData.violations) +'</br>' +
                  'Violations: ' + statisticsData.violations + '</br>' +
                  'Init: ' + statisticsData.init;


                $(className).on({
                  powerTipPreRender: function () {

                    // generate some dynamic content
                    $(this).data('powertip', comment);
                  },
                  powerTipRender: function () {

                    // change some content dynamically
                    $('#powerTip').find('.title').text('This is a dynamic title.');
                  }
                });
              } else {
                if(className === '.rawChart') {
                  comment = '<b>Raw</b></br></br>';
                } else {
                  comment = '<b>Aggregated</b></br></br>';
                }
                comment =  comment + 'Valid: ' + (statisticsData.total - statisticsData.init - statisticsData.violations) +'</br>' +
                'Violations: ' + statisticsData.violations + '</br>' +
                'Init: ' + statisticsData.init;

                $(className).on({
                  powerTipPreRender: function () {

                    // generate some dynamic content
                    $(this).data('powertip', comment);
                  },
                  powerTipRender: function () {

                    // change some content dynamically
                    $('#powerTip').find('.title').text('This is a dynamic title.');
                  }
                });

                var theChart = $(element).find(className).highcharts();
                theChart.series[0].setData([
                  statisticsData.total - statisticsData.init - statisticsData.violations,
                  statisticsData.violations,
                  statisticsData.init
                ]);
              }
              // clone it, for comparison on next run
              previousChartData[previousChartDataVarName] = JSON.parse(JSON.stringify(statisticsData));
            }

            var callback = {
              id: 'headerLiveStats',
              messageType: 'ribbonStat',
              doCallback: function (incoming) {
                var rawData = {};
                var aggData = {};
                if (incoming.messageType === 'ribbonStat') {
                  rawData.total = incoming.payLoad.rawCount;
                  rawData.valid = incoming.payLoad.rawCount - incoming.payLoad.rawInit - incoming.payLoad.rawViolated;
                  rawData.init = incoming.payLoad.rawInit;
                  rawData.violations = incoming.payLoad.rawViolated;
                  renderChart(rawData, '.rawChart', 'rawChartData', 'rawData', 'R');
                  
                  aggData.total = incoming.payLoad.aggregatedCount;
                  aggData.valid = incoming.payLoad.aggregatedCount - incoming.payLoad.aggInit - incoming.payLoad.aggViolated;
                  aggData.init = incoming.payLoad.aggInit;
                  aggData.violations = incoming.payLoad.aggViolated;
                  renderChart(aggData, '.aggregatedChart', 'aggregatedChartData', 'aggregatedData', 'A');
                }
              }
            };

            socketWatcherService.registerCallback('headerLiveStats', callback);
            scope.$on('$destroy', function () {
              socketWatcherService.removeRegisteredCallback('headerLiveStats');
              if (rawChart) {
                if ($(element).find(className).highcharts()) {
                  $(element).find(className).highcharts().destroy();
                  rawChart = null;
                }
              }
            });
          }
        }
      }
    }
  }]);
