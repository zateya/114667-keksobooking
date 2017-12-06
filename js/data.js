'use strict';

(function () {
  var USERS_COUNT = 8;
  var AVATAR_FILE_MASK = 'img/avatars/user';
  var AVATAR_ID_PREFIX = 0;
  var AVATAR_FILE_EXTENSION = '.png';

  var OFFERS_TITLES = [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ];

  var PRICE_MIN = 1000;
  var PRICE_MAX = 1000000;
  var PROPERTY_TYPES = ['flat', 'house', 'bungalo'];
  var TYPES = {
    flat: {
      ru: 'Квартира',
      minPrice: 1000
    },
    bungalo: {
      ru: 'Бунгало',
      minPrice: 0
    },
    house: {
      ru: 'Дом',
      minPrice: 5000
    },
    palace: {
      ru: 'Дворец',
      minPrice: 10000
    }
  };
  var ROOMS_MIN = 1;
  var ROOMS_MAX = 5;
  var TIME = ['12:00', '13:00', '14:00'];
  var FEATURES_LIST = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

  var LOCATION_X_MIN = 300;
  var LOCATION_X_MAX = 900;

  var LOCATION_Y_MIN = 100;
  var LOCATION_Y_MAX = 500;

  var RUB_CURRENCY = '\u20BD';

  var userId = 0;
  var offersTitles = OFFERS_TITLES.slice(0, OFFERS_TITLES.length);

  // получение уникального заголовка предложения
  var getOfferTitle = function (titles) {
    var offerIndex = window.utils.getRandomInteger(0, titles.length - 1);
    var offerTitle = offersTitles[offerIndex];
    offersTitles.splice(offerIndex, 1);
    return offerTitle;
  };

  // получение массива с особенностями предложения
  var getFeatures = function (features) {
    var offerFeatures = [];
    var featuresCount = window.utils.getRandomInteger(1, features.length);
    for (var i = 0; i < featuresCount; i++) {
      offerFeatures.push(features[i]);
    }
    return offerFeatures;
  };

  // формирование объекта с данными по предложению
  var getOfferData = function () {
    var locationX = window.utils.getRandomInteger(LOCATION_X_MIN, LOCATION_X_MAX);
    var locationY = window.utils.getRandomInteger(LOCATION_Y_MIN, LOCATION_Y_MAX);
    var roomsCount = window.utils.getRandomInteger(ROOMS_MIN, ROOMS_MAX);
    userId++;

    return {
      'author': {
        'avatar': AVATAR_FILE_MASK + AVATAR_ID_PREFIX + userId + AVATAR_FILE_EXTENSION
      },
      'offer': {
        'title': getOfferTitle(offersTitles),
        'address': locationX + ', ' + locationY,
        'price': window.utils.getRandomInteger(PRICE_MIN, PRICE_MAX),
        'type': window.utils.getRandomArrayElement(PROPERTY_TYPES),
        'rooms': roomsCount,
        'guests': window.utils.getRandomInteger(1, roomsCount),
        'checkin': window.utils.getRandomArrayElement(TIME),
        'checkout': window.utils.getRandomArrayElement(TIME),
        'features': getFeatures(FEATURES_LIST),
        'description': '',
        'photos': []
      },
      'location': {
        'x': locationX,
        'y': locationY
      }
    };
  };

  // формирование массива объектов недвижимости
  var getOffers = function (usersCount) {
    var offersList = [];
    for (var i = 0; i < usersCount; i++) {
      offersList.push(getOfferData());
    }
    return offersList;
  };

  var offers = getOffers(USERS_COUNT);

  window.data = {
    offers: offers,
    types: TYPES,
    rubCurrency: RUB_CURRENCY
  };
})();
