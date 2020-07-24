# Image Editor - Using HTML5 Canvas and Angular

This project is inspired to build Image editing tool using HTML5 Canvas API, Angular and
Angular Material for UI infrastructure and behaviour

# Requirements

This project requires
- `node v(10.15.1)` Javascript Runtime used to run javascript outside browser environment
- `npm v(6.4.1)` Node Package Manager for installing `node` packages
- `Angular CLI v(10.0.4)`
- Information regarding the packages can be found in `package.json` file. Make sure your local machine `typescript` version matches on `package.json` file

# Developing project on local machine

- Clone the codebase `git clone https://github.com/VictorChatterji/image-editor.git`
- Change the directory by `cd image-editor`
- Run `npm install`, which will install all dependencies of the angular project from npm
- Run `ng serve -o`. which will open localhost link in the default browser of IDE

# Author
- Victor Neerugatti


# Overview

- This project is still at developmental stage
- Features developed till date
    1. Fetch Images from remote server using Angular service and displaying in UI using Angular Material CDK Virtual Scrolling (Loading images on scrolling)
    2. Drag and drop images into `canvas` tag in a way to fit as per aspect ratio and blur sides
    3. Feature of changing the aspect ratio of `canvas`
    4. Ability to add text into the canvas and change text parameters (Fill/Stroke etc.,) still in development phase

