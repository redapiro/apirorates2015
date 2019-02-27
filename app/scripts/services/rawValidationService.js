'use strict';

angular.module('ratesUiApp').service('rawValidationService',
  ['configService', '$http', '$q', function (configService, $http, $q) {

    var _findRawValDefColumns = function () {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/config/rawRateFieldValidationDefinition/columns', {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _findRawValInsColumns = function () {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/config/rawRateFieldValidationInstance/columns', {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    //RawRateFieldValidationDefinition
    var _listAllRawRateFieldValidationDefinition = function () {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/config/rawRateFieldValidationDefinition/listAll', {}, {
        headers: {'Content-Type': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      });
      return deferred.promise;
    };

    var _deleteRawRateFieldValidationDefinition = function (id, name) {
      var deferred = $q.defer();
      $http.delete(configService.getHostUrl() + '/config/rawRateFieldValidationDefinition/delete/' + id + '/' + name, {}, {
        headers: {'Content-Type': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      });
      return deferred.promise;
    };

    var _saveRawRateFieldValidationDefinition = function (rawRateFieldValDef) {
      var deferred = $q.defer();
      $http.post(configService.getHostUrl() + '/config/rawRateFieldValidationDefinition/save', rawRateFieldValDef, {
        headers: {'Content-Type': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      });
      return deferred.promise;
    };

    var _getRawRateFieldValidationDefinitionById = function (id) {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/config/rawRateFieldValidationDefinition/id/' + id, {}, {
        headers: {'Content-Type': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      });
      return deferred.promise;
    };

    var _getRawValDefReferenceData = function () {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/config/rawRateFieldValidationDefinition/referenceData', {}, {
        headers: {'Content-Type': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      });
      return deferred.promise;
    };

    //RawRateFieldValidationInstance
    var _listAllRawRateFieldValidationInstance = function () {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/config/rawRateFieldValidationInstance/listAll', {}, {
        headers: {'Content-Type': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      });
      return deferred.promise;
    };

    var _deleteRawRateFieldValidationInstance = function (id, name) {
      var deferred = $q.defer();
      $http.delete(configService.getHostUrl() + '/config/rawRateFieldValidationInstance/delete/' + id + '/' + name, {}, {
        headers: {'Content-Type': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      });
      return deferred.promise;
    };

    var _saveRawRateFieldValidationInstance = function (rawRateFieldValIns) {
      var deferred = $q.defer();
      $http.post(configService.getHostUrl() + '/config/rawRateFieldValidationInstance/save', rawRateFieldValIns, {
        headers: {'Content-Type': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      });
      return deferred.promise;
    };

    var _getRawRateFieldValidationInstanceById = function (id) {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/config/rawRateFieldValidationInstance/id/' + id, {}, {
        headers: {'Content-Type': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      });
      return deferred.promise;
    };

    var _getRawValInsByDefId = function (id) {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/config/rawRateFieldValidationInstance/find/defId/' + id, {}, {
        headers: {'Content-Type': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      });
      return deferred.promise;
    };

    return {
      findRawValDefColumns: function () {
        return _findRawValDefColumns();
      },
      findRawValInsColumns: function () {
        return _findRawValInsColumns();
      },
      listAllRawRateFieldValidationDefinition: function () {
        return _listAllRawRateFieldValidationDefinition();
      },
      deleteRawRateFieldValidationDefinition: function (id, name) {
        return _deleteRawRateFieldValidationDefinition(id, name);
      },
      saveRawRateFieldValidationDefinition: function (rawRateFieldValDef) {
        return _saveRawRateFieldValidationDefinition(rawRateFieldValDef);
      },
      getRawRateFieldValidationDefinitionById: function (id) {
        return _getRawRateFieldValidationDefinitionById(id);
      },
      getRawValDefReferenceData: function () {
        return _getRawValDefReferenceData();
      },
      listAllRawRateFieldValidationInstance: function () {
        return _listAllRawRateFieldValidationInstance();
      },
      deleteRawRateFieldValidationInstance: function (id, name) {
        return _deleteRawRateFieldValidationInstance(id, name);
      },
      saveRawRateFieldValidationInstance: function (rawRateFieldValIns) {
        return _saveRawRateFieldValidationInstance(rawRateFieldValIns);
      },
      getRawRateFieldValidationInstanceById: function (id) {
        return _getRawRateFieldValidationInstanceById(id);
      },
      getRawValInsByDefId: function (id) {
        return _getRawValInsByDefId(id);
      }


    };
  }]);
