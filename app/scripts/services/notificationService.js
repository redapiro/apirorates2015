'use strict';

angular.module('ratesUiApp').service('notificationService',
  ['toaster', function (toaster) {
    var _sendError = function (title, errorMessage) {
      toaster.pop('error', title, errorMessage);
    };

    var _sendInfo = function (title, errorMessage) {
      toaster.pop('success', title, errorMessage);
    };

    return {
      sendError: function (title, errorMessage) {
        _sendError(title, errorMessage);
      },
      sendInfo: function (title, errorMessage) {
        _sendInfo(title, errorMessage);
      },
      sendSuccess: function (title, errorMessage) {
        _sendSuccess(title, errorMessage);
      }
    };
  }]);
