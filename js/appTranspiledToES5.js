'use strict';

(function () {

  /** 
   * The app consists of three modules:
   * 1) Model - Represents the data
   * 2) Controller - Provides data to the view
   * 3) View - Displays the model data
   */

  /* ======================== Model ======================== */
  var model = {
    images: imageDatabase,
    imagesLength: null,
    imagesIndexesRemaining: null,
    imagesNext: null,
    roundsPerGame: 3,
    currentRound: 1
  };

  /* ======================== Controller ======================== */
  var controller = {

    // Initialise the game
    init: function init() {
      model.imagesLength = model.images.length;
      this.resetImagesRemaining();
      this.prepareNextImages();
      this.preloadNextImages();
      view.init();
    },

    // Reset the record of the images to start from the beginning
    resetImagesRemaining: function resetImagesRemaining() {
      model.imagesIndexesRemaining = [];
      for (var i = 0; i < model.imagesLength; i++) {
        model.imagesIndexesRemaining.push(i);
      }
    },

    // Prepare the images that will be shown in the next round
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

    // Generate random number between min and max
    getRandomNumber: function getRandomNumber(min, max) {
      return Math.floor(Math.random() * (max + 1 - min) + min);
    },

    // Shuffle array in place
    shuffleArray: function shuffleArray(array) {
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      return array;
    },

    // Preload images for the next round to ensure faster rendering
    preloadNextImages: function preloadNextImages() {
      model.imagesNext.forEach(function (image) {
        var imageDummyElement = new Image();
        imageDummyElement.src = image.src;
      });
    },

    // Initialise the first gameplay screen
    initGameplayScreen: function initGameplayScreen() {
      view.initGameplayScreen();
      this.nextRound();
    },

    // Logic for controlling next round
    nextRound: function nextRound(gameplayScreenContainerElement) {
      var currentRound = model.currentRound,
          imagesLength = model.imagesLength,
          roundsPerGame = model.roundsPerGame;

      // Finish the game after a predefined number of rounds; or
      // show next round

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

    // Initialise the finish screen
    initFinishScreen: function initFinishScreen() {
      view.initFinishScreen();
    },

    // Get images for the next round
    getNextImages: function getNextImages() {
      var imagesNext = model.imagesNext;


      var nextMainImage = [imagesNext[0]];
      var nextGridImages = imagesNext.slice(1);

      // Return one main image and four grid images
      return [nextMainImage, nextGridImages];
    }
  };

  /* ======================== View ======================== */
  var view = {

    // Initialise the first gameplay screen
    init: function init() {
      this.root = document.getElementById('root');
      this.initStartScreen();
      // controller.initGameplayScreen();
    },

    // Standard animation delay when changing the screens
    animationDelay: 300,

    // Smoothly switch to the next screen
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

    // Initialise the start (welcome) screen
    initStartScreen: function initStartScreen() {
      var _this = this;

      // Create the DOM container for the start screen
      var startScreenContainerElement = document.createElement('div');
      startScreenContainerElement.id = 'start-screen-container';

      // Start screen welcome / title message
      var startTextElement = document.createElement('p');
      startTextElement.innerHTML = 'Social Skills Hero';
      startScreenContainerElement.appendChild(startTextElement);

      // Start screen start the game button
      var startButtonElement = document.createElement('div');
      startButtonElement.className = 'start-button';
      startButtonElement.textContent = 'Start the game';

      // Start the game on button click; and ensure
      // that only the first click is recorded
      var wasButtonClicked = false;
      startButtonElement.addEventListener('click', function () {
        if (wasButtonClicked === false) {
          wasButtonClicked = true;
          _this.showNextScreen(startScreenContainerElement, controller.initGameplayScreen);
        }
      });
      startScreenContainerElement.appendChild(startButtonElement);

      this.root.appendChild(startScreenContainerElement);

      // Adjust the styling of the start button for touch devices
      this.adjustTouch('start-button');
    },

    // Initialise the gameplay (round) screen
    initGameplayScreen: function initGameplayScreen() {
      var _this2 = this;

      // Create DOM wrapper divs for the main gameplay screen
      var gameplayScreenContainerElement = document.createElement('div');
      gameplayScreenContainerElement.id = 'gameplay-screen-container';
      var gameplayScreenElement = document.createElement('div');
      gameplayScreenElement.id = 'gameplay-screen';

      // Create the header that will hold instructions and the main image
      var headerElement = document.createElement('header');

      // Create instructions 
      var paragraphElement = document.createElement('p');
      paragraphElement.textContent = 'Try finding all images which show a situation similar to this one';
      headerElement.appendChild(paragraphElement);

      // Create main image
      var mainImageContainerElement = document.createElement('div');
      mainImageContainerElement.id = 'main-image-container';
      var mainImageElement = document.createElement('img');
      mainImageElement.id = 'main-image';
      mainImageContainerElement.appendChild(mainImageElement);
      headerElement.appendChild(mainImageContainerElement);
      gameplayScreenElement.appendChild(headerElement);

      // Create a drop shadow under the header
      var dropShadowElement = document.createElement('div');
      dropShadowElement.id = 'header-drop-shadow';
      gameplayScreenElement.appendChild(dropShadowElement);

      // Create a container for grid images
      var gridImagesContainer = document.createElement('section');
      gridImagesContainer.id = 'grid-images-container';

      // Create 4 grid images
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

      // Create the footer to hold the next button
      var footerElement = document.createElement('footer');

      // Create the next button
      var nextButtonContainerElement = document.createElement('div');
      nextButtonContainerElement.id = 'next-button-container';
      var nextButtonElement = document.createElement('div');
      nextButtonElement.className = 'next-button';
      nextButtonElement.textContent = 'Next';

      // Go the next screen on button click; and 
      // ensure that only the first click is recorded
      var wasButtonClicked = false;
      nextButtonElement.addEventListener('click', function () {
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

      // Smoothly fade in the gameplay screen
      gameplayScreenContainerElement.style.opacity = 0;
      setTimeout(function () {
        gameplayScreenContainerElement.style.opacity = 1;
      }, this.animationDelay + 20);

      // Adjust the styling of the next button for touch devices
      this.adjustTouch('next-button');
    },

    // Render next images
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

    // Initialise the finish screen
    initFinishScreen: function initFinishScreen() {
      var _this3 = this;

      // Create the DOM container for the finish screen
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

      // Play again on button click; and ensure
      // that only the first click is recorded
      var wasButtonClicked = false;
      finishButtonElement.addEventListener('click', function () {
        if (wasButtonClicked === false) {
          wasButtonClicked = true;
          finishScreenContainerElement.style.opacity = 0;
          _this3.showNextScreen(finishScreenContainerElement, controller.initGameplayScreen);
        }
      });
      finishScreenContainerElement.appendChild(finishButtonElement);

      // Create a link to info about the app
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

      // Smoothly fade in the finish screen
      finishScreenContainerElement.style.opacity = 0;
      setTimeout(function () {
        finishScreenContainerElement.style.opacity = 1;
      }, this.animationDelay + 20);

      this.adjustTouch('finish-button');
    },

    // Process the checkboxes hidden on top of each grid image
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

    // Adjust styling for touch devices
    adjustTouch: function adjustTouch(className) {
      // Test if the user's device supports touch events
      var isTouch = !!('ontouchstart' in window) || window.navigator.msMaxTouchPoints > 0;
      // Add CSS classes only for non-touch devices.
      // This prevents touch devices from having 
      // buttons stuck in the CSS hover state.
      if (!isTouch) {
        var element = document.getElementsByClassName(className)[0];
        element.classList.add(className + '-non-touch');
      }
    }

  };

  // Initialise the whole app
  controller.init();
})();
