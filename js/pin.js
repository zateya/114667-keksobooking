'use strict';

(function () {
  var PINS_COUNT = 3;

  var mapPins = document.querySelector('.map__pins');
  var mapPin = document.querySelector('template').content.querySelector('button.map__pin');
  var pinsFragment = document.createDocumentFragment();

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
    var targetPin = evt.target.tagName === 'IMG' ? evt.target.parentElement : evt.target;
    window.showCard.open(offer);
    addCurrentPinActiveState(targetPin);
  };

  var createPins = function (offers) {
    var pinsCount = (offers.length > PINS_COUNT) ? PINS_COUNT : offers.length;
    for (var i = 0; i < pinsCount; i++) {
      pinsFragment.appendChild(createPin(offers[i]));
    }
    mapPins.appendChild(pinsFragment);
  };

  window.pin = {
    render: createPins,
    activate: addCurrentPinActiveState,
    deactivate: removePinActiveState
  };
})();
