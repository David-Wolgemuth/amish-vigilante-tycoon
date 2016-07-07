
var Map = require("./views/map.js");

var renderer = new PIXI.autoDetectRenderer(600, 600);
renderer.autoResize = true;
renderer.resize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.view);
var stage = new PIXI.Container();
renderer.render(stage);

var Textures = require("./models/textures.js");
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
