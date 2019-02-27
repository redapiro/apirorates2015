'use strict';

angular.module('ratesUiApp').service('aggregatedService',
  ['$q', 'configService', '$http', '$window', function ($q, configService, $http, $window) {

    var _loadRateById = function (id) {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/rates/aggregated/rate/' + id, {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _loadRateByRateDefId = function (loadRateByRateDefId) {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/rates/aggregated/get?rateDefId=' + loadRateByRateDefId, {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _findIntraday = function (rateDefinitionId, successCallback, failureCallback) {
      $http.get(configService.getHostUrl() + '/rates/aggregated/intraday/' + rateDefinitionId, {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        successCallback(response);
      });
    };

    var _getAdjustmentsPayload = function (rateDefinitionId, rateInstanceId) {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/rates/aggregated/adjust/' + rateDefinitionId + '/' + rateInstanceId, {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (response) {
        deferred.reject(response);
      });
      return deferred.promise;
    };

    var _getAggregatedDrillDown = function (rateDefinitionId, rateInstanceId) {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/rates/aggregated/details/' + rateDefinitionId + '/' + rateInstanceId, {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (response) {
        deferred.reject(response);
      });
      return deferred.promise;
    };

    var _findColumns = function (schemaId) {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/rates/aggregated/columns/' + schemaId, {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _loadRateByIdAsArray = function (id) {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/rates/aggregated/search/' + id, {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _manualUpdate = function (payload, successCallback, failureCallback) {
      $http.put(configService.getHostUrl() + '/rates/aggregated/adjust/', payload, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        successCallback(response);
      }).error(function (response) {
        failureCallback(response);
      });
    };

    var _getDownloadLink = function (queryObject) {
      var queryString = '';
      var isFirst = true;
      for (var property in queryObject) {
        var prop = queryObject[property];
        if (isFirst) {
          if (prop) {
            queryString = queryString + '?' + property + '=' + encodeURIComponent(prop);
            isFirst = false;
          }
        } else {
          if (prop) {
            queryString = queryString + '&' + property + '=' + encodeURIComponent(prop);
          }
        }
      }
      return configService.getHostUrl() + '/rates/aggregated/dump/' + queryString;
    };

    return {
      loadRateById: function (id) {
        return _loadRateById(id);
      },
      loadRateByRateDefId: function (rateDefId) {
        return _loadRateByRateDefId(rateDefId);
      },
      loadRateByIdAsArray: function (id) {
        return _loadRateByIdAsArray(id);
      },
      findColumns: function (paginationRequest) {
        return _findColumns(paginationRequest);
      },
      findIntraday: function (rateDefinitionId, successCallback, failureCallback) {
        _findIntraday(rateDefinitionId, successCallback, failureCallback);
      },
      getAdjustmentsPayload: function (rateDefinitionId, rateInstanceId) {
        return _getAdjustmentsPayload(rateDefinitionId, rateInstanceId);
      },
      manualUpdate: function (payload, successCallback, failureCallback) {
        _manualUpdate(payload, successCallback, failureCallback);
      },
      getDownloadLink: function (queryObject) {
        return _getDownloadLink(queryObject);
      },
      getAggregatedDrillDown: function (rateDefinitionId, rateInstanceId) {
        return _getAggregatedDrillDown(rateDefinitionId, rateInstanceId);
      }
    };
  }]);
