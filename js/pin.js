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
  var createPin = function (offerData) {
    var newPin = mapPin.cloneNode(true);
    var left = offerData.location.x - window.data.pinParams.offsetX;
    var top = offerData.location.y - window.data.pinParams.offsetY;
    newPin.style = 'left:' + left + 'px;' + 'top:' + top + 'px';
    newPin.querySelector('img').src = offerData.author.avatar;
    newPin.tabIndex = 0;

    newPin.addEventListener('click', function (evt) {
      handlePinClick(evt, offerData);
    });
    return newPin;
  };

  // функция обработки клика по карте
  var handlePinClick = function (evt, offer) {
    var targetPin = evt.target.closest('.map__pin'); // берем ближайший с классом, т.к. внутри картинка, забирающая фокус при клике
    window.showCard.open(offer);
    addCurrentPinActiveState(targetPin);
  };

  window.pin = {
    create: createPin,
    activate: addCurrentPinActiveState,
    deactivate: removePinActiveState
  };
})();
