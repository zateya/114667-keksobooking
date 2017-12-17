'use strict';

(function () {
  var PriceToCompare = {
    LOW: 10000,
    HIGH: 50000
  };

  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');
  var userPin = map.querySelector('.map__pin--main');

  var filtersForm = document.querySelector('.map__filters');
  var typeFilter = filtersForm.querySelector('#housing-type');
  var priceFilter = filtersForm.querySelector('#housing-price');
  var roomsFilter = filtersForm.querySelector('#housing-rooms');
  var guestsFilter = filtersForm.querySelector('#housing-guests');

  var offers = [];

  // удаление меток
  var removePins = function () {
    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    [].forEach.call(pins, function (pin) {
      mapPins.removeChild(pin);
    });
  };

  // фильтрация и добавление меток
  var updatePins = function () {
    var filteredOffers = offers;
    removePins();
    window.showCard.close();

    // фильтрация по значению элемента
    var filterByValue = function (element, property) {
      if (element.value !== 'any') {
        filteredOffers = filteredOffers.filter(function (offerData) {
          return offerData.offer[property].toString() === element.value;
        });
      }
      return filteredOffers;
    };

    // фильтрация по цене
    var filterByPrice = function () {
      if (priceFilter.value !== 'any') {
        filteredOffers = filteredOffers.filter(function (offerData) {

          var valueToPriceСondition = {
            'middle': offerData.offer.price >= PriceToCompare.LOW && offerData.offer.price < PriceToCompare.HIGH,
            'low': offerData.offer.price < PriceToCompare.LOW,
            'high': offerData.offer.price >= PriceToCompare.HIGH
          };

          return valueToPriceСondition[priceFilter.value];
        });
      }
      return filteredOffers;
    };

    // фильтрация по особенностям
    var filterByFeatures = function () {
      var featuresFilters = filtersForm.querySelectorAll('#housing-features [type="checkbox"]:checked');
      [].forEach.call(featuresFilters, function (item) {
        filteredOffers = filteredOffers.filter(function (offerData) {
          return offerData.offer.features.indexOf(item.value) >= 0;
        });
      });

      return filteredOffers;
    };

    // вызов функций фильтрации
    filterByValue(typeFilter, 'type');
    filterByValue(roomsFilter, 'rooms');
    filterByValue(guestsFilter, 'guests');
    filterByPrice();
    filterByFeatures();

    // вывод отфильтрованных меток
    window.pin.render(filteredOffers);
  };

  // добавление обработчика на форму с фильтрами
  filtersForm.addEventListener('change', function () {
    window.utils.debounce(updatePins, 500);
  });

  // при успешной загрузке данных с сервера
  var onLoad = function (data) {
    offers = data.slice();
    window.pin.render(offers);
  };

  // обработчик отпускания кнопки мыши на пользовательской метке
  var onUserPinMouseup = function () {
    // загрузка данных с сервера
    window.backend.load(onLoad, window.backend.isError);

    map.classList.remove('map--faded');
    window.form.isDisabled(false);

    userPin.removeEventListener('mouseup', onUserPinMouseup);
    document.removeEventListener('keydown', onDocumentKeydown);
  };

  // обработчик нажатия клавиши
  var onDocumentKeydown = function (evt) {
    window.utils.isEnterEvent(evt, onUserPinMouseup);
    window.utils.isEscEvent(evt, onUserPinMouseup);
  };

  // добавление обработчиков
  userPin.addEventListener('mouseup', onUserPinMouseup);
  document.addEventListener('keydown', onDocumentKeydown);

  // по умолчанию сервис отключен
  window.form.isDisabled(true);
})();
