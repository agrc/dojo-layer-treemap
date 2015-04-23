#!/usr/bin/env node
'use strict';
var meow = require('meow');
var dojoLayerTreemap = require('./');

var cli = meow({
    help: [
        'Usage',
        '  dojo-layer-treemap <layer-file> <build-report>',
        '',
        '<layer-file>',
        '  The path to the layer file that you want to analyze',
        '  Defaults to: dist/dojo/dojo.js',
        '',
        '<build-report>',
        '  Path to the build-report.txt file associated with the build',
        '  Defaults to: dist/build-report.txt',
        '',
        'Example',
        '  dojo-layer-treemap dist/dojo/dojo.js dist/build-report.txt'
    ].join('\n')
});

dojoLayerTreemap(cli.input[0], cli.input[1]).main();
