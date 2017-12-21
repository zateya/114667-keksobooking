'use strict';

(function () {
  var roomsToCapacity = {
    '1': ['1'],
    '2': ['2', '1'],
    '3': ['3', '2', '1'],
    '100': ['0']
  };

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

  var noticeForm = document.querySelector('.notice__form');
  var noticeFormFieldsets = document.querySelectorAll('fieldset');
  var titleField = noticeForm.querySelector('#title');
  var timeInField = noticeForm.querySelector('#timein');
  var timeOutField = noticeForm.querySelector('#timeout');
  var typeField = noticeForm.querySelector('#type');
  var priceField = noticeForm.querySelector('#price');
  var roomsField = noticeForm.querySelector('#room_number');
  var capacityField = noticeForm.querySelector('#capacity');
  var formReset = noticeForm.querySelector('.form__reset');
  var avatarPreview = document.querySelector('.notice__preview  img');

  var defaultAvatarIcon = avatarPreview.src;

  // переключение формы в неактивное/активное состояние
  var toggleNoticeFormDisabled = function (isFormDisabled) {
    noticeForm.classList.toggle('notice__form--disabled', isFormDisabled);
    [].forEach.call(noticeFormFieldsets, function (item) {
      item.disabled = isFormDisabled;
    });
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

  // получение массива значений в селектах
  var timeInValues = window.utils.getOptionsValuesArray(timeInField);
  var timeOutValues = window.utils.getOptionsValuesArray(timeOutField);
  var typeFieldValues = window.utils.getOptionsValuesArray(typeField);

  var getPriceFieldMinValues = function (arr) {
    return arr.map(function (item) {
      return TYPES[item].minPrice;
    });
  };

  var priceFieldValues = getPriceFieldMinValues(typeFieldValues);

  // синхронизация полей
  var onTimeInFieldChange = function () {
    window.synchronizeFields(timeInField, timeOutField, timeInValues, timeOutValues, window.utils.syncValues);
  };

  var onTimeOutFieldChange = function () {
    window.synchronizeFields(timeOutField, timeInField, timeOutValues, timeInValues, window.utils.syncValues);
  };

  var setPriceFieldMinValues = function () {
    window.synchronizeFields(typeField, priceField, typeFieldValues, priceFieldValues, window.utils.syncValueWithMin);
    priceField.placeholder = priceField.min;
  };

  // установка значений в поле количество мест
  var setCapacityFieldValues = function () {
    if (capacityField.options.length > 0) {
      [].forEach.call(capacityField.options, function (item) {
        item.selected = (roomsToCapacity[roomsField.value][0] === item.value) ? true : false;
        item.hidden = (roomsToCapacity[roomsField.value].indexOf(item.value) >= 0) ? false : true;
      });
    }
  };

  var resetInvalidFieldStyle = function (field) {
    field.style.borderColor = '';
  };

  var removeUploads = function () {
    var photos = document.querySelectorAll('.form__photo');

    if (photos) {
      [].forEach.call(photos, function (photo) {
        photo.parentNode.removeChild(photo);
      });
    }
  };

  var resetForm = function () {
    var requiredFields = noticeForm.querySelectorAll('input[required]');

    noticeForm.reset();
    window.userPin.getDefaultAddress();
    setPriceFieldMinValues();
    setCapacityFieldValues();
    removeUploads();
    avatarPreview.src = defaultAvatarIcon;

    [].forEach.call(requiredFields, function (item) {
      resetInvalidFieldStyle(item);
    });
  };

  /* *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** */

  window.userPin.getDefaultAddress();
  setPriceFieldMinValues();
  setCapacityFieldValues();

  if (titleField) {
    titleField.addEventListener('invalid', onTitleFieldInvalid);

    titleField.addEventListener('input', function () {
      resetInvalidFieldStyle(titleField);
    });

    titleField.addEventListener('blur', function () {
      titleField.checkValidity();
    });
  }

  if (priceField) {
    priceField.addEventListener('invalid', onPriceFieldInvalid);

    priceField.addEventListener('input', function () {
      resetInvalidFieldStyle(priceField);
    });

    priceField.addEventListener('blur', function () {
      priceField.checkValidity();
    });
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

  if (formReset) {
    formReset.addEventListener('click', function (evt) {
      evt.preventDefault();
      resetForm();
    });
  }

  /* *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** */

  // отправка формы

  noticeForm.addEventListener('invalid', function (evt) {
    var invalidField = evt.target;
    invalidField.style.borderColor = 'red';
  }, true);

  noticeForm.addEventListener('submit', function (evt) {
    window.backend.save(new FormData(noticeForm), resetForm, window.backend.isError);
    evt.preventDefault();
  });

  window.form = {
    isDisabled: toggleNoticeFormDisabled,
    types: TYPES
  };
})();
