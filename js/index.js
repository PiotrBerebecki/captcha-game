console.clear();


(function() {
  
  
  /* ======== MODEL (THE DATA USED BY THE APP) ======== */
  const model = {
    images: imageDatabase,
    imagesLength: null,
    imagesIndexesRemaining: null,
    imagesNext: null,
    roundsPerGame: 3,
    currentRound: 1,
  };  
  
  
  /* ======== CONTROLLER (THE LOGIC USED BY THE APP) ======== */
  const controller = {
    init: function() {
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

    resetImagesRemaining: function() {
      model.imagesIndexesRemaining = [];
      for (let i = 0; i < model.imagesLength; i++) {
        model.imagesIndexesRemaining.push(i);
      }
    },
    
    prepareNextImages: function() {
      const { imagesIndexesRemaining } = model;
      const nextImagesIndex = imagesIndexesRemaining[this.getRandomNumber(0, imagesIndexesRemaining.length - 1)];
      model.imagesNext = model.images[nextImagesIndex][`set${nextImagesIndex.toString()}`];
      this.shuffleArray(model.imagesNext);
      
      imagesIndexesRemaining.splice(imagesIndexesRemaining.indexOf(nextImagesIndex), 1);
      if (imagesIndexesRemaining.length === 0) {
        this.resetImagesRemaining();
      };
    },
    
    getRandomNumber: function(min, max) {
      return Math.floor(Math.random() * (max + 1 - min) + min);
    },
    
    shuffleArray: function(array) {
      for (let i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      return array;
    },
    
    preloadNextImages: function() {
      model.imagesNext.forEach(image => {
        let imageDummyElement = new Image();
        imageDummyElement.src = image.src;
      });
    },
    
    initGameplayScreen: function() {
      view.initGameplayScreen();
      this.nextRound();
    },
    
    nextRound: function(gameplayScreenContainerElement) {
      const { currentRound, imagesLength, roundsPerGame } = model;
       
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
    
    initFinishScreen: function() {
      view.initFinishScreen();
    },
    
    getNextImages: function() {
      const { imagesNext } = model;
      
      const nextMainImage = [imagesNext[0]];
      const nextGridImages = imagesNext.slice(1);
 
      return [nextMainImage, nextGridImages];
    }
  };
  
  
  /* ======== VIEW (THE LOGIC FOR INTERACTING WITH THE DOM) ======== */
  const view = {
    init: function() {
      this.root = document.getElementById('root');
      this.initStartScreen();
      // controller.initGameplayScreen();
    },
    
    animationDelay: 300,
    
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
    
    initStartScreen: function() {
      // Create start screen
      const startScreenContainerElement = document.createElement('div');
      startScreenContainerElement.id = 'start-screen-container';

      // Start screen message
      const startTextElement = document.createElement('p');
      startTextElement.innerHTML = 'Social Skills Hero';
      startScreenContainerElement.appendChild(startTextElement);

      // Start screen button
      const startButtonElement = document.createElement('div');
      startButtonElement.className = 'start-button';
      startButtonElement.textContent = 'Start the game';
      
      let wasButtonClicked = false;
      startButtonElement.addEventListener('click', event => {
        if (wasButtonClicked === false) {
          wasButtonClicked = true;
          this.showNextScreen(startScreenContainerElement, controller.initGameplayScreen); 
        }
      });
      startScreenContainerElement.appendChild(startButtonElement);
      
      this.root.appendChild(startScreenContainerElement);
      
      this.adjustTouch('start-button');
    },
    
    initGameplayScreen: function() {
      // Create wrapper divs for the main gameplay screen
      const gameplayScreenContainerElement = document.createElement('div');
      gameplayScreenContainerElement.id = 'gameplay-screen-container';
      const gameplayScreenElement = document.createElement('div');
      gameplayScreenElement.id = 'gameplay-screen';
      
      // Create Header
      const headerElement = document.createElement('header');
      const paragraphElement = document.createElement('p');
      paragraphElement.textContent = 'Try finding all images which show a situation similar to this one';

      headerElement.appendChild(paragraphElement);
      const mainImageContainerElement = document.createElement('div');
      mainImageContainerElement.id = 'main-image-container';
      const mainImageElement = document.createElement('img');
      mainImageElement.id = 'main-image';
      mainImageContainerElement.appendChild(mainImageElement);
      headerElement.appendChild(mainImageContainerElement);
      gameplayScreenElement.appendChild(headerElement);
      
      // Create header drop shadow
      const dropShadowElement = document.createElement('div');
      dropShadowElement.id = 'header-drop-shadow';
      gameplayScreenElement.appendChild(dropShadowElement);
      
      // Create Grid Images Container
      const gridImagesContainer = document.createElement('section');
      gridImagesContainer.id = 'grid-images-container';
      
      // Create 4 Grid Images
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
      
      // Create Footer
      const footerElement = document.createElement('footer');
      // Create Info Link
      const infoLinkElement = document.createElement('a');
      infoLinkElement.id = 'info-link';
      infoLinkElement.href = '#';
      const infoIconElement = document.createElement('i');
      infoIconElement.className = 'fa fa-info-circle';
      infoIconElement['aria-hidden'] = 'true';
      infoLinkElement.appendChild(infoIconElement);
      const linkTextElement = document.createElement('span');
      linkTextElement.textContent = 'About this app';
      infoLinkElement.appendChild(linkTextElement);
      footerElement.appendChild(infoLinkElement);
      // Create Next Button
      const nextButtonContainerElement = document.createElement('div');
      nextButtonContainerElement.id = 'next-button-container';
      const nextButtonElement = document.createElement('div');
      nextButtonElement.className = 'next-button';
      nextButtonElement.textContent = 'Next';
      
      let wasButtonClicked = false;
      nextButtonElement.addEventListener('click', event => {
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
      gameplayScreenContainerElement.style.opacity = 0;
      
      setTimeout(function() {
        gameplayScreenContainerElement.style.opacity = 1;
      }, this.animationDelay + 20);

      this.adjustTouch('next-button'); //  <-- Adjust styling for touch devices
    },

    
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
      setTimeout(function() {
        // Load main image
        mainImageElement.src = images[0][0].src;
        // Load grid images
        Array.prototype.forEach.call(gridImageElements, (gridImageElement, index) => {
          gridImageElement.src = images[1][index].src;
        });
      }, this.animationDelay);
      
      // Fade in all images
      setTimeout(function() {
        mainImageContainerElement.style.opacity = 1;
        gridImagesContainerElement.style.opacity = 1;
      }, this.animationDelay + 10);
      
    },
    
    initFinishScreen: function() {      
      // Create finish screen
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
      let wasButtonClicked = false;
      finishButtonElement.addEventListener('click', event => {
        if (wasButtonClicked === false) {
          wasButtonClicked = true;
          finishScreenContainerElement.style.opacity = 0;
          this.showNextScreen(finishScreenContainerElement, controller.initGameplayScreen);
        }
      });
      finishScreenContainerElement.appendChild(finishButtonElement);

      this.root.appendChild(finishScreenContainerElement);
      finishScreenContainerElement.style.opacity = 0;
      
      setTimeout(function() {
        finishScreenContainerElement.style.opacity = 1;
      }, this.animationDelay + 20);
      
      this.adjustTouch('finish-button');
    },
    
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
    
    adjustTouch: function(className) {
      // Tests if the user's device supports touch events
      const isTouch = !!('ontouchstart' in window) || window.navigator.msMaxTouchPoints > 0;
      // Adds CSS classes only for non-touch devices.
      // This prevents touch devices from having 
      // buttons stuck in the CSS hover state.
      if (!isTouch) {
        let element = document.getElementsByClassName(className)[0];
        element.classList.add(className + '-non-touch');
      }
    }

  };

  controller.init();
    
}());