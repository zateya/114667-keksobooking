'use strict';

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
var ROOMS_MIN = 1;
var ROOMS_MAX = 5;
var TIME = ['12:00', '13:00', '14:00'];
var FEATURES_LIST = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

var LOCATION_X_MIN = 300;
var LOCATION_X_MAX = 900;

var LOCATION_Y_MIN = 100;
var LOCATION_Y_MAX = 500;

var MAP_PIN_WIDTH = 46;
var MAP_PIN_HEIGHT = 61;

var RUB_CURRENCY = '\u20BD';

var userID = 0;
var offersTitles = OFFERS_TITLES.slice(0, OFFERS_TITLES.length);

var getRandomInteger = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var getRandomArrayElement = function (arr) {
  var randomElement = arr[getRandomInteger(0, arr.length - 1)];
  return randomElement;
};

var getOfferTitle = function (titles) {
  var offerIndex = getRandomInteger(0, titles.length - 1);
  var offerTitle = offersTitles[offerIndex];
  offersTitles.splice(offerIndex, 1);
  return offerTitle;
};

var getFeatures = function (features) {
  var offerFeatures = [];
  var featuresCount = getRandomInteger(1, features.length);
  for (var i = 0; i < featuresCount; i++) {
    offerFeatures.push(features[i]);
  }
  return offerFeatures;
};

var getOfferData = function () {
  var locationX = getRandomInteger(LOCATION_X_MIN, LOCATION_X_MAX);
  var locationY = getRandomInteger(LOCATION_Y_MIN, LOCATION_Y_MAX);
  var propertyAddress = locationX + ', ' + locationY;
  var roomsCount = getRandomInteger(ROOMS_MIN, ROOMS_MAX);
  var guestsCount = getRandomInteger(1, roomsCount);
  userID++;

  return {
    'author': {
      'avatar': AVATAR_FILE_MASK + AVATAR_ID_PREFIX + userID + AVATAR_FILE_EXTENSION
    },
    'offer': {
      'title': getOfferTitle(offersTitles),
      'address': propertyAddress,
      'price': getRandomInteger(PRICE_MIN, PRICE_MAX),
      'type': getRandomArrayElement(PROPERTY_TYPES),
      'rooms': roomsCount,
      'guests': guestsCount,
      'checkin': getRandomArrayElement(TIME),
      'checkout': getRandomArrayElement(TIME),
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

var getOffers = function (usersCount) {
  var offers = [];
  for (var i = 0; i < usersCount; i++) {
    offers.push(getOfferData());
  }
  return offers;
};

var map = document.querySelector('.map');
var mapPins = map.querySelector('.map__pins');
var mapPin = document.querySelector('template').content.querySelector('button.map__pin');
var mapCard = document.querySelector('template').content.querySelector('.map__card');

var createPin = function (offerData) {
  var newPin = mapPin.cloneNode(true);
  var left = offerData.location.x - MAP_PIN_WIDTH / 2;
  var top = offerData.location.y - MAP_PIN_HEIGHT;
  newPin.style = 'left:' + left + 'px;' + 'top:' + top + 'px';
  newPin.querySelector('img').src = offerData.author.avatar;
  return newPin;
};

var createPins = function (offers) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < offers.length; i++) {
    fragment.appendChild(createPin(offers[i]));
  }
  mapPins.appendChild(fragment);
};

var getFeaturesList = function (features) {
  var featuresList = '';
  for (var i = 0; i < features.length; i++) {
    featuresList += '<li class="feature feature--' + features[i] + '"></li>';
  }
  return featuresList;
};

var createAdvert = function (offerData) {
  var advert = mapCard.cloneNode(true);
  var TYPES = {
    flat: {
      ru: 'Квартира'
    },
    bungalo: {
      ru: 'Бунгало'
    },
    house: {
      ru: 'Дом'
    }
  };
  advert.querySelector('h3').textContent = offerData.offer.title;
  advert.querySelector('small').textContent = offerData.offer.address;
  advert.querySelector('.popup__price').textContent = offerData.offer.price + ' ' + RUB_CURRENCY + '/ночь';
  advert.querySelector('h4').textContent = TYPES[offerData.offer.type].ru;
  advert.querySelector('h4 + p').textContent = offerData.offer.rooms + ' комнаты для ' + offerData.offer.guests + ' гостей';
  advert.querySelector('h4 + p + p').textContent = 'Заезд после ' + offerData.offer.checkin + ', выезд до ' + offerData.offer.checkout;
  advert.querySelector('.popup__features').innerHTML = getFeaturesList(offerData.offer.features);
  advert.querySelector('.popup__features + p').textContent = offerData.offer.description;
  advert.querySelector('.popup__avatar').src = offerData.author.avatar;
  return advert;
};

var showAdvert = function (adverts, number) {
  var currentAdvert = createAdvert(adverts[number]);
  map.appendChild(currentAdvert);
};

var offers = getOffers(USERS_COUNT);
map.classList.remove('map--faded');
createPins(offers);
showAdvert(offers, 0);
