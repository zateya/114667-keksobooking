'use strict';

(function () {
  var PINS_COUNT = 5;

  var PinParam = {
    HEIGHT: 44,
    ARROW_WIDTH: 10,
    ARROW_HEIGHT: 18
  };

  // размер map__pin в разметке 40*44px,
  // за счет transform: translate(-50%, -50%) метка смещается на 20px влево по x и 22px вверх по y
  // стрелка-указатель внутри метки - псевлоэлемент 10*18px
  // с абсолютным позиционированием top 100% (или 44 пикселя) и смещением left на 50%, т.е. на 20 пикселей.
  // Ширина указателя 10, центр - 5. Итого центр указателя смещен вправо от левого края map__pin на 25px.
  // Чтобы указатель показывал на координату надо сместить map__pin влево еще на 5 (смещение по Х), на 20 уже смещается транслейтом.
  // высота метки с указателем: 44 + 18 = 62, надо сместить на: 62 - 22 = 40 (смещение по Y), на 22 уже смещается транслейтом.

  var mapPins = document.querySelector('.map__pins');
  var mapPin = document.querySelector('template').content.querySelector('button.map__pin');
  var activePin = null;
  var pinsFragment = document.createDocumentFragment();

  // создает метку для карты
  var createPin = function (offerData) {
    var newPin = mapPin.cloneNode(true);
    var left = offerData.location.x - PinParam.ARROW_WIDTH / 2; // (ширина метки / 2 - ширина метки / 2) - сокращаются.
    var top = offerData.location.y - (PinParam.HEIGHT / 2 + PinParam.ARROW_HEIGHT);
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
