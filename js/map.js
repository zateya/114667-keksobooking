'use strict';

(function () {
  var PRICES_TO_COMPARE = {
    low: 10000,
    high: 50000
  };

  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');
  var userPin = map.querySelector('.map__pin--main');

  var filtersForm = document.querySelector('.map__filters');
  var typeFilter = filtersForm.querySelector('#housing-type');
  var priceFilter = filtersForm.querySelector('#housing-price');
  var roomsFilter = filtersForm.querySelector('#housing-rooms');
  var guestsFilter = filtersForm.querySelector('#housing-guests');
  var featuresFilters = filtersForm.querySelectorAll('#housing-features input[name="features"]');

  var offers = [];

  var removePins = function () {
    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    [].forEach.call(pins, function (pin) {
      mapPins.removeChild(pin);
    });
  };

  var updatePins = function () {
    var filteredOffers = offers;
    removePins();
    window.showCard.close();

    var filterByValue = function (element, property) {
      if (element.value !== 'any') {
        filteredOffers = filteredOffers.filter(function (advert) {
          return advert.offer[property].toString() === element.value;
        });
      }
      return filteredOffers;
    };

    var filterByPrice = function () {
      if (priceFilter.value !== 'any') {
        filteredOffers = filteredOffers.filter(function (advert) {

          var priceFilterValues = {
            'middle': advert.offer.price >= PRICES_TO_COMPARE.low && advert.offer.price < PRICES_TO_COMPARE.high,
            'low': advert.offer.price < PRICES_TO_COMPARE.low,
            'high': advert.offer.price >= PRICES_TO_COMPARE.high
          };

          return priceFilterValues[priceFilter.value];
        });
      }
      return filteredOffers;
    };

    var filterByFeatures = function () {
      [].forEach.call(featuresFilters, function (item) {
        if (item.checked) {
          filteredOffers = filteredOffers.filter(function (advert) {
            return advert.offer.features.indexOf(item.value) >= 0;
          });
        }
      });

      return filteredOffers;
    };

    filterByValue(typeFilter, 'type');
    filterByValue(roomsFilter, 'rooms');
    filterByValue(guestsFilter, 'guests');
    filterByPrice();
    filterByFeatures();

    window.pin.render(filteredOffers);
  };

  filtersForm.addEventListener('change', function () {
    window.utils.debounce(updatePins, 500);
  });

  // переключение карты в неактивное/активное состояние
  var enableMap = function () {
    map.classList.remove('map--faded');
  };

  var onUserPinMouseup = function () {
    enableMap();
    window.form.isDisabled(false);
    window.pin.render(offers);

    userPin.removeEventListener('mouseup', onUserPinMouseup);
  };

  var onLoad = function (data) {
    offers = data.slice();
    userPin.addEventListener('mouseup', onUserPinMouseup);
  };

  // по-умолчанию сервис отключен
  window.form.isDisabled(true);

  window.backend.load(onLoad, window.backend.isError);
})();
