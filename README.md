Simulation Steps
========
**Important Notes:**
	**- Supported only for Google Chrome browser**
	**- Optimise Performance of loading mosaic faster by reducing timePostfix value in preloader. Currently its value is set to clearly demonstrate in the UI that each row is displayed sequentially from top to bottom, and that when each row loads all its associated tiles display at the same time.**
  **- Composited photomosaic contains results of the original image in accordance with the specification, however tiles may not always be displayed in the correct representative position or colour depending on what image is loaded.**

* Running the App in Google Chrome. Click the button "Choose File" to upload an image. Wait for original image and associated photomosaic to be displayed.
```node server```

* Testing with Jasmine and ESLint
```eslint js/client.js js/mosaic.js js/singleton.js js/preloader.js js/deck_model.js js/deck_composite.js js/deck.js js/controller.js js/client.js```
```open SpecRunner.html```

Submission Checklist
========

- [x] **Initial App Setup**
	- Created Specification and Readme

- [x] **Setup ESLint and Config File**
```npm install --save eslint```
```eslint --init```
- [x] **Setup ES6 Promise Polyfill in Package.json using Gulpfile** (some browsers not support according to caniuse.com)**
- [x] **Clarification Questions/Assumptions** 
- [x] **Engineering Process Check**
	- [Canva Engineering Blog](https://engineering.canva.com/)
- [x] **JavaScript/CSS3/HTML5 Refactoring Check** 
	- [Mozilla JavaScript Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference)
- [x] **Readability Check**
	- Code Comments
	- Modularised
		- Composite Design Pattern (with DOM Interface Methods)
		- Singleton Design Pattern (with Utility and AJAX Interface Methods)
		- MVC
- [x] **Check No Libraries Included**
	- HTML5 Canva API only used
	- Promises with ES6 Polyfill added to Gulpfile
- [x] **Usability/Use Case Review - Cross Browser/Device**
	- Supported Browsers/Devices/Platforms:
		- Google Chrome only (not compatible with Firefox)
- [x] **Unit Testing Check**
- [x] **ESLint**
- [x] **Bugs/Issues**
	- Image tile colours and positions scattered on mosaic do not match the original image (i.e. black instead of white) due to problem processing preloader method (being passed each base64 images tile) 
- [x] **Submission**
	- FE your First Name, Last Name and YYMMDD (FELukeSchoen16____).