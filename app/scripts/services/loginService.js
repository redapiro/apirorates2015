'use strict';

angular.module('ratesUiApp').service('loginService',
  ['$q', 'configService', 'constantsService', '$http', '$resource', 'storageService', '$rootScope', 'userService',
    function ($q, configService, constantsService, $http, $resource, storageService, $rootScope, userService) {
      var deferred = $q.defer();
      var _login = function (login) {
        storageService.clearAll();
        var deferred = $q.defer();
        $http.post(configService.getHostUrl() + '/authenticator/authenticate', login, {
          headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}
        }).success(function (response) {
          storageService.saveObject(constantsService.getUserAuth(), response);
          userService.getUserById(response.userId).then(function(userData){
            storageService.saveObject(constantsService.getUser(), userData);
          });
          deferred.resolve(response);
        }).error(function (error) {
          deferred.reject(error);
        });
        return deferred.promise;
      };

      var _logout = function () {
        storageService.remove(constantsService.isLoggedIn());
        storageService.remove(constantsService.getSelectedSourcesTab());
        storageService.clearAll();
      };

      var _getLoggedinUser = function () {
        var user = storageService.fetchObject(constantsService.getUserAuth());
        if (!user) {
          // raise event
          $rootScope.$broadcast('event:notLoggedIn', {});
          return;
        }
        return user;
      };

      return {
        login: function (login) {
          return _login(login);
        },
        getLoggedinUser: function () {
          return _getLoggedinUser();
        },
        logout: function () {
          return _logout();
        }
      };
    }]);
