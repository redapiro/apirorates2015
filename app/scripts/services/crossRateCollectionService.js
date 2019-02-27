'use strict';

angular.module('ratesUiApp').service('crossRateCollectionService',
  ['configService', '$http', '$q', function (configService, $http, $q) {

    var _findColumns = function () {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/config/crossRateCollection/columns', {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _getById = function (id) {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/config/crossRateCollection/id/' + encodeURIComponent(id), {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };


    var _getReferenceData = function () {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/config/crossRateCollection/referenceData', {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };


    var _save = function (crossRateCol) {
      var deferred = $q.defer();
      $http.post(configService.getHostUrl() + '/config/crossRateCollection/save', crossRateCol, {
        headers: {'Content-Type': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _findInnerColumns = function () {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/config/crossRateCollection/crossRateLineItem/columns', {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _listAllActive = function () {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/config/crossRateCollection/allActive', {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _filter = function (query) {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/config/rateDef/prefixsearch?' + query, {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    return {
      findColumns: function () {
        return _findColumns();
      },
      getById: function (id) {
        return _getById(id);
      },
      findInnerColumns: function () {
        return _findInnerColumns();
      },
      getReferenceData: function () {
        return _getReferenceData();
      },
      save: function (crossRateCol) {
        return _save(crossRateCol);
      },
      filter: function (query) {
        return _filter(query);
      },
      listAllActive: function () {
        return _listAllActive();
      }

    };
  }]);
