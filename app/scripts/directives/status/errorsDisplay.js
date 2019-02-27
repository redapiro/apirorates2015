'use strict';

angular.module('ratesUiApp')
  .directive('errorsDisplay', ['statusService', 'socketWatcherService', '$timeout', function (statusService, socketWatcherService, $timeout) {
    return {
      template: '<div class="alert alert-danger  animate-show "  ng-show="show"><button class="close" ng-click="close()">×</button>Validation failures occurred:<ul><li ng-repeat="errorMessage in suppliedErrorMessages">Code: {{errorMessage.code}} - Description: {{errorMessage.message}}</li></ul></div>',
      restrict: 'EA',
      scope: {
        errorMessages: '='
      },
      replace: true,
      link: function postLink($scope) {

        $scope.close = function() {
          $scope.show = false;
        };

        $scope.$watch('errorMessages', function(supplied){
          if(supplied && supplied.length > 0) {
            $scope.show = true;
            $scope.suppliedErrorMessages = supplied;
          }
        });
      }
    };
  }]);
