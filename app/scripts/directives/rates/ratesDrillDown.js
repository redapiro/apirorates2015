'use strict';

'use strict';

angular.module('ratesUiApp').directive('ratesDrillDown', ['rawService', 'aggregatedService', 'configService', 'historicalService', '$q',
  function (rawService, aggregatedService, configService, historicalService, $q) {
    return {
      restrict: 'AE',
      templateUrl: 'views/directives/rates/ratesDrillDown.html',
      replace: true,
      scope: {
        'visible': '=',
        'rateType': '=',
        'rateId': '=',
        'rateIdHolder': '='
      },
      compile: function compile() {
        return {
          pre: function preLink(scope) {
            // Before DOM is rendered, set it won't show, otherwise we get a nasty flash of the div before
            // it is needed
            scope.show = false;
          },
          post: function postLink(scope, element) {
            scope.show = false;
            scope.rawUrl = configService.getHostUrl() + '/rates/raw/list';
            scope.historicalUrl = configService.getHostUrl() + '/rates/historical/list';
            scope.baseUrl = scope.rawUrl + '';
            scope.activeTab = 'raw';
            scope.showEditTab = true;
            var rawType = 'raw';
            var aggregatedType = 'aggregated';
            var historicalType = 'historical';
            var service;
            scope.displayDateCriteria = false;

            scope.$watch('visible', function (state) {
              scope.show = state;
            });

            scope.$watch('rateType', function (rateType) {
              if (rateType === rawType) {
                service = rawService;
              } else if (rateType === aggregatedType) {
                service = aggregatedService;
              } else if (rateType === historicalType) {
                service = historicalService;
              }
            });

            scope.$watch('rateIdHolder', function (rateIdHolder) {
                if (!rateIdHolder) {
                  return;
                }
                scope.schemaId = rateIdHolder.schemaId;
                scope.rateDefinitionId = rateIdHolder.rateDefinitionId;
                var columnsPromise = rawService.findDrillDownColumns(rateIdHolder.schemaId);
                //var aggregatedRatePromise = aggregatedService.loadRateByRateDefId(rateIdHolder.id);
                var promises = [];
                promises.push(columnsPromise);
                //promises.push(aggregatedRatePromise);
                $q.all(promises).then(function(responseArray){
                  console.log(responseArray[0]);
                  console.log(responseArray[1]);
                });
                rawService.findDrillDownColumns(rateIdHolder.schemaId).then(function (columns) {
                  scope.columns = columns;
                });
              },
              function (failure) {
                console.error(result);
              });

            scope.hide = function () {
              scope.ready = false;
              scope.visible = false;
              scope.activeTab = 'raw';
              $('#detailTable').find('tr td').each(function () {
                $.powerTip.destroy($(this));
              });
              scope.$broadcast('destroyDrillDownGrid', true);
            };

            // display loader
            scope.ready = false;

            scope.setRawActive = function () {
              scope.$broadcast('destroyDrillDownGrid', true);
              scope.activeTab = 'raw';
              scope.baseUrl = scope.rawUrl;
              rawService.findDrillDownColumns(scope.schemaId).then(function (columns) {
                scope.columns = columns;
              });
            };

            scope.setHistoricActive = function () {
              scope.$broadcast('destroyDrillDownGrid', true);
              scope.activeTab = 'historic';
              scope.baseUrl = scope.historicalUrl;
              historicalService.findDrillDownColumns(scope.schemaId).then(function (columns) {
                scope.columns = columns;
              });
            };

            scope.setEditActive = function () {
              scope.$broadcast('destroyDrillDownGrid', true);
              scope.activeTab = 'edit';
            };

            //scope.$watch('activeTab', function (value) {
            //  aggregatedService.findColumns(scope.schemaId).then(function (columns) {
            //    scope.aggregatedColumns = columns;
            //  });
            //});

          }
        };
      }
    };
  }
]);

angular.module('ratesUiApp').directive('onFinishRender', function ($timeout) {
  return {
    restrict: 'A',
    link: function (scope, element, attr) {
      if (scope.$last === true) {
        $timeout(function () {
          scope.$emit('ngRepeatFinished');
        });
      }
    }
  }
});