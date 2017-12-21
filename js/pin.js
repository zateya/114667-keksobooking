'use strict';

(function () {
  var PINS_COUNT = 5;

  var PinParam = {
    OFFSET_X: 5, // смещение X координаты центра метки относительно left позиции маркера
    OFFSET_Y: 40 // смещение Y координаты нижнего края метки относительно top позиции маркера
  };

  // размер map__pin 40*44px,
  // за счет transform: translate(-50%, -50%) он смещается на 20px влево по x и 22px вверх по y
  // указатель - псевлоэлемент 10*18px с абсолютным позиционированием top 100% (или 44 пикселя)
  // и смещением left на 50%, т.е. на 20 пикселей.
  // Ширина указателя 10, центр - 5. Итого центр указателя смещен вправо от левого края map__pin на 25px.
  // Чтобы указатель показывал на координату надо сместить map__pin влево еще на 5 (OFFSET_X) (на 20 уже смещается транслейтом).
  // высота пина с указателем: 44 + 18 = 62, надо сместить 62 - 22 = 40 (OFFSET_Y) (на 22 уже смещается транслейтом).

  var mapPins = document.querySelector('.map__pins');
  var mapPin = document.querySelector('template').content.querySelector('button.map__pin');
  var activePin = null;
  var pinsFragment = document.createDocumentFragment();

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

  // убирает активное состояние у метки
  var removePinActiveState = function () {
    if (activePin !== null) {
      activePin.classList.remove('map__pin--active');
    }
  };

  // функция обработки клика по метке
  var handlePinClick = function (evt, offer) {
    var targetPin = evt.target.tagName === 'IMG' ? evt.target.parentElement : evt.target;
    window.showCard.open(offer);
    removePinActiveState();
    targetPin.classList.add('map__pin--active');
    activePin = targetPin;
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
    deactivate: removePinActiveState
  };
})();
