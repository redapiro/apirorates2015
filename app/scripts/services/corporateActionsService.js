'use strict';

angular.module('ratesUiApp').service('corporateActionsService',
  ['configService', '$http', '$q', function (configService, $http, $q) {
    var _findColumns = function () {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/corporateActions/columns', {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _getTypes = function () {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/corporateActions/types', {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _save = function (corporateAction) {
      var deferred = $q.defer();
      $http.post(configService.getHostUrl() + '/corporateActions/save', corporateAction, {
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _get = function (corporateActionId) {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/corporateActions/get?corporateActionId=' + corporateActionId, {}, {
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}
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
      getTypes: function () {
        return _getTypes();
      },
      get: function (corporateActionId) {
        return _get(corporateActionId);
      },
      save: function (corporateAction) {
        return _save(corporateAction);
      }
    };
  }]);
