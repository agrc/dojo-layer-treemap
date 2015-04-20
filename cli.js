#!/usr/bin/env node
'use strict';
var meow = require('meow');
var dojoLayerTreemap = require('./');

var cli = meow({
    help: [
        'Usage',
        '  dojo-layer-treemap <path to layer file> <path to build-report.txt>',
        '',
        'Example',
        'dojo-layer-treemap dist/dojo/dojo.js dist/build-report.txt'
    ].join('\n')
});

dojoLayerTreemap(cli.input[0], cli.input[1]).main();
