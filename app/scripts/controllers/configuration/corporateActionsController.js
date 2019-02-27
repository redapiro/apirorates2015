'use strict';

angular.module('ratesUiApp')
  .controller('corporateActionsController', ['$scope', 'corporateActionsService', '$modal',
    function ($scope, corporateActionsService, $modal) {

      $scope.columns = [];

      var promise = corporateActionsService.findColumns();
      promise.then(function (data) {
        $scope.columns = data;
        if (!$scope.$$phase) {
          $scope.$apply();
        }
        $scope.ready = true;
      });


//      $scope.corprateActionsModal = {
//        backdrop: true,
//        keyboard: true,
//        backdropClick: false,
//        templateUrl: 'views/modals/corporateActionsModal.html',
//        controller: 'corporateActionsModalController'
//      };
//
//      $scope.addCorporateAction = function () {
//        $scope.corprateActionsModal.resolve = {
//          bundle: function () {
//            return {
//
//            };
//          },
//          result: function () {
//
//          }
//        };
//
//        var rateModal = $modal.open(
//          $scope.corprateActionsModal
//        );
//      }
    }]);
