'use strict';

angular.module('ratesUiApp').service('auditService',
  ['configService', '$http', '$resource', '$q', function (configService, $http, $resource, $q) {
    var _findColumns = function () {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/audit/task/columns', {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _findEntityColumns = function (successCallback, failureCallback) {
      $http.get(configService.getHostUrl() + '/entityaudit/entity/columns', {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {

        successCallback(response);
      }).error(function (error) {

        failureCallback(error);
      });
    };

    var _findCombinedColumns = function (successCallback, failureCallback) {
      $http.get(configService.getHostUrl() + '/audit/detailed/combined/columns', {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {

        successCallback(response);
      }).error(function (error) {

        failureCallback(error);
      });
    };

    var _getFullEntityAudit = function (referenceId, successCallback, failureCallback) {
      var queryObject = {
        referenceId: referenceId
      };

      var resource = $resource(configService.getHostUrl() + '/entityaudit/entity/fullaudit', queryObject,
        {
          get: {
            method: 'GET',
            headers: {
              'Accept': 'application/json'
            },
            isArray: true
          }
        });

      //execute call to API
      resource.get(
        function (response) {
          successCallback(response);
        },
        function (response) {
          failureCallback(response);
        });
    };

    return {
      findTaskColumns: function () {
        return _findColumns();
      },
      findEntityColumns: function (successCallback, failureCallback) {
        _findEntityColumns(successCallback, failureCallback);
      },
      findCombinedColumns: function (successCallback, failureCallback) {
        _findCombinedColumns(successCallback, failureCallback);
      },

      getFullEntityAudit: function (referenceId, successCallback, failureCallback) {
        _getFullEntityAudit(referenceId, successCallback, failureCallback);
      }
    };
  }]);
