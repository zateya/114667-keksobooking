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

var MAP_PIN_WIDTH = 46;
var MAP_PIN_HEIGHT = 62;

var RUB_CURRENCY = '\u20BD';

var ESC_KEYCODE = 27;

var userId = 0;
var offersTitles = OFFERS_TITLES.slice(0, OFFERS_TITLES.length);

var map = document.querySelector('.map');
var mapPins = map.querySelector('.map__pins');
var userPin = map.querySelector('.map__pin--main');
var mapFiltersContainer = map.querySelector('.map__filters-container');
var mapPin = document.querySelector('template').content.querySelector('button.map__pin');
var mapCard = document.querySelector('template').content.querySelector('.map__card');

var noticeForm = document.querySelector('.notice__form');
var noticeFormFieldsets = document.querySelectorAll('fieldset');
var titleField = noticeForm.querySelector('#title');
var addressField = noticeForm.querySelector('#address');
var timeInField = noticeForm.querySelector('#timein');
var timeOutField = noticeForm.querySelector('#timeout');
var typeField = noticeForm.querySelector('#type');
var priceField = noticeForm.querySelector('#price');
var roomsField = noticeForm.querySelector('#room_number');
var capacityField = noticeForm.querySelector('#capacity');
var submitButton = noticeForm.querySelector('.form__submit');

// переключение сервиса в неактивное/активное состояние
var toggleMapDisabled = function (isMapDisabled) {
  map.classList.toggle('map--faded', isMapDisabled);
};

// переключение формы в неактивное/активное
var toggleNoticeFormDisabled = function (isFormDisabled) {
  noticeForm.classList.toggle('notice__form--disabled', isFormDisabled);
  for (var i = 0; i < noticeFormFieldsets.length; i++) {
    noticeFormFieldsets[i].disabled = isFormDisabled;
  }
};

// валидация формы объявления

var onTimeInFieldChange = function () {
  if (timeInField && timeOutField) {
    timeOutField.value = timeInField.value;
  }
};

var onTimeOutFieldChange = function () {
  if (timeInField && timeOutField) {
    timeInField.value = timeOutField.value;
  }
};

var setPriceFieldMinValues = function () {
  if (typeField && priceField) {
    priceField.min = TYPES[typeField.value].minPrice;
  }
};

var getAddress = function () {
  var pin = document.querySelector('.map__pin--main');
  if (pin) {
    var pinLeft = window.getComputedStyle(pin, null).getPropertyValue('left').slice(0, -2);
    var pinTop = window.getComputedStyle(pin, null).getPropertyValue('top').slice(0, -2);
    addressField.value = pinLeft + ', ' + pinTop;
  }
};

var hideCapacityFieldValues = function () {
  if (roomsField && capacityField) {
    for (var i = 0; i < roomsField.length; i++) {
      if (
        roomsField.value > roomsField.length //                   Прячем поля:
        && capacityField.children[i].value !== '0'//              1. если выбрано 100 комнат скроет все кроме -не для гостей-,
        || capacityField.children[i].value > roomsField.value //  2. если вместимость > числа комнат, то скроет вместимость
        || capacityField.children[i].value === '0' //             3. скроет -не для гостей- везде кроме 100 комнат
        && roomsField.value < roomsField.length //
      ) {
        capacityField.children[i].hidden = true;
      } else {
        capacityField.children[i].hidden = false;
      }
    }
  }
};

var setCapacityFieldValues = function () {
  if (roomsField && capacityField) {
    if (roomsField.value < roomsField.length) {
      capacityField.value = roomsField.value;
    } else {
      capacityField.value = '0';
    }
    hideCapacityFieldValues();
  }
};

// Валидация текста в поле Заголовок
var onTitleFieldInvalid = function () {
  if (titleField.validity.tooShort) {
    titleField.setCustomValidity('Минимальная длина — 30 символов');
  } else if (titleField.validity.tooLong) {
    titleField.setCustomValidity('Максимальная длина — 100 символов');
  } else if (titleField.validity.valueMissing) {
    titleField.setCustomValidity('Обязательное поле');
  } else {
    titleField.setCustomValidity('');
  }
};

// Валидация значения в поле Цена
var onPriceFieldInvalid = function () {
  if (priceField.validity.rangeUnderflow) {
    priceField.setCustomValidity('Минимальная цена — ' + priceField.min);
  } else if (priceField.validity.rangeOverflow) {
    priceField.setCustomValidity('Максимальная цена — ' + priceField.max);
  } else if (priceField.validity.valueMissing) {
    priceField.setCustomValidity('Обязательное поле');
  } else {
    priceField.setCustomValidity('');
  }
};

/* *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** */

getAddress();
setPriceFieldMinValues();
setCapacityFieldValues();

if (priceField) {
  priceField.addEventListener('invalid', onPriceFieldInvalid);
}

if (titleField) {
  titleField.addEventListener('invalid', onTitleFieldInvalid);
}

if (typeField) {
  typeField.addEventListener('change', function () {
    setPriceFieldMinValues();
  });
}

if (roomsField) {
  roomsField.addEventListener('change', function () {
    setCapacityFieldValues();
  });
}

if (timeInField) {
  timeInField.addEventListener('change', onTimeInFieldChange);
}

if (timeOutField) {
  timeOutField.addEventListener('change', onTimeOutFieldChange);
}

