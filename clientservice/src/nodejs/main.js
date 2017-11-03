var express = require("express");
var app = express();
app.use(express.static("static"));

var mysql = require('mysql');
var async = require('async');

var tools = require("./tools.js");

app.get("/data.html", function (req, res) {
    var connection = mysql.createConnection({
        host: 'wimb-db',
        user: 'root',
        password: 'dat1a57',
        database: 'wimb'
    });

    console.log("got data request");
    connection.connect(function (err) {
        if (err) throw err;
        console.log('connected');
    });

    connection.query('SELECT lat, lon, serialno from bus_data where local_time = (select max(local_time) from bus_data)', function (err, rows, fields) {
        if (err) throw err;
        if (rows.length == 0) {
            connection.end();
            console.log('no data');
            res.send('{"lat": 50.607058, "lng": 30.294730, "ser": "XXX"}');
        } else {
            var data = {latitude: rows[0].lat, longitude: rows[0].lon, serial: + rows[0].serialno};
            connection.end();

            var result = tools.getPosOnRouteDir(data,route226.directions[0])
            console.log(result);
            res.send(result);
        }
    });
});

var route226 = null;
function readRoute(routeNum) {
    async.waterfall([
            connect,
            getRouteData,
            getRouteDirectionData,
            disconnect],
        function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log("%j",result);
                route226 = result;
            }
        }
    );
}

function connect(callback) {
    var con = mysql.createConnection({
        host: 'wimb-db',
        user: 'root',
        password: 'dat1a57',
        database: 'wimb'
    });
    con.connect(function (err) {
        if (err) throw err;
        console.log('connected');
    });
    callback(null, con);
}

function getRouteData(con, callback) {
    var route = {'id': "n/a", 'number': "n/a", 'name': "n/a", 'lat': "n/a", 'lng': "n/a", 'directions': []};
    con.query("select id, number, name from route where number = '226'", function (err, rows, fields) {
        if (err) throw err;
        if (rows.length == 0) {
            callback(new Error("no route"));
        } else {
            route = {
                'id': rows[0].id,
                'number': rows[0].number,
                'name': rows[0].name,
                'lat': 50.607058,
                'lng': 30.294730,
                'directions': []
            };
            callback(null, route, con);
        }
    });
}

function getRouteDirectionData(route, con, callback) {
    con.query("select id, name from route_direction where route_id = " + route.id, function (err, rows, fields) {
        if (err) throw err;
        if (rows.length == 0) {
            callback(new Error("no route directions"));
        } else {
            for (i = 0; i < rows.length; i++) {
                route.directions[i] = {'id': rows[i].id, 'name': rows[i].name, 'points': []};
            }
            var idx = 0;
            async.whilst(
                function () {
                    return idx < route.directions.length
                },
                function (callback) {
                    con.query("select rp.id, rp.name, rp.lat, rp.lon, rpt.name type from route_point rp left join route_point_type rpt on rp.route_point_type_id=rpt.id where route_direction_id = " + route.directions[idx].id, function (err, rows, fields) {
                        if (err) throw err;
                        for (i = 0; i < rows.length; i++) {
                            route.directions[idx].points[i] = {
                                'id': rows[i].id,
                                'idx': i,
                                'name': rows[i].name,
                                'lat': rows[i].lat,
                                'lon': rows[i].lon,
                                'type': rows[i].type
                            };
                        }
                        idx++;
                        callback(null, route);
                    });
                },
                function (err, result) {
                    callback(null, route, con);
                }
            );
        }
    });
}

function disconnect(route, con, callback) {
    con.end();
    console.log('disconnected');
    callback(null, route);
}

var server = app.listen(8080, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
});
readRoute("226");

app.get("/route.html", function (req, res) {
    res.send(route226);
});

app.get("/index.html", function (req, res) {
    console.log("got page request");
    res.sendFile(__dirname + "/" + "index.html");
});

app.get("/bus-stop.png", function (req, res) {
    res.sendFile(__dirname + "/" + "bus-stop.png");
});

app.get("/calibration-small.png", function (req, res) {
    res.sendFile(__dirname + "/" + "calibration-small.png");
});

app.get("/bus55.png", function (req, res) {
    res.sendFile(__dirname + "/" + "bus55.png");
});
