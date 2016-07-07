/*
    Amish Vigilante Tycoon
    Server Configuration
*/

//------------ App + Server -------------//
var express = require("express");
var app = express();
var server = require("http").Server(app);

app.use(express.static(__dirname));

//------------ Server Listen -------------//
var port = process.env.PORT || 5000;
var listener = server.listen(port, function () {
    console.log("Listening On Port:", listener.address().port);
});