var express = require("express");
var app = express();
app.use(express.static("static"));

var mysql = require('mysql');
var async = require('async');

app.get("/index.html", function (req, res){
    console.log("got page request");
    res.sendFile(__dirname + "/" + "index.html");
});

app.get("/bus-stop.png", function (req, res){
    res.sendFile(__dirname + "/" + "bus-stop.png");
});

app.get("/bus55.png", function (req, res){
    res.sendFile(__dirname + "/" + "bus55.png");
});

app.get("/data.html", function (req, res){
    var connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : '',
      database: 'wimb'
    });

    console.log("got data request");
    connection.connect(function(err) {
      if (err) throw err;
      console.log('connected');
    });

    connection.query('SELECT lat, lon, serialno from bus_data where local_time = (select max(local_time) from bus_data)', function(err, rows, fields) {
      if (err) throw err;
      if (rows.length == 0) {
        connection.end();
        console.log('no data');
        res.send('{"lat": 50.607058, "lng": 30.294730, "ser": "XXX"}');
      }else{
        var data = '{"lat": ' + rows[0].lat + ', "lng": ' + rows[0].lon + ', "ser": "' + rows[0].serialno + '"}';
        connection.end();
        console.log('sending: ', data);
        res.send(data);
      }
    });
});

app.get("/route.html", function (req, res){

    var route = {'id':'n/a','number':'n/a','name':'n/a','lat':'n/a','lng':'n/a'};

    console.log("got route request");

    async.waterfall([
        connect,
        getRouteData,
        getRouteDirectionData,
        disconnect],
        function(err, result){
          if (err){
              console.log(err);
          }else{
              console.log("result:", result)
              res.send(result);
          }
        }
    );

});

function connect(callback){
    var con = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : '',
      database: 'wimb'
    });
    con.connect(function(err) {
      if (err) throw err;
      console.log('connected');
    });
    callback(null,con);
}

function getRouteData(con,callback){
    var route = {'id':"n/a",'number':"n/a",'name':"n/a",'lat':"n/a",'lng':"n/a", 'directions':[]};
    con.query("select id, number, name from route where number = '226'", function(err, rows, fields) {
        if (err) throw err;
        if (rows.length == 0) {
            callback(new Error("no route"));
        }else{
            route = {'id':rows[0].id,'number':rows[0].number,'name':rows[0].name,'lat':50.607058,'lng':30.294730, 'directions':[]};
            console.log("getRouteData:", route);
            callback(null, route, con);
        }
    });
}

function getRouteDirectionData(route, con, callback){
    con.query("select id, name from route_direction where route_id = " + route.id, function(err, rows, fields) {
        if (err) throw err;
        if (rows.length == 0) {
            callback(new Error("no route directions"));
        }else{
            for (i = 0; i < rows.length; i++){
                route.directions[i] = {'id':rows[i].id,'name':rows[i].name, 'points':[]};
            }
            var idx = 0;
            async.whilst(
                function(){return idx < route.directions.length},
                function(callback){
                    con.query("select rp.id, rp.name, rp.lat, rp.lon, rpt.name type from route_point rp left join route_point_type rpt on rp.route_point_type_id=rpt.id where route_direction_id = " + route.directions[idx].id, function(err, rows, fields) {
                        if (err) throw err;
                        for (i = 0; i < rows.length; i++){
                            route.directions[idx].points[i] = {'id':rows[i].id,'name':rows[i].name,'lat':rows[i].lat,'lon':rows[i].lon,'type':rows[i].type};
                        }
                        console.log("done dir:", idx, ":", route.directions[idx].points.length);
                        idx++;
                        callback(null,route);
                    });
                },
                function (err, result){
                    console.log("finished repetition");
                    callback(null, route, con);
                }
            );
        }
    });
}

//function getRoutePointData(route, idx, con){
//    con.query("select rp.id, rp.name, rp.lat, rp.lon, rpt.name type from route_point rp left join route_point_type rpt on rp.route_point_type_id=rpt.id where route_direction_id = " + route.directions[idx].id, function(err, rows, fields) {
//        if (err) throw err;
//        console.log("here");
//        for (i = 0; i < rows.length; i++){
//            route.directions[idx].points[i] = {'id':rows[i].id,'name':rows[i].name,'lat':rows[i].lat,'lon':rows[i].lon,'type':rows[i].type};
//        }
//        console.log("done dir:", idx);
//    });
//}

function disconnect(route, con, callback){
    con.end();
    console.log('disconnected');
    callback(null, route);
}

var server = app.listen(8080,function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
});
