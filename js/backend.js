'use strict';

(function () {
  var SERVER_URL = 'https://1510.dump.academy/keksobooking';

  var setup = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError(xhr.response);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 10000; // 10s

    return xhr;
  };

  // функция нажатия Esc при возникновении ошибки
  var onErrorEscPress = function (evt) {
    window.utils.isEscEvent(evt, function () {
      var errorDialog = document.querySelector('.error-dialog');
      document.body.removeChild(errorDialog);
      document.removeEventListener('keydown', onErrorEscPress);
    });
  };

  window.backend = {
    load: function (onLoad, onError) {
      var xhr = setup(onLoad, onError);

      xhr.open('GET', SERVER_URL + '/data');
      xhr.send();
    },
    save: function (data, onLoad, onError) {
      var xhr = setup(onLoad, onError);

      xhr.open('POST', SERVER_URL);
      xhr.send(data);
    },
    isError: function (errorMessage) {
      var errorDialog = document.createElement('div');
      errorDialog.classList.add('error-dialog');
      errorDialog.textContent = 'Произошка ошибка! ' + errorMessage + ', нажмите клавишу Escape для продолжения.';
      document.body.insertAdjacentElement('afterbegin', errorDialog);

      document.addEventListener('keydown', onErrorEscPress);
    }
  };
})();
