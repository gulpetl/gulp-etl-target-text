# gulp-etl-target-text #

This plugin creates text files (including HTML, JSON, tweets, etc.) from **gulp-etl** **Message Stream** files; It is a **gulp-etl** wrapper for [squirrelly](https://squirrelly.js.org/).

**WARNING:** This is a very early-stage plugin; new features are being added and it is not yet stable. Check back in a few weeks to see what it can do!

This is a **[gulp-etl](https://gulpetl.com/)** plugin, and as such it is a [gulp](https://gulpjs.com/) plugin. **gulp-etl** plugins work with [ndjson](http://ndjson.org/) data streams/files which we call **Message Streams** and which are compliant with the [Singer specification](https://github.com/singer-io/getting-started/blob/master/docs/SPEC.md#output). Message Streams look like this:

``` ndjson
{"type":"RECORD","stream":"cars","record":{"carModel":"Audi","price":"10000","color":"blue"},"raw":"\"Audi\",10000,\"blue\"\n"}
{"type":"RECORD","stream":"cars","record":{"carModel":"BMW","price":"15000","color":"red"},"raw":"\"BMW\",15000,\"red\"\n"}
{"type":"RECORD","stream":"cars","record":{"carModel":"Mercedes","price":"20000","color":"yellow"},"raw":"\"Mercedes\",20000,\"yellow\"\n"}
{"type":"RECORD","stream":"cars","record":{"carModel":"Porsche","price":"30000","color":"green"},"raw":"\"Porsche\",30000,\"green\""}
```

## Usage ##

**gulp-etl** plugins accept a configObj as the first parameter; configObj
will contain any info the plugin needs. For this plugin configObj expects a "template" parameter to be passed to Squirrelly. The data/context object it requires
will be the current line of the Message Stream. Get started with [squirrelly](https://squirrelly.js.org) [here](https://squirrelly.js.org/docs/v7/first-template/).

### Sample gulpfile.js ###

``` javascript
var gulp = require('gulp')
var targetText = require('gulp-etl-target-text').targetText
var template = `{ model:"{{record.carModel}}", color:"{{record['color']}}", prc:{{record.price}}}`

exports.default = function() {
    return gulp.src('data/*.ndjson')
    .on('data', function (file) {
        console.log('Starting processing on ' + file.basename)
    })  
    .pipe(targetText({"template":template}))
    .on('data', function (file) {
        console.log('Done processing on ' + file.basename)
    })  
    .pipe(gulp.dest('data/'));
}
```

### Quick Start for Coding on This Plugin ###

* Dependencies:
* [git](https://git-scm.com/downloads)
* [nodejs](https://nodejs.org/en/download/releases/) - At least v6.3 (6.9 for Windows) required for TypeScript debugging
* npm (installs with Node)
* typescript - installed as a development dependency
* Clone this repo and run `npm install` to install npm packages
* Debug: with [VScode](https://code.visualstudio.com/download) use `Open Folder` to open the project folder, then hit F5 to debug. This runs without compiling to javascript using [ts-node](https://www.npmjs.com/package/ts-node)
* Test: `npm test` or `npm t`
* Compile to javascript: `npm run build`

### Testing ###

We are using [Jest](https://facebook.github.io/jest/docs/en/getting-started.html) for our testing. Each of our tests are in the `test` folder.

* Run `npm test` to run the test suites

Note: This document is written in [Markdown](https://daringfireball.net/projects/markdown/). We like to use [Typora](https://typora.io/) and [Markdown Preview Plus](https://chrome.google.com/webstore/detail/markdown-preview-plus/febilkbfcbhebfnokafefeacimjdckgl?hl=en-US) for our Markdown work..
