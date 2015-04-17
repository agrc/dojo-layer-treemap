#!/usr/bin/env node
'use strict';
var meow = require('meow');
var dojoLayerTreemap = require('./');

var cli = meow({
    help: [
        'Usage',
        '  dojo-layer-treemap <input>',
        '',
        'Example',
        '  dojo-layer-treemap Unicorn'
    ].join('\n')
});

dojoLayerTreemap(cli.input[0]);
