'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var avatarChooser = document.querySelector('#avatar');
  var avatarPreview = document.querySelector('.notice__preview  img');
  var imagesChooser = document.querySelector('#images');
  var photoContainer = document.querySelector('.form__photo-container');

  var onAvatarLoad = function () {
    var file = avatarChooser.files[0];
    window.utils.loadFile(file, FILE_TYPES, function (reader) {
      avatarPreview.src = reader.result;
    });
  };

  var loadPhotos = function (photos) {
    photos.forEach(function (photo) {
      window.utils.loadFile(photo, FILE_TYPES, function (reader) {
        var image = document.createElement('img');
        image.classList.add('form__photo');
        image.src = reader.result;
        photoContainer.appendChild(image);
      });
    });
  };

  avatarChooser.addEventListener('change', onAvatarLoad);
  imagesChooser.addEventListener('change', function () {
    var photos = [].map.call(imagesChooser.files, function (photo) {
      return photo;
    });
    loadPhotos(photos);
  });
})();
