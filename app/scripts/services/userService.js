'use strict';

angular.module('ratesUiApp').service('userService',
  ['configService', '$http', '$q', function (configService, $http, $q) {

    var _getUserById = function (id) {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/user/id/' + id, {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _save = function (user) {
      var deferred = $q.defer();
      $http.post(configService.getHostUrl() + '/user/save', user, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _deleteUser = function (id, name) {
      var deferred = $q.defer();
      $http.delete(configService.getHostUrl() + '/user/delete/' + id + '/' + name, {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _findUserColumns = function () {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/user/columns', {}, {
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
      $http.get(configService.getHostUrl() + '/user/referenceData', {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    return {
      getUserById: function (id) {
        return _getUserById(id);
      },
      save: function (user) {
        return _save(user);
      },
      deleteUser: function (id, name) {
        return _deleteUser(id, name);
      },
      findUserColumns: function () {
        return _findUserColumns();
      },
      getReferenceData: function () {
        return _getReferenceData();
      }
    };

  }]);
