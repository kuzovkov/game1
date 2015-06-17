/**
* модуль обработки http запросов к серверу
**/
var fs = require('fs');
var parameters = require('./parameters').parameters;
var MISSIONS_DIR = 'missions/';

/**
* обработчик GET запроса на '/' (сама игра)
**/
function index(req,res){
    var locations = [];
    for (var key in global.locations){
        
        locations.push({
                            id: global.locations[key].id,
                            name: global.locations[key].name
                        });
    }
    res.render('select',{locations:locations});
}


function location1(req, res){
    res.render('game',{title:global.locations.location1.name});
}

function location2(req, res){
     res.render('game',{title:global.locations.location2.name});
}

function location3(req, res){
     res.render('game',{title:global.locations.location3.name});
}

/*обработчик запроса на /consruct (конструктор миссий)*/
function construct(req,res){
    res.render('construct');     
}

/*обработчик запроса на /makemissions (создание файла миссий)*/
function makemissions(req,res){
    var file = MISSIONS_DIR + req.body.file;
    var data = JSON.parse(req.body.data);
    var countries = JSON.parse(req.body.countries);
    var content = makeMissionsContent(data, countries);
    fs.writeFile(file, content, function(err){
        if (err) throw err;
        console.log('Missions file ' + file + ' created');
        res.writeHead(200, {"Content-Type": "text/html","Access-Control-Allow-Origin": "*"});
		res.write(JSON.stringify({file:file}));
		res.end();
    }); 
}


/**
* Далее вспомогательные функции
**/
/**
* возвращает true пользователь новый (нет user_id в cookie)
**/
function userNew(req){
    return ( req.cookies.user_id == undefined || req.cookies.user_id == 'undefined' )? true : false;
}

/**
* возвращает true если в cookie запроса есть имя пользователя
**/
function hasUserName(req){
    return ( req.cookies.user == undefined || req.cookies.user == 'undefined' )? false : true;
}

/**
*количество user ов в игре
**/
function countUsers(){
    return ( global.sdata.game != null )? global.sdata.game.users.length : 0;
}

/**
* есть ли пользователь в игре с таким id
**/
function userIdPresent(id){
    for ( var i = 0; i < global.sdata.game.users.length; i++ ){
        if ( global.sdata.game.users[i].id  == id ) return true;
    }
    return false;
}

/**
* есть ли пользователь в игре с таким id и name
**/
function userIdNamePresent(id, name){
    for ( var i = 0; i < global.sdata.game.users.length; i++ ){
        if ( global.sdata.game.users[i].id  == id && global.sdata.game.users[i].name == name ) return true;
    }
    return false;
}

/**
* существует ли уже игра
**/
function gameExists(){
    return ( global.sdata.game != null )? true : false;
}

/**
* создание контента для записи в файл миссий
* @param data массив объектов миссий
**/
function makeMissionsContent(data, countries){
    var content = '';
    for ( var i = 0; i < data.length; i++ ){
        content += 'var ' + data[i].id + " = \n" + JSON.stringify(data[i]) + ";\n";
    }
    content += "var Missions = \n{\n";
    for ( var i = 0; i < data.length; i++ ){
        content += data[i].id + ': {selected: false, object: ' + data[i].id + ", name: '" + data[i].name + "', ";
        var country1_id = data[i].regiments[0].country;
        var country2_id = '';
        for ( var j = 0; j < data[i].regiments.length; j++ ){
            if ( data[i].regiments[j].country != country1_id ){
                country2_id = data[i].regiments[j].country;
            }
        }
        var country1 = {id:country1_id, name: countries[country1_id], selected:false};  
        var country2 = {id:country2_id, name: countries[country2_id], selected:false};
        content += 'country1: ' + JSON.stringify(country1) + ', country2: ' + JSON.stringify(country2) + '}';
        if ( i < data.length -1  ) content += ',';
        content += "\n";
    }
    content += "\n};\nexports.missions = Missions;";
    return content;
}


exports.index = index;
exports.location1 = location1;
exports.location2 = location2;
exports.location3 = location3;

exports.construct = construct;
exports.makemissions = makemissions;