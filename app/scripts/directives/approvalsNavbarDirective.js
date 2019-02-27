'use strict';

angular.module('ratesUiApp')
  .directive('approvalsNavbar', ['$location', function ($location) {
    return {
      templateUrl: '/views/directives/approvalsNavbar.html',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        scope.location = $location.$$path;
      }
    };
  }]);
