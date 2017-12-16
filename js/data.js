'use strict';

(function () {
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

  var PIN_PARAMS = {
    offsetX: 5, // смещение X координаты центра метки относительно left позиции маркера
    offsetY: 39 // смещение Y координаты нижнего края метки относительно top позиции маркера
  };

  var USER_PIN_PARAMS = {
    width: 65,
    offsetY: 48 // смещение Y координаты нижнего края метки относительно top позиции маркера
  };

  window.data = {
    pinParams: PIN_PARAMS,
    userPinParams: USER_PIN_PARAMS,
    types: TYPES,
    roomsCapacity: ROOMS_CAPACITY
  };
})();
