'use strict';

/**
 * The 'instance' is inherited from the parent scope, and reflects the scriptable instance loaded
 */
angular.module('ratesUiApp')
  .directive('postCloseProcessInstanceForm', ['$location', 'lookupService',
    function ($location, lookupService) {
      return {
        templateUrl: 'views/directives/scriptable/instance/postCloseProcessInstanceForm.html',
        restrict: 'AE',
        link: function postLink(scope, element, attrs) {

        }
      };
    }]);
