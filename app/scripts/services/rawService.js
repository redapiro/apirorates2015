'use strict';

angular.module('ratesUiApp').service('rawService',
  ['$q', 'configService', '$http', '$window', function ($q, configService, $http, $window) {

    var _findColumns = function (schemaId) {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/rates/raw/columns/' + schemaId, {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _findDrillDownColumns = function (schemaId) {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/rates/raw/columns/' + schemaId + '/slider', {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _findByRateDefinition = function (rateDefinitionId) {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/rates/list?rateDefinitionId=' + rateDefinitionId + '', {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _loadRateById = function (id) {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/rates/raw/rate/' + id, {}, {
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
      $http.get(configService.getHostUrl() + '/rates/raw/search/' + id, {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _findFeedInstances = function (successCallback, failureCallback) {
      $http.get(configService.getHostUrl() + '/rates/raw/feed/search', {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        successCallback(response);
      });
    };

    var _findRateDefinitions = function (successCallback, failureCallback) {
      $http.get(configService.getHostUrl() + '/rates/raw/rateDef/search', {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        successCallback(response);
      });
    };

    var _findIntraday = function (rateDefinitionId, successCallback, failureCallback) {
      $http.get(configService.getHostUrl() + '/rates/raw/intraday/' + rateDefinitionId, {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        successCallback(response);
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
      return configService.getHostUrl() + '/rates/raw/dump/' + queryString;
    };

    return {
      loadRateById: function (id) {
        return _loadRateById(id);
      },
      loadRateByIdAsArray: function (id) {
        return _loadRateByIdAsArray(id);
      },
      findColumns: function (schemaId) {
        return _findColumns(schemaId);
      },
      findDrillDownColumns: function (schemaId) {
        return _findDrillDownColumns(schemaId);
      },
      findByRateDefinition: function (rateDefinitionId) {
        return _findByRateDefinition(rateDefinitionId);
      },
      findFeedInstances: function (successCallback, failureCallback) {
        _findFeedInstances(successCallback, failureCallback);
      },
      findRateDefinitions: function (successCallback, failureCallback) {
        _findRateDefinitions(successCallback, failureCallback);
      },
      findIntraday: function (rateDefinitionId, successCallback, failureCallback) {
        _findIntraday(rateDefinitionId, successCallback, failureCallback);
      },
      getDownloadLink: function (queryObject) {
        return _getDownloadLink(queryObject);
      }
    };
  }]);
