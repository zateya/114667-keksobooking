'use strict';

(function () {
  var mapCard = document.querySelector('template').content.querySelector('.map__card');

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

  window.card = {
    create: createAdvert
  };
})();
