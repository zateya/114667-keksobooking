'use strict';

(function () {
  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');
  var userPin = map.querySelector('.map__pin--main');

  // переключение карты в неактивное/активное состояние
  var toggleMapDisabled = function (isMapDisabled) {
    map.classList.toggle('map--faded', isMapDisabled);
  };

  var createPins = function (offers) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < offers.length; i++) {
      fragment.appendChild(window.pin.create(offers[i], i));
    }
    mapPins.appendChild(fragment);
  };

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

      var yMin = window.data.mapCoords.y.min - window.data.pinParams.user.offsetY;
      var yMax = window.data.mapCoords.y.max - window.data.pinParams.user.offsetY;

      if (window.data.mapCoords.x.min < currentCoords.x && currentCoords.x < window.data.mapCoords.x.max) {
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

  // при отпускании кнопки мыши на маркере (пользовательская метка) сервис активируется и создаются другие метки
  var onUserPinMouseup = function () {
    toggleMapDisabled(false);
    window.form.isDisabled(false);
    createPins(window.data.offers);

    map.addEventListener('click', window.showCard);
    userPin.removeEventListener('mouseup', onUserPinMouseup);
  };

  // по-умолчанию сервис отключен
  toggleMapDisabled(true);
  window.form.isDisabled(true);

  // создаем обработчик отпускания маркера
  userPin.addEventListener('mouseup', onUserPinMouseup);
})();
