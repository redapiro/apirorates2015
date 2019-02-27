'use strict';

angular.module('ratesUiApp').service('validationService',
  ['$q', 'configService', '$http', function ($q, configService, $http) {

    var _validateCronExpression = function (cronExpression) {
      var deferred = $q.defer();
      var payload = {'expression': cronExpression};
      $http.post(configService.getHostUrl() + '/validator/cron', payload, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    return {
      validateCronExpression: function (cronExpression) {
        return _validateCronExpression(cronExpression);
      }
    };
  }]);
