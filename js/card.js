'use strict';

(function () {
  var mapCard = document.querySelector('template').content.querySelector('.map__card');

  // получение элемента списка услуг
  var getFeatureItem = function (feature) {
    return '<li class="feature feature--' + feature + '"></li>';
  };

  // получение элемента списка фотографий
  var getPhotoItem = function (photo) {
    return '<li><img src="' + photo + '" width="42" height="42"></li>';
  };

  // формирует текст объявления
  var createAdvert = function (offerData) {
    var advert = mapCard.cloneNode(true);
    var roomsDecline = window.utils.getDecline(offerData.offer.rooms, 'комната', 'комнаты', 'комнат');
    var guestsDecline = window.utils.getDecline(offerData.offer.guests, 'гостя', 'гостей', 'гостей');
    var featuresElement = advert.querySelector('.popup__features');
    var photosElement = advert.querySelector('.popup__pictures');

    advert.querySelector('h3').textContent = offerData.offer.title;
    advert.querySelector('small').textContent = offerData.offer.address;
    advert.querySelector('.popup__price').textContent = offerData.offer.price + ' ' + window.utils.rubCurrency + '/ночь';
    advert.querySelector('h4').textContent = window.form.types[offerData.offer.type].ru;
    advert.querySelector('h4 + p').textContent = offerData.offer.rooms + ' ' + roomsDecline + ' для ' + offerData.offer.guests + ' ' + guestsDecline;
    advert.querySelector('h4 + p + p').textContent = 'Заезд после ' + offerData.offer.checkin + ', выезд до ' + offerData.offer.checkout;
    window.utils.getListElement(featuresElement, offerData.offer.features, getFeatureItem);
    advert.querySelector('.popup__features + p').textContent = offerData.offer.description;
    advert.querySelector('.popup__avatar').src = offerData.author.avatar;
    window.utils.getListElement(photosElement, offerData.offer.photos, getPhotoItem);
    return advert;
  };

  window.card = {
    create: createAdvert
  };
})();
