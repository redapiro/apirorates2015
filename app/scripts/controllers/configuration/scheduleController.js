'use strict';

angular.module('ratesUiApp').controller('scheduleController', ['$scope', '$modalInstance', 'id',
  function ($scope, $modalInstance, id) {
    $scope.modal = {};
    $scope.modal.schedule = {
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      repeat: ""
    };

    $scope.modal.repeats = ["Yearly", "Monthly", "Weekly", "Daily"];

    if (id != null) {

    }

    $scope.modal.schedule = function () {
      $modalInstance.close($scope.modal.definition);
    };

    $scope.modal.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  }]);