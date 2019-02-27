'use strict';

angular.module('ratesUiApp').service('approvalsService',
  ['configService', '$http', '$q', function (configService, $http, $q) {
    var _findColumns = function () {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/actions/approvals/columns', {}, {
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
      $http.get(configService.getHostUrl() + '/actions/approvals/approval/' + encodeURIComponent(id), {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _approve = function (id) {
      var deferred = $q.defer();
      $http.post(configService.getHostUrl() + '/actions/approvals/accept/' + encodeURIComponent(id), {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _reject = function (id) {
      var deferred = $q.defer();
      $http.post(configService.getHostUrl() + '/actions/approvals/reject/' + encodeURIComponent(id), {}, {
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
      approve: function (id) {
        return _approve(id);
      },
      reject: function (id) {
        return _reject(id);
      }
    };
  }]);
