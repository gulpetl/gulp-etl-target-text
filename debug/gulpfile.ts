let gulp = require('gulp')
import {targetText} from '../src/plugin'

import * as loglevel from 'loglevel'
const log = loglevel.getLogger('gulpfile')
log.setLevel((process.env.DEBUG_LEVEL || 'warn') as loglevel.LogLevelDesc)
// if needed, you can control the plugin's logging level separately from 'gulpfile' logging above
// const pluginLog = loglevel.getLogger(PLUGIN_NAME)
// pluginLog.setLevel('debug')

import * as rename from 'gulp-rename'
const errorHandler = require('gulp-error-handle'); // handle all errors in one handler, but still stop the stream if there are errors

const pkginfo = require('pkginfo')(module); // project package.json info into module.exports
const PLUGIN_NAME = module.exports.name;

import Vinyl = require('vinyl') 

let gulpBufferMode = false;

function switchToBuffer(callback: any) {
  gulpBufferMode = true;

  callback();
}
// works
// let template = `{
//   {{foreach(options.record)}}
//     "{{@key}}":"{{@this}}"
//     {{if(Object.keys(options.record)[Object.keys(options.record).length - 1] !== @key)}},{{/if}}
//   {{/foreach}}
// }`;

// let template = `{{{foreach(options.record)}}"{{@key}}":"{{@this}}",{{/foreach}}
// "entityAspect": {"entityState": "AddedOrModified","entityTypeName": "{{stream}}:#GinProServer2"}}`;

// doesn't work. on foreach, at all?
// let template = `{{{foreach(options.record)}}
// {{@../../this.values.length}}
// {{/foreach}}}`;

// let template = `{ carModel:"{{carModel}}", price:{{price}}, color:"{{color}}"}`;
// let template = `{ carModel:"{{record['carModel']}}", price:{{record['price']}}, color:"{{record['color']}}"}`; //works
let template = `{ model:"{{record.carModel}}", color:"{{record['color']}}", prc:{{record.price}}}`; //works

function runtargetCsv(callback: any) {
  log.info('gulp task starting for ' + PLUGIN_NAME)

  return gulp.src('../testdata/*.ndjson',{buffer:gulpBufferMode})
    .pipe(errorHandler(function(err:any) {
      log.error('Error: ' + err)
      callback(err)
    }))
    .on('data', function (file:Vinyl) {
      log.info('Starting processing on ' + file.basename)
    })   
    .pipe(targetText({template:template}))
    // rename back to ndjson, since that's what we are creating here
    .pipe(rename({
      extname: ".ndjson",
    }))      
    .pipe(gulp.dest('../testdata/processed'))
    .on('data', function (file:Vinyl) {
      log.info('Finished processing on ' + file.basename)
    })    
    .on('end', function () {
      log.info('gulp task complete')
      callback()
    })

}

export function csvStringifyWithoutGulp(callback: any) {

  const stringify = require('csv-stringify')
  const transform = require('stream-transform')
  const split = require('split2')

  var stringifier = stringify({});
  
  require('fs').createReadStream('../testdata/cars.ndjson', {encoding:"utf8"})
  .pipe(split()) // split the stream into individual lines
  .pipe(transform(function(dataLine:string) {
    // parse each text line into an object and return the record property
    const dataObj = JSON.parse(dataLine)
    return dataObj.record
  }))
  .pipe(stringifier)
  .on("data",(data:any)=>{
    console.log((data as Buffer).toString())
  });
  
}

exports.default = gulp.series(runtargetCsv)
exports.runtargetCsvBuffer = gulp.series(switchToBuffer, runtargetCsv)