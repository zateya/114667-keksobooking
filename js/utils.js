'use strict';

(function () {
  var RUB_CURRENCY = '\u20BD';
  var KeyboardKey = {
    ESC: 27,
    ENTER: 13
  };

  var lastTimeout;

  // выполняем переданную функцию action если нажата клавиша Escape
  var isEscEvent = function (evt, action) {
    if (evt.keyCode === KeyboardKey.ESC) {
      action();
    }
  };

  // выполняем переданную функцию action если нажата клавиша Enter
  var isEnterEvent = function (evt, action) {
    if (evt.keyCode === KeyboardKey.ENTER) {
      action();
    }
  };

  // получение массива значений в селекте
  var getOptionsValuesArray = function (element) {
    var values = [];
    [].forEach.call(element.options, function (item) {
      values.push(item.value);
    });
    return values;
  };

  // устанавливает переданному элементу переданное значение
  var syncValues = function (element, value) {
    element.value = value;
  };

  // устанавливает минимальное значение переданного элемента равное переданному значению
  var syncValueWithMin = function (element, value) {
    element.min = value;
  };

  // выполняет переданную функцию action через заданный интервал timeInterval
  var debounce = function (action, timeInterval) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(action, timeInterval);
  };

  // получение для чисел существительных с правильным окончанием
  var getDecline = function (num, oneSubject, twoSubjects, manySubjects) {
    var numString = '' + num;
    var digit = numString.charAt(numString.length - 2) !== '1' ? parseInt(numString.slice(-1), 10) : 0;
    var decline = manySubjects;

    var digitToDecline = {
      1: oneSubject,
      2: twoSubjects,
      3: twoSubjects,
      4: twoSubjects
    };

    return digitToDecline[digit] || decline;
  };

  window.utils = {
    isEscEvent: isEscEvent,
    isEnterEvent: isEnterEvent,
    rubCurrency: RUB_CURRENCY,
    getOptionsValuesArray: getOptionsValuesArray,
    syncValues: syncValues,
    syncValueWithMin: syncValueWithMin,
    debounce: debounce,
    getDecline: getDecline
  };
})();
