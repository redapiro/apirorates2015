'use strict';

angular.module('ratesUiApp').service('ratesDistributionService',
  ['configService', '$http', '$q', function (configService, $http, $q) {
    var _findColumns = function (successCallback, failureCallback) {
      $http.get(configService.getHostUrl() + '/config/distributions/columns', {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        successCallback(response);
      }).error(function (error) {
        failureCallback(error);
      });
    };

    var _distribute = function (rateDistributionId) {
      var deferred = $q.defer();
      $http.post(configService.getHostUrl() + '/config/distributions/distribute/' + rateDistributionId, {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(response);
      });
      return deferred.promise;
    };

    var _distributeCross = function (rateDistributionId) {
      var deferred = $q.defer();
      $http.post(configService.getHostUrl() + '/config/distributions/distributeCross/' + rateDistributionId, {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(response);
      });
      return deferred.promise;
    };


    return {
      findColumns: function (successCallback, failureCallback) {
        _findColumns(successCallback, failureCallback);
      },
      distribute: function (rateDistributionId) {
        return _distribute(rateDistributionId);
      },
      distributeCross: function (rateDistributionId) {
        return _distributeCross(rateDistributionId);
      }
    };
  }]);
