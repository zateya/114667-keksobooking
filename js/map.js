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

  // функция обработки клика по карте
  var onMapPinClick = function (evt) {
    var targetPin = evt.target.closest('.map__pin'); // берем ближайший с классом, т.к. внутри картинка, забирающая фокус при клике
    if (
      targetPin && targetPin.classList.contains('map__pin') &&
      !targetPin.classList.contains('map__pin--main')
    ) {
      window.card.show(window.data.offers[targetPin.tabIndex]);
      window.pin.activate(targetPin);

      var popup = document.querySelector('.popup');
      var popupClose = popup.querySelector('.popup__close');
      popupClose.addEventListener('click', window.card.closeClick);

      document.addEventListener('keydown', window.card.escPress);
    }
  };

  // при отпускании кнопки мыши на маркере (пользовательская метка) сервис активируется и создаются другие метки
  var onUserPinMouseup = function () {
    toggleMapDisabled(false);
    window.form.isDisabled(false);
    createPins(window.data.offers);

    map.addEventListener('click', onMapPinClick);
    userPin.removeEventListener('mouseup', onUserPinMouseup);
  };

  // по-умолчанию сервис отключен
  toggleMapDisabled(true);
  window.form.isDisabled(true);

  // создаем обработчик отпускания маркера
  userPin.addEventListener('mouseup', onUserPinMouseup);
})();
