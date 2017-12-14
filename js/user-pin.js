'use strict';

(function () {
  var USER_PIN_ZINDEX = '2';
  var USER_PIN_AREA = {
    x: {
      min: 0,
      max: 1200
    },
    y: {
      min: 100,
      max: 500
    }
  };

  var userPin = document.querySelector('.map__pin--main');

  userPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    userPin.style.zIndex = USER_PIN_ZINDEX;

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onPinMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var currentCoords = {
        x: userPin.offsetLeft - shift.x,
        y: userPin.offsetTop - shift.y
      };

      var yMin = USER_PIN_AREA.y.min - window.data.userPinParams.offsetY;
      var yMax = USER_PIN_AREA.y.max - window.data.userPinParams.offsetY;

      var xMin = USER_PIN_AREA.x.min + window.data.userPinParams.width / 2;
      var xMax = USER_PIN_AREA.x.max - window.data.userPinParams.width / 2;

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

      userPin.style.left = currentCoords.x + 'px';
      userPin.style.top = currentCoords.y + 'px';

      window.form.setAddressValue(currentCoords.x, currentCoords.y + window.data.userPinParams.offsetY);
    };

    var onPinMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onPinMouseMove);
      document.removeEventListener('mouseup', onPinMouseUp);
    };

    document.addEventListener('mousemove', onPinMouseMove);
    document.addEventListener('mouseup', onPinMouseUp);
  });
})();
