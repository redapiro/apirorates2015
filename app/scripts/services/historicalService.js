'use strict';

angular.module('ratesUiApp').service('historicalService',
  ['$q', 'configService', '$http', '$resource', '$window', function ($q, configService, $http, $window) {
    var _findColumns = function (schemaId) {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/rates/historical/columns/' + schemaId, {}, {
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
      $http.get(configService.getHostUrl() + '/rates/historical/columns/' + schemaId + '/slider', {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
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
      return configService.getHostUrl() + '/rates/historical/dump/' + queryString;
    };

    var _getSystemDate = function (successCallback, failureCallback) {
      $http.get(configService.getHostUrl() + '/rates/historical/systemdate/', {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        successCallback(response);
      })
    };

    return {
      getSystemDate: function (successCallback, failureCallback) {
        _getSystemDate(successCallback, failureCallback);
      },
      findColumns: function (schemaId) {
        return _findColumns(schemaId);
      },
      getDownloadLink: function (queryObject) {
        return _getDownloadLink(queryObject);
      },
      findDrillDownColumns: function (schemaId) {
        return _findDrillDownColumns(schemaId);
      }
    };
  }]);
