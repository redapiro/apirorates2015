'use strict';

angular.module('ratesUiApp').directive('loggedInHeader', ['$rootScope', '$location', 'configService', 'constantsService',
  'storageService', 'loginService', 'socketWatcherService', 'notificationService', 'systemStatusService',
  function ($rootScope, $location, configService, constantsService, storageService, loginService, socketWatcherService,
            notificationService, systemStatusService) {
    return {
      templateUrl: 'views/includes/loggedInHeader.html',
      restrict: 'AE',
      replace: true,
      scope: {},
      link: function postLink(scope) {
        $rootScope.isRuntime = function() {
          return $location.$$path.indexOf('/runtime') > -1;
        };

        $rootScope.isSetup = function() {
          return $location.$$path.indexOf('/setup') > -1;
        };

        $rootScope.isConfiguration = function() {
          return $location.$$path.indexOf('/configuration') > -1;
        };

        $rootScope.performLogout = function () {
          loginService.logout();
          $rootScope.$broadcast('event:loggedOut', {});
        };


        var host = $location.absUrl();
        var path = $location.path();

        var indexOf = host.indexOf(path);
        host = host.substring(0, indexOf -1);


        scope.runtimeLocation = host + '#/runtime/dashboard';
        scope.setupLocation = host + '#/setup/rates/definitions/dimensions';
        scope.configLocation = host + '#/configuration/rates/raw/preSourceCleanse';

        scope.goConfiguration = function(){
          var location = storageService.fetchValue(constantsService.getConfiguration());
          if(location) {
            $location.url(decodeURIComponent(location));
          } else {
            $location.url('/configuration/rates/raw/preSourceCleanse');
          }
        };

        scope.getNewState = function () {
          var currentState = $rootScope.currentState;
          var newState = systemStatusService.getNextState(currentState);
          return newState;
        };

        scope.getNewStateAsFriendly= function () {
          var currentState = $rootScope.currentState;
          var newState = systemStatusService.getFriendlyName(systemStatusService.getNextState(currentState));
          return newState;
        };

        scope.getFriendlyName = function () {
          return systemStatusService.getFriendlyName($rootScope.currentState);
        };


        scope.isTransitioning = false;
        scope.transition = function () {
          scope.isTransitioning = true;
          var currentState = $rootScope.currentState;
          var newStatus = systemStatusService.getNextState(currentState);
          var newStatusFriendly =  systemStatusService.getFriendlyName(systemStatusService.getNextState(currentState));
          var promise = systemStatusService.transition(newStatus);
          promise.then(function (response) {
            scope.isTransitioning = false;
            if (response.code !== 0) {
              notificationService.sendError('Failed to transition', response.message);
            } else {
              notificationService.sendInfo('Transition complete', 'System has transitioned to ' + newStatusFriendly);
            }
          });
        };

        $rootScope.currentState = '';
        scope.formatSystemStatus = function () {
          var status = systemStatusService.getFriendlyName($rootScope.currentState);
          if (systemStatusService.getFriendlyName($rootScope.currentState)) {
            return status;
          }
          return $rootScope.currentState;
        };

        scope.aggregatedModalOptions = {
          backdrop: true,
          keyboard: true,
          backdropClick: false,
          templateUrl: 'views/modals/approvals/aggregatedApproval.html',
          controller: 'aggregatedApprovalController'
        };

        var systemStatusCallback = {
          id: 'systemStat',
          messageType: 'systemStat',
          doCallback: function (changed) {
            $rootScope.systemDate = changed.payLoad.marketDateString;
            if ($rootScope.currentState === '') {
              $rootScope.currentState = changed.payLoad.status;
              $rootScope.systemDate = changed.payLoad.marketDateString;
              scope.$apply();
            }

            if ($rootScope.currentState !== changed.payLoad.status) {
              $rootScope.currentState = changed.payLoad.status;
              $rootScope.systemDate = changed.payLoad.marketDateString;
              scope.$apply();
            }
          }
        };


        scope.$on('$routeChangeSuccess', function (event, next, current){
          if($location.path().indexOf('/runtime') === 0) {
            storageService.saveValue(constantsService.getRuntime(), $location.absUrl());
            scope.runtimeLocation = $location.absUrl();
          }

          if($location.path().indexOf('/setup') === 0) {
            storageService.saveValue(constantsService.getSetup(), $location.absUrl());
            scope.setupLocation = $location.absUrl();
          }

          if($location.path().indexOf('/configuration') === 0) {
            storageService.saveValue(constantsService.getConfiguration(), $location.absUrl());
            scope.configLocation = $location.absUrl();
          }
        });

        socketWatcherService.registerCallback('systemStat', systemStatusCallback);

        scope.$on('$destroy', function() {
          socketWatcherService.removeRegisteredCallback('systemStat');
        });

        $('.show-on-hover').powerTip({
          placement: 's', // north-east tooltip position
          followMouse: false
        });
      }
    };
  }]);
