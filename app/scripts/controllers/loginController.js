'use strict';

angular.module('ratesUiApp').controller('loginController', ['$scope', '$location',
  'loginService', '$timeout', 'ngProgressLite', 'storageService', 'constantsService', '$rootScope', '$route','userService', '$window',
  function ($scope, $location, loginService, $timeout, ngProgressLite, storageService, constantsService, $rootScope, $route, userService, $window) {
    ngProgressLite.done();
    jQuery('body').removeClass('fixed-header');
    $scope.ready = false;
    $scope.login = {};
    if($rootScope.showView){
      $scope.show = false;
      $window.location = '#/runtime/dashboard';
    }else{
      $scope.show = true;
      $('.main-view-div').attr('id','extr-page');
    }
    $scope.displayLoading = false;
    $scope.displaySuccess = false;
    $scope.displayBadLogin = false;
    $scope.errorMessage = '';
    $scope.doLogin = function () {
      $scope.displayLoading = true;
      var loginPromise = loginService.login($scope.login);
      ngProgressLite.start();
      loginPromise.then(function (success) {
        storageService.saveValue(constantsService.isLoggedIn(), true);
        $scope.displayBadLogin = false;
        $scope.displaySuccess = true;
        ngProgressLite.set(50);
        userService.getUserById(success.userId).then(function(user){
          $timeout(function () {
            $scope.show = false;
            $rootScope.showView = true;
            $rootScope.loggedInUser = user;
            ngProgressLite.done();
            $window.location = '#/runtime/dashboard';
          }, 1000);
        });
      }, function (failure) {
        ngProgressLite.done();
        $scope.login.password = '';
        $scope.errorMessage = failure.errorMessage;
        if ($scope.errorMessage) {
          $scope.displayBadLogin = true;
        } else {
          $scope.errorMessage = 'Invalid username or password combination';
          $scope.displayBadLogin = true;
        }
        $scope.displayLoading = false;
      });
    };

    $scope.clearError = function () {
      $scope.displayBadLogin = false;
    };

    $scope.getClass = function () {
      if ($scope.displayBadLogin) {
        return 'animate fadeIn';
      }

      return 'animate fadeOut';
    }
  }]);