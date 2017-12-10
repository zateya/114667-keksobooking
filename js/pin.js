'use strict';

(function () {
  var mapPins = document.querySelector('.map__pins');
  var mapPin = document.querySelector('template').content.querySelector('button.map__pin');

  // функция убирает активное состояние у метки
  var removePinActiveState = function () {
    var activePin = mapPins.querySelector('.map__pin--active');
    if (activePin) {
      activePin.classList.remove('map__pin--active');
    }
  };

  // функция добавляет активное состояние для текущей метки
  var addCurrentPinActiveState = function (currentPin) {
    removePinActiveState();
    currentPin.classList.add('map__pin--active');
  };

  // создает метки на карте
  var createPin = function (offerData, offerNumber) {
    var newPin = mapPin.cloneNode(true);
    var left = offerData.location.x - window.data.pinParams.rival.offsetX;
    var top = offerData.location.y - window.data.pinParams.rival.offsetY;
    newPin.style = 'left:' + left + 'px;' + 'top:' + top + 'px';
    newPin.querySelector('img').src = offerData.author.avatar;
    newPin.dataset.id = offerNumber;
    newPin.tabIndex = 0;
    return newPin;
  };

  window.pin = {
    create: createPin,
    activate: addCurrentPinActiveState,
    deactivate: removePinActiveState
  };
})();
