(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var renderer = new PIXI.autoDetectRenderer(600, 600);
renderer.autoResize = true;
renderer.resize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.view);
var stage = new PIXI.Container();
renderer.render(stage);

var Textures = require("./scripts/textures.js");
Textures.load()
.then(function () {

    var background = new PIXI.Container();

    var rows = renderer.height / 64;
    var cols = renderer.width / 64;

    for (var row = 0; row < rows; row++) {
        for (var col = 0; col < cols; col++) {
            var water = new PIXI.Sprite(Textures.water.water);
            water.position.x = col * 64;
            water.position.y = row * 64;
            background.addChild(water);
        }
    }
    stage.addChild(background);


    var islands = new PIXI.Container();

    var island = [
        { x: 0, y: 0, image: "topLeft" },
        { x: 1, y: 0, image: "topMid" },
        { x: 2, y: 0, image: "topRight" },

        { x: 0, y: 1, image: "left" },
        { x: 1, y: 1, image: "full" },
        { x: 2, y: 1, image: "right" },

        { x: 0, y: 2, image: "bottomLeft" },
        { x: 1, y: 2, image: "bottomMid" },
        { x: 2, y: 2, image: "bottomRight" }
    ];

    for (var i = 0; i < island.length; i++) {
        var piece = island[i];
        var sprite = new PIXI.Sprite(Textures.landGreen[piece.image]);
        var offset = 64 * 4;
        sprite.position.x = offset + (piece.x * 64);
        sprite.position.y = offset + (piece.y * 64);
        islands.addChild(sprite);
    }
    background.addChild(islands);
    renderer.render(stage);
});

},{"./scripts/textures.js":2}],2:[function(require,module,exports){

var TEXTURES = [
    ["water", 
        ["water"]
    ],
    ["landBlue", 
        ["topLeft", "topMid", "topRight",
        "bottomLeft", "bottomMid", "bottomRight",
        "full", "left", "right",
        "fullTopLeft", "fullTopRight", "fullBottomLeft", "fullBottomRight"]
    ],
    ["landGreen", 
        ["topLeft", "topMid", "topRight",
        "bottomLeft", "bottomMid", "bottomRight",
        "full", "left", "right",
        "fullTopLeft", "fullTopRight", "fullBottomLeft", "fullBottomRight"]
    ]
];

function TexturesLoader ()
{
    var self = this;
    this.load = function ()
    {
        var promise = new Promise(function (resolve, reject) {
            var loader = PIXI.loader;
            for (var i = 0; i < TEXTURES.length; i++) {
                var dir = TEXTURES[i];
                var dirname = dir[0];
                for (var j = 0; j < dir[1].length; j++) {
                    var texture = dir[1][j];
                    loader.add(dirname+texture, "images/" + dirname + "/" + texture + ".png");
                }
            }
            loader.load(function (loader, resources) {
                for (var i = 0; i < TEXTURES.length; i++) {
                    var dir = TEXTURES[i];
                    var dirname = dir[0];
                    self[dirname] = {};
                    for (var j = 0; j < dir[1].length; j++) {
                        var texture = dir[1][j];
                        self[dirname][texture] = resources[dirname+texture].texture;
                    }
                }
                console.log(self);
                resolve();
            });
        });
        return promise;
    };
}

module.exports = new TexturesLoader();
},{}]},{},[1]);
