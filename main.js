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
