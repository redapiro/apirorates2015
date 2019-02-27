'use strict';

angular.module('ratesUiApp').controller('globalController', ['$scope', '$location', 'loginService', '$timeout',
  'storageService', 'constantsService', '$interval', '$rootScope', 'userService', '$window',
  function ($scope, $location, loginService, $timeout, storageService, constantsService, $interval, $rootScope, userService, $window) {

    $rootScope.loggedInUser = undefined;
    var user = storageService.fetchObject(constantsService.getUser());
    $rootScope.showView = false;
    if(user) {
      userService.getUserById(user.id).then(function(fetched){
        $rootScope.loggedInUser = fetched;
        //alert();
        //$window.location = $location.path();
        $timeout(function(){
          $rootScope.showView = true;
        },100)
      },function(error){
        delete $rootScope.loggedInUser;
        storageService.clearAll();
        $timeout(function(){
          $window.location ='#/login';
        })
      })
    }else{
      $rootScope.showView = false;
      delete $rootScope.loggedInUser;
      $window.location ='#/login';
    }

    // Some Nav hacks go here
    $scope.isRateDefinitionMain = function(){
      return $location.path() === '/configuration/rates/definitions/schemaDefinitions';
    }


  }]);