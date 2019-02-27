'use strict';

angular.module('ratesUiApp').service('dictionaryData', [function () {
  var data = [
    {type: 'ATTRIBUTE', label: 'ASK', datatype: 'DOUBLE', value: '', description: '', editable: false},
    {type: 'ATTRIBUTE', label: 'BID', datatype: 'DOUBLE', value: '', description: '', editable: true},
    {type: 'ATTRIBUTE', label: 'MID', datatype: 'DOUBLE', value: '', description: '', editable: true},
    {type: 'ATTRIBUTE', label: 'MARKET_CAP', datatype: 'DOUBLE', value: '', description: '', editable: true},
    {type: 'ATTRIBUTE', label: 'LOW', datatype: 'DOUBLE', value: '', description: '', editable: true},
    {type: 'ATTRIBUTE', label: 'HIGH', datatype: 'DOUBLE', value: '', description: '', editable: true},
    {type: 'ATTRIBUTE', label: 'LAST_CLOSE', datatype: 'DOUBLE', value: '', description: '', editable: true},
    {type: 'ATTRIBUTE', label: 'ADJUSTED_CLOSE', datatype: 'DOUBLE', value: '', description: '', editable: true},
    {type: 'ATTRIBUTE', label: 'EXPIRY_DATA', datatype: 'DATE', value: '', description: '', editable: true},
    {type: 'ATTRIBUTE', label: 'MATURITY_DATE', datatype: 'DATE', value: '', description: '', editable: true},
    {type: 'ATTRIBUTE', label: 'MK_TIME', datatype: 'TIME', value: '', description: '', editable: true},
    {type: 'ATTRIBUTE', label: 'SETTLEMENT_DATE', datatype: 'DATE', value: '', description: '', editable: true},
    {type: 'ATTRIBUTE', label: 'VOLUME', datatype: 'DOUBLE', value: '', description: '', editable: true},
    {type: 'ATTRIBUTE', label: 'UPDATE_DATE', datatype: 'DATE', value: '', description: '', editable: true},
    {type: 'ATTRIBUTE', label: 'UPDATE_TIME', datatype: 'TIME', value: '', description: '', editable: true},
    {type: 'PROPERTY', label: 'BLOOMBERG_ID', datatype: '', value: '', description: '', editable: true},
    {type: 'PROPERTY', label: 'FORM_FACTOR', datatype: 'DOUBLE', value: '', description: '', editable: true},
    {type: 'PROPERTY', label: 'GEN_ID', datatype: '', value: '', description: '', editable: true},
    {type: 'PROPERTY', label: 'MUREX_ID', datatype: '', value: '', description: '', editable: true},
    {type: 'PROPERTY', label: 'CALYPSO_ID', datatype: '', value: '', description: '', editable: true},
    {type: 'PROPERTY', label: 'RETEURS_RIC', datatype: '', value: '', description: '', editable: true},
    {type: 'CLASS', label: 'ASSET TYPE', datatype: 'STRING', value: 'Equites', description: '', editable: true},
    {type: 'CLASS', label: 'ASSET TYPE', datatype: 'STRING', value: 'IR', description: '', editable: true},
    {type: 'CLASS', label: 'ASSET TYPE', datatype: 'STRING', value: 'FX', description: '', editable: true},
    {type: 'CLASS', label: 'ASSET TYPE', datatype: 'STRING', value: 'Bond', description: '', editable: false},
    {type: 'CLASS', label: 'ASSET TYPE', datatype: 'STRING', value: 'DERIVATIVES', description: '', editable: true},
    {
      type: 'CLASS',
      label: 'ASSET TYPE',
      datatype: 'STRING',
      value: 'OTC',
      description: 'Over-the-counter',
      editable: true
    },
    {type: 'CLASS', label: 'ASSET TYPE', datatype: 'STRING', value: 'COMMODITIES', description: '', editable: true},
    {type: 'CLASS', label: 'ASSET TYPE', datatype: 'STRING', value: 'FIXED INCOME', description: '', editable: true},
    {type: 'CLASS', label: 'ASSET TYPE', datatype: 'STRING', value: 'BROKER PAGE', description: '', editable: true},
    {type: 'CLASS', label: 'INSTRUMENT', datatype: 'STRING', value: 'SWAP', description: '', editable: true},
    {type: 'CLASS', label: 'INSTRUMENT', datatype: 'STRING', value: 'SPOT', description: '', editable: true},
    {type: 'CLASS', label: 'INSTRUMENT', datatype: 'STRING', value: 'FUTURES', description: '', editable: true},
    {type: 'CLASS', label: 'CURRENCY', datatype: 'STRING', value: 'USD', description: '', editable: true},
    {type: 'CLASS', label: 'CURRENCY', datatype: 'STRING', value: 'EUR', description: '', editable: true},
    {type: 'CLASS', label: 'CURRENCY', datatype: 'STRING', value: 'GBP', description: '', editable: true},
    {type: 'CLASS', label: 'CURRENCY', datatype: 'STRING', value: 'INR', description: 'Indian Rupee', editable: true},
    {type: 'CLASS', label: 'CURRENCY', datatype: 'STRING', value: 'AUD', description: '', editable: true},
    {type: 'CLASS', label: 'CURRENCY', datatype: 'STRING', value: 'AED', description: 'Emirati Dirham', editable: true},
    {
      type: 'CLASS',
      label: 'CURRENCY',
      datatype: 'STRING',
      value: 'CAD',
      description: 'Canadian Dollar',
      editable: true
    },
    {
      type: 'CLASS',
      label: 'CURRENCY',
      datatype: 'STRING',
      value: 'MYR',
      description: 'Malaysian Ringgit',
      editable: true
    },
    {type: 'CLASS', label: 'CURRENCY', datatype: 'STRING', value: 'CHF', description: 'Swiss Franc', editable: true},
    {
      type: 'CLASS',
      label: 'CURRENCY',
      datatype: 'STRING',
      value: 'CNY',
      description: 'Chinese Yuan Renminbi',
      editable: true
    },
    {
      type: 'CLASS',
      label: 'CURRENCY',
      datatype: 'STRING',
      value: 'SAR',
      description: 'Saudi Arabian Riyal',
      editable: true
    },
    {type: 'CLASS', label: 'CURRENCY', datatype: 'STRING', value: 'THB', description: 'Thai Baht', editable: true},
    {
      type: 'CLASS',
      label: 'CURRENCY',
      datatype: 'STRING',
      value: 'NZD',
      description: 'New Zealand Dollar',
      editable: true
    },
    {type: 'CLASS', label: 'CURRENCY', datatype: 'STRING', value: 'JPY', description: 'Japanese Yen', editable: false},
    {type: 'CLASS', label: 'CURRENCY', datatype: 'STRING', value: 'TRY', description: 'Turkish Lira', editable: true},
    {
      type: 'CLASS',
      label: 'CURRENCY',
      datatype: 'STRING',
      value: 'SGD',
      description: 'Singapore Dollar',
      editable: true
    },
    {
      type: 'CLASS',
      label: 'CURRENCY',
      datatype: 'STRING',
      value: 'PHP',
      description: 'Philippine Peso',
      editable: true
    },
    {
      type: 'CLASS',
      label: 'CURRENCY',
      datatype: 'STRING',
      value: 'ZAR',
      description: 'South African Rand',
      editable: true
    },
    {
      type: 'CLASS',
      label: 'CURRENCY',
      datatype: 'STRING',
      value: 'HKD',
      description: 'Hong Kong Dollar',
      editable: true
    },
    {
      type: 'CLASS',
      label: 'CURRENCY',
      datatype: 'STRING',
      value: 'IDR',
      description: 'Indonesian Rupiah',
      editable: true
    },
    {type: 'CLASS', label: 'CURRENCY', datatype: 'STRING', value: 'MXN', description: 'Mexican Peso', editable: true},
    {type: 'CLASS', label: 'CURRENCY', datatype: 'STRING', value: 'SEK', description: 'Swedish Krona', editable: true},
    {type: 'CLASS', label: 'CURRENCY', datatype: 'STRING', value: 'BRL', description: 'Brazilian Real', editable: true},
    {type: 'CLASS', label: 'CURRENCY', datatype: 'STRING', value: 'QAR', description: 'Qatari Riyal', editable: true},
    {type: 'CLASS', label: 'CURRENCY', datatype: 'STRING', value: 'OMR', description: 'Omani Rial', editable: true},
    {type: 'CLASS', label: 'CURRENCY', datatype: 'STRING', value: 'KWD', description: 'Kuwaiti Dinar', editable: true},
    {
      type: 'CLASS',
      label: 'CURRENCY',
      datatype: 'STRING',
      value: 'PKR',
      description: 'Pakistani Rupee',
      editable: true
    },
    {
      type: 'CLASS',
      label: 'CURRENCY',
      datatype: 'STRING',
      value: 'NOK',
      description: 'Norwegian Krone',
      editable: true
    },
    {type: 'CLASS', label: 'CURRENCY', datatype: 'STRING', value: 'DKK', description: 'Danish Krone', editable: true},
    {type: 'CLASS', label: 'CURRENCY', datatype: 'STRING', value: 'RUB', description: 'Russian Ruble', editable: true},
    {
      type: 'CLASS',
      label: 'MARKET',
      datatype: 'STRING',
      value: 'ASX',
      description: 'Australia Securities',
      editable: true
    },
    {
      type: 'CLASS',
      label: 'MARKET',
      datatype: 'STRING',
      value: 'NASDAQ',
      description: 'National Association of Securities Dealers Automated Quotations',
      editable: true
    },
    {
      type: 'CLASS',
      label: 'MARKET',
      datatype: 'STRING',
      value: 'NYSE',
      description: 'New York Stock Exchange',
      editable: true
    },
    {
      type: 'CLASS',
      label: 'MARKET',
      datatype: 'STRING',
      value: 'SSE',
      description: 'Shanghai Stock Exchange',
      editable: true
    },
    {
      type: 'CLASS',
      label: 'MARKET',
      datatype: 'STRING',
      value: 'SZSE',
      description: 'Shenzhen Stock Exchange',
      editable: true
    },
    {
      type: 'CLASS',
      label: 'MARKET',
      datatype: 'STRING',
      value: 'SEHK',
      description: 'Honk Kong Stock Exchange',
      editable: true
    },
    {
      type: 'CLASS',
      label: 'MARKET',
      datatype: 'STRING',
      value: 'TSEC',
      description: 'Taiwan Stock Exchange',
      editable: true
    },
    {
      type: 'CLASS',
      label: 'MARKET',
      datatype: 'STRING',
      value: 'SGX',
      description: 'Singapore Stock Exchange',
      editable: true
    },
    {
      type: 'CLASS',
      label: 'MARKET',
      datatype: 'STRING',
      value: 'FTSE',
      description: 'Financial Times and Stock Exchange (UK ) - footsie',
      editable: true
    },
    {
      type: 'CLASS',
      label: 'MARKET',
      datatype: 'STRING',
      value: 'TSE',
      description: 'Tokio Stock Exchange',
      editable: true
    },
    {
      type: 'CLASS',
      label: 'MARKET',
      datatype: 'STRING',
      value: 'SIX',
      description: 'SIX Swiss Exchang e - formerly SWX',
      editable: true
    },
    {
      type: 'CLASS',
      label: 'MARKET',
      datatype: 'STRING',
      value: 'NSE',
      description: 'National Stock Exchange of India ',
      editable: true
    },
    {type: 'CLASS', label: 'TENOR', datatype: 'STRING', value: '1M', description: '', editable: false},
    {type: 'CLASS', label: 'TENOR', datatype: 'STRING', value: '2M', description: '', editable: true},
    {type: 'CLASS', label: 'TENOR', datatype: 'STRING', value: '3M', description: '', editable: true},
    {type: 'CLASS', label: 'TENOR', datatype: 'STRING', value: '200W', description: '', editable: true},
    {type: 'CLASS', label: 'TENOR', datatype: 'STRING', value: 'Jan-13', description: '', editable: true},
    {type: 'CLASS', label: 'TENOR', datatype: 'STRING', value: 'Feb-13', description: '', editable: true},
    {type: 'CLASS', label: 'TENOR', datatype: 'STRING', value: 'Mar-13', description: '', editable: true}
  ];
  var dictionaryData = {
    'results': data,
    fieldSort: false,
    totalResults: data.length,
    columnDefinitions: [
      {'editable': false, 'field': 'type', 'name': 'Type', 'path': 'type'},
      {'editable': false, 'field': 'label', 'name': 'Label', 'path': 'label'},
      {'editable': false, 'field': 'datatype', 'name': 'Datatype', 'path': 'datatype'},
      {'editable': false, 'field': 'value', 'name': 'Value', 'path': 'value'},
      {'editable': false, 'field': 'description', 'name': 'Description', 'path': 'description'},
      {'editable': false, 'field': 'editable', 'name': 'Editable', 'path': 'editable'}
    ]
  };
  return {
    get: function () {
      return dictionaryData;
    },
    delete: function (index, scope) {
      if (index >= 0) {
        data.splice(index, 1);
        scope.$broadcast('dataEdited');
      }
    },
    addRow: function (index, scope) {
      if (index >= 0) {
        data.splice(index + 1, 0, {type: '', label: '', datatype: '', value: '', description: '', editable: true});
        scope.$broadcast('dataEdited');
      }
    }
  };
}])
  .service('dataFeedsData', [function () {
    var fileParams = [
      {name: 'PATH', value: 'file:/testDir/nyse.csv', required: 'YES', description: '', editable: true},
      {name: 'FORMAT', value: 'DELIMETED', required: 'YES', description: '', editable: true},
      {name: 'DELIMITER', value: ',', required: 'YES', description: '', editable: true},
      {name: 'FILE', value: '', required: '', description: '', editable: true},
      {name: 'FILE EXTENSION', value: '', required: '', description: '', editable: true},
      {name: 'BODYENDCELL', value: '', required: '', description: '', editable: true},
      {name: 'BODYSTARTCELL', value: '', required: '', description: '', editable: true},
      {name: 'HEADENDCELL', value: '', required: '', description: '', editable: true},
      {name: 'HEADSTARTCELL', value: '', required: '', description: '', editable: true},
      {name: 'SHEETNAME', value: '', required: '', description: '', editable: true},
      {name: 'COLNAMES', value: '', required: '', description: '', editable: true},
      {name: 'HEADERFLAG', value: '', required: '', description: '', editable: true},
      {name: 'HEADERTEXT', value: '', required: '', description: '', editable: true},
      {name: 'TRAILERFLAG', value: '', required: '', description: '', editable: true},
      {name: 'TRAILERTEXT', value: '', required: '', description: '', editable: true},
      {name: 'HEADTIMETEXT', value: '', required: '', description: '', editable: true},
      {name: 'TRAILTIMETEXT', value: '', required: '', description: '', editable: true},
      {name: 'TIMESTAMPFORMAT', value: '', required: '', description: '', editable: true},
      {name: 'DATASTARTLINE', value: '', required: '', description: '', editable: true},
      {name: 'DATAENDLINE', value: '', required: '', description: '', editable: true}
    ];
    var bloombergParams = [
      {name: 'FORMAT', value: '', required: 'YES', description: '', editable: true},
      {name: 'TICKER', value: '', required: '', description: '', editable: true},
      {name: 'DERIVED', value: '', required: '', description: '', editable: true},
      {name: 'SEC_MASTER', value: '', required: '', description: '', editable: true},
      {name: 'SECID', value: '', required: '', description: '', editable: true},
      {name: 'TICKER_LIST', value: '', required: '', description: '', editable: true},
      {name: 'CLOSING_VALUES', value: '', required: '', description: '', editable: true},
      {name: 'DATE_FORMAT', value: '', required: '', description: '', editable: true},
      {name: 'HEADER', value: '', required: '', description: '', editable: true},
      {name: 'COLUMN_HEADER', value: '', required: '', description: '', editable: true},
      {name: 'FIRM_NAME', value: '', required: '', description: '', editable: true},
      {name: 'PROGRAM_NAME', value: '', required: '', description: '', editable: true},
      {name: 'BROKER PAGE', value: '', required: '', description: '', editable: true}
    ];
    var reutersParams = [
      {name: 'RIC', value: '', required: '', description: '', editable: true},
      {name: 'PARSER', value: '', required: '', description: '', editable: true},
      {name: 'PAGE', value: '', required: '', description: '', editable: true},
      {name: 'FORMAT', value: '', required: 'YES', description: '', editable: true}
    ];

    var data = [
      {
        name: 'FILE_BROKER', source: 'FILE', descriptions: '', editable: true, parameters: []
      },
      {name: 'FILE_CSV', source: 'FILE', descriptions: '', editable: true, parameters: fileParams},
      {name: 'Bloomberg_1', source: 'BLOOMBERG', descriptions: '', editable: true, parameters: bloombergParams},
      {name: 'Bloomberg_2', source: 'BLOOMBERG', descriptions: '', editable: true, parameters: bloombergParams},
      {name: 'Reuters_1', source: 'REUTERS', descriptions: '', editable: true, parameters: reutersParams},
      {name: 'Reuters_2', source: 'REUTERS', descriptions: '', editable: true, parameters: reutersParams},
      {name: 'Reuters_3', source: 'REUTERS', descriptions: '', editable: true, parameters: reutersParams},
      {
        name: 'Murex_DF', source: 'MUREX', descriptions: '', editable: true, parameters: []
      },
      {
        name: 'ASX_CSV', source: 'FILE', descriptions: '', editable: true, parameters: []
      },
      {
        name: 'EXOTIC_CSV', source: 'FILE', descriptions: '', editable: true, parameters: []
      },
      {name: 'BLOOMBERG_CSV', source: 'BLOOMBERG', descriptions: '', editable: true, parameters: bloombergParams}
    ];
    var feedsData = {
      'results': data,
      fieldSort: false,
      totalResults: data.length,
      columnDefinitions: [
        {'editable': false, 'field': 'name', name: 'Name', path: 'name', 'type': 'string'},
        {'editable': false, 'field': 'source', name: 'Source', path: 'source', 'type': 'string'},
        {'editable': false, 'field': 'descriptions', name: 'Descriptions', path: 'descriptions', 'type': 'string'},
        {'editable': false, 'field': 'editable', name: 'Editable', path: 'editable', 'type': 'string'}
      ]
    }

    var getParamArray = function (targetString) {
      targetString = targetString.toLowerCase();
      if (targetString === 'file') {
        var targetArr = fileParams;
      } else if (targetString === 'bloomberg') {
        var targetArr = bloombergParams;
      } else if (targetString === 'reuters') {
        var targetArr = reutersParams;
      }
      return targetArr;
    };

    return {
      get: function () {
        return feedsData;
      },
      delete: function (index, scope) {
        // todo: send one more attr (which of parameter tables is edited)
        if (index >= 0) {
          data.splice(index, 1);
          scope.$broadcast('dataEdited');
        }
      },
      addRow: function (index, scope) {
        // todo: send one more attr (which of parameter tables is edited)
        if (index >= 0) {
          data.splice(index + 1, 0, {name: '', source: '', descriptions: '', editable: true, parameters: []});
          scope.$broadcast('dataEdited');
        }
      }
    };
  }])
  .service('violationsData', function () {
    var data = [
      {'violation': 'Zero', 'blocking': true, 'script': ''},
      {'violation': 'Negative', 'blocking': false, 'script': ''},
      {'violation': 'Read deadline', 'blocking': true, 'script': ''},
      {'violation': 'Staleness', 'blocking': false, 'script': ''},
      {'violation': 'Absolute Range', 'blocking': true, 'script': ''},
      {'violation': 'Relative Range', 'blocking': true, 'script': ''}
    ];
    var violations = {
      'results': data,
      'columnDefinitions': [
        {'editable': false, 'field': 'violation', 'name': 'Violation', 'path': 'violation', 'type': 'string'},
        {'editable': false, 'field': 'blocking', 'name': 'Blocking', 'path': 'blocking', 'type': 'boolean'},
        {'editable': false, 'field': 'script', 'name': 'Script', 'path': 'script', 'type': 'string'},
        {'editable': false, 'field': 'additional', 'name': 'Additional', 'path': 'additional', 'type': 'string'}
      ],
      totalResults: data.length,
      fieldSort: null
    };
    return {
      get: function () {
        return violations;
      },
      delete: function (index, scope) {
        if (index >= 0) {
          data.splice(index, 1);
          scope.$broadcast('dataEdited');
        }
      },
      addRow: function (index, scope) {
        if (index >= 0) {
          data.splice(index + 1, 0, {violation: '', blocking: false, script: ''});
          scope.$broadcast('dataEdited');
        }
      }
    }
  });