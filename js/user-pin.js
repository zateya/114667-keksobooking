'use strict';

(function () {
  var userPin = document.querySelector('.map__pin--main');

  userPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    userPin.style.zIndex = '2';

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

      var yMin = window.data.userPinArea.y.min - window.data.pinParams.user.offsetY;
      var yMax = window.data.userPinArea.y.max - window.data.pinParams.user.offsetY;

      if (window.data.userPinArea.x.min < currentCoords.x && currentCoords.x < window.data.userPinArea.x.max) {
        userPin.style.left = currentCoords.x + 'px';
      }

      if (yMin < currentCoords.y && currentCoords.y < yMax) {
        userPin.style.top = currentCoords.y + 'px';
      }

      window.form.setAddressValue(currentCoords.x, currentCoords.y + window.data.pinParams.user.offsetY);
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
