(function() {
  
  /** 
   * The app consists of three modules:
   * 1) Model - Represents the data
   * 2) Controller - Provides data to the view
   * 3) View - Displays the model data
   */
  
  
  /* ======================== Model ======================== */
  const model = {
    images: imageDatabase,
    imagesLength: null,
    imagesIndexesRemaining: null,
    imagesNext: null,
    roundsPerGame: 3,
    currentRound: 1,
  };
  
  
  /* ======================== Controller ======================== */
  const controller = {
    
    // Initialise the game
    init: function() {
      model.imagesLength = model.images.length;
      this.resetImagesRemaining();
      this.prepareNextImages();
      this.preloadNextImages();
      view.init();
    },
    
    // Reset the record of the images to start from the beginning
    resetImagesRemaining: function() {
      model.imagesIndexesRemaining = [];
      for (let i = 0; i < model.imagesLength; i++) {
        model.imagesIndexesRemaining.push(i);
      }
    },
    
    // Prepare the images that will be shown in the next round
    prepareNextImages: function() {
      const { imagesIndexesRemaining } = model;
      const nextImagesIndex = imagesIndexesRemaining[this.getRandomNumber(0, imagesIndexesRemaining.length - 1)];
      model.imagesNext = model.images[nextImagesIndex][`set${nextImagesIndex.toString()}`];
      this.shuffleArray(model.imagesNext);
      
      imagesIndexesRemaining.splice(imagesIndexesRemaining.indexOf(nextImagesIndex), 1);
      if (imagesIndexesRemaining.length === 0) {
        this.resetImagesRemaining();
      }
    },
    
    // Generate random number between min and max
    getRandomNumber: function(min, max) {
      return Math.floor(Math.random() * (max + 1 - min) + min);
    },
    
    // Shuffle array in place
    shuffleArray: function(array) {
      for (let i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      return array;
    },
    
    // Preload images for the next round to ensure faster rendering
    preloadNextImages: function() {
      model.imagesNext.forEach(image => {
        let imageDummyElement = new Image();
        imageDummyElement.src = image.src;
      });
    },
    
    // Initialise the first gameplay screen
    initGameplayScreen: function() {
      view.initGameplayScreen();
      this.nextRound();
    },
    
    // Logic for controlling next round
    nextRound: function(gameplayScreenContainerElement) {
      const { currentRound, imagesLength, roundsPerGame } = model;
      
      // Finish the game after a predefined number of rounds; or
      // show next round
      if (currentRound > roundsPerGame) {
        view.showNextScreen(gameplayScreenContainerElement, this.initFinishScreen);
        model.currentRound = 1;
      } else {
        view.showNextImages(this.getNextImages());
        model.currentRound = (currentRound + 1);
        this.prepareNextImages();
        this.preloadNextImages();
      }
    },
    
    // Initialise the finish screen
    initFinishScreen: function() {
      view.initFinishScreen();
    },
    
    // Get images for the next round
    getNextImages: function() {
      const { imagesNext } = model;
      
      const nextMainImage = [imagesNext[0]];
      const nextGridImages = imagesNext.slice(1);
      
      // Return one main image and four grid images
      return [nextMainImage, nextGridImages];
    }
  };
  
  
  /* ======================== View ======================== */
  const view = {
    
    // Initialise the first gameplay screen
    init: function() {
      this.root = document.getElementById('root');
      this.isMobileSafari = this.checkIfMobileSafari();
      this.initStartScreen();
      // controller.initGameplayScreen();
    },
    
    // Standard animation delay when changing the screens
    animationDelay: 300,
    
    // Smoothly switch to the next screen
    showNextScreen: function(elementToRemove, initNextScreen) {
      elementToRemove.style.opacity = 0;
      
      setTimeout(function() {
        if (this.root.childNodes[0] === elementToRemove) {
          this.root.removeChild(elementToRemove);
        }
      }, this.animationDelay);
      
      setTimeout(function() {
        initNextScreen.call(controller);
      }, this.animationDelay + 10);
    },
    
    // Initialise the start (welcome) screen
    initStartScreen: function() {
      // Create the DOM container for the start screen
      const startScreenContainerElement = document.createElement('div');
      startScreenContainerElement.id = 'start-screen-container';

      // Start screen welcome / title message
      const startTextElement = document.createElement('p');
      startTextElement.innerHTML = 'Social Skills Hero';
      startScreenContainerElement.appendChild(startTextElement);

      // Start screen start the game button
      const startButtonElement = document.createElement('div');
      startButtonElement.className = 'start-button';
      startButtonElement.textContent = 'Start the game';
      
      // Start the game on button click; and ensure
      // that only the first click is recorded
      let wasButtonClicked = false;
      startButtonElement.addEventListener('click', () => {
        if (wasButtonClicked === false) {
          wasButtonClicked = true;
          this.showNextScreen(startScreenContainerElement, controller.initGameplayScreen); 
        }
      });
      startScreenContainerElement.appendChild(startButtonElement);
      
      this.root.appendChild(startScreenContainerElement);
      
      // Adjust the styling of the start button for touch devices
      this.adjustTouch('start-button');
    },
    
    // Initialise the gameplay (round) screen
    initGameplayScreen: function() {
      // Create DOM wrapper divs for the main gameplay screen
      const gameplayScreenContainerElement = document.createElement('div');
      gameplayScreenContainerElement.id = 'gameplay-screen-container';
      
      const gameplayScreenElement = document.createElement('div');
      gameplayScreenElement.id = 'gameplay-screen';
      
      // Create the header that will hold instructions and the main image
      const headerElement = document.createElement('header');
      
      // Create instructions 
      const paragraphElement = document.createElement('p');
      paragraphElement.textContent = 'Try finding all images which show a situation similar to this one';
      headerElement.appendChild(paragraphElement);
      
      // Create main image
      const mainImageContainerElement = document.createElement('div');
      mainImageContainerElement.id = 'main-image-container';
      const mainImageElement = document.createElement('img');
      mainImageElement.id = 'main-image';
      mainImageContainerElement.appendChild(mainImageElement);
      headerElement.appendChild(mainImageContainerElement);
      gameplayScreenElement.appendChild(headerElement);
      
      // Create a drop shadow under the header
      const dropShadowElement = document.createElement('div');
      dropShadowElement.id = 'header-drop-shadow';
      gameplayScreenElement.appendChild(dropShadowElement);
      
      // Create a container for grid images
      const gridImagesContainer = document.createElement('section');
      gridImagesContainer.id = 'grid-images-container';
      
      // Create 4 grid images
      for (let i = 0; i < 4; i++) {
        let figureElement = document.createElement('figure');
        figureElement.className = 'grid-image-container';
        let inputElement = document.createElement('input');
        inputElement.type = 'checkbox';
        inputElement.id = 'checkbox' + i.toString();
        figureElement.appendChild(inputElement);
        let gridImageElement = document.createElement('img');
        gridImageElement.className = 'grid-image';
        figureElement.appendChild(gridImageElement);
        gridImagesContainer.appendChild(figureElement);
      }
      gameplayScreenElement.appendChild(gridImagesContainer);
      
      // Create the footer to hold the next button
      const footerElement = document.createElement('footer');

      // Create the next button
      const nextButtonContainerElement = document.createElement('div');
      nextButtonContainerElement.id = 'next-button-container';
      const nextButtonElement = document.createElement('div');
      nextButtonElement.className = 'next-button';
      nextButtonElement.textContent = 'Next';
      
      // Go the next screen on button click; and 
      // ensure that only the first click is recorded
      let wasButtonClicked = false;
      nextButtonElement.addEventListener('click', () => {
        if (wasButtonClicked === false) {
          wasButtonClicked = true;
          setTimeout(() => {
            wasButtonClicked = false;
          }, this.animationDelay + 10);
          this.processCheckboxes();
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
      setTimeout(function() {
        gameplayScreenContainerElement.style.opacity = 1;
      }, this.animationDelay + 20);
      
      // Adjust the height of the screen for Safari mobile
      this.adjustHeight(gameplayScreenContainerElement);

      // Adjust the styling of the next button for touch devices
      this.adjustTouch('next-button');
    },

    // Render next images
    showNextImages: function(images) {
      // Find DOM elements where images will be shown
      const mainImageElement = document.getElementById('main-image');
      const mainImageContainerElement = document.getElementById('main-image-container');
      const gridImagesContainerElement = document.getElementById('grid-images-container');
      const gridImageElements = document.getElementsByClassName('grid-image');
      
      // Fade out main image container
      mainImageContainerElement.style.opacity = 0;
      // Fade out grid images container
      gridImagesContainerElement.style.opacity = 0;
      
      // Load images
      setTimeout(() => {
        // Load main image
        mainImageElement.src = images[0][0].src;
        // Load grid images
        Array.prototype.forEach.call(gridImageElements, (gridImageElement, index) => {
          gridImageElement.src = images[1][index].src;
        });       
      }, this.animationDelay);
      
      // Fade in all images
      setTimeout(() => {
        mainImageContainerElement.style.opacity = 1;
        gridImagesContainerElement.style.opacity = 1;
      }, this.animationDelay + 10);
    },
    
    // Initialise the finish screen
    initFinishScreen: function() {      
      // Create the DOM container for the finish screen
      const finishScreenContainerElement = document.createElement('div');
      finishScreenContainerElement.id = 'finish-screen-container';
      finishScreenContainerElement.style.opacity = 0;

      // Finish screen message
      const finishTextElement = document.createElement('p');
      finishTextElement.className = 'finishMessage';
      finishTextElement.innerHTML = 'Thank you for playing <br>the Social Skills Hero';
      finishScreenContainerElement.appendChild(finishTextElement);
      
      // Finish screen graphic
      const finishGraphicElement = document.createElement('p');
      finishGraphicElement.className = 'graphic';
      finishGraphicElement.textContent = 'F';
      finishScreenContainerElement.appendChild(finishGraphicElement);
      
      // Finish screen button
      const finishButtonElement = document.createElement('div');
      finishButtonElement.className = 'finish-button';
      finishButtonElement.textContent = 'Play again';
      
      // Play again on button click; and ensure
      // that only the first click is recorded
      let wasButtonClicked = false;
      finishButtonElement.addEventListener('click', () => {
        if (wasButtonClicked === false) {
          wasButtonClicked = true;
          finishScreenContainerElement.style.opacity = 0;
          this.showNextScreen(finishScreenContainerElement, controller.initGameplayScreen);
        }
      });
      finishScreenContainerElement.appendChild(finishButtonElement);
      
      // Create a link to info about the app
      const infoLinkElement = document.createElement('a');
      infoLinkElement.id = 'info-link';
      infoLinkElement.href = 'https://github.com/PiotrBerebecki/captcha-game';
      infoLinkElement.target = '_blank';
      
      const infoIconElement = document.createElement('i');
      infoIconElement.className = 'fa fa-external-link';
      infoIconElement['aria-hidden'] = 'true';
      infoLinkElement.appendChild(infoIconElement);
      
      const linkTextElement = document.createElement('span');
      linkTextElement.textContent = 'About this app';
      infoLinkElement.appendChild(linkTextElement);     
      
      finishScreenContainerElement.appendChild(infoLinkElement);

      this.root.appendChild(finishScreenContainerElement);
      
      // Smoothly fade in the finish screen
      finishScreenContainerElement.style.opacity = 0;
      setTimeout(function() {
        finishScreenContainerElement.style.opacity = 1;
      }, this.animationDelay + 20);
      
      // Adjust the height of the screen for Safari mobile
      this.adjustHeight(finishScreenContainerElement);
      
      this.adjustTouch('finish-button');
    },
    
    // Process the checkboxes hidden on top of each grid image
    processCheckboxes: function() {
      const checkboxElements = document.querySelectorAll('input[type=checkbox]');
      
      for (let i = 0; i < checkboxElements.length; i++) {
        (function(iClosure, thisClosure) {
          setTimeout(function() {
            checkboxElements[iClosure].checked = false;
          }, thisClosure.animationDelay);
        }(i, this));
      }
    },
    
    // Check if the user is using mobile Safari
    // to later fix the Safari issue with 100vh
    // extending beyond the viewport
    checkIfMobileSafari: function() {
      const userAgent = navigator.userAgent;
      const iOS = !!userAgent.match(/iPad/i) || !!userAgent.match(/iPhone/i);
      const webkit = !!userAgent.match(/WebKit/i);
      const iOSSafari = iOS && webkit && !userAgent.match(/CriOS/i);
      return iOSSafari;
    },
    
    // Fix the Safari issue with 100vh
    // extending beyond the viewport
    adjustHeight: function(element) {
      if (this.isMobileSafari) {
        element.style.height = document.body.getBoundingClientRect().bottom - 60 + 'px';
      }
    },
    
    // Adjust styling for touch devices
    adjustTouch: function(className) {
      // Test if the user's device supports touch events
      const isTouch = !!('ontouchstart' in window) || window.navigator.msMaxTouchPoints > 0;
      // Add CSS classes only for non-touch devices.
      // This prevents touch devices from having 
      // buttons stuck in the CSS hover state.
      if (!isTouch) {
        let element = document.getElementsByClassName(className)[0];
        element.classList.add(className + '-non-touch');
      }
    }

  };

  // Initialise the whole app
  controller.init();
    
}());
