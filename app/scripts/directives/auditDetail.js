'use strict';

angular.module('ratesUiApp')
  .directive('auditDetail', ['$location', function ($location) {
    return {
      templateUrl: '/views/directives/auditDetail.html',
      restrict: 'E',
      replace: true,
      scope: {
        auditHistory: '='
      },
      link: function postLink(scope, element, attrs) {
        element.find('.body').slimScroll({
          height: '600px'
        });
      }
    };
  }]);
