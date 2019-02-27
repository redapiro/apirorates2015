'use strict';

angular.module('ratesUiApp').service('scriptableTypesConstantsService', [function () {

    var FEED = 'feed';
    var RATE_DEF_IMPORT = 'rateDefImporter';
    var DATASINK = 'dataSink';
    var DISTRIBUTION_FORMATTER = 'distributionFormatter';
    var CROSS_RATE_DISTRIBUTION_FORMATTER = 'crossRateDistributionFormatter';
    var EVENT_LISTENER = 'eventListener';
    var SCHEDULED_SCRIPT = 'scheduledScript';
    var RATE_COLFILTER = 'rateColFilter';
    var PRE_SOURCEFIELD_CLEANSER = 'preSourceFieldCleanser';
    var RAW_RATEFIELD_VALIDATION = 'rawRateFieldValidation';
    var POST_AGGRATE_FIELDVALIDATION = 'postAggRateFieldValidation';
    var POST_AGGPROC = 'postAggProc';
    var POST_CLOSEPROC = 'postCloseProc';
    var POST_SOURCEPROC = 'postSourceProc';
    var FIELD_AGGREGATION_ALGORITHM = 'fieldAggAlg';

    //SCRIPTABLE MANAGER
    var FEED_SERVICE = 'feedService';
    var AGGREGATION_SERVICE = 'aggregationService';
    var AUTHENTICATION = 'authentication';
    var AUTHORIZATION = 'authorization';
    var CROSS_RATE_DISPROC_SERVICE = 'crossRateDisProcService';
    var DISTRIBUTION_PROC_SERVICE = 'distributionProcService';
    var EVENT_PROCESSOR_SERVICE = 'eventProcessorService';
    var CORP_ACTION_PROCSERVICE = 'corpActionProcService';
    var LIFE_CYCLE_PROC_SERVICE = 'lifeCycleProcService';
    var RATE_DEF_IMPORT_SERVICE = 'rateDefImportService';

    return {
      getAggregationService: function () {
        return AGGREGATION_SERVICE;
      },
      getAuthentication: function () {
        return AUTHENTICATION;
      },
      getAuthorization: function () {
        return AUTHORIZATION;
      },
      getCorpActionProcService: function () {
        return CORP_ACTION_PROCSERVICE;
      },
      getCrossRateDisProcService: function () {
        return CROSS_RATE_DISPROC_SERVICE;
      },
      getFeed: function () {
        return FEED;
      },
      getRateDefImport: function () {
        return RATE_DEF_IMPORT;
      },
      getDataSink: function () {
        return DATASINK;
      },
      getDistributionFormatter: function () {
        return DISTRIBUTION_FORMATTER;
      },
      getDistributionProcService: function () {
        return DISTRIBUTION_PROC_SERVICE;
      },
      getEventListener: function () {
        return EVENT_LISTENER;
      },
      getScheduledScript: function () {
        return SCHEDULED_SCRIPT;
      },
      getEventProcessorService: function () {
        return EVENT_PROCESSOR_SERVICE;
      },
      getFeedService: function () {
        return FEED_SERVICE;
      },
      getLifeCycleProcService: function () {
        return LIFE_CYCLE_PROC_SERVICE;
      },
      getPostAggRateFieldValidation: function () {
        return POST_AGGRATE_FIELDVALIDATION;
      },
      getPostAggProc: function () {
        return POST_AGGPROC;
      },
      getPostCloseProc: function () {
        return POST_CLOSEPROC;
      },
      getPostSourceProc: function () {
        return POST_SOURCEPROC;
      },
      getPreSourceFieldCleanser: function () {
        return PRE_SOURCEFIELD_CLEANSER;
      },
      getRateColFilter: function () {
        return RATE_COLFILTER;
      },
      getRawRateFieldValidation: function () {
        return RAW_RATEFIELD_VALIDATION;
      },
      getFieldAggregationAlgorithm: function () {
        return FIELD_AGGREGATION_ALGORITHM;
      },
      getCrossRatedistributionFormatter: function () {
        return CROSS_RATE_DISTRIBUTION_FORMATTER;
      },
      getRateDefImportService: function () {
        return RATE_DEF_IMPORT_SERVICE;
      }


    };
  }]
);
