'use strict';

angular.module('ratesUiApp')
  .directive('dashboardStatus', ['statusService', 'socketWatcherService', function (statusService, socketWatcherService) {
    return {
      templateUrl: '/views/directives/status/dashboardStatus.html',
      restrict: 'E',
      scope: {
        type: '=',
        received: '=received'
      },
      replace: true,
      link: function postLink(scope, element, attrs) {
        var timer;
        scope.statusData;
        scope.validationFailureCount;
        scope.speedInPercentage = {width: '0%'};
        scope.microsecondsPercentage = {width: '0%'};
        var callback = {
          id: 'dashboardRibbonStats',
          messageType: 'ribbonStat',
          doCallback: function (statsDta) {
            if (statsDta.messageType === 'ribbonStat') {
              scope.statusData = statsDta.payLoad;
              if (scope.type === 'raw') {
                scope.validationFailureCount = scope.statusData.rawViolated;
                scope.count = statsDta.rawCount;
              } else {
                scope.validationFailureCount = scope.statusData.aggViolated;
                scope.microseconds = statsDta.payLoad.microseconds;
              }
              scope.microseconds = statsDta.payLoad.microseconds;
              scope.microsecondsPercentage.width = (parseFloat(Math.round(statsDta.payLoad.microseconds * 100) / 100) / 10000) * 100;


              scope.speedInPercentage.width = scope.statusData.ratesPerSecPercent + '%';
              scope.received = statsDta;
              scope.$apply();
            }
          }
        };

        socketWatcherService.registerCallback('dashboardRibbonStats', callback);
        scope.$on('$destroy', function() {
          socketWatcherService.removeRegisteredCallback('dashboardRibbonStats');
        });


      }
    };
  }]);
