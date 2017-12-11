'use strict';

(function () {
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
  var formReset = noticeForm.querySelector('.form__reset');

  // переключение формы в неактивное/активное
  var toggleNoticeFormDisabled = function (isFormDisabled) {
    noticeForm.classList.toggle('notice__form--disabled', isFormDisabled);
    for (var i = 0; i < noticeFormFieldsets.length; i++) {
      noticeFormFieldsets[i].disabled = isFormDisabled;
    }
  };

  var setAddressFieldValue = function (x, y) {
    addressField.value = 'x: ' + x + ', y: ' + y;
  };

  // получение адреса по-умолчанию
  var getDefaultAddress = function () {
    var pin = document.querySelector('.map__pin--main');
    if (pin) {
      var x = window.getComputedStyle(pin, null).getPropertyValue('left').slice(0, -2);
      var y = parseInt(window.getComputedStyle(pin, null).getPropertyValue('top').slice(0, -2), 10) + window.data.pinParams.user.offsetY;
      setAddressFieldValue(x, y);
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

  // синхронизация полей

  var syncValues = function (element, value) {
    element.value = value;
  };

  var syncValueWithMin = function (element, value) {
    element.min = value;
  };

  var getOptionsValuesArray = function (element) {
    var values = [];
    [].forEach.call(element.options, function (item) {
      values.push(item.value);
    });
    return values;
  };

  var timeInValues = getOptionsValuesArray(timeInField);
  var timeOutValues = getOptionsValuesArray(timeOutField);
  var typeFieldValues = getOptionsValuesArray(typeField);

  var getPriceFieldMinValues = function (arr) {
    var values = [];
    arr.forEach(function (item) {
      values.push(window.data.types[item].minPrice);
    });
    return values;
  };

  var priceFieldValues = getPriceFieldMinValues(typeFieldValues);

  var onTimeInFieldChange = function () {
    window.synchronizeFields(timeInField, timeOutField, timeInValues, timeOutValues, syncValues);
  };

  var onTimeOutFieldChange = function () {
    window.synchronizeFields(timeOutField, timeInField, timeOutValues, timeInValues, syncValues);
  };

  var setPriceFieldMinValues = function () {
    window.synchronizeFields(typeField, priceField, typeFieldValues, priceFieldValues, syncValueWithMin);
    priceField.placeholder = priceField.min;
  };

  // установка значений в поле количество мест
  var setCapacityFieldValues = function () {
    if (capacityField.options.length > 0) {
      [].forEach.call(capacityField.options, function (item) {
        item.selected = (window.data.roomsCapacity[roomsField.value][0] === item.value) ? true : false;
        item.hidden = (window.data.roomsCapacity[roomsField.value].indexOf(item.value) >= 0) ? false : true;
      });
    }
  };

  var resetInvalidFieldStyle = function (field) {
    field.style.borderColor = '';
  };

  /* *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** */

  getDefaultAddress();
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
      noticeForm.reset();
      getDefaultAddress();
    });
  }

  /* *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** */

  // отправка формы

  noticeForm.addEventListener('invalid', function (evt) {
    var invalidField = evt.target;
    invalidField.style.borderColor = 'red';
  }, true);

  noticeForm.addEventListener('submit', function (evt) {
    window.backend.save(new FormData(noticeForm), function () {
      noticeForm.reset();
      getDefaultAddress();
    }, window.backend.isError);
    evt.preventDefault();
  });

  window.form = {
    isDisabled: toggleNoticeFormDisabled,
    setAddressValue: setAddressFieldValue
  };
})();
