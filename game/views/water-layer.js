
var Textures = require("../models/textures.js");

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