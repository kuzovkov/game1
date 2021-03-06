/*клиентский модуль обработчиков событий при взаимодействии клиента и сервера*/

url = window.location.host;
pathname = window.location.pathname;
socket = io.connect(url+pathname);
hostname = window.location.hostname;
user = new User(Helper.getCookie('user_id'),'noname');/*клиентский объект user*/
game = null; /*переменная для хранения клиентского объекта game*/
interval = null; /*интервал обновления клиента и сервера*/



/**
* обработчик события connect
* генерация события get_missions
**/
socket.on('connect', function(data){
    socket.emit('get_game', {user:user, location:pathname}); 
});

/**
* обработчик события disconnect
* перезагрузка страницы
**/
socket.on('disconnect', function(data){
   //window.location.replace('/');
    
});




/**
* инициализация игры клиентом и генерация события game_init_client
* с посылкой данных объекта game и user
**
function gameInit(){
    map.setView(game.mission.center,13);
    map.setMaxBounds(L.latLngBounds(L.latLng(32.5, 43.5), L.latLng(33.9, 45)));
    showElem(iface.preloader);
    game.init(function(){
        socket.emit('game_init_client',{user: user.toString(), game: game.toString(), msg: 'Game init'}); 
    });
    
};

/**
* клонирование игры клиентом при присоединении к игре 
* и генерация события game_clone_client
* с посылкой данных объекта game и user
**
function gameClone(){
    map.setView(game.mission.center,13);
    map.setMaxBounds(L.latLngBounds(L.latLng(32.5, 43.5), L.latLng(33.9, 45)));
    game.clone(remoteGame, function(){
         socket.emit('game_clone_client',{user: user.toString(), game: game.toString(), msg: 'Game clone'}); 
    });
};

/**
* постановка игры на паузу 
* и генерация события game_pause_client
* с посылкой данных объекта user
**
function gamePause(){
    socket.emit('game_pause_client',{user: user.toString(), msg: 'Game pause'}); 
};

/**
* старт игры 
* и генерация события game_start_client
* с посылкой данных объекта user
**
function gameStart(){
    socket.emit('game_start_client',{user: user.toString(), msg: 'Game start'}); 
};

/**
* выход из игры 
* и генерация события game_exit_client
* с посылкой данных объекта game и user
**
function gameExit(){
    socket.emit('game_exit_client',{user: user.toString(), game: game.toString(), msg: 'Game exit'}); 
};

/**
* посылка данных на сервер для синхронизации
* и генерация события game_from_client
* с посылкой данных объекта game
**/
function sendDataToServer(){
    socket.emit('data_from_client', {game: game.toString(), user: user.toString(), location:pathname.slice(10)});
}

/**
* позиционирование карты и установка границ
* @param game объект игры
**/
function setMapOptions(game){
    var SW_lat = game.location.bounds.SW[0];
    var SW_lng = game.location.bounds.SW[1];
    var NE_lat = game.location.bounds.NE[0];
    var NE_lng = game.location.bounds.NE[1];
    var center = [(SW_lat + NE_lat)/2, (SW_lng + NE_lng)/2];
    map.setView(center,13);
    map.setMaxBounds(L.latLngBounds(L.latLng(SW_lat, SW_lng),L.latLng(NE_lat, NE_lng)));
}

/**
* восстановление данных игры с сервера при
* перезагрузке страницы
* и генерация события get_game
* с посылкой данных объекта user
**
function restoreGame(){
    socket.emit('get_game',{user:user.toString()});
}

/**
* посылка события означающего активность клиента
* и генерация события user_live
* с посылкой данных объекта user
**/

function userLive(){
    socket.emit('user_live',{user:user.toString(), location:game.location.id});
}


/**
* начало активности клиента
**/

function beginUserLive(){
    if ( interval == null ){
        interval = setInterval( userLive, 4000 );
    }
    //updateElevation();
    //updateWeather();
}


