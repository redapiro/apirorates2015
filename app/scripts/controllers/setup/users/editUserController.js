'use strict';

angular.module('ratesUiApp').controller('editUserController', ['$scope', 'notificationService', 'userService', '$routeParams', '$q', '$location',
  function ($scope, notificationService, userService, $routeParams, $q, $location) {
    var userId = $routeParams.userId;

    var promise;
    var referenceDataPromise = userService.getReferenceData();
    if(userId) {
      promise = userService.getUserById(userId);
    } else{
      promise = $q.when({});
    }

    $q.all([promise, referenceDataPromise]).then(function(response){
      $scope.user = response[0];
      $scope.roles = response[1].roles;
    });


    $scope.cancel = function() {
      goBack();
    };

    $scope.save = function() {
      userService.save($scope.user).then(function(user){
        $scope.user = user;
        notificationService.sendInfo('Saved', 'User has been updated');
        goBack();
      }, function(error){
        $scope.errorMessages = error.errorMessages;
      })
    };

    function goBack() {
      $location.path('/setup/users/user').search({});
    }

  }]);