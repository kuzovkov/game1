/**
* управление стартовым интерфейсом игры
**/

/**
* объект содержащий элементы интерфейса
**/
var Interface = {};



Interface.init = function() {
    Interface.wrap_start_div = document.getElementById('wrap-start');
    Interface.map_div = document.getElementById('map');
    Interface.mission_select = null;
    Interface.country_select = null;
    Interface.parent_mission_select = document.getElementById('td-mission');
    Interface.parent_country_select = document.getElementById('td-country');
    Interface.button_start = document.getElementById('btn-start');
    Interface.input_name = document.getElementById('input-name');
    Interface.error_div = document.getElementById('error-block');
    Interface.button_exit = document.getElementById('btn-exit');
    Interface.button_pause = document.getElementById('btn-pause');
    Interface.log_div = document.getElementById('log-message');
    Interface.info_div = document.getElementById('info-message');
    Interface.unitinfo_div = document.getElementById('unit-info');
    Interface.weatherinfo_div = document.getElementById('weather-info');
    Interface.gameover_div = document.getElementById('game-over');
    Interface.label_next = document.getElementById('label-next');
    Interface.preloader = document.getElementById('preloader');
    Interface.label_mission = document.getElementById('mission-label');
    Interface.missioninfo_div = document.getElementById('mission-info');
    Interface.missiondesc_p = document.getElementById('mission-desc');
    Interface.button_menu = document.getElementById('btn-menu');

};    
    /*перезагрузка страницы*/
Interface.reloadPage = function(url){ window.location.replace(url); };
    
/**
* запись сообщения в поле лога
* @param mess массив строк сообщения
**/
Interface.addLog = function(mess){
    destroyChildren(this.log_div);
    for ( var i = 0; i < mess.length; i++ ){
        var p = document.createElement('p');
        p.innerText = mess[i];
        p.textContent = mess[i];
        this.log_div.appendChild(p);
    }
};

/**
* запись сообщения в поле сводки
* @param mess массив строк сообщения
**/
Interface.addInfo = function(mess){
    destroyChildren(this.info_div);
    for ( var i = 0; i < mess.length; i++ ){
        var p = document.createElement('p');
        p.innerText = mess[i];
        p.textContent = mess[i];
        this.info_div.appendChild(p);
    }
};

/**
* показ информации о юните
* @param unit объект содержащий данные об юните
**/
Interface.showUnit = function(unit){
    var ul = document.createElement('ul');
    for ( var item in unit ){
        if ( item == 'weather' ) continue;
        var li = document.createElement('li');
        var value = unit[item];
        if ( typeof(value) == 'boolean' && value == false ) value = 'Нет';
        if ( typeof(value) == 'boolean' && value == true ) value = 'Да';
        if ( typeof(value) == 'string' && translate[value] != undefined ) value = translate[value];
        var text = translate[item] + ': ' + value;
        li.innerText = text;
        li.textContent = text;
        ul.appendChild(li);
    }
    destroyChildren(this.unitinfo_div);
    destroyChildren(this.weatherinfo_div);
    this.weatherinfo_div.style.display = 'block';
    this.weatherinfo_div.innerHTML = formatWeatherData(unit.weather);
    this.unitinfo_div.style.display = 'block';
    this.unitinfo_div.appendChild(ul);
};

/**
* скрытие информации о юните
**/
Interface.hideUnit = function(){
    
    destroyChildren(this.unitinfo_div);
    this.unitinfo_div.style.display = 'none';
    destroyChildren(this.weatherinfo_div);
    this.weatherinfo_div.style.display = 'none';
};

/**
* показ описания миссии
**/
Interface.showMission = function(){
    var p = document.createElement('p');
    var text = game.mission.desc[game.country.id];
    p.innerText = text;
    p.textContent = text;
    this.missioninfo_div.style.display = 'block';
    this.missioninfo_div.appendChild(p);
};

/**
* скрытие описания миссии
**/
Interface.hideMission = function(){
    destroyChildren(this.missioninfo_div);
    this.unitinfo_div.style.display = 'none';
};

Interface.setMissionDecs = function(text){
    this.missiondesc_p.innerText = text;
    this.missiondesc_p.textContent = text; 
};

/**
* показ контекстного меню юнита
* @param unit объект юнита
**/
Interface.showMenu = function(unit){
    if ( unit.type.id == 'base' ) {
        return getBaseMenu(unit);
    }else{
        return getRegimentMenu(unit);
    }
};

/**
* показ сообщения об окончании игры 
**/
Interface.showGameOver = function(mess){
    var p = this.gameover_div.firstChild;
    p.innerText = mess;
    p.textContent = mess;
    this.gameover_div.style.display = 'block';
    window.onkeypress = function(e){  if(e.keyCode == 13) this.reloadPage('/');};
};

  

    





/*обработка кнопки меню*/
if (Interface.button_exit) Interface.button_exit.onclick = btnExitHandler;


/*обработка кнопки паузы*/
//iface.button_pause.onclick = function(){ btnPauseHandler(iface); };

/*обработчик клика на метке "Дальше"*/
if (iface.label_next) iface.label_next.onclick = function(){ iface.reloadPage('/'); };
if (iface.button_menu) iface.button_menu.onclick = function(){ iface.reloadPage('/');};

/*показ описания миссии*/
if (iface.label_mission) iface.label_mission.onmouseover = function(){ iface.showMission(); };

/*скрытие описания миссии*/
if (iface.label_mission) iface.label_mission.onmouseout = function(){ iface.hideMission(); }; 

/*включение скрытия/показа блоков*/
hideShowElement( document.getElementById('label-btn-block'), 'Скрыть кнопки', 'Показать кнопки', 'btn-block control-block grad2 font-response hide', 'btn-block control-block grad2 font-response' );
hideShowElement( document.getElementById('label-log-block'), 'Скрыть лог', 'Показать лог', 'log-block control-block grad2 font-response hide', 'log-block control-block grad2 font-response' );
hideShowElement( document.getElementById('label-info-block'), 'Скрыть сводку', 'Показать сводку', 'info-block control-block grad2 font-response hide', 'info-block control-block grad2 font-response' );

