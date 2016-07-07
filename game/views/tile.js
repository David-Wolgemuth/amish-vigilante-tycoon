
var Textures = require("../models/textures.js");

Tile.prototype = new PIXI.Sprite();
Tile.prototype.constructor = Tile;

module.exports = Tile;

function Tile (col, row)
{
    PIXI.Sprite.call(this);
    this.col = col;
    this.row = row;
}
