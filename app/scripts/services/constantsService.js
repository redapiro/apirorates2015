'use strict';

angular.module('ratesUiApp').service('constantsService', [function () {
    var FORM_STATE = 'formState';

    var EXCEPTION_THRESHOLD = 0;

    var RAW_RATES_TO_UPDATE = 'rawRatesToUpdate';

    var USER_AUTH = 'userAuth';

    var RAW_GRID_SETTINGS = 'rawGridSettings';

    var AGGREGATED_GRID_SETTINGS = 'aggregatedGridSettings';

    var HISTORICAL_GRID_SETTINGS = 'historicalGridSettings';

    var SELECTED_SOURCES_TAB = 'selectedSourcesTab';

    var HISORICAL_DATE_RANGES = 'historicalDateRanges';

    var IS_LOGGED_IN = 'isLoggedIn';

    var USER = 'user';

    return {
      isLoggedIn: function () {
        return IS_LOGGED_IN;
      },
      getFormState: function () {
        return FORM_STATE;
      },
      getRawRatesToUpdate: function () {
        return RAW_RATES_TO_UPDATE;
      },
      getExceptionThreshold: function () {
        return EXCEPTION_THRESHOLD;
      },
      getUserAuth: function () {
        return USER_AUTH;
      },
      getRawGridSettings: function () {
        return RAW_GRID_SETTINGS;
      },
      getAggregatedGridSettings: function () {
        return AGGREGATED_GRID_SETTINGS;
      },
      getHistoricalGridSettings: function () {
        return HISTORICAL_GRID_SETTINGS;
      },
      getSelectedSourcesTab: function () {
        return SELECTED_SOURCES_TAB;
      },
      getHistoricaDateRanges: function () {
        return HISORICAL_DATE_RANGES;
      },
      getUser: function () {
        return USER;
      },
      getRuntime: function () {
        return 'runtime';
      },
      getSetup: function () {
        return 'setup';
      },
      getConfiguration: function () {
        return 'configuration';
      },
      getSchemaDefinition: function () {
        return 'schemaDefinition';
      }
    };
  }]
);
