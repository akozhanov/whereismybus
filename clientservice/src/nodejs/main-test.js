var express = require("express");
var app = express();
app.use(express.static("static"));
var test_tools = require("./test-tools.js");
var tools = require("./tools.js");

app.get("/data.html", function (req, res) {
    var result = tools.getPosOnRouteDir(test_tools.loc2, test_tools.route.directions[0]);
    console.log(result);
    res.send(result);
});

app.get("/index-test.html", function (req, res) {
    res.sendFile(__dirname + "/" + "index-test.html");
});

var server = app.listen(8080, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Test app listening at http://%s:%s", host, port);
});

app.get("/bus-stop.png", function (req, res) {
    res.sendFile(__dirname + "/" + "bus-stop.png");
});

app.get("/bus-route.png", function (req, res) {
    res.sendFile(__dirname + "/" + "bus-route.png");
});

app.get("/bus55.png", function (req, res) {
    res.sendFile(__dirname + "/" + "bus55.png");
});
