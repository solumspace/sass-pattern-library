'use strict';

module.exports = function(grunt) {
	// Required Sass task
	const sass = require('node-sass');

	var path = require('path'),
		argv = require('minimist')(process.argv.slice(2));


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

	/******************************************************
	 * PATTERN LAB CONFIGURATION
	 ******************************************************/

	//read all paths from our namespaced config file
	var config = require('./patternlab-config.json'),
		pl = require('patternlab-node')(config);

	function paths() {
		return config.paths;
	}

	function getConfiguredCleanOption() {
		return config.cleanPublic;
	}

	grunt.registerTask('patternlab', 'create design systems with atomic design', function(arg) {

		if (arguments.length === 0) {
			pl.build(function() {}, getConfiguredCleanOption());
		}

		if (arg && arg === 'version') {
			pl.version();
		}

		if (arg && arg === "patternsonly") {
			pl.patternsonly(function() {}, getConfiguredCleanOption());
		}

		if (arg && arg === "help") {
			pl.help();
		}

		if (arg && arg === "liststarterkits") {
			pl.liststarterkits();
		}

		if (arg && arg === "loadstarterkit") {
			pl.loadstarterkit(argv.kit, argv.clean);
		}

		if (arg && (arg !== "version" && arg !== "patternsonly" && arg !== "help" && arg !== "liststarterkits" && arg !== "loadstarterkit")) {
			pl.help();
		}
	});


	grunt.initConfig({

		/******************************************************
		 * COPY TASKS
		 ******************************************************/
		copy: {
			main: {
				files: [{
						expand: true,
						cwd: path.resolve(paths().source.js),
						src: '**/*.js',
						dest: path.resolve(paths().public.js)
					},
					{
						expand: true,
						cwd: path.resolve(paths().source.js),
						src: '**/*.js.map',
						dest: path.resolve(paths().public.js)
					},
					{
						expand: true,
						cwd: path.resolve(paths().source.css),
						src: '**/*.css',
						dest: path.resolve(paths().public.css)
					},
					{
						expand: true,
						cwd: path.resolve(paths().source.css),
						src: '**/*.css.map',
						dest: path.resolve(paths().public.css)
					},
					{
						expand: true,
						cwd: path.resolve(paths().source.images),
						src: '**/*',
						dest: path.resolve(paths().public.images)
					},
					{
						expand: true,
						cwd: path.resolve(paths().source.fonts),
						src: '**/*',
						dest: path.resolve(paths().public.fonts)
					},
					{
						expand: true,
						cwd: path.resolve(paths().source.root),
						src: 'favicon.ico',
						dest: path.resolve(paths().public.root)
					},
					{
						expand: true,
						cwd: path.resolve(paths().source.styleguide),
						src: ['*', '**'],
						dest: path.resolve(paths().public.root)
					},
					// slightly inefficient to do this again - I am not a grunt glob master. someone fix
					{
						expand: true,
						flatten: true,
						cwd: path.resolve(paths().source.styleguide, 'styleguide', 'css', 'custom'),
						src: '*.css)',
						dest: path.resolve(paths().public.styleguide, 'css')
					}
				]
			}
		},
		/******************************************************
		 * SERVER AND WATCH TASKS
		 ******************************************************/
		watch: {
			stylesheets: {
                files: ['_sass/**/*.{scss,sass}'],
                tasks: ['sass']
            },
			all: {
				files: [
					path.resolve(paths().source.css + '**/*.css'),
					path.resolve(paths().source.styleguide + 'css/*.css'),
					path.resolve(paths().source.patterns + '**/*'),
					path.resolve(paths().source.fonts + '/*'),
					path.resolve(paths().source.images + '/*'),
					path.resolve(paths().source.data + '*.json'),
					path.resolve(paths().source.js + '/*.js'),
					path.resolve(paths().source.root + '/*.ico')
				],
				tasks: ['default', 'bsReload:css']
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
		browserSync: {
			dev: {
				options: {
					server: path.resolve(paths().public.root),
					watchTask: true,
					watchOptions: {
						ignoreInitial: true,
						ignored: '*.html'
					},
					snippetOptions: {
						// Ignore all HTML files within the templates folder
						blacklist: ['/index.html', '/', '/?*']
					},
					plugins: [{
						module: 'bs-html-injector',
						options: {
							files: [path.resolve(paths().public.root + '/index.html'), path.resolve(paths().public.styleguide + '/styleguide.html')]
						}
					}],
					notify: {
						styles: [
							'display: none',
							'padding: 15px',
							'font-family: sans-serif',
							'position: fixed',
							'font-size: 1em',
							'z-index: 9999',
							'bottom: 0px',
							'right: 0px',
							'border-top-left-radius: 5px',
							'background-color: #1B2032',
							'opacity: 0.4',
							'margin: 0',
							'color: white',
							'text-align: center'
						]
					}
				}
			}
		},
		bsReload: {
			css: path.resolve(paths().public.root + '**/*.css')
		}
	});

	/******************************************************
	 * COMPOUND TASKS
	 ******************************************************/

	grunt.registerTask('default', ['patternlab', 'copy:main']);
	grunt.registerTask('patternlab:build', ['patternlab', 'copy:main']);
	grunt.registerTask('patternlab:watch', ['patternlab', 'copy:main', 'watch']);
	grunt.registerTask('patternlab:serve', ['sass', 'patternlab', 'copy:main', 'browserSync', 'watch']);

};
