'use strict';

(function () {
  var UserPinParam = {
    WIDTH: 65,
    OFFSET_Y: 49 // смещение Y координаты нижнего края метки относительно top позиции маркера
  };

  // размер map__pin--main 65*65px
  // пин отцентрован по x (left 50% и translateX -50%), а по y смещен на 32.5 пикселя (translateY -50%)
  // указатель 10*22px смещен влево на 50% и отцентрован транслейтом
  // т.о. по x смещать не нужно
  // указатель абсолютно спозиционирован top 100% (т.е. 65px) и поднят транслейтом на 6 пикселей, итого 59 пикселей.
  // высота пина с указателем: 59 + 22 = 81px, величина сдвига 81 - 32.5 = 48.5 (OFFSET_Y) (т.к. на 32.5 уже сдвинут транслейтом)

  var UserPinMapArea = {
    TOP: 100,
    BOTTOM: 500,
    LEFT: 0,
    RIGHT: 1200
  };
  var USER_PIN_ZINDEX = '2';

  var userPin = document.querySelector('.map__pin--main');
  var addressField = document.querySelector('#address');

  // получение адреса по умолчанию
  var getDefaultAddress = function () {
    if (userPin) {
      var x = userPin.offsetLeft;
      var y = userPin.offsetTop + UserPinParam.OFFSET_Y;
      setAddressFieldValue(x, y); // установка значений положения метки в поле Адрес
    }
  };

  // установка значения с текущими координатами метки в поле Адрес
  var setAddressFieldValue = function (x, y) {
    addressField.value = 'x: ' + Math.floor(x) + ', y: ' + Math.floor(y);
  };

  // обработчик нажатия на пользовательскую метку
  userPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    userPin.style.zIndex = USER_PIN_ZINDEX;

    // стартовые координаты соответствуют положению курсора
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    // обработчик движения курсора при нажатой метке
    var onPinMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      // смещение курсора относительно старторых координат
      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      // переопределение стартовых координат
      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      // текущие координаты
      var currentCoords = {
        x: userPin.offsetLeft - shift.x,
        y: userPin.offsetTop - shift.y
      };

      // определения границ положения метки
      var yMin = UserPinMapArea.TOP - UserPinParam.OFFSET_Y;
      var yMax = UserPinMapArea.BOTTOM - UserPinParam.OFFSET_Y;

      var xMin = UserPinMapArea.LEFT + UserPinParam.WIDTH / 2;
      var xMax = UserPinMapArea.RIGHT - UserPinParam.WIDTH / 2;

      // установка границ движения метки
      if (currentCoords.x < xMin) {
        currentCoords.x = xMin;
      } else if (currentCoords.x > xMax) {
        currentCoords.x = xMax;
      }

      if (currentCoords.y < yMin) {
        currentCoords.y = yMin;
      } else if (currentCoords.y > yMax) {
        currentCoords.y = yMax;
      }

      // присвоение метке свойств top и left
      userPin.style.left = currentCoords.x + 'px';
      userPin.style.top = currentCoords.y + 'px';

      // вывод текущих координат метки в поле Адреса
      setAddressFieldValue(currentCoords.x, currentCoords.y + UserPinParam.OFFSET_Y);
    };

    // обработчик отпускания кнопки мыши
    var onPinMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onPinMouseMove);
      document.removeEventListener('mouseup', onPinMouseUp);
    };

    // добавление обработчиков движения курсора и отпускания кнопки мыши
    document.addEventListener('mousemove', onPinMouseMove);
    document.addEventListener('mouseup', onPinMouseUp);
  });

  window.userPin = {
    getDefaultAddress: getDefaultAddress
  };
})();
