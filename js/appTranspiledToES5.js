'use strict';

console.clear();

(function () {

  /* ======== MODEL (THE DATA USED BY THE APP) ======== */
  var model = {
    images: imageDatabase,
    imagesLength: null,
    imagesIndexesRemaining: null,
    imagesNext: null,
    roundsPerGame: 3,
    currentRound: 1
  };

  /* ======== CONTROLLER (THE LOGIC USED BY THE APP) ======== */
  var controller = {
    init: function init() {
      model.imagesLength = model.images.length;
      this.resetImagesRemaining();
      this.prepareNextImages();
      this.preloadNextImages();
      view.init();
      // console.log(
      //   'Is length of image array correct?', 
      //    Number.isInteger(model.imagesLength / model.roundsPerGame)
      // );
    },

    resetImagesRemaining: function resetImagesRemaining() {
      model.imagesIndexesRemaining = [];
      for (var i = 0; i < model.imagesLength; i++) {
        model.imagesIndexesRemaining.push(i);
      }
    },

    prepareNextImages: function prepareNextImages() {
      var imagesIndexesRemaining = model.imagesIndexesRemaining;

      var nextImagesIndex = imagesIndexesRemaining[this.getRandomNumber(0, imagesIndexesRemaining.length - 1)];
      model.imagesNext = model.images[nextImagesIndex]['set' + nextImagesIndex.toString()];
      this.shuffleArray(model.imagesNext);

      imagesIndexesRemaining.splice(imagesIndexesRemaining.indexOf(nextImagesIndex), 1);
      if (imagesIndexesRemaining.length === 0) {
        this.resetImagesRemaining();
      }
    },

    getRandomNumber: function getRandomNumber(min, max) {
      return Math.floor(Math.random() * (max + 1 - min) + min);
    },

    shuffleArray: function shuffleArray(array) {
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      return array;
    },

    preloadNextImages: function preloadNextImages() {
      model.imagesNext.forEach(function (image) {
        var imageDummyElement = new Image();
        imageDummyElement.src = image.src;
      });
    },

    initGameplayScreen: function initGameplayScreen() {
      view.initGameplayScreen();
      this.nextRound();
    },

    nextRound: function nextRound(gameplayScreenContainerElement) {
      var currentRound = model.currentRound,
          imagesLength = model.imagesLength,
          roundsPerGame = model.roundsPerGame;


      if (currentRound > roundsPerGame) {
        view.showNextScreen(gameplayScreenContainerElement, this.initFinishScreen);
        model.currentRound = 1;
      } else {
        view.showNextImages(this.getNextImages());
        model.currentRound = currentRound + 1;
        this.prepareNextImages();
        this.preloadNextImages();
      }
    },

    initFinishScreen: function initFinishScreen() {
      view.initFinishScreen();
    },

    getNextImages: function getNextImages() {
      var imagesNext = model.imagesNext;


      var nextMainImage = [imagesNext[0]];
      var nextGridImages = imagesNext.slice(1);

      return [nextMainImage, nextGridImages];
    }
  };

  /* ======== VIEW (THE LOGIC FOR INTERACTING WITH THE DOM) ======== */
  var view = {
    init: function init() {
      this.root = document.getElementById('root');
      this.initStartScreen();
      // controller.initGameplayScreen();
    },

    animationDelay: 300,

    showNextScreen: function showNextScreen(elementToRemove, initNextScreen) {
      elementToRemove.style.opacity = 0;

      setTimeout(function () {
        if (this.root.childNodes[0] === elementToRemove) {
          this.root.removeChild(elementToRemove);
        }
      }, this.animationDelay);

      setTimeout(function () {
        initNextScreen.call(controller);
      }, this.animationDelay + 10);
    },

    initStartScreen: function initStartScreen() {
      var _this = this;

      // Create start screen
      var startScreenContainerElement = document.createElement('div');
      startScreenContainerElement.id = 'start-screen-container';

      // Start screen message
      var startTextElement = document.createElement('p');
      startTextElement.innerHTML = 'Social Skills Hero';
      startScreenContainerElement.appendChild(startTextElement);

      // Start screen button
      var startButtonElement = document.createElement('div');
      startButtonElement.className = 'start-button';
      startButtonElement.textContent = 'Start the game';

      var wasButtonClicked = false;
      startButtonElement.addEventListener('click', function (event) {
        if (wasButtonClicked === false) {
          wasButtonClicked = true;
          _this.showNextScreen(startScreenContainerElement, controller.initGameplayScreen);
        }
      });
      startScreenContainerElement.appendChild(startButtonElement);

      this.root.appendChild(startScreenContainerElement);

      this.adjustTouch('start-button');
    },

    initGameplayScreen: function initGameplayScreen() {
      var _this2 = this;

      // Create wrapper divs for the main gameplay screen
      var gameplayScreenContainerElement = document.createElement('div');
      gameplayScreenContainerElement.id = 'gameplay-screen-container';
      var gameplayScreenElement = document.createElement('div');
      gameplayScreenElement.id = 'gameplay-screen';

      // Create Header
      var headerElement = document.createElement('header');
      var paragraphElement = document.createElement('p');
      paragraphElement.textContent = 'Try finding all images which show a situation similar to this one';

      headerElement.appendChild(paragraphElement);
      var mainImageContainerElement = document.createElement('div');
      mainImageContainerElement.id = 'main-image-container';
      var mainImageElement = document.createElement('img');
      mainImageElement.id = 'main-image';
      mainImageContainerElement.appendChild(mainImageElement);
      headerElement.appendChild(mainImageContainerElement);
      gameplayScreenElement.appendChild(headerElement);

      // Create header drop shadow
      var dropShadowElement = document.createElement('div');
      dropShadowElement.id = 'header-drop-shadow';
      gameplayScreenElement.appendChild(dropShadowElement);

      // Create Grid Images Container
      var gridImagesContainer = document.createElement('section');
      gridImagesContainer.id = 'grid-images-container';

      // Create 4 Grid Images
      for (var i = 0; i < 4; i++) {
        var figureElement = document.createElement('figure');
        figureElement.className = 'grid-image-container';
        var inputElement = document.createElement('input');
        inputElement.type = 'checkbox';
        inputElement.id = 'checkbox' + i.toString();
        figureElement.appendChild(inputElement);
        var gridImageElement = document.createElement('img');
        gridImageElement.className = 'grid-image';
        figureElement.appendChild(gridImageElement);
        gridImagesContainer.appendChild(figureElement);
      }
      gameplayScreenElement.appendChild(gridImagesContainer);

      // Create Footer
      var footerElement = document.createElement('footer');

      // Create Next Button
      var nextButtonContainerElement = document.createElement('div');
      nextButtonContainerElement.id = 'next-button-container';
      var nextButtonElement = document.createElement('div');
      nextButtonElement.className = 'next-button';
      nextButtonElement.textContent = 'Next';

      var wasButtonClicked = false;
      nextButtonElement.addEventListener('click', function (event) {
        if (wasButtonClicked === false) {
          wasButtonClicked = true;
          setTimeout(function () {
            wasButtonClicked = false;
          }, _this2.animationDelay + 10);
          _this2.processCheckboxes();
          controller.nextRound(gameplayScreenContainerElement);
        }
      });

      nextButtonContainerElement.appendChild(nextButtonElement);
      footerElement.appendChild(nextButtonContainerElement);
      gameplayScreenElement.appendChild(footerElement);

      // Append the main elements to the DOM
      gameplayScreenContainerElement.appendChild(gameplayScreenElement);

      this.root.appendChild(gameplayScreenContainerElement);
      gameplayScreenContainerElement.style.opacity = 0;

      setTimeout(function () {
        gameplayScreenContainerElement.style.opacity = 1;
      }, this.animationDelay + 20);

      this.adjustTouch('next-button'); //  <-- Adjust styling for touch devices
    },

    showNextImages: function showNextImages(images) {
      // Find DOM elements where images will be shown
      var mainImageElement = document.getElementById('main-image');
      var mainImageContainerElement = document.getElementById('main-image-container');
      var gridImagesContainerElement = document.getElementById('grid-images-container');
      var gridImageElements = document.getElementsByClassName('grid-image');

      // Fade out main image container
      mainImageContainerElement.style.opacity = 0;
      // Fade out grid images container
      gridImagesContainerElement.style.opacity = 0;

      // Load images
      setTimeout(function () {
        // Load main image
        mainImageElement.src = images[0][0].src;
        // Load grid images
        Array.prototype.forEach.call(gridImageElements, function (gridImageElement, index) {
          gridImageElement.src = images[1][index].src;
        });
      }, this.animationDelay);

      // Fade in all images
      setTimeout(function () {
        mainImageContainerElement.style.opacity = 1;
        gridImagesContainerElement.style.opacity = 1;
      }, this.animationDelay + 10);
    },

    initFinishScreen: function initFinishScreen() {
      var _this3 = this;

      // Create finish screen
      var finishScreenContainerElement = document.createElement('div');
      finishScreenContainerElement.id = 'finish-screen-container';
      finishScreenContainerElement.style.opacity = 0;

      // Finish screen message
      var finishTextElement = document.createElement('p');
      finishTextElement.className = 'finishMessage';
      finishTextElement.innerHTML = 'Thank you for playing <br>the Social Skills Hero';
      finishScreenContainerElement.appendChild(finishTextElement);

      // Finish screen graphic
      var finishGraphicElement = document.createElement('p');
      finishGraphicElement.className = 'graphic';
      finishGraphicElement.textContent = 'F';
      finishScreenContainerElement.appendChild(finishGraphicElement);

      // Finish screen button
      var finishButtonElement = document.createElement('div');
      finishButtonElement.className = 'finish-button';
      finishButtonElement.textContent = 'Play again';
      var wasButtonClicked = false;
      finishButtonElement.addEventListener('click', function (event) {
        if (wasButtonClicked === false) {
          wasButtonClicked = true;
          finishScreenContainerElement.style.opacity = 0;
          _this3.showNextScreen(finishScreenContainerElement, controller.initGameplayScreen);
        }
      });
      finishScreenContainerElement.appendChild(finishButtonElement);

      // Create Info Link
      var infoLinkElement = document.createElement('a');
      infoLinkElement.id = 'info-link';
      infoLinkElement.href = 'https://github.com/PiotrBerebecki/captcha-game';
      infoLinkElement.target = '_blank';

      var infoIconElement = document.createElement('i');
      infoIconElement.className = 'fa fa-external-link';
      infoIconElement['aria-hidden'] = 'true';
      infoLinkElement.appendChild(infoIconElement);

      var linkTextElement = document.createElement('span');
      linkTextElement.textContent = 'About this app';
      infoLinkElement.appendChild(linkTextElement);

      finishScreenContainerElement.appendChild(infoLinkElement);

      this.root.appendChild(finishScreenContainerElement);
      finishScreenContainerElement.style.opacity = 0;

      setTimeout(function () {
        finishScreenContainerElement.style.opacity = 1;
      }, this.animationDelay + 20);

      this.adjustTouch('finish-button');
    },

    processCheckboxes: function processCheckboxes() {
      var checkboxElements = document.querySelectorAll('input[type=checkbox]');

      for (var i = 0; i < checkboxElements.length; i++) {
        (function (iClosure, thisClosure) {
          setTimeout(function () {
            checkboxElements[iClosure].checked = false;
          }, thisClosure.animationDelay);
        })(i, this);
      }
    },

    adjustTouch: function adjustTouch(className) {
      // Tests if the user's device supports touch events
      var isTouch = !!('ontouchstart' in window) || window.navigator.msMaxTouchPoints > 0;
      // Adds CSS classes only for non-touch devices.
      // This prevents touch devices from having 
      // buttons stuck in the CSS hover state.
      if (!isTouch) {
        var element = document.getElementsByClassName(className)[0];
        element.classList.add(className + '-non-touch');
      }
    }

  };

  controller.init();
})();
