'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var RUB_CURRENCY = '\u20BD';

  var lastTimeout;

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

  var getOptionsValuesArray = function (element) {
    var values = [];
    [].forEach.call(element.options, function (item) {
      values.push(item.value);
    });
    return values;
  };

  var debounce = function (fun, timeInterval) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(fun, timeInterval);
  };

  window.utils = {
    isEscEvent: isEscEvent,
    rubCurrency: RUB_CURRENCY,
    getRandomInteger: getRandomInteger,
    getRandomArrayElement: getRandomArrayElement,
    getOptionsValuesArray: getOptionsValuesArray,
    debounce: debounce
  };
})();