noticeForm.addEventListener('invalid', function (evt) {
  var invalidField = evt.target;
  invalidField.style.borderColor = 'red';
}, true);

submitButton.addEventListener('click', function () {
  if (noticeForm.checkValidity()) {
    noticeForm.submit();
  }
});

/* *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** */

// функция убирает активное состояние у метки
var removePinActiveState = function () {
  var activePin = mapPins.querySelector('.map__pin--active');
  if (activePin) {
    activePin.classList.remove('map__pin--active');
  }
};

// функция добавляет активное состояние для текущей метки
var addCurrentPinActiveState = function (currentPin) {
  removePinActiveState();
  currentPin.classList.add('map__pin--active');
};

// удаляет попап, если он есть
var removePopup = function () {
  var popup = map.querySelector('.popup');
  if (popup) {
    map.removeChild(popup);
  }
};

// функция закрытия попапа
var closePopup = function () {
  removePopup();
  removePinActiveState();
  document.removeEventListener('keydown', onPopupEscPress);
};

// функция нажатия Esc при открытом попапе
var onPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePopup();
  }
};

// функция нажатия на кнопку Закрыть в попап
var onPopupCloseClick = function () {
  closePopup();
};

// функция обработки клика по карте
var onMapPinClick = function (evt) {
  var targetPin = evt.target.closest('.map__pin'); // берем ближайший с классом, т.к. внутри картинка, забирающая фокус при клике
  if (
    targetPin && targetPin.classList.contains('map__pin') &&
    !targetPin.classList.contains('map__pin--main')
  ) {
    showAdvert(offers[targetPin.tabIndex]);
    addCurrentPinActiveState(targetPin);

    var popup = document.querySelector('.popup');
    var popupClose = popup.querySelector('.popup__close');
    popupClose.addEventListener('click', onPopupCloseClick);

    document.addEventListener('keydown', onPopupEscPress);
  }
};

// при отпускании кнопки мыши на маркере (пользовательская метка) сервис активируется и создаются другие метки
var onUserPinMouseup = function () {
  toggleMapDisabled(false);
  toggleNoticeFormDisabled(false);
  createPins(offers);

  map.addEventListener('click', onMapPinClick);
  userPin.removeEventListener('mouseup', onUserPinMouseup);
};

// функции для работы с массивами
var getRandomInteger = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var getRandomArrayElement = function (arr) {
  var randomElement = arr[getRandomInteger(0, arr.length - 1)];
  return randomElement;
};

// получение уникального заголовка предложения
var getOfferTitle = function (titles) {
  var offerIndex = getRandomInteger(0, titles.length - 1);
  var offerTitle = offersTitles[offerIndex];
  offersTitles.splice(offerIndex, 1);
  return offerTitle;
};

// получение массива с особенностями предложения
var getFeatures = function (features) {
  var offerFeatures = [];
  var featuresCount = getRandomInteger(1, features.length);
  for (var i = 0; i < featuresCount; i++) {
    offerFeatures.push(features[i]);
  }
  return offerFeatures;
};

// формирование объекта с данными по предложению
var getOfferData = function () {
  var locationX = getRandomInteger(LOCATION_X_MIN, LOCATION_X_MAX);
  var locationY = getRandomInteger(LOCATION_Y_MIN, LOCATION_Y_MAX);
  var propertyAddress = locationX + ', ' + locationY;
  var roomsCount = getRandomInteger(ROOMS_MIN, ROOMS_MAX);
  var guestsCount = getRandomInteger(1, roomsCount);
  userId++;

  return {
    'author': {
      'avatar': AVATAR_FILE_MASK + AVATAR_ID_PREFIX + userId + AVATAR_FILE_EXTENSION
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

// формирование массива объектов недвижимости
var getOffers = function (usersCount) {
  var offers = [];
  for (var i = 0; i < usersCount; i++) {
    offers.push(getOfferData());
  }
  return offers;
};

// создает метки на карте
var createPin = function (offerData, offerNumber) {
  var newPin = mapPin.cloneNode(true);
  var left = offerData.location.x - MAP_PIN_WIDTH / 2;
  var top = offerData.location.y - MAP_PIN_HEIGHT;
  newPin.style = 'left:' + left + 'px;' + 'top:' + top + 'px';
  newPin.querySelector('img').src = offerData.author.avatar;
  newPin.tabIndex = offerNumber;
  return newPin;
};

var createPins = function (offers) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < offers.length; i++) {
    fragment.appendChild(createPin(offers[i], i));
  }
  mapPins.appendChild(fragment);
};

// формирует список особенностей предложения для вывода в объявление
var getFeaturesList = function (features) {
  var featuresList = '';
  for (var i = 0; i < features.length; i++) {
    featuresList += '<li class="feature feature--' + features[i] + '"></li>';
  }
  return featuresList;
};

// формирует текст объявления
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

// показывает объявление: если уже есть попап, то сначала удаляем, а затем создаем новый
var showAdvert = function (advert) {
  removePopup();
  var currentAdvert = createAdvert(advert);
  map.insertBefore(currentAdvert, mapFiltersContainer);
};

/* *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** */

// по-умолчанию сервис отключен
toggleMapDisabled(true);
toggleNoticeFormDisabled(true);

// создаем обработчик отпускания маркера
if (userPin) {
  userPin.addEventListener('mouseup', onUserPinMouseup);
}

var offers = getOffers(USERS_COUNT);
