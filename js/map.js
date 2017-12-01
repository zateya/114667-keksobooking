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
var ROOMS_MIN = 1;
var ROOMS_MAX = 5;
var TIME = ['12:00', '13:00', '14:00'];
var FEATURES_LIST = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

var LOCATION_X_MIN = 300;
var LOCATION_X_MAX = 900;

var LOCATION_Y_MIN = 100;
var LOCATION_Y_MAX = 500;

var MAP_PIN_WIDTH = 46;
var MAP_PIN_HEIGHT = 62;

var RUB_CURRENCY = '\u20BD';

var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

var userID = 0;
var offersTitles = OFFERS_TITLES.slice(0, OFFERS_TITLES.length);

var map = document.querySelector('.map');
var mapPins = map.querySelector('.map__pins');
var userPin = map.querySelector('.map__pin--main');
var mapFiltersContainer = map.querySelector('.map__filters-container');
var mapPin = document.querySelector('template').content.querySelector('button.map__pin');
var mapCard = document.querySelector('template').content.querySelector('.map__card');

var noticeForm = document.querySelector('.notice__form');
var noticeFormFieldsets = document.querySelectorAll('fieldset');

// переключение сервиса в неактивное/активное состояние
var toggleServiceDisabled = function (isServiceDisabled) {
  map.classList.toggle('map--faded', isServiceDisabled);
  toggleNoticeFormDisabled(isServiceDisabled);
};

// переключение формы в неактивное/активное
var toggleNoticeFormDisabled = function (isFormDisabled) {
  noticeForm.classList.toggle('notice__form--disabled', isFormDisabled);
  for (var i = 0; i < noticeFormFieldsets.length; i++) {
    noticeFormFieldsets[i].disabled = isFormDisabled;
  }
};

// по-умолчанию сервис отключен
toggleServiceDisabled(true);

// при отпускании кнопки мыши на маркере (пользовательская метка) активируем сервис и создаем другие метки
var onUserPinMouseup = function () {
  toggleServiceDisabled(false);
  createPins(offers);
};

// создаем обработчик отпускания маркера
userPin.addEventListener('mouseup', onUserPinMouseup);

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

// функция закрытия попапа
var closePopup = function () {
  var popup = map.querySelector('.popup');
  map.removeChild(popup);
  removePinActiveState();
  document.removeEventListener('keydown', onPopupEscPress);
};

// функция нажатия на Esc при открытом попапе
var onPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePopup();
  }
};

// функция убирания активного состояния у активной метки
var removePinActiveState = function () {
  var activePin = mapPins.querySelector('.map__pin--active');
  if (activePin) {
    activePin.classList.remove('map__pin--active');
  }
};

// функция установки активного состояния у для пина
var setCurrentPinActiveState = function (pin) {
  removePinActiveState();
  pin.classList.add('map__pin--active');
};

// создаем пин и навешиваем события и обработчики
var createPin = function (offerData, offerNumber) {
  var newPin = mapPin.cloneNode(true);
  newPin.addEventListener('click', function () {
    setCurrentPinActiveState(newPin);
    showAdvert(offers, offerNumber);
    var popup = document.querySelector('.popup');
    var popupClose = popup.querySelector('.popup__close');
    popupClose.addEventListener('click', function () {
      closePopup();
    });
    document.addEventListener('keydown', onPopupEscPress);
  });
  newPin.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      setCurrentPinActiveState(newPin);
    }
  });
  var left = offerData.location.x - MAP_PIN_WIDTH / 2;
  var top = offerData.location.y - MAP_PIN_HEIGHT;
  newPin.style = 'left:' + left + 'px;' + 'top:' + top + 'px';
  newPin.querySelector('img').src = offerData.author.avatar;
  return newPin;
};

var createPins = function (offers) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < offers.length; i++) {
    fragment.appendChild(createPin(offers[i], i)); // i для передачи номера объявления
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

// показывает объявление, если уже есть попап, то сначала удаляем, а затем создаем новый
var showAdvert = function (adverts, number) {
  var popup = map.querySelector('.popup');
  if (popup) {
    map.removeChild(popup);
  }
  var currentAdvert = createAdvert(adverts[number]);
  map.insertBefore(currentAdvert, mapFiltersContainer);
};

var offers = getOffers(USERS_COUNT);
