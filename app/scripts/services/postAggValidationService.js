'use strict';

/**
 * DO NOT USE THIS
 */
angular.module('ratesUiApp').service('postAggValidationService',
  ['configService', '$http', '$q', function (configService, $http, $q) {

    var _findPostAggValDefColumns = function () {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/config/postAggRateFieldValidationDefinition/columns', {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _findPostAggValInsColumns = function () {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/config/postAggRateFieldValidationInstance/columns', {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    //PostAggRateFieldValidationDefinition
    var _listAllPostAggRateFieldValidationDefinition = function () {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/config/postAggRateFieldValidationDefinition/listAll', {}, {
        headers: {'Content-Type': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      });
      return deferred.promise;
    };

    var _deletePostAggRateFieldValidationDefinition = function (id, name) {
      var deferred = $q.defer();
      $http.delete(configService.getHostUrl() + '/config/postAggRateFieldValidationDefinition/delete/' + id + '/' + name, {}, {
        headers: {'Content-Type': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      });
      return deferred.promise;
    };

    var _savePostAggRateFieldValidationDefinition = function (postAggRateFieldValDef) {
      var deferred = $q.defer();
      $http.post(configService.getHostUrl() + '/config/postAggRateFieldValidationDefinition/save', postAggRateFieldValDef, {
        headers: {'Content-Type': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      });
      return deferred.promise;
    };

    var _getPostAggRateFieldValidationDefinitionById = function (id) {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/config/postAggRateFieldValidationDefinition/id/' + id, {}, {
        headers: {'Content-Type': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      });
      return deferred.promise;
    };

    var _getPostAggValDefReferenceData = function () {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/config/postAggRateFieldValidationDefinition/referenceData', {}, {
        headers: {'Content-Type': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      });
      return deferred.promise;
    };

    //PostAggRateFieldValidationInstance
    var _listAllPostAggRateFieldValidationInstance = function () {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/config/postAggRateFieldValidationInstance/listAll', {}, {
        headers: {'Content-Type': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      });
      return deferred.promise;
    };

    var _deletePostAggRateFieldValidationInstance = function (id, name) {
      var deferred = $q.defer();
      $http.delete(configService.getHostUrl() + '/config/postAggRateFieldValidationInstance/delete/' + id + '/' + name, {}, {
        headers: {'Content-Type': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      });
      return deferred.promise;
    };

    var _savePostAggRateFieldValidationInstance = function (postAggRateFieldValIns) {
      var deferred = $q.defer();
      $http.post(configService.getHostUrl() + '/config/postAggRateFieldValidationInstance/save', postAggRateFieldValIns, {
        headers: {'Content-Type': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      });
      return deferred.promise;
    };

    var _getPostAggRateFieldValidationInstanceById = function (id) {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/config/postAggRateFieldValidationInstance/id/' + id, {}, {
        headers: {'Content-Type': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      });
      return deferred.promise;
    };

    var _getPostAggValInsByDefId = function (id) {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/config/postAggRateFieldValidationInstance/find/defId/' + id, {}, {
        headers: {'Content-Type': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      });
      return deferred.promise;
    };

    return {
      findPostAggValDefColumns: function () {
        return _findPostAggValDefColumns();
      },
      findPostAggValInsColumns: function () {
        return _findPostAggValInsColumns();
      },
      listAllPostAggRateFieldValidationDefinition: function () {
        return _listAllPostAggRateFieldValidationDefinition();
      },
      deletePostAggRateFieldValidationDefinition: function (id, name) {
        return _deletePostAggRateFieldValidationDefinition(id, name);
      },
      savePostAggRateFieldValidationDefinition: function (postAggRateFieldValDef) {
        return _savePostAggRateFieldValidationDefinition(postAggRateFieldValDef);
      },
      getPostAggRateFieldValidationDefinitionById: function (id) {
        return _getPostAggRateFieldValidationDefinitionById(id);
      },
      getPostAggValDefReferenceData: function () {
        return _getPostAggValDefReferenceData();
      },
      listAllPostAggRateFieldValidationInstance: function () {
        return _listAllPostAggRateFieldValidationInstance();
      },
      deletePostAggRateFieldValidationInstance: function (id, name) {
        return _deletePostAggRateFieldValidationInstance(id, name);
      },
      savePostAggRateFieldValidationInstance: function (postAggRateFieldValIns) {
        return _savePostAggRateFieldValidationInstance(postAggRateFieldValIns);
      },
      getPostAggRateFieldValidationInstanceById: function (id) {
        return _getPostAggRateFieldValidationInstanceById(id);
      },
      getPostAggValInsByDefId: function (id) {
        return _getPostAggValInsByDefId(id);
      }
    };
  }]);
