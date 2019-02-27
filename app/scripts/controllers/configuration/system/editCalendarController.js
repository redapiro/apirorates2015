'use strict';

angular.module('ratesUiApp')
  .controller('editCalendarController', ['$scope', 'notificationService', 'calendarService', '$routeParams', '$q', '$location',
    function ($scope, notificationService, calendarService, $routeParams, $q, $location) {
      $scope.dayOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
      var calendarId = $routeParams.calendarId;

      var calendarPromise;
      if(calendarId){
        calendarPromise = calendarService.getById(calendarId);

      } else {
        calendarPromise = $q.when({
          additionalHolidays: [],
          normalDays: []
        });
      }

      function initAfterLoad() {
        var count = 0;
        angular.forEach($scope.instance.additionalHolidays, function (holiday) {
          holiday.id = count;
          // add simple representation in string of date
          holiday.dateAsObject = new Date(holiday.date);
          count++;
        });
        $scope.itemsForEdit = $scope.instance.additionalHolidays;
        $scope.refresh = new Date();
      }

      calendarPromise.then(function(response){
        $scope.instance = response;
        // enumerate the existing holidays
        initAfterLoad();
      });

      $scope.$watch('itemsForEdit', function(changed){
        console.log(changed);
      });

      function updateDateFromObject(){
        console.log($scope.itemsForEdit);
        for (var i=0; i< $scope.itemsForEdit.length; i++){
          $scope.itemsForEdit[i].date = $scope.itemsForEdit[i].dateAsObject.getTime();
        }
        $scope.instance.additionalHolidays = $scope.itemsForEdit;
        console.log($scope.instance);
      }

      //$scope.addHoliday = function () {
      //  if ($scope.newHoliday.name == null || $scope.newHoliday.name.length == 0 || $scope.newHoliday.date == null) {
      //    return;
      //  }
      //  $scope.instance.additionalHolidays.push($scope.newHoliday);
      //  $scope.newHoliday = {
      //    "name": "",
      //    "date": null
      //  };
      //};
      function goBack() {
        $location.path('/configuration/system/calendar').search({});
      }

      $scope.cancel = function () {
        goBack();
      };

      $scope.save = function () {
        $scope.errorMessages = [];
        $scope.inProgress = true;
        updateDateFromObject();
        var savePromise = calendarService.save($scope.instance);
        savePromise.then(function (data) {
          $scope.instance = data.object;
          initAfterLoad();
          notificationService.sendInfo('Updated', 'Business calendar updated');
        }, function (failure) {
          $scope.editMode = false;
          $scope.errorMessages = failure.errorMessages;
        });
      };

    }]);
