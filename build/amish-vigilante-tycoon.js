(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var Map = require("./scripts/map.js");

var renderer = new PIXI.autoDetectRenderer(600, 600);
renderer.autoResize = true;
renderer.resize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.view);
var stage = new PIXI.Container();
renderer.render(stage);

var Textures = require("./scripts/textures.js");
Textures.load()
.then(function () {

    var rows = 128;
    var cols = 256;

    var map = new Map(rows, cols);
    stage.addChild(map);
    renderer.render(stage);


    document.addEventListener("mousedown", function (event) {
        map.dragging = true;
    });
    document.addEventListener("mousemove", function (event) {
        if (map.dragging) {
            map.drag(event.movementX, event.movementY);
            renderer.render(stage);
        }
    });
    document.addEventListener("mouseup", function (event) {
        map.dragging = false;
    });
    document.addEventListener("mousewheel", function (event) {
        event.preventDefault();
        map.zoom(event.pageX, event.pageY, event.deltaY);
        renderer.render(stage);
    });

});

},{"./scripts/map.js":3,"./scripts/textures.js":5}],2:[function(require,module,exports){

var Random = require("./random.js");
var Tile = require("./tile.js");
var Textures = require("./textures.js");

IslandLayer.prototype = new PIXI.Container();
IslandLayer.prototype.constructor = IslandLayer;

module.exports = IslandLayer;

function IslandLayer (rows, cols)
{
    PIXI.Container.call(this);
    this.rows = rows;
    this.cols = cols;

    this.dragging = false;
    this.grid = [];
    this.islands = [];

    this._init();
}
IslandLayer.prototype.eachTile = function (callback)
{
    for (var row = 0; row < this.rows; row++) {
        for (var col = 0; col < this.cols; col++) {
            var tile = this.grid[row][col];
            if (tile) {
                callback(tile);
            }
        }
    }
};

IslandLayer.prototype._init = function ()
{
    var row, col;
    for (row = 0; row < this.rows; row++) {
        var arr = [];
        for (col = 0; col < this.cols; col++) {
            arr[col] = null;
        }
        this.grid.push(arr);
    }
    for (var count = 0; count < 24 || Random.chance(80); count++) {
        this._createRandomIsland();
    }
    this._findAllConnectedIslands();
    var self = this;
    this.eachTile(function (tile) {
        self._setEdgeTileTextures(tile);
    });
};

IslandLayer.prototype._setEdgeTileTextures = function (tile)
{
    var texture;
    if (this.grid[tile.row-1] && !this.grid[tile.row-1][tile.col]) {  // Top
        if (!this.grid[tile.row][tile.col-1]) {
            texture = "topLeft";
        } else if (!this.grid[tile.row][tile.col+1]) {
            texture = "topRight";
        } else {
            texture = "topMid";
        }
    } else if (this.grid[tile.row+1] && !this.grid[tile.row+1][tile.col]) {  // Bottom
        if (!this.grid[tile.row][tile.col-1]) {
            texture = "bottomLeft";
        } else if (!this.grid[tile.row][tile.col+1]) {
            texture = "bottomRight";
        } else {
            texture = "bottomMid";
        }
    } else if (!this.grid[tile.row][tile.col-1]) {
        texture = "left";
    } else if (!this.grid[tile.row][tile.col+1]) {
        texture = "right";
    } else if (this.grid[tile.row-1] && !this.grid[tile.row-1][tile.col-1]) {
        texture = "fullTopLeft";
    } else if (this.grid[tile.row-1] && !this.grid[tile.row-1][tile.col+1]) {
        texture = "fullTopRight";
    } else if (this.grid[tile.row+1] && !this.grid[tile.row+1][tile.col-1]) {
        texture = "fullBottomLeft";
    } else if (this.grid[tile.row+1] && !this.grid[tile.row+1][tile.col+1]) {
        texture = "fullBottomRight";
    } else {
        texture = "full";
    }
    tile.texture = Textures[tile.islandColor][texture];
};

IslandLayer.prototype._findAllConnectedIslands = function ()
{
    var marked = [];
    for (var i = 0; i < this.grid.length; i++) {
        marked.push({});
    }
    var self = this;
    for (var row = 0; row < this.rows; row++) {
        for (var col = 0; col < this.cols; col++) {
            var tile = this.grid[row][col];
            if (!tile || marked[row][col]) {
                continue;
            }
            var color = Random.chance(70) ? "landGreen" : "landBlue";
            var island = [tile];
            island.color = color;
            self.islands.push(island);
            markAllConnections(tile, island, color);
        }
    }
    function markAllConnections (tile, island, color)
    {
        if (!tile) {
            return;
        }
        if (marked[tile.row][tile.col]) {
            return;
        }
        marked[tile.row][tile.col] = true;
        tile.islandColor = color;

        if (self.grid[tile.row - 1]) {
            markAllConnections(self.grid[tile.row-1][tile.col], island, color);
        }
        if (self.grid[tile.row + 1]) {
            markAllConnections(self.grid[tile.row+1][tile.col], island, color);
        }
        markAllConnections(self.grid[tile.row][tile.col - 1], island, color);
        markAllConnections(self.grid[tile.row][tile.col + 1], island, color);
    }
};

IslandLayer.prototype._createRandomIsland = function ()
{
    var x = Random.range(0, this.cols);
    var y = Random.range(0, this.rows);
    var w = Random.range(4, 36);
    var h = Random.range(4, 36);

    for (var row = y; row < y + h; row ++) {
        for (var col = x; col < x + w; col ++) {
            if (row < 0 || row >= this.grid.length || col < 0 || col >= this.grid[row].length) {
                continue;
            }
            try {
                var tile = new Tile(col, row);
                this.grid[row][col] = tile;
                this.addChild(tile);
                tile.position.x = col * 64;
                tile.position.y = row * 64;
            } catch (err) {
                console.log(err, "row:", row, "col:", col);
            }
        }
    }
};
},{"./random.js":4,"./textures.js":5,"./tile.js":6}],3:[function(require,module,exports){

var IslandLayer = require("./island-layer.js");
var WaterLayer = require("./water-layer.js");

Map.prototype = new PIXI.Container();
Map.prototype.constructor = Map;

module.exports = Map;

function Map (rows, cols)
{
    PIXI.Container.call(this);
    this._zoom = 1;
    this.dragging = false;
    this.water = new WaterLayer(rows, cols);
    this.addChild(this.water);
    this.islands = new IslandLayer(rows, cols);
    this.addChild(this.islands);
}

Map.prototype.drag = function (x, y)
{
    this.position.x += x;
    this.position.y += y;
};

Map.prototype.zoom = function (x, y, delta)
{
    var local_pt = new PIXI.Point();
    var point = new PIXI.Point(x, y);

    PIXI.interaction.InteractionData.prototype.getLocalPosition(this, local_pt, point);
    
    if (delta > 0) {
        this._zoom /= 0.8;
    } else {
        this._zoom *= 0.8;
    }
    this.pivot = local_pt;
    this.position = point;
    this.scale.x = this.scale.y = this._zoom;
};

},{"./island-layer.js":2,"./water-layer.js":7}],4:[function(require,module,exports){

module.exports = {
    range: function (min, max)
    {
        return Math.floor(Math.random() * (max - min)) + min;
    },
    chance: function (percent)
    {
        return Math.random() < (percent * 0.01);
    }
};
},{}],5:[function(require,module,exports){

var TEXTURES = [
    ["water", 
        ["water", "water2", "water3"]
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
},{}],6:[function(require,module,exports){

var Textures = require("./textures.js");

Tile.prototype = new PIXI.Sprite();
Tile.prototype.constructor = Tile;

module.exports = Tile;

function Tile (col, row)
{
    PIXI.Sprite.call(this);
    this.col = col;
    this.row = row;
}

},{"./textures.js":5}],7:[function(require,module,exports){

var Textures = require("./textures.js");

WaterLayer.prototype = new PIXI.Container();
WaterLayer.prototype.constructor = WaterLayer;

module.exports = WaterLayer;

function WaterLayer (rows, cols)
{
    PIXI.Container.call(this);
    for (var row = 0; row < rows; row++) {
        for (var col = 0; col < cols; col++) {
            var water = new PIXI.Sprite(Textures.water.water3 );
            water.position.x = col * 64;
            water.position.y = row * 64;
            this.addChild(water);
        }
    } 
}
},{"./textures.js":5}]},{},[1]);
