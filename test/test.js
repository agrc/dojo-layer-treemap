'use strict';
var assert = require('assert');
var dojoLayerTreemap = require('../');
var path = require('path');

describe('dojo-layer-treemap node module', function () {
    var testFile = path.join(process.cwd(), 'test/data/dojo.js');
    var buildReportFile = path.join(process.cwd(), 'test/data/build-report.txt');
    var tm = dojoLayerTreemap(testFile, buildReportFile);
    describe('getModuleNames', function () {
        it('gets a list of the modules in the build report', function () {
            var names = tm.getModuleNames();

            assert.equal(names.length, 61);
            assert.equal(names[0], 'app/LayerTest');
            assert.equal(names[60], 'jquery/jquery');
        });
        it('can handle build reports with multiple layers', function () {
            var tm2 = dojoLayerTreemap(testFile, path.join(process.cwd(), 'test/data/build-report-multi-layer.txt'));
            var names = tm2.getModuleNames();

            assert.equal(names.length, 332);
        });
    });
    describe('getTree', function () {
        var moduleNames = ['app/LayerTest', 'dojo/dom', 'dojo/sniff', 'dojo/has', 'dojo/_base/window', 'dojo/_base/kernel', 'dojo/_base/config', 'dojo/_base/lang', 'bootstrap/dist/js/bootstrap', 'dojo/main', 'dojo/_base/array', 'dojo/ready', 'dojo/domReady', 'dojo/_base/declare', 'dojo/_base/connect', 'dojo/on', 'dojo/topic', 'dojo/Evented', 'dojo/aspect', 'dojo/_base/event', 'dojo/dom-geometry', 'dojo/dom-style', 'dojo/mouse', 'dojo/_base/sniff', 'dojo/keys', 'dojo/_base/Deferred', 'dojo/Deferred', 'dojo/errors/CancelError', 'dojo/errors/create', 'dojo/promise/Promise', 'dojo/promise/instrumentation', 'dojo/promise/tracer', 'dojo/when', 'dojo/_base/json', 'dojo/json', 'dojo/_base/Color', 'dojo/_base/browser', 'dojo/_base/unload', 'dojo/_base/html', 'dojo/dom-attr', 'dojo/dom-prop', 'dojo/dom-construct', 'dojo/dom-class', 'dojo/_base/NodeList', 'dojo/query', 'dojo/selector/_loader', 'dojo/selector/acme', 'dojo/NodeList-dom', 'dojo/_base/xhr', 'dojo/io-query', 'dojo/dom-form', 'dojo/request/watch', 'dojo/request/util', 'dojo/errors/RequestError', 'dojo/errors/RequestTimeoutError', 'dojo/request/xhr', 'dojo/request/handlers', 'dojo/_base/fx', 'dijit/main', 'dojox/main', 'jquery/jquery'];
        it('returns an object representing the data', function () {
            var obj = tm.getTree(moduleNames);

            var numChildren = 0;

            var getChildren = function (parent) {
                if (parent.children) {
                    parent.children.forEach(getChildren);
                } else {
                    numChildren += 1;
                }
            };
            getChildren(obj);
            assert.equal(numChildren, 61);
            assert.equal(obj.children[1].children[0].name, 'Deferred (2057)');
        });
    });
    describe('main', function () {
        it('doesn\'t choke', function () {
            tm.main();
        });
    });
});
