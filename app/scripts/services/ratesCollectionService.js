'use strict';

angular.module('ratesUiApp').service('ratesCollectionService',
  ['configService', '$http', '$q', function (configService, $http, $q) {
    var _findColumns = function () {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/ratecollections/columns', {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _findAllActive = function () {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/ratecollections/listAllActive', {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _getReferences = function (successCallback, failureCallback) {
      $http.get(configService.getHostUrl() + '/ratecollections/references', {}, {
        headers: {'Content-Type': 'application/json'}
      }).success(function (response) {
        successCallback(response);
      });
    };

    var _save = function (saveRateColRequest, successCallback, failureCallback) {
      $http.post(configService.getHostUrl() + '/ratecollections/creatNewAdhoc', saveRateColRequest, {
        headers: {'Content-Type': 'application/json'}
      }).success(function (response) {
        successCallback(response);
      });
    };

    var _searchSymbol = function (prefix, successCallback, failureCallback) {
      $http.get(configService.getHostUrl() + '/config/rateDef/prefixsearch?prefix=' + prefix, {}, {
        headers: {'Content-Type': 'application/json'}
      }).success(function (response) {
        successCallback(response);
      });
    };

    return {
      findColumns: function () {
        return _findColumns();
      },
      findAllActive: function () {
        return _findAllActive();
      },
      getReferences: function (successCallback, failureCallback) {
        _getReferences(successCallback, failureCallback);
      },
      save: function (saveRateColRequest, successCallback, failureCallback) {
        _save(saveRateColRequest, successCallback, failureCallback);
      },
      searchSymbol: function (prefix, successCallback, failureCallback) {
        _searchSymbol(prefix, successCallback, failureCallback);
      }
    };
  }]);
