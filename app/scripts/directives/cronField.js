'use strict';

angular.module('ratesUiApp')
  .directive('cronField', ['validationService', function (validationService) {
    return {
      templateUrl: '/views/directives/cronField.html',
      restrict: 'E',
      replace: true,
      link: function postLink(scope, element, attrs) {
        scope.sourceArray = [];
        scope.$watch(attrs.expressionSource, function (newValue) {
          if (newValue) {
            scope.sourceArray = newValue;
          }else{
            scope.sourceArray = [];
          }
        });

        scope.addNew = function () {
          scope.sourceArray.push('');
        };

        scope.remove = function (index) {
          scope.sourceArray.splice(index, 1);
        };

        scope.hasExpressions = function () {
          return scope.sourceArray.length === 0;
        };
      }
    };
  }]);

angular.module('ratesUiApp')
  .directive('cronFieldValidator', ['validationService', function (validationService) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, elem, attr, ctrl) {
        ctrl.$parsers.unshift(function (value) {
          var promise = validationService.validateCronExpression(value);
          promise.then(function (results) {
            ctrl.$setValidity('badExpression', true);
            ctrl.$setValidity('valid', true);
            return valid ? value : undefined;
          }, function (failure) {
            ctrl.$setValidity('badExpression', false);
            ctrl.$setValidity('valid', false);
            return false;
          });
          return value;
        });
      }
    };
  }]);

