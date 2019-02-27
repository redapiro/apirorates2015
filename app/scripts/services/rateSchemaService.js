'use strict';

angular.module('ratesUiApp').service('rateSchemaService', ['configService', '$http', '$q',
  function (configService, $http, $q) {

    var _findColumns = function () {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/config/rateSchemaDef/columns', {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _listAll = function () {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/config/rateSchemaDef/listAll', {}, {
        headers: {'Content-Type': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      });
      return deferred.promise;
    };

    var _save = function (definition) {
      var deferred = $q.defer();
      var definitionId = definition.id;
      var toSave = JSON.parse(angular.toJson(definition));
      toSave.id = definitionId;
      $http.post(configService.getHostUrl() + '/config/rateSchemaDef/save', toSave, {
        headers: {'Content-Type': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (response) {
        deferred.reject(response);
      });
      return deferred.promise;
    };

    var _getById = function (id) {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/config/rateSchemaDef/id/' + id, {}, {
        headers: {'Content-Type': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      });
      return deferred.promise;
    };

    var _getReferenceData = function () {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/config/rateSchemaDef/referenceData', {}, {
        headers: {'Content-Type': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      });
      return deferred.promise;
    };

    return {
      findColumns: function () {
        return _findColumns();
      },
      listAll: function () {
        return _listAll();
      },
      /*	   delete: function(id, name){
       return _delete(id, name);
       },*/
      save: function (postAggRateFieldValDef) {
        return _save(postAggRateFieldValDef);
      },
      getById: function (id) {
        return _getById(id);
      },
      getReferenceData: function () {
        return _getReferenceData();
      }
    };
  }]);
