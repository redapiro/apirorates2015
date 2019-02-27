'use strict';

angular.module('ratesUiApp').service('marketService',
  ['configService', '$http', '$q', function (configService, $http, $q) {

    var _findColumns = function () {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/config/market/columns', {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _save = function (market) {
      var deferred = $q.defer();
      $http.post(configService.getHostUrl() + '/config/market/save', market, {
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
     $http.get(configService.getHostUrl()+'/config/market/references', {}, {
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
      $http.get(configService.getHostUrl() + '/config/market/id/' + encodeURIComponent(id), {}, {
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
      save: function (market) {
        return _save(market);
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
