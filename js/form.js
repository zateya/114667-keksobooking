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
  var submitButton = noticeForm.querySelector('.form__submit');

  // переключение формы в неактивное/активное
  var toggleNoticeFormDisabled = function (isFormDisabled) {
    noticeForm.classList.toggle('notice__form--disabled', isFormDisabled);
    for (var i = 0; i < noticeFormFieldsets.length; i++) {
      noticeFormFieldsets[i].disabled = isFormDisabled;
    }
  };

  // получение адреса по-умолчанию
  var getAddress = function () {
    var pin = document.querySelector('.map__pin--main');
    if (pin) {
      var pinLeft = window.getComputedStyle(pin, null).getPropertyValue('left').slice(0, -2);
      var pinTop = window.getComputedStyle(pin, null).getPropertyValue('top').slice(0, -2);
      addressField.value = pinLeft + ', ' + pinTop;
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

  var onTimeInFieldChange = function () {
    timeOutField.value = timeInField.value;
  };

  var onTimeOutFieldChange = function () {
    timeInField.value = timeOutField.value;
  };

  var setPriceFieldMinValues = function () {
    priceField.min = priceField.placeholder = window.data.types[typeField.value].minPrice;
  };

  var hideCapacityFieldValues = function () {
    for (var i = 0; i < roomsField.length; i++) {
      if (
        roomsField.value > roomsField.length //                   Прячем значения в поле Вместимость:
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
  };

  var setCapacityFieldValues = function () {
    if (roomsField.value < roomsField.length) {
      capacityField.value = roomsField.value;
    } else {
      capacityField.value = '0';
    }
    hideCapacityFieldValues();
  };

  var resetInvalidFieldStyle = function (field) {
    field.style.borderColor = '';
  };

  getAddress();
  setPriceFieldMinValues();
  setCapacityFieldValues();

  if (titleField) {
    titleField.addEventListener('invalid', onTitleFieldInvalid);

    titleField.addEventListener('focus', function () {
      resetInvalidFieldStyle(titleField);
    });

    titleField.addEventListener('blur', function () {
      titleField.checkValidity();
    });
  }

  if (priceField) {
    priceField.addEventListener('invalid', onPriceFieldInvalid);

    priceField.addEventListener('focus', function () {
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

  noticeForm.addEventListener('invalid', function (evt) {
    var invalidField = evt.target;
    invalidField.style.borderColor = 'red';
  }, true);

  submitButton.addEventListener('click', function () {
    if (noticeForm.checkValidity()) {
      noticeForm.submit();
    }
  });

  window.form = {
    isDisabled: toggleNoticeFormDisabled
  };
})();