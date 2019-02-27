'use strict';

angular.module('ratesUiApp').service('logManagementService',
  ['configService', '$http', '$q', function (configService, $http, $q) {
    var _findLoggers = function () {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/setup/logManagement', {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _saveLoggers = function (loggers) {
      var deferred = $q.defer();
      $http.post(configService.getHostUrl() + '/setup/logManagement', loggers, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };


    return {
      findLoggers: function () {
        return _findLoggers();
      },
      saveLoggers: function(loggers){
        return _saveLoggers(loggers);
      }
    };
  }]);
