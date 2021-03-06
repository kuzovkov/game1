var http = require('http');
var Helper = require('./helper');;
var WEATHER_SERVICE_HOSTNAME = '127.0.0.1'; /*���� ������� ������*/
var WEATHER_SERVICE_PORT = 8004; /*���� ������� ������*/
var FAIL = -1000000;
var date = null;
var unitsPositionsHash = []; /*������ ����� ������� ������*/
var queue = []; /*������ ������ ������� � ������� �������*/

/**
* ����� �������� ���������� ����� ������
* @param games ������ ���������� ������� ��� � ��������
* @param locations ������ ����������� �������
**/
function startUpdateWeather(games, locations){
    for (var loc in locations){
        queue.push(loc);
        unitsPositionsHash.push(0);
    }
    begin(games, locations);
}

/**
* ������� ���������� �����, ���������� ����� �������
* @param games ������ ���������� ������� ��� � ��������
* @param locations ������ ����������� �������
**/
function begin(games, locations){
    updateWeatherRun(0, games, locations, function(){
        setTimeout(begin, 1000, games, locations);
    });
}

/**
* ���������� ����� ������ � ������������ �������
* @param index ������� � ������� ������ �������
* @param games ������ ���������� ������� ��� � ��������
* @param locations ������ ����������� �������
* @param callback ������� ��������� ������, ���������� �� ���������� ��������
**/
function updateWeatherRun(index, games, locations, callback){
    updateWeather(index, games[queue[index]], function(){
        index++;
        if ( index < queue.length ){
            updateWeatherRun(index, games, locations, callback);
        }else{
            callback();
        }
    });
}
/**
* ��������� �������� ������
* � ���������� � ������������ � ���� �������� ������
* � ������� ���� game
* @param index ������ ���� � ������� ����� ������
* @param game ������ ����
* @callback ������� ��������� ������, ���������� �� ���������� ��������
**/
function updateWeather(index, game, callback){
    
    var currDate = Helper.getDate(game.location.year);
    /*��������� ���� �� ��������� ��������� ������*/
    var hash = calcUnitsPositionsHash(game);
    if ( unitsPositionsHash[index] == hash && currDate == date){
        callback();
        return;
    }
    unitsPositionsHash[index] = hash;
    date = currDate;
    var dots = prepareDots(game);
    
    if (dots.length == 0){
        callback();
        return;
    }
    getWeather(date, dots, function(result){
        updateGameObject(game, result, callback);
    }); 
    
}

/**
* ��������� ���� �� ������� ������ � ����� ����������� 
* ���� �� �������� ������ ��� ���
* @param game ������ ����
* @return hash ��� �� ��������� ������
**/
function calcUnitsPositionsHash(game){
    var hash = 0;
    for (var i = 0; i < game.regiments.length; i++){
        hash += game.regiments[i].latlng[0] + game.regiments[i].latlng[1];
    }
    for (var i = 0; i < game.bases.length; i++){
        hash += game.bases[i].latlng[0] + game.bases[i].latlng[1];
    }
    return hash;
}

/**
*���������� ���� weather � ������ ����
* @param game ������ ����
* @param result ��������� ������� � ������� ������
* @param callback ������� ��������� ������, ���������� �� ���������� ��������
**/
function updateGameObject(game, result, callback){
    if ( result.result == false ) return false;
    for ( var i = 0; i < game.regiments.length; i++ ){
        if ( game.regiments[i] == undefined ) continue;
        var weather = findNearest(game.regiments[i].latlng, result.data);
        if ( weather != FAIL ) game.regiments[i].weather = weather;
    }
    for ( var i = 0; i < game.bases.length; i++ ){
        if ( game.bases[i] == undefined ) continue;
        var weather = findNearest(game.bases[i].latlng, result.data);
        if ( weather != FAIL ) game.bases[i].weather = weather;
    }
    callback();
}

/**
* ���������� ������� � ������������ ������ ����
* @param game ������ ����
**/
function prepareDots(game){
    var dots = [];
    var rNumber = game.regiments.length;
    var bNumber = game.bases.length;
    
    for (var i = 0; i < rNumber + bNumber; i++ ){
        dots.push([0,0]);
    }
    
    for ( var i = 0; i < rNumber; i++ ){
        if ( game.regiments[i] == undefined ) continue;
        dots[i][0] = game.regiments[i].latlng[0];
        dots[i][1] = game.regiments[i].latlng[1];
    }
    for ( var i = 0; i < bNumber; i++ ){
        if ( game.bases[i] == undefined ) continue;
        dots[i+rNumber][0] = game.bases[i].latlng[0];
        dots[i+rNumber][1] = game.bases[i].latlng[1];
    }
    
    return dots;
}

/**
* ���������� �������� ���������� ����� ������� (��� ����� ��������)
**/
function getSquareDist( x, y ){
	return ( (x[0]-y[0])*(x[0]-y[0]) + (x[1]-y[1])*(x[1]-y[1]) );
}

/**
* ���������� � ������� ����������� ���������� ���������� � �������� ����� 
* @param dot �����, �������� ����������� [lat,lng]
* @param array ������ �������� [{found_lat:lat,found_lng:lng,elevation:elevation, pressure:pressure,wind:5.0886000000000005,visib:visib,"prcp":prcp,frshht:frshht,stn:stn,wban:wban}, ...]
**/
function findNearest( dot, array ){
    if ( array.length == 0 ) return FAIL;
    var obj = array[0];
    var minDist = getSquareDist(dot, [array[0]['found_lat'], array[0]['found_lng']]);
    for ( var i = 0; i < array.length; i++ ){
        currDist = getSquareDist(dot, [array[i]['found_lat'], array[i]['found_lng']]);
        if ( currDist < minDist ){
            minDist = currDist;
            obj = array[i];
        }
    }
    return obj;
}

/**
* ��������� ������  ����� �������� HTTP POST �������
* @param date ���� � ���� �������� 
* @param dots ������ ����� ����� ������ � ��� ���� [[lat1,lng1],[lat2,lng2],...]
* @param callback ������� ��������� ������, � ������� ���������� ���������� � 
* ���� ������� ���� 
* {"result":true,"data":
* [{"temperature":-9,"pressure":0.986923,"wind":2.7242,
* "visib":2.9,"prcp":"0.20E","frshht":"001000\n","stn":"277850",
* "wban":"99999","found_lat":54.32,"found_lng":48.33},
* {"temperature":-11,"pressure":null,"wind":5.0886000000000005,
* "visib":3,"prcp":"99.99","frshht":"001000\n","stn":"279622",
* "wban":"99999","found_lat":56.09,"found_lng":47.347}]}
**/
function getWeather( date, dots, callback ){
    //console.log(dots);
    var path = '/weather/multi';
    var params = 'date=' + date + '&dots=' + JSON.stringify(dots);
    var results = [];
    var options = {
                        hostname: WEATHER_SERVICE_HOSTNAME,
                        port: WEATHER_SERVICE_PORT,
                        path: path,
                        method: 'POST',
                        headers: {'Content-type': 'application/x-www-form-urlencoded'}
                    };
            
    var req = http.request(options, function(res){
        if ( res.statusCode === 200 ){
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    results.push(chunk);
                });
                res.on('end',function(){
                   var result = JSON.parse(results.join(''));
                   callback(result); 
                });
        }
        else{
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    //console.log(chunk);
                    callback(undefined);
                });      
        }
        
    });
        
    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });
    
    // write data to request body
    req.write(params);
    req.end();
}

exports.startUpdateWeather = startUpdateWeather;