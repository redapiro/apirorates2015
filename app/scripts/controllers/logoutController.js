'use strict';

angular.module('ratesUiApp').controller('logoutController', ['$scope', '$location',
  'loginService', '$rootScope', '$window',
  function ($scope, $location, loginService, $rootScope, $window) {
    loginService.logout();
    $rootScope.loggedInUser = undefined;
    $rootScope.showView = false;
    $window.location = '#/login';
  }]);