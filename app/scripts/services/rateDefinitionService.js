'use strict';

angular.module('ratesUiApp').service('rateDefinitionService', ['configService', '$http', '$q',
  function (configService, $http, $q) {

    var _getReferenceData = function () {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/config/rateDef/referenceData', {}, {
        headers: {'Content-Type': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _getMarketsBySchemaId = function (schemaId) {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/config/rateDef/marketsBySchemaId/' + schemaId, {}, {
        headers: {'Content-Type': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _getById = function (id) {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/config/rateDef/id/' + id, {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };


    var _findColumns = function () {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/config/rateDef/columns', {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _save = function (rateDef) {
      var deferred = $q.defer();
      $http.post(configService.getHostUrl() + '/config/rateDef/save', rateDef, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _changeRateSchemaDefinition = function (schemaId) {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/config/rateDef/changeRateSchemaDef/' + schemaId, {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };


    return {
      getReferenceData: function () {
        return _getReferenceData();
      },
      findColumns: function () {
        return _findColumns();
      },
      getById: function (id) {
        return _getById(id);
      },
      getMarketsBySchemaId: function (schemaId) {
        return _getMarketsBySchemaId(schemaId);
      },
      changeRateSchemaDefinition: function (schemaId) {
        return _changeRateSchemaDefinition(schemaId);
      },
      save: function (rateDef) {
        return _save(rateDef);
      }
    };

  }]);
