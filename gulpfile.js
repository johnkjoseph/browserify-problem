var gulp = require('gulp');
var babel = require('gulp-babel');
var useref = require('gulp-useref');
var inject = require('gulp-inject');
var changed = require('gulp-changed');
var browserify = require('browserify');
var babelify = require('babelify');
var source     = require('vinyl-source-stream');
var plumber = require('gulp-plumber');
var util = require('gulp-util');
var buffer = require('vinyl-buffer');
var babelpolyfill = require('babel-polyfill');


gulp.task('buildComponents', function() {

  var destDir = './dist';
  var rootDir = '';

  var bundleComponents = function(srcArray) {
    for(var i=0;i<srcArray.length;i++) {
      var sourceItem = srcArray[i];
      var fileName = sourceItem.file.split('/').pop();
      browserify(sourceItem.component+sourceItem.file,
        { debug: true ,paths: ['./'], standalone: 'standalone'})
        .add(require.resolve('babel-polyfill'))
        .transform(babelify, {presets: ['es2015']})
        .bundle()
        .on('error', util.log.bind(util, 'Browserify Error'))
        .pipe(source(fileName))
        .pipe(buffer())
        .pipe(gulp.dest(destDir+'/'+sourceItem.component+'/js'));

    };
  };
  bundleComponents([
    {'component' : 'es6-component','file' : '/test.js'},    
    {'component' : 'test','file' : '/test.js'}
  ]);
});

gulp.task('default', ['buildComponents']);