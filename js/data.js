'use strict';

(function () {
  var USERS_COUNT = 3;

  var TYPES = {
    flat: {
      ru: 'Квартира',
      minPrice: 1000
    },
    bungalo: {
      ru: 'Бунгало',
      minPrice: 0
    },
    house: {
      ru: 'Дом',
      minPrice: 5000
    },
    palace: {
      ru: 'Дворец',
      minPrice: 10000
    }
  };

  var ROOMS_CAPACITY = {
    '1': ['1'],
    '2': ['2', '1'],
    '3': ['3', '2', '1'],
    '100': ['0']
  };

  var USER_PIN_AREA = {
    x: {
      min: 300,
      max: 900
    },
    y: {
      min: 160,
      max: 680
    }
  };

  var PIN_PARAMS = {
    user: {
      width: 65,
      height: 82,
      offsetX: 0,
      offsetY: 48
    },
    rival: {
      width: 46,
      height: 62,
      offsetX: 5,
      offsetY: 39
    }
  };

  window.data = {
    usersCount: USERS_COUNT,
    types: TYPES,
    roomsCapacity: ROOMS_CAPACITY,
    userPinArea: USER_PIN_AREA,
    pinParams: PIN_PARAMS
  };
})();
