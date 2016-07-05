
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