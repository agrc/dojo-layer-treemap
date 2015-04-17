'use strict';
module.exports = function (grunt) {
    // Show elapsed time at the end
    require('time-grunt')(grunt);
    // Load all grunt tasks
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            gruntfile: {
                src: ['Gruntfile.js']
            },
            js: {
                src: ['*.js']
            },
            test: {
                src: ['test/**/*.js']
            }
        },
        jscs: {
            options: {
                config: '.jscsrc'
            },
            gruntfile: {
                src: ['<%= jshint.gruntfile.src %>']
            },
            js: {
                src: ['<%= jshint.js.src %>']
            },
            test: {
                src: ['<%= jshint.test.src %>']
            }
        },
        mochacli: {
            options: {
                reporter: 'nyan',
                bail: true
            },
            all: ['test/*.js']
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile', 'jscs:gruntfile']
            },
            js: {
                files: '<%= jshint.js.src %>',
                tasks: ['jshint:js', 'jscs:js', 'mochacli']
            },
            test: {
                files: '<%= jshint.test.src %>',
                tasks: ['jshint:test', 'jshint:test', 'mochacli']
            }
        }
    });

    grunt.registerTask('default', ['jshint', 'jscs', 'mochacli', 'watch']);
    grunt.registerTask('test', ['jshint', 'jscs', 'mochacli']);
};