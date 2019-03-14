'use strict';

module.exports = function(grunt) {
    // Required Sass task
    const sass = require('node-sass');
    // Show elapsed time after tasks run to visualize performance
    require('time-grunt')(grunt);
    // Load all Grunt tasks that are listed in package.json automagically
    require('load-grunt-tasks')(grunt);
    var log = function(err, stdout, stderr, cb) {
        if (stdout) {
            grunt.log.writeln(stdout);
        }
        if (stderr) {
            grunt.log.error(stderr);
        }
        cb();
    };
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // watch for files to change and run tasks when they do
        watch: {
            stylesheets: {
                files: ['_sass/**/*.{scss,sass}'],
                tasks: ['sass']
            }
        },

        // sass (libsass) config
        sass: {
            options: {
                implementation: sass,
                sourceMap: true,
                relativeAssets: false,
                outputStyle: 'expanded',
                sassDir: '_sass/',
                cssDir: 'source/css'
            },
            build: {
                files: [{
                    expand: true,
                    cwd: '_sass',
                    src: ['**/*.{scss,sass}'],
                    dest: 'source/css',
                    ext: '.css'
                }]
            }
        },

    });

    // Register the grunt serve task
    grunt.registerTask('style', [
      'sass',
      'watch'
    ]);


};
