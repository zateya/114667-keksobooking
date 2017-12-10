'use strict';

(function () {
  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');
  var userPin = map.querySelector('.map__pin--main');

  // переключение карты в неактивное/активное состояние
  var toggleMapDisabled = function (isMapDisabled) {
    map.classList.toggle('map--faded', isMapDisabled);
  };

  var createPins = function (pinsData) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < window.data.usersCount; i++) {
      fragment.appendChild(window.pin.create(pinsData[i], i));
    }
    mapPins.appendChild(fragment);
  };

  var onLoad = function (data) {
    // при отпускании кнопки мыши на маркере (пользовательская метка) сервис активируется и создаются другие метки
    var onUserPinMouseup = function () {
      toggleMapDisabled(false);
      window.form.isDisabled(false);

      createPins(data);
      map.addEventListener('click', function (evt) {
        window.showCard(evt, data);
      });

      userPin.removeEventListener('mouseup', onUserPinMouseup);
    };

    // создаем обработчик отпускания маркера
    userPin.addEventListener('mouseup', onUserPinMouseup);
  };

  // по-умолчанию сервис отключен
  toggleMapDisabled(true);
  window.form.isDisabled(true);

  window.backend.load(onLoad, window.backend.isError);
})();
