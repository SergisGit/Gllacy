var popupOverlay = document.querySelector('.popup-overlay'),
  hiddenForm = document.querySelector('.hidden-form'),
  divMap = document.querySelector('.map');

// Yandex Map
if (divMap) {

  ymaps.ready(init);
  var myMap,
    myPlacemark;

  function init() {
    myMap = new ymaps.Map("map", {
      center: [59.939341672682204, 30.32883931838468],
      zoom: 16
    });
    myMap.behaviors.disable('scrollZoom');
    myMap.controls.add(
      new ymaps.control.ZoomControl()
    );
    myMap.controls.add(
      new ymaps.control.FullscreenControl({
        options: {
          floatIndex: 2,
          float: "left"
        }
      })
    );
    myMap.controls.add(
      new ymaps.control.GeolocationControl({
        options: {
          floatIndex: 1,
          float: "left"
        }
      })
    );
    myMap.controls.add(
      new ymaps.control.TrafficControl(), {
        float: "none",
        position: {
          top: 10,
          left: 250
        }
      }
    );
    myPlacemark = new ymaps.Placemark([59.938662169970215, 30.323054972279827], {
      hintContent: 'г. Санкт-Петербург, ул. Б. Конюшенная, д. 19/8',
    }, {
      iconLayout: 'default#image',
      iconImageHref: './img/map-marker.png',
      iconImageSize: [218, 142],
      iconImageOffset: [-38, -140]
    });
    myMap.geoObjects.add(myPlacemark);
  }
}

//feedback-form popup
if (hiddenForm) {
  var feedbackBtn = document.querySelector('.feedback-btn'),
    contactName = hiddenForm.querySelector('#contact-name'),
    close = document.querySelector('.close-btn');

  feedbackBtn.addEventListener('click', function (event) {
    event.preventDefault();
    popupOverlay.classList.add('popup-overlay-showed');
    hiddenForm.classList.add('hidden-form-animation');
    setTimeout(function () { //ie, edge fix cursor bug
      contactName.focus();
    }, 600);
  });

  // Закрытие формы по нажатию на Esc
  window.addEventListener('keydown', function (event) {
    if (event.keyCode === 27 && hiddenForm.classList.contains('hidden-form-animation')) {
      hiddenForm.classList.remove('hidden-form-animation');
      popupOverlay.classList.remove('popup-overlay-showed');
    }
  });

  // Закрытие формы входа по клику вне формы или на крестик
  document.addEventListener('click', function (event) {
    if (hiddenForm.classList.contains('hidden-form-animation') && (event.target == popupOverlay || event.target == close)) {
      hiddenForm.classList.remove('hidden-form-animation');
      popupOverlay.classList.remove('popup-overlay-showed');
    }
  });
}

//catalog price scale
if (document.querySelector('.filter-price')) {

  var slider = document.getElementById('filter-range');
  var filterScale = document.querySelector('.filter-scale');
  var inputMin = document.getElementById('filter-price-min');
  var inputMax = document.getElementById('filter-price-max');
  var inputs = [inputMin, inputMax];

  filterScale.classList.add('hide-block');

  noUiSlider.create(slider, {
    start: [100, 500],
    connect: true,
    step: 1,
    range: {
      'min': 0,
      'max': 700
    },
    format: wNumb({
      decimals: 0
    })
  });

  slider.noUiSlider.on('update', function (values, handle) {
    inputs[handle].value = values[handle];
  });

  function setSliderHandle(i, value) {
    var r = [null, null];
    r[i] = value;
    slider.noUiSlider.set(r);
  }

  // Listen to keydown events on the input field.
  inputs.forEach(function (input, handle) {

    input.addEventListener('change', function () {
      setSliderHandle(handle, this.value);
    });

    input.addEventListener('keydown', function (e) {

      var values = slider.noUiSlider.get();
      var value = Number(values[handle]);

      // [[handle0_down, handle0_up], [handle1_down, handle1_up]]
      var steps = slider.noUiSlider.steps();

      // [down, up]
      var step = steps[handle];

      var position;

      // 13 is enter,
      // 38 is key up,
      // 40 is key down.
      switch (e.which) {

        case 13:
          setSliderHandle(handle, this.value);
          e.preventDefault();
          break;

        case 38:

          // Get step to go increase slider value (up)
          position = step[1];

          // false = no step is set
          if (position === false) {
            position = 1;
          }

          // null = edge of slider
          if (position !== null) {
            setSliderHandle(handle, value + position);
          }

          break;

        case 40:

          position = step[0];

          if (position === false) {
            position = 1;
          }

          if (position !== null) {
            setSliderHandle(handle, value - position);
          }
          break;
      }
    });
  });
}