
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

// IslandLayer.prototype.mousedown = function (data)
// {
    // console.log(data);
// };

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
    for (var count = 0; count < 24 || Random.chance(70); count++) {
        this._createRandomIsland();
    }
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
    tile.texture = Textures.landGreen[texture];
};

IslandLayer.prototype._createRandomIsland = function ()
{
    var x = Random.range(0, this.rows);
    var y = Random.range(0, this.cols);
    var w = Random.range(2, 24);
    var h = Random.range(2, 24);

    for (var row = y; row < y + h; row ++) {
        for (var col = x; col < x + w; col ++) {
            if (!this.grid[row] || !this.grid[col]) {
                continue;
            }
            var tile = new Tile(col, row);
            this.grid[row][col] = tile;
            this.addChild(tile);
            tile.position.x = col * 64;
            tile.position.y = row * 64;
        }
    }
};