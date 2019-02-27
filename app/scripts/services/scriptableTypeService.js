'use strict';

/**
 * DO NOT USE THIS
 */
angular.module('ratesUiApp').service('scriptableTypeService',
  ['configService', '$http', '$q', function (configService, $http, $q) {

    var _getDatasourceUrl = function (type) {
      return configService.getHostUrl() + '/config/' + type + '/search';
    };

    var _getById = function (type, id) {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/config/' + type + '/id/' + id, {}, {
        headers: {'Content-Type': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      });
      return deferred.promise;
    };

    var _findColumns = function (type) {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/config/' + type + '/columns', {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _listAll = function (type) {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/config/' + type + '/listAll', {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _save = function (type, instance) {
      var deferred = $q.defer();
      $http.post(configService.getHostUrl() + '/config/' + type + '/save', instance, {
        headers: {'Content-Type': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    return {
      getDataSourceSearchUrl: function (entityType) {
        return _getDatasourceUrl(entityType);
      },
      findColumns: function (entityType) {
        return _findColumns(entityType);
      },
      listAll: function (entityType) {
        return _listAll(entityType);
      },
      save: function (entityType, instance) {
        return _save(entityType, instance);
      },
      getById: function (entityType, id) {
        return _getById(entityType, id);
      }
    };
  }]);
