'use strict';

angular.module('ratesUiApp').service('scriptLanguageService',
  ['configService', '$http', '$q', function (configService, $http, $q) {

    var _findColumns = function () {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/config/scriptLanguage/columns', {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _save = function (scriptLanguage) {
      var deferred = $q.defer();
      $http.post(configService.getHostUrl() + '/config/scriptLanguage/save', scriptLanguage, {
        headers: {'Content-Type': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    /*
     var _getReferences = function(){
     var deferred = $q.defer();
     $http.get(configService.getHostUrl()+'/config/scriptLanguage/references', {}, {
     headers: { 'Content-Type': 'application/json'}
     }).success(function(response) {
     deferred.resolve(response);
     }).error(function(error) {
     deferred.reject(error);
     });
     return deferred.promise;
     };*/


    var _getById = function (id) {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/config/scriptLanguage/id/' + encodeURIComponent(id), {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    return {
      findColumns: function () {
        return _findColumns();
      },
      save: function (scriptLanguage) {
        return _save(scriptLanguage);
      },
      /*
       getReferences: function(){
       return _getReferences();
       },*/

      getById: function (id) {
        return _getById(id);
      }

    };
  }]);
