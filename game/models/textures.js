
var landDirections = ["topLeft", "topMid", "topRight",
        "bottomLeft", "bottomMid", "bottomRight",
        "full", "left", "right",
        "fullTopLeft", "fullTopRight", "fullBottomLeft", "fullBottomRight"];

var cityMarkers = [];
for (var i = 0; i <= 20; i++) {
    cityMarkers.push(i);
}

var TEXTURES = [
    ["water", 
        ["water", "water2", "water3"]
    ],
    ["grass", landDirections],
    ["desert", landDirections],
    ["tundra", landDirections],
    ["cityMarker", cityMarkers]
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