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

  var PRICE = {
    min: 1000,
    max: 1000000
  };
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

  var ROOMS = {
    min: 1,
    max: 5
  };
  var ROOMS_CAPACITY = {
    '1': ['1'],
    '2': ['2', '1'],
    '3': ['3', '2', '1'],
    '100': ['0']
  };

  var TIME = ['12:00', '13:00', '14:00'];
  var FEATURES_LIST = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

  var MAP_COORDS = {
    x: {
      min: 300,
      max: 900
    },
    y: {
      min: 100,
      max: 500
    }
  };
  var PIN_PARAMS = {
    user: {
      width: 65,
      height: 64,
      arrowHeight: 17,
      arrowCenterOffset: 49
    },
    rival: {
      width: 46,
      height: 44,
      arrowHeight: 18,
      arrowCenterOffset: 30
    }
  };

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
    var locationX = window.utils.getRandomInteger(MAP_COORDS.x.min, MAP_COORDS.x.max);
    var locationY = window.utils.getRandomInteger(MAP_COORDS.y.min, MAP_COORDS.y.max);
    var roomsCount = window.utils.getRandomInteger(ROOMS.min, ROOMS.max);
    userId++;

    return {
      'author': {
        'avatar': AVATAR_FILE_MASK + AVATAR_ID_PREFIX + userId + AVATAR_FILE_EXTENSION
      },
      'offer': {
        'title': getOfferTitle(offersTitles),
        'address': locationX + ', ' + locationY,
        'price': window.utils.getRandomInteger(PRICE.min, PRICE.max),
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
    roomsCapacity: ROOMS_CAPACITY,
    rubCurrency: RUB_CURRENCY,
    mapCoords: MAP_COORDS,
    pinParams: PIN_PARAMS
  };
})();
