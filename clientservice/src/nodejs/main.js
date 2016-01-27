var express = require("express");
var app = express();
app.use(express.static("static"));

var mysql = require('mysql');

app.get("/index.html", function (req, res){
    console.log("got page request");
    res.sendFile(__dirname + "/" + "index.html");
});

app.get("/bus4.png", function (req, res){
    console.log("got icon request");
    res.sendFile(__dirname + "/" + "bus4.png");
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
        res.send("{lat: 50.607058, lng: 30.294730, ser: 'XXX'}");
      }else{
        var data = '{"lat": ' + rows[0].lat + ', "lng": ' + rows[0].lon + ', "ser": "' + rows[0].serialno + '"}';
        connection.end();
        console.log('sending: ', data);
        res.send(data);
      }
    });
});

var server = app.listen(8080,function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
});
