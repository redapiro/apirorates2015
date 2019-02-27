'use strict';

angular.module('ratesUiApp').service('dataProviderService',
  ['configService', '$http', '$q', function (configService, $http, $q) {

    var _findColumns = function () {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/config/dataProvider/columns', {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _save = function (distribution) {
      var deferred = $q.defer();
      $http.post(configService.getHostUrl() + '/config/dataProvider/save', distribution, {
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
     $http.get(configService.getHostUrl()+'/config/dataProvider/references', {}, {
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
      $http.get(configService.getHostUrl() + '/config/dataProvider/id/' + encodeURIComponent(id), {}, {
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
      save: function (distribution) {
        return _save(distribution);
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
