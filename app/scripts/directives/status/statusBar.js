'use strict';

angular.module('ratesUiApp')
  .directive('statusBar', ['$rootScope', 'statusService', 'socketWatcherService', function ($rootScope, statusService,
                                                                                            socketWatcherService) {
    return {
      templateUrl: '/views/directives/status/statusBar.html',
      restrict: 'E',
      scope: {
        type: '='
      },
      replace: true,
      link: function postLink(scope, element) {
        scope.statusData;
        scope.validationFailureCount;
        scope.microseconds = 0;
        scope.speedInPercentage = {width: '0%'};
        var callback = {
          messageType: 'ribbonStat',
          doCallback: function (statsDta) {
            //$rootScope.statusData = statsDta;
            if (statsDta.messageType === 'ribbonStat') {
              scope.statusData = statsDta.payLoad;
              if (scope.type === 'raw') {
                scope.validationFailureCount = scope.statusData.rawViolated;
                scope.count = scope.statusData.rawCount;
              } else {
                scope.validationFailureCount = scope.statusData.aggViolated;
                scope.count = scope.statusData.aggregatedCount;
              }
              scope.speedInPercentage.width = scope.statusData.ratesPerSecPercent;

              scope.microseconds = parseFloat(Math.round(scope.statusData.microseconds * 100) / 100).toFixed(0);

              scope.$apply();
            }
          }
        };

        scope.currentFeed = function() {
          if(!scope.statusData){
            return '';
          }
          return scope.statusData.currentFeed.length < 15 ? scope.statusData.currentFeed : scope.statusData.currentFeed.substring(0,10)+'...'
        };
        socketWatcherService.registerCallback('tableRibbonStats', callback);
        scope.$on('$destroy', function() {
          socketWatcherService.removeRegisteredCallback('tableRibbonStats');
        });
      }
    };
  }]);
