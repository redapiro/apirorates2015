'use strict';

angular.module('ratesUiApp').service('graphStatsService',
  ['configService', '$http', '$q', function (configService, $http, $q) {
    var _getRawStats = function () {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/graphstat/rawRateStats', {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.resolve(error);
      });
      return deferred.promise;
    };

    var _getAggregatedStats = function () {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/graphstat/aggregatedRateStats', {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.resolve(error);
      });
      return deferred.promise;
    };

    var _getCombined = function () {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/graphstat/combined', {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.resolve(error);
      });
      return deferred.promise;
    };

    return {
      getRawStats: function () {
        return _getRawStats();
      },
      getAggregatedStats: function () {
        return _getAggregatedStats();
      },
      getCombined: function () {
        return _getCombined();
      }
    };
  }]);
