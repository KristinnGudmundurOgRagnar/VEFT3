'use strict';

module.exports = function(grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);
    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    grunt.loadNpmTasks('grunt-wiredep');

    // 1. All configuration goes here 
    grunt.initConfig({
        thisapp: {
            // configurable paths
            app: require('./bower.json').appPath || 'app',
            dist: 'dist'
        },

        pkg: grunt.file.readJSON('package.json'),

        // Watch for all changes
        watch: {
            js: {
                files: ['<%= thisapp.app %>/scripts/{,*/}*.js'],
                tasks: ['newer:jshint:all'],
                options: {
                    livereload: true
                }
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            livereload: {
                files: [
                    '<%= thisapp.app %>/views/{,*//*}*.html',
                    '{.tmp,<%= thisapp.app %>}/styles/{,*//*}*.css',
                    '{.tmp,<%= thisapp.app %>}/scripts/{,*//*}*.js',
                ],
                options: {
                    livereload: true
                }
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= thisapp.dist %>/views/*',
                        '<%= thisapp.dist %>/public/*',
                        '!<%= thisapp.dist %>/public/.git',
                    ]
                }]
            },
            server: '.tmp'
        },

        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '{,*/}*.css',
                    dest: '.tmp/styles/'
                }]
            }
        },

        // Automatically inject Bower components into the app
        wiredep: {
            app: {
                src: ['<%= thisapp.app %>/views/index.html'],
                ignorePath: /\.\.\//
            }
        },

        // Renames files for browser caching purposes
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= thisapp.app %>/public/scripts/{,*/}*.js',
                        '<%= thisapp.app %>/public/styles/{,*/}*.css'
                    ]
                }
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: ['<%= thisapp.app %>/views/index.html'],
            options: {
                dest: '<%= thisapp.dist %>/public'
            }
        },

        // Performs rewrites based on rev and the useminPrepare configuration
        usemin: {
            html: ['<%= thisapp.dist %>/views/{,*/}*.html'],
            css: ['<%= thisapp.dist %>/styles/{,*/}*.css'],
            options: {
                assetsDirs: ['<%= thisapp.dist %>/public']
            }
        },

        // Minify html files
        htmlmin: {
            dist: {
                options: {

                },
                files: [{
                    expand: true,
                    cwd: '<%= thisapp.app %>/views',
                    src: ['*.html', 'partials/*.html'],
                    dest: '<%= thisapp.dist %>/views'
                }]
            }
        },
        // Allow the use of non-minsafe AngularJS files. Automatically makes it
        // minsafe compatible so Uglify does not destroy the ng references
        ngAnnotate: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/concat/scripts',
                    src: '*.js',
                    dest: '.tmp/concat/scripts'
                }]
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= thisapp.app %>',
                    dest: '<%= thisapp.dist %>/public',
                    src: [
                        'bower_comonents/**/*'
                    ]
                }, {
                    expand: true,
                    dot: true,
                    cwd: '<%= thisapp.app %>/views',
                    dest: '<%= thisapp.dist %>/views',
                    src: '**/*.html'
                }, {
                    expand: true,
                    dest: '<%= thisapp.dist %>',
                    src: ['packages.json']
                }]
            },
            styles: {
                expand: true,
                cwd: '<%= thisapp.app %>/styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            }
        },
        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost',
                livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '.tmp',
                        '<%= thisapp.app %>/views'
                    ]
                }
            },
            test: {
                options: {
                    port: 9001,
                    base: [
                        '.tmp',
                        'test',
                        '<%= thisapp.app %>'
                    ]
                }
            },
            dist: {
                options: {
                    base: '<%= thisapp.dist %>'
                }
            }
        }


    });

    grunt.loadNpmTasks('grunt-ng-annotate');

    grunt.registerTask('serve', function(target) {
        if (target === 'dist') {
            return grunt.task.run(['build']);
        }

        grunt.task.run([
            'clean:server',
            'wiredep',
            'autoprefixer',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('server', function() {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve']);
    });

    grunt.registerTask('build', [
        'clean:dist',
        'wiredep',
        'useminPrepare',
        'autoprefixer',
        'concat',
        'ngAnnotate',
        'copy:dist',
        'cssmin',
        'uglify',
        'rev',
        'usemin'
    ]);

    grunt.registerTask('default', [
        'newer:jshint',
        'build'
    ]);

};