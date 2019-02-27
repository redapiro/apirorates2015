'use strict';

angular.module('ratesUiApp').service('serviceImplsService',
  ['configService', '$http', '$q', function (configService, $http, $q) {

    var _getDefault = function () {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/config/serviceDefaultImpl/singleton', {}, {
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
      $http.get(configService.getHostUrl() + '/config/serviceDefaultImpl/references', {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _save = function (serviceDefault) {
      var deferred = $q.defer();
      $http.post(configService.getHostUrl() + '/config/serviceDefaultImpl/save', serviceDefault, {
        headers: {'Content-Type': 'application/json'}
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
      getDefault: function () {
        return _getDefault();
      },
      save: function (serviceDefault) {
        return _save(serviceDefault);
      }

    };
  }]);
