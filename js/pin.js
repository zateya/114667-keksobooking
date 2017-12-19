'use strict';

(function () {
  var PINS_COUNT = 5;

  var PinParam = {
    OFFSET_X: 5, // смещение X координаты центра метки относительно left позиции маркера
    OFFSET_Y: 39 // смещение Y координаты нижнего края метки относительно top позиции маркера
  };

  var mapPins = document.querySelector('.map__pins');
  var mapPin = document.querySelector('template').content.querySelector('button.map__pin');
  var pinsFragment = document.createDocumentFragment();

  // убирает активное состояние у метки
  var removePinActiveState = function () {
    var activePin = mapPins.querySelector('.map__pin--active');
    if (activePin) {
      activePin.classList.remove('map__pin--active');
    }
  };

  // добавляет активное состояние для текущей метки
  var addCurrentPinActiveState = function (currentPin) {
    removePinActiveState();
    currentPin.classList.add('map__pin--active');
  };

  // создает метку для карты
  var createPin = function (offerData) {
    var newPin = mapPin.cloneNode(true);
    var left = offerData.location.x - PinParam.OFFSET_X;
    var top = offerData.location.y - PinParam.OFFSET_Y;
    newPin.style = 'left:' + left + 'px;' + 'top:' + top + 'px';
    newPin.querySelector('img').src = offerData.author.avatar;
    newPin.tabIndex = 0;

    newPin.addEventListener('click', function (evt) {
      handlePinClick(evt, offerData);
    });
    return newPin;
  };

  // функция обработки клика по метке
  var handlePinClick = function (evt, offer) {
    var targetPin = evt.target.tagName === 'IMG' ? evt.target.parentElement : evt.target;
    window.showCard.open(offer);
    addCurrentPinActiveState(targetPin);
  };

  // отрисовывает метки на карте
  var createPins = function (offers) {
    var selectedOffers = offers.slice(0, PINS_COUNT);
    selectedOffers.forEach(function (item) {
      pinsFragment.appendChild(createPin(item));
    });
    mapPins.appendChild(pinsFragment);
  };

  window.pin = {
    render: createPins,
    activate: addCurrentPinActiveState,
    deactivate: removePinActiveState
  };
})();
