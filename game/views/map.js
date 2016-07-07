
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
