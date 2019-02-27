'use strict';

angular.module('ratesUiApp').service('logMessageService',
  ['configService', '$http', '$q', function (configService, $http, $q) {
    var _findColumns = function () {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/system/log/columns', {}, {
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
      }
    };
  }]);
