'use strict';

angular.module('ratesUiApp').service('systemStatusService',
  ['$rootScope', 'configService', '$http', '$q', function ($rootScope, configService, $http, $q) {
    var lookup = {
      'OPEN': 'Open',
      'CLOSE': 'Close',
      'CLOSED': 'Closed',
      'POST_CLOSE': 'Post Close',
      'POST_CLOSED': 'Post Closed',
      'CUSTOM_PROCESSING': 'Custom processing',
      'POST_CUSTOM': 'Post Custom',
      'PRE_OPEN': 'Pre Open',
      'CLOSING': 'Closing'
    };

    var _getSystemStatuses = function () {
      return {
        'OPEN': 'CLOSE',
        'CLOSED': 'POST_CLOSE',
        'POST_CLOSED': 'CUSTOM_PROCESSING',
        'CUSTOM_PROCESSING': 'POST_CUSTOM',
        'POST_CUSTOM': 'PRE_OPEN',
        'PRE_OPEN': 'OPEN'
      };
    };

    var _isCloseable = function () {
      var statusData = $rootScope.statusData;
      if (!statusData) {
        return false;
      }
      var payload = statusData.payLoad;
      return (payload.aggViolated + payload.aggInit) == 0;
    };

    var _getNextState = function (currentState) {
      return _getSystemStatuses()[currentState];
    };

    var _transition = function (newState) {
      var deferred = $q.defer();
      $http.post(configService.getHostUrl() + '/systransition/progress/' + newState, {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _canTransition = function (currentState) {
      return _getSystemStatuses()[currentState];
    };

    return {
      getSystemStatuses: function () {
        return _getSystemStatuses();
      },
      isCloseable: function () {
        return _isCloseable();
      },
      getNextState: function (currentState) {
        return _getNextState(currentState);
      },
      transition: function (newState) {
        return _transition(newState);
      },
      canTransition: function (currentState) {
        return _canTransition(newState);
      },
      getFriendlyName: function (currentState) {
        return lookup[currentState];
      }
    };
  }]);
