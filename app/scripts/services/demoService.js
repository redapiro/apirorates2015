'use strict';

angular.module('ratesUiApp').service('demoService', ['$resource', 'configService', function ($resource, configService) {
  /**
   * Perform a search
   * @param searchQuery
   * @param successCallback
   * @param failureCallback
   */
  var getDemoContentHelper = function (successCallback, failureCallback) {
    var resource = $resource(configService.getResourceUrl() + '/hello', {},
      {
        get: {
          method: 'get',
          cache: false,
          headers: {'Accept': 'application/json'}
        }
      });

    resource.get({},
      {},
      function (data) {
        successCallback.call(this, data);
      },
      function (response) {
        failureCallback.call(this, response.data, response.status);
      });
  };
  return {
    getDemoContent: function (successCallback, failureCallback) {
      return getDemoContentHelper(successCallback, failureCallback);
    }
  };
}]);
