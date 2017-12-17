'use strict';

(function () {
  var mapCard = document.querySelector('template').content.querySelector('.map__card');

  // формирует содержимое списка особенностей предложения
  var getFeaturesList = function (features) {
    return features.map(function (item) {
      return '<li class="feature feature--' + item + '"></li>';
    }).join('');
  };

  // формирует содержимое списка с фотографиями
  var getPhotosList = function (photos) {
    return photos.map(function (item) {
      return '<li><img src="' + item + '" width = "42" height="42"></li>';
    }).join('');
  };

  // формирует текст объявления
  var createAdvert = function (offerData) {
    var advert = mapCard.cloneNode(true);
    var roomsDecline = window.utils.getDecline(offerData.offer.rooms, 'комната', 'комнаты', 'комнат');
    var guestsDecline = window.utils.getDecline(offerData.offer.guests, 'гостя', 'гостей', 'гостей');
    advert.querySelector('h3').textContent = offerData.offer.title;
    advert.querySelector('small').textContent = offerData.offer.address;
    advert.querySelector('.popup__price').textContent = offerData.offer.price + ' ' + window.utils.rubCurrency + '/ночь';
    advert.querySelector('h4').textContent = window.form.types[offerData.offer.type].ru;
    advert.querySelector('h4 + p').textContent = offerData.offer.rooms + ' ' + roomsDecline + ' для ' + offerData.offer.guests + ' ' + guestsDecline;
    advert.querySelector('h4 + p + p').textContent = 'Заезд после ' + offerData.offer.checkin + ', выезд до ' + offerData.offer.checkout;
    advert.querySelector('.popup__features').innerHTML = getFeaturesList(offerData.offer.features);
    advert.querySelector('.popup__features + p').textContent = offerData.offer.description;
    advert.querySelector('.popup__avatar').src = offerData.author.avatar;
    advert.querySelector('.popup__pictures').innerHTML = getPhotosList(offerData.offer.photos);
    return advert;
  };

  window.card = {
    create: createAdvert
  };
})();
