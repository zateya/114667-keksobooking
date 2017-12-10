'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var RUB_CURRENCY = '\u20BD';

  // при нажатии клавиши Escape
  var isEscEvent = function (evt, action) {
    if (evt.keyCode === ESC_KEYCODE) {
      action();
    }
  };

  // функции для работы с массивами
  var getRandomInteger = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  var getRandomArrayElement = function (arr) {
    var randomElement = arr[getRandomInteger(0, arr.length - 1)];
    return randomElement;
  };

  window.utils = {
    isEscEvent: isEscEvent,
    getRandomInteger: getRandomInteger,
    getRandomArrayElement: getRandomArrayElement,
    rubCurrency: RUB_CURRENCY
  };
})();
