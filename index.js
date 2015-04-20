'use strict';
var fs = require('fs');
var path = require('path');
var appRoot = require('app-root-path');
var cp = require('cp');
var o = require('open');

module.exports = function (pathToLayerFile, pathToBuildReport) {
    var txt = fs.readFileSync(pathToLayerFile || 'dist/dojo/dojo.js', 'utf-8');
    var reportTxt = fs.readFileSync(pathToBuildReport || 'dist/build-report.txt', 'utf-8');

    return {
        getModuleNames: function () {
            // returns a list of modules in the layer file as reported by the build-report.txt file
            var modList = new RegExp("Layer Contents:[\\s\\S].*" + path.basename(pathToLayerFile, '.js') + ":([\\s\\S]*)\\n\\n")
                .exec(reportTxt)[1].trim();
            var moduleNames = [];

            var regex = /(\S+)/g;
            var match = regex.exec(modList);
            if (!match) {
                throw('No modules found! Are you sure this is a dojo layer file?');
            }
            while (match) {
                if (match[1] !== 'dojo/dojo' && match[1].indexOf('.') === -1) {
                    moduleNames.push(match[1]);
                }
                match = regex.exec(modList);
            }

            return moduleNames;
        },
        getTree: function (names) {
            var tree = {
                'name': 'treemap',
                children: []
            };

            var addChild = function (parent, childName) {
                var child;
                if (parent.children) {
                    parent.children.some(function (c) {
                        if (c.name === childName) {
                            child = c;
                            return true;
                        } else {
                            return false;
                        }
                    });
                } else {
                    parent.children = [];
                }
                if (!child) {
                    child = {
                        name: childName
                    };
                    parent.children.push(child);
                    parent.children.sort();
                }
                return child;
            };

            var lastChild;
            var addPart = function (p, i) {
                lastChild = addChild((i === 0) ? tree : lastChild, p);

                return lastChild;
            };

            names.forEach(function (mod, i, arr) {
                var parts = mod.split('/');
                parts.forEach(addPart);
                var child;
                parts.forEach(function (p, i, arr) {
                    child = addPart(p, i, arr);
                });

                var start = '"' + mod.replace(/\//g, '\\/') + '"(:function\\(\\){[\\s\\S]+)';
                var reg;
                if (i < arr.length - 1) {
                    var nextMod = names[i + 1];
                    reg = new RegExp(start + '"' +
                        nextMod.replace(/\//g, '\\/') + '":function\\(\\){');
                } else {
                    reg = new RegExp(start + '$');
                }
                var l = reg.exec(txt)[1].length;
                child.size = l;
                child.name = child.name + ' (' + l + ')';
            });

            return tree;
        },
        main: function () {
            var treeDataObject = this.getTree(this.getModuleNames());
            var tempFolder = '.dojo-layer-treemap';
            if (!fs.existsSync(tempFolder)) {
                fs.mkdirSync(tempFolder);
            }

            var htmlPage = path.join(tempFolder, 'tree.html');
            cp.sync(path.join(appRoot.toString(), 'tree.html'), htmlPage);

            var contents = fs.readFileSync(htmlPage, {encoding: 'utf-8'});
            contents = contents.replace('// insert tree data here',
                'window.treeData = ' + JSON.stringify(treeDataObject));

            fs.writeSync(fs.openSync(htmlPage, 'w+'), contents);

            o(htmlPage);
        }
    };
};
