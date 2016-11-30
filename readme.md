# Social Skills Hero

Live version: https://piotrberebecki.github.io/social-skills-hero/

<img src="./assets/github/social-skills-hero-screencast.gif" width="275px" height="auto">

### The principles behind the app
---

* Children, teenagers and adolescents with autism and asperger syndrome often have difficulty recognising emotions in social situations. They often miss the body language or facial cues that other people rely on to gauge the moods of others, or even of themselves. As a result, inappropriate responses to situations may occur, for example, laughing or giggling when someone is hurt or upset.
* Social Skills Hero is a non-competitive app which allows the user to train in identifying and reacting to different social situations.
* Currently the app covers skills such as: sharing, companionship, empathy, selflessness, kindness, turn-taking, participating, engagement, ability to compromise, teamwork, respecting personal space. More skills will be added in future.

### Development technologies and techniques
---

* Vanilla JavaScript and pure CSS - All front-end layout has been hand-crafted. Only the fonts have been sourced from external libraries.
* Model-View-Controller (MVC) design pattern - The data used by the app is maintained by the `Model`. The user interface is specified in the `View`. App's logic is managed by the `Controller`.
* Image preloading - Images that will be displayed on the next screen are preloaded to ensure a smoother user experience.
* Material design - The principles of material design have been followed in order to improve accessibility and usability.
* ES6 - At the production stage effort was made to use the latest features of the JavaScript language. This includes for example: [let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) and [const](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const); [arrow functions](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions); [destructuring assignment](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment). At the deployment stage the ES6 code has been transpiled down to ES5 to ensure better cross-browser compatibility.
* Comments - Leaving descriptive comments is a good practice in the long run so JavaScript source code includes comments which explain functions and methods used in the app. This will make the app easier to maintain by the author or the open-source contributors.

### Running the app in your local environment
---

Clone the repository
```
$ git clone https://github.com/PiotrBerebecki/social-skills-hero.git
$ cd social-skills-hero
```
Open the `index.html` file in your browser
