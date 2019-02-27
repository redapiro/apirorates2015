'use strict';

angular.module('ratesUiApp')
  .controller('servicesController', ['$scope', 'notificationService', 'serviceImplsService', 'configService', '$q',
    function ($scope, notificationService, serviceImplsService, configService, $q) {
      $scope.instance = {};
      $scope.references = {};


      var servicePromise = serviceImplsService.getDefault();
      var refPromise = serviceImplsService.getReferenceData();
      $q.all([servicePromise, refPromise]).then(function(response){
        $scope.instance = response[0];
        $scope.references = response[1];
        $scope.ready = true;
      });

      $scope.getServiceName = function(id, referenceField){
        for(var i=0; i< $scope.references[referenceField].length; i++){
          if($scope.references[referenceField][i].id === id){
            console.log('matched: ' + id);
            console.log('matched: ' + referenceField);
            return $scope.references[referenceField][i].name;
          }
        }
        return '';
      };

      $scope.doSaveOp = function () {
        $scope.inProgress = true;
        var savePromise = serviceImplsService.save($scope.instance);
        savePromise.then(function (data) {
          notificationService.sendInfo('Updated', 'Services implementation updated');
        }, function (failure) {
          notificationService.sendError('Failure', 'Not able to save services implementation');
        });
      };

    }]);
