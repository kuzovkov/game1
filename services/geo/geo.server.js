/*сервер гео-данных*/
var argv = process.argv;
if ( argv.length < 4 ){
	console.log("Usage: node geo.server <port> <geo_data_db_file>");
	process.exit(0);
 }

var express = require('express');
var app = express();
var server = require('http').Server(app);
var port = parseInt(argv[2]);
var db_file = argv[3];
var spatialite = require('./spatialite3');
var Helper = require('./helper');
var time = require('./time');
var bodyParser = require('body-parser');

server.listen(port,function(){
    console.log('GEO server start at port '+port+ ' ' + Helper.getTime());
    spatialite.init(db_file, function(){
        console.log(db_file+': server ready');
    });
});

app.use(bodyParser.urlencoded({ extended: false }));


/*маршрут для GET запроса маршрута от модуля spatialite*/
app.get('/routespatialite',function(req,res){
    var data = JSON.parse(req.query.data);
	var source = data[0];
	var target = data[1];
    var from = {lat:source[0],lng:source[1]};
	time.start();
	spatialite.routeQuery(from, target, function(route){
		console.log('Executing time: '+time.stop());
		res.writeHead(200, {"Content-Type": "text/html","Access-Control-Allow-Origin": "*"});
        res.write(JSON.stringify(route));
		res.end();
	});   
});

/*маршрут для GET запроса ближайшего узла графа*/
app.get('/getnearestnode',function(req,res){
    var dot = JSON.parse(req.query.data);
	time.start();
	spatialite.getNearestNode(dot, function(node){
		console.log('Executing time: '+time.stop());
		console.log('node='+JSON.stringify(node));
        res.writeHead(200, {"Content-Type": "text/html","Access-Control-Allow-Origin": "*"});
        res.write(JSON.stringify(node));
		res.end();
	});   
});


/*маршрут для POST запроса маршрута от модуля spatialite через getRouteToBases*/
app.post('/routetobases',function(req,res){
    var source = JSON.parse(req.body.source);
	var targets = JSON.parse(req.body.targets);
    var enemy = JSON.parse(req.body.enemies);
	time.start();
	spatialite.findRouteToBases(source, targets, enemy, function(route){
		console.log('Executing time: '+time.stop());
		res.writeHead(200, {"Content-Type": "text/html","Access-Control-Allow-Origin": "*"});
		res.write(JSON.stringify(route));
		res.end();
	});
     
});

/*маршрут для POST запроса к модулю spatialite для вычисления окружения юнитов*/
app.post('/around',function(req,res){
    var regiments = JSON.parse(req.body.regiments);
	var bases = JSON.parse(req.body.bases);
	time.start();
	spatialite.around(regiments, bases, function(result){
		console.log('Around Executing time: '+time.stop());
		res.writeHead(200, {"Content-Type": "text/html","Access-Control-Allow-Origin": "*"});
		res.write(JSON.stringify(result));
		res.end();
	});
     
});


