'use strict';

(function () {
  var OFFERS__COUNT = 5;
  var PRICES_TO_COMPARE = {
    min: 10000,
    max: 50000
  };

  var offers = [];

  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');
  var pinsFragment = document.createDocumentFragment();
  var userPin = map.querySelector('.map__pin--main');

  var filtersForm = document.querySelector('.map__filters');
  var typeFilter = filtersForm.querySelector('#housing-type');
  var priceFilter = filtersForm.querySelector('#housing-price');
  var roomsFilter = filtersForm.querySelector('#housing-rooms');
  var guestsFilter = filtersForm.querySelector('#housing-guests');
  var featuresFilters = filtersForm.querySelectorAll('#housing-features input[name="features"]');

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
            'middle': advert.offer.price >= PRICES_TO_COMPARE.min && advert.offer.price < PRICES_TO_COMPARE.max,
            'low': advert.offer.price < PRICES_TO_COMPARE.min,
            'high': advert.offer.price >= PRICES_TO_COMPARE.max
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

    createPins(filteredOffers);
  };

  filtersForm.addEventListener('change', function () {
    window.utils.debounce(updatePins, 500);
  });

  // переключение карты в неактивное/активное состояние
  var enableMap = function () {
    map.classList.remove('map--faded');
  };

  var createPins = function (adverts) {
    var offersCount = (adverts.length > OFFERS__COUNT) ? OFFERS__COUNT : adverts.length;
    for (var i = 0; i < offersCount; i++) {
      pinsFragment.appendChild(window.pin.create(adverts[i]));
    }
    mapPins.appendChild(pinsFragment);
  };

  var onUserPinMouseup = function () {
    enableMap();
    window.form.isDisabled(false);
    createPins(offers);

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
