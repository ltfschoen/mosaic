Simulation Steps
========
**Important Note: Supported only in Google Chrome**
	
* Running the App in Google Chrome
```node server```

* Testing with Jasmine and ESLint
```eslint js/client.js js/mosaic.js js/singleton.js js/preloader.js js/deck_model.js js/deck_composite.js js/deck.js js/controller.js js/client.js```
```open SpecRunner.html```

Submission Checklist
========

- [x] **Initial App Setup**
	- Created Specification and Readme
- [x] Setup ESLint and Config File
```npm install --save eslint```
```eslint --init```
- [x] Setup ES6 Promise Polyfill in Package.json using Gulpfile (some browsers not support according to caniuse.com)
```npm install es6-promise --save```
```npm install```
```npm install gulp --save```
```npm install gulp-file --save```
```gulp```
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
- [x] **Unit Testing Check
- [x] **ESLint**
- [x] **Bugs/Issues**
	- Image tile colours and positions scattered on mosaic do not match the original image (i.e. black instead of white) due to problem processing preloader method (being passed each base64 images tile) 
- [ ] **Submission**
	- FE your First Name, Last Name and YYMMDD (FELukeSchoen16____).