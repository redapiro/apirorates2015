'use strict';

angular.module('ratesUiApp')
  .directive('dashboardLiveChart', ['statusService', 'socketWatcherService', function (statusService, socketWatcherService) {
    return {
      template: '<div id="container" style="align:left;width: 500px; height: 400px; margin: 0 auto"></div>',
      restrict: 'EA',
      scope: {
        type: '='
      },
      replace: true,
      compile: function compile() {
        return {
          pre: function preLink(scope) {

          },
          post: function postLink(scope, element, attrs) {
            var chart;


            function getRandomColour() {
              return "#" + Math.random().toString(16).slice(2, 8);
            }


            var previousData;
            var done = false;

            /**
             * Render the pie chart
             */
            function renderGraph(statisticsData) {

              // if the data hasn't change, don't update graphs
              if (_.isEqual(previousData, statisticsData)) {
                return;
              }

              var colors = Highcharts.getOptions().colors,
                categories = ['Raw', 'Aggregated'],
                data = [{
                  y: statisticsData.rawTotal,
                  color: '#3a3f51',
                  drilldown: {
                    name: 'Raw Status',
                    categories: ['Valid', 'Violation', 'Init'],
                    data: [statisticsData.rawTotal - statisticsData.rawInit - statisticsData.rawViolations,
                      statisticsData.rawViolations, statisticsData.rawInit],
                    color: colors[0]
                  }
                }, {
                  y: statisticsData.aggTotal,
                  color: '#33a8ff',
                  drilldown: {
                    name: 'Aggregated Status',
                    categories: ['Valid', 'Violation', 'Init'],
                    data: [statisticsData.aggTotal - statisticsData.aggInit - statisticsData.aggViolations,
                      statisticsData.aggViolations, statisticsData.aggInit],
                    color: colors[1]
                  }
                }],
                browserData = [],
                versionsData = [],
                i,
                j,
                dataLen = data.length,
                drillDataLen;


              // Build the data arrays
              for (i = 0; i < dataLen; i += 1) {
                // add browser data
                browserData.push({
                  name: categories[i],
                  y: data[i].y,
                  color: data[i].color
                });

                // add version data
                drillDataLen = data[i].drilldown.data.length;
                for (j = 0; j < drillDataLen; j += 1) {
                  var item = {
                    name: data[i].drilldown.categories[j],
                    y: data[i].drilldown.data[j]

                  };
                  if (j === 0) {
                    item.color = '#8EBC00'
                  }

                  if (j === 1) {
                    item.color = '#FF0000'
                  }

                  if (j === 2) {
                    item.color = '#dfb56c'
                  }
                  //console.log(item);
                  versionsData.push(item);
                }
              }

              // Create the chart
              if (!chart) {
                chart = $('#container').highcharts({
                  legend: {
                    enabled: false
                  },
                  chart: {
                    type: 'pie'
                  },
                  title: {
                    text: 'Rates status'
                  },
                  yAxis: {
                    title: {
                      text: 'Total percent market share'
                    }
                  },
                  plotOptions: {
                    pie: {
                      shadow: true,
                      center: ['50%', '50%']
                    }
                  },
                  tooltip: {
                    valueSuffix: ''
                  },
                  series: [{
                    name: 'Totals',
                    data: browserData,
                    size: '60%',
                    dataLabels: {
                      formatter: function () {
                        return this.y > 5 ? this.point.name : null;
                      },
                      color: 'white',
                      distance: -30
                    }
                  }, {
                    name: 'Count',
                    data: versionsData,
                    size: '80%',
                    innerSize: '60%',
                    dataLabels: {
                      formatter: function () {
                        // display only if larger than 1
                        return this.y > 1 ? '<b>' + this.point.name + ':</b> ' + this.y : null;
                      }
                    }
                  }]
                });
              } else {
                var theChart = $('#container').highcharts();
                theChart.series[0].setData([statisticsData.rawTotal, statisticsData.aggTotal]);
                theChart.series[1].setData([
                      statisticsData.rawTotal - statisticsData.rawInit - statisticsData.rawViolations,
                      statisticsData.rawViolations,
                      statisticsData.rawInit,
                      statisticsData.aggTotal - statisticsData.aggInit - statisticsData.aggViolations,
                      statisticsData.aggViolations,
                      statisticsData.aggInit
                  ]
                );
              }
              // clone it, for comparison on next run
              previousData = JSON.parse(JSON.stringify(statisticsData));
            }

            var callback = {
              id: 'dashboardLiveStats',
              messageType: 'ribbonStat',
              doCallback: function (statsDta) {
                var statisticsData = {};
                if (statsDta.messageType === 'ribbonStat') {
                  statisticsData.rawTotal = statsDta.payLoad.rawCount;
                  statisticsData.rawValid = statsDta.payLoad.rawCount - statsDta.payLoad.rawInit - statsDta.payLoad.rawViolated;
                  statisticsData.rawInit = statsDta.payLoad.rawInit;
                  statisticsData.rawViolations = statsDta.payLoad.rawViolated;

                  statisticsData.aggTotal = statsDta.payLoad.aggregatedCount;
                  statisticsData.aggValid = statsDta.payLoad.aggregatedCount - statsDta.payLoad.aggInit - statsDta.payLoad.aggViolated;
                  statisticsData.aggInit = statsDta.payLoad.aggInit;
                  statisticsData.aggViolations = statsDta.payLoad.aggViolated;
                  renderGraph(statisticsData);
                }
              }
            };

            socketWatcherService.registerCallback('dashboardLiveStats', callback);
            scope.$on('$destroy', function () {
              socketWatcherService.removeRegisteredCallback('dashboardLiveStats');
              if (chart) {
                if ($('#container').highcharts()) {
                  $('#container').highcharts().destroy();
                  chart = null;
                }
              }
            });

//        var setupPoll = function() {
//          timer = $interval(function refresh() {
//            statusService.getStats(function(statsDta){
//              scope.statusData = statsDta;
//              if(scope.type === 'raw') {
//                scope.validationFailureCount = statsDta.rawViolated;
//                scope.count = statsDta.rawCount;
//              }else{
//                scope.validationFailureCount = statsDta.aggViolated
//                scope.count = statsDta.aggregatedCount;
//              }
//              scope.speedInPercentage.width = statsDta.ratesPerSecPercent +'%';
//            },function(failureData){
//
//            });
//          },200);
//        };
//        setupPoll();

//        scope.displayCurrentDatafeed = function () {
//          if(scope.statusData && scope.statusData.currentFeed){
//            return scope.statusData.currentFeed !== '';
//          }
//          return false;
//        };

          }
        }
      }
    }
  }]);
