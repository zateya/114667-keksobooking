'use strict';

(function () {
  var map = document.querySelector('.map');
  var mapFiltersContainer = map.querySelector('.map__filters-container');

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
    removePopupEvents();
  };

  // функция нажатия на кнопку Закрыть в попап
  var onPopupCloseClick = function () {
    closePopup();
  };

  // функция нажатия Esc при открытом попапе
  var onPopupEscPress = function (evt) {
    window.utils.isEscEvent(evt, closePopup);
  };

  // добавляет обработчики нажатия на кнопку Закрыть и клавишу Esc
  var addPopupEvents = function () {
    var popupClose = document.querySelector('.popup__close');
    if (popupClose) {
      popupClose.addEventListener('click', onPopupCloseClick);
    }
    document.addEventListener('keydown', onPopupEscPress);
  };

  // удаляет обработчики нажатия на кнопку Закрыть и клавишу Esc
  var removePopupEvents = function () {
    var popupClose = document.querySelector('.popup__close');
    if (popupClose) {
      popupClose.removeEventListener('click', onPopupCloseClick);
    }

    document.removeEventListener('keydown', onPopupEscPress);
  };

  window.showCard = {
    open: function (advert) {
      removePopup();
      var currentAdvert = window.card.create(advert);
      map.insertBefore(currentAdvert, mapFiltersContainer);
      addPopupEvents();
    },
    close: closePopup
  };
})();
