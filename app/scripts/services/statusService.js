'use strict';

angular.module('ratesUiApp').service('statusService',
  ['configService', '$http', function (configService, $http) {
    var _getStats = function (successCallback, failureCallback) {
      $http.get(configService.getHostUrl() + '/ribbonstat/stat', {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        if (response && response.ratesPerSec !== 0) {
          response.microSecondsPerRate = 1000000 / response.ratesPerSec;
          response.microSecondsPerRate = parseFloat(response.microSecondsPerRate).toFixed(2);
        } else {
          response.microSecondsPerRate = 0;
        }

        if (response.currentFeed === '') {
          response.currentFeed = 'None';
        }
        if (response.currentFeed === 'NONE') {
          response.currentFeedRunningFor = '0 s';
        } else {
          response.currentFeedRunningFor = parseFloat(response.currentFeedRunningFor).toFixed(2) + ' s';
        }


        successCallback(response);
      }).error(function (error) {
        failureCallback(error);
      });
    };

    return {
      getStats: function (successCallback, failureCallback) {
        _getStats(successCallback, failureCallback);
      }
    };
  }]);
