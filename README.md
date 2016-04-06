# coc-js

This repository will house javascript utility 'classes' used in our work. Currently, it contains `coc-swipe` - a swipe detection class for touch events in the browser.

## Usage

Require coc-swipe.js in your project with 
`var cocSwipe = require('/path/to/coc-swipe.js');`

## Dependencies

**coc-swipe** requires the **vec2** module from [gl-matrix](https://github.com/toji/gl-matrix).

## Building and Running

You will need **gulp** and **browserify** to build the example. After cloning the repo, install the dependencies with `npm install`.

Build the JS files for the example with `gulp build-example`. Then, open `./examples/index.html` in a browser. When emulating a mobile device or touch events, press and move the pointer around the canvas. The swipe direction will be printed in the console.

Alternatively, you can run `gulp serve` which will build and run the example using browsersync.
