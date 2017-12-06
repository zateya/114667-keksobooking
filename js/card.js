'use strict';

(function () {
  var map = document.querySelector('.map');
  var mapCard = document.querySelector('template').content.querySelector('.map__card');
  var mapFiltersContainer = map.querySelector('.map__filters-container');

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
    advert.querySelector('.popup__price').textContent = offerData.offer.price + ' ' + window.data.rubCurrency + '/ночь';
    advert.querySelector('h4').textContent = window.data.types[offerData.offer.type].ru;
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
    window.pin.deactivate();
    document.removeEventListener('keydown', onPopupEscPress);
  };

  // функция нажатия на кнопку Закрыть в попап
  var onPopupCloseClick = function () {
    closePopup();
  };

  // функция нажатия Esc при открытом попапе
  var onPopupEscPress = function (evt) {
    window.utils.isEscEvent(evt, closePopup);
  };

  window.card = {
    show: showAdvert,
    closeClick: onPopupCloseClick,
    escPress: onPopupEscPress
  };
})();
