'use strict';

angular.module('ratesUiApp').service('symbolAutocompleteService',
  ['configService', '$resource', function (configService, $resource) {
    var _getSystemStatus = function (query, successCallback, failureCallback) {
      $http.get(configService.getHostUrl() + '/config/rateDef/prefixsearch', {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {

        successCallback(response);
      }).error(function (error) {

        failureCallback(error);
      });
    };
    var queryObject = {};
    queryObject.prefix = query;

    var resource = $resource(configService.getHostUrl() + '/config/rateDef/prefixsearch', queryObject,
      {
        get: {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
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


    return {
      getSymbols: function (query, successCallback, failureCallback) {
        _getSymbols(query, successCallback, failureCallback);
      }
    };
  }]);
