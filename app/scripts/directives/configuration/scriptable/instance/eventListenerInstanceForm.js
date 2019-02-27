'use strict';

/**
 * The 'instance' is inherited from the parent scope, and reflects the scriptable instance loaded
 */
angular.module('ratesUiApp')
  .directive('eventListenerInstanceForm', ['$location', 'lookupService',
    function ($location, lookupService) {
      return {
        templateUrl: 'views/directives/scriptable/instance/eventListenerInstanceForm.html',
        restrict: 'AE',
        link: function postLink(scope, element, attrs) {
          scope.eventTypes = [];

          lookupService.getEventTypes().then(function (value) {
            scope.eventTypes = value;
          });
        }
      };
    }]);
