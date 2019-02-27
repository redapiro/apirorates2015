'use strict';

angular.module('ratesUiApp').service('dataDictionaryService',
  ['configService', '$http', '$q', function (configService, $http, $q) {

    var _findColumns = function () {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/config/dictionary/columns', {}, {
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
      $http.get(configService.getHostUrl() + '/config/dictionary/id/' + encodeURIComponent(id), {}, {
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
      $http.get(configService.getHostUrl() + '/config/dictionary/referenceData', {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _create = function (dataDictionary) {
      var deferred = $q.defer();
      $http.post(configService.getHostUrl() + '/config/dictionary/save', dataDictionary, {
        headers: {'Content-Type': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _deleteByIdAndName = function (id, name) {
      var deferred = $q.defer();
      $http.delete(configService.getHostUrl() + '/config/dictionary/delete/' + id + '/' + name, {}, {
        headers: {'Content-Type': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _listAttributesDef = function () {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/config/dictionary/attributes', {}, {
        headers: {'Content-Type': 'application/json'}
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
      getReferenceData: function () {
        return _getReferenceData();
      },
      create: function (dataDictionary) {
        return _create(dataDictionary);
      },
      deleteByIdAndName: function (id, name) {
        return _deleteByIdAndName(id, name);
      },
      listAttributesDef: function () {
        return _listAttributesDef();
      }

    };
  }]);