/**
* запрос на проверку окружения полков
**
function checkAround(){
    //socket.emit('check_around',{user:user.toString()});
}

/**
* запрос на обновление высотных данных
**
function updateElevation(){
    //socket.emit('update_elevation',{user:user.toString()});
}

/**
* запрос на обновление погодных данных
**
function updateWeather(){
    //socket.emit('update_weather',{user:user.toString()});
}

/**
* запрашивает игровые сообщения с сервера 
**
function getGameMessages(){
    socket.emit('get_game_message_client',{user:user.toString()});
}

/**
* обработчик события получения игры от сервера
* инициализация объекта remoteGame
**/
socket.on('resume_game', function(data){
   if ( data.game ) {
        game = new Game(user);
        game.restore(data.game, beginUserLive);
        user.gameId = data.game.id;
        setMapOptions(game);
        game.startGame();       
   }
});

/**
* обработчик события получения игры от сервера
* инициализация объекта remoteGame
* присоединение к игре
**/
socket.on('new_game', function(data){
   if ( data.game ) {
        game = new Game(user);
        game.restore(data.game, function(){});
        user.gameId = data.game.id;
        setMapOptions(game);
        JoinUser.showAvailUnits(data.location);
   } 
}); 

/**
* обработчик события от сервера постановки игры на паузу
**
socket.on('game_pause_server', function(data){
    game.pauseGame();
});

/**
* обработчик события от сервера старта игры
**
socket.on('game_start_server', function(data){
    game.startGame();
});

/**
* обработчик события от сервера об инициализации игры
* получение и установка id игры и юзера
**
socket.on('game_init_server',function(data){ 
    game.id = data.gameId;
    user.gameId = data.gameId;
    hideElem(iface.preloader);
    //Debug.trace(data.msg);
});

/**
* обработчик события от сервера о клонировании игры
* получение и установка id игры и юзера
**
socket.on('game_clone_server',function(data){
    game.id = data.gameId;
    user.gameId = data.gameId;
    //Debug.trace(data.msg);
});

/**
* обработчик события от сервера о готовности к началу игры
* старт игры и начало посылки событий активности клиента
**
socket.on('game_ready', function(data){
   game.startGame();
   beginUserLive();
});

/**
* обработчик события получения данных от сервера для синхронизации
**/
socket.on('data_from_server',function(data){
    //Debug.trace(JSON.stringify(data.game));
    game.sync(data.game);
    updateInfoUnit();
    iface.addLog( data.game.logMessages );
    iface.addInfo( data.game.gameMessages );
    
});

/**
* обработчик события получения сообщений от сервера для вывода
**
socket.on('server_msg',function(data){
    iface.addLog( data.msg );
});

/**
* обработчик события от сервера о прекращении игры
* удаление клиентского объкта game и перезагрузка страницы
**
socket.on('game_exit_server',function(data){
   game.destroy(function(){
       iface.reloadPage('/');    
   });
});

/**
* обработчик события от сервера о перезагрузке страницы
**/
socket.on('client_refresh_by_server',function(data){
    window.location.assign(data.url);
});

/**
* обработчик события от сервера об окончании цикла
* проверки окружения полков
* запуск следующего цикла проверки
**
socket.on('check_around_done',function(data){
    setTimeout( checkAround, AROUND_TIMEOUT );
});

/**
* обработчик события от сервера об окончании цикла
* обновления высотных данных
* запуск следующего цикла обновления
**
socket.on('update_elevation_done',function(data){
    setTimeout( updateElevation, ELEVATION_TIMEOUT );
});

/**
* обработчик события от сервера об окончании цикла
* обновления погодных данных
* запуск следующего цикла обновления
**/
/*
socket.on('update_weather_done',function(data){
    setTimeout( updateWeather, WEATHER_TIMEOUT );
});

/**
* обработчик события получения игрового сообщения от сервера
**/
/*
socket.on('server_game_msg', function(data){
    iface.addInfo(data.msg);
});
*/

/**
* обработчик сообщения события окончания игры 
**/

socket.on('game_over', function(data){
    iface.showGameOver(getGameOverMess());
});

/*
socket.on('around_ready', function(data){
    checkAround();
});

*/

socket.on('to_user_live', function(data){
    console.log(data.location);
});    

    
