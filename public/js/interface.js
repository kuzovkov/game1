/**
* объект пользовательского интерфейса
**/
var Interface = {};


Interface.init = function(app) {
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
    Interface.preloader = document.getElementById('preloader');
    Interface.label_mission = document.getElementById('mission-label');
    Interface.missioninfo_div = document.getElementById('mission-info');
    Interface.missiondesc_p = document.getElementById('mission-desc');
    Interface.button_menu = document.getElementById('btn-menu');
    Interface.button_clear_all = document.getElementById('btn-clear-all');
    Interface.button_begin_game = document.getElementById('btn-begin-game');
    Interface.selectCountry = document.getElementById('set-country');
    Interface.unitsList = document.getElementById('units-list');
    Interface.alert = document.getElementById('alert-wrap');
    Interface.alert_button = document.getElementById('alert-button');
    Interface.alert_text = document.getElementById('alert-text');
    Interface.preloader = document.getElementById('preloader');    
    /*установка сервиса маршрутов*/
    Interface.selectService = document.getElementById('service');
    Interface.alert_callback = false;
    Interface.input_username = document.getElementById('username');
    Interface.country_image = document.getElementById('country-image');
    Interface.lang_select = document.getElementById('lang');
    
    Interface.languages = {
        ru: {
            icon: '/img/country/Russia.png',
            name: 'Русский'
        },
        
        en: {
            icon: '/img/country/United-Kingdom.png',
            name: 'English'
        }       
    };
    Interface.lang = (Storage.load('lang') != null)? Storage.load('lang') : 'ru';
    //console.log(Storage.load('lang'));
    //Storage.clear();
    Helper.setCookie('lang',Interface.lang);
    Interface.dict = Dicts[Interface.lang];
    
    /*обработка выбора языка*/
    Interface.lang_select.onchange = function(){
        Interface.lang = Interface.lang_select.value;
        Storage.save('lang', Interface.lang_select.value);
        Helper.setCookie('lang',Interface.lang);
        Interface.dict = Dicts[Interface.lang];
        window.location.reload(true);
    };
    
    
    if ( Interface.alert_button ) Interface.alert_button.onclick = Interface.closeAlert;
    
     /*обработка кнопки удалить всех установленных юнитов*/
    if ( Interface.button_clear_all ) Interface.button_clear_all.onclick = app.clear;
    
    /*обработка кнопки начала игры*/
    if ( Interface.button_begin_game ) Interface.button_begin_game.onclick = app.begin;   
    
    /*обработка кнопки меню*/
    if (Interface.button_exit) Interface.button_exit.onclick = function(){ Interface.reloadPage('/'); };
    
    /*обработчик клика на метке "Дальше"*/
    if (Interface.label_next) Interface.label_next.onclick = function(){ Interface.reloadPage('/'); };
    
    if (Interface.button_menu) Interface.button_menu.onclick = function(){ Interface.reloadPage('/');};
    
    /*показ описания миссии*/
    if (Interface.label_mission) Interface.label_mission.onmouseover = function(){ Interface.showMission(); };
    
    /*скрытие описания миссии*/
    if (Interface.label_mission) Interface.label_mission.onmouseout = function(){ Interface.hideMission(); }; 

    /*включение скрытия/показа блоков*/
    Interface.hideShowElement( document.getElementById('label-btn-block'), '-', '+', 'btn-block control-block grad2 font-response hide', 'btn-block control-block grad2 font-response' );
    Interface.hideShowElement( document.getElementById('label-log-block'), '-', '+', 'log-block control-block grad2 font-response hide', 'log-block control-block grad2 font-response' );
    Interface.hideShowElement( document.getElementById('label-info-block'), '-', '+', 'info-block control-block grad2 font-response hide', 'info-block control-block grad2 font-response' );

    /*смена сервиса маршрутов*/
    if (Interface.selectService) Interface.selectService.onchange = function(){
		Route.service = Interface.selectService.value;
	};
    
    Interface.fillLangSelect();
    
};    
    /*перезагрузка страницы*/
Interface.reloadPage = function(url){ window.location.replace(url); };
    
/**
* запись сообщения в поле лога
* @param mess массив строк сообщения
**/
Interface.addLog = function(mess){
    this.destroyChildren(this.log_div);
    for ( var i = 0; i < mess.length; i++ ){
        var p = document.createElement('p');
        for(key in this.dict){
            if (mess[i].indexOf(key) != -1){
                var regV = new RegExp(key,"g");
                mess[i] = mess[i].replace(regV,this.dict[key]);
            }
        }
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
    this.destroyChildren(this.info_div);
    for ( var i = 0; i < mess.length; i++ ){
        var p = document.createElement('p');
        for(key in this.dict){
            if (mess[i].indexOf(key) != -1){
                var regV = new RegExp(key,"g");
                mess[i] = mess[i].replace(regV,this.dict[key]);
            }
        }
        p.innerText = mess[i];
        p.textContent = mess[i];
        this.info_div.appendChild(p);
    }
};

/**
* заполнения селекта языков
**/
Interface.fillLangSelect = function(){
    this.destroyChildren(this.lang_select);
    for (var key in this.languages){
        if (this.languages[key].name != undefined){
            var opt = document.createElement('option');
            opt.innerText = this.languages[key].name;
            opt.textContent = this.languages[key].name;
            opt.value = key;
            if (key == this.lang) opt.setAttribute('selected','selected');
            this.lang_select.appendChild(opt);
        }
        
    }
};

/**
* объект для перевода представления данных об юните
**/

Interface.translate = {
    id: 'identificator',
    country: 'country',
    type: 'type',
    people: 'people',
    ammo: 'ammo',
    food: 'food',
    discipline: 'discipline',
    experience: 'experience',
    elevation: 'elevation',
    battle: 'battle_',
    status: 'status',
    attack: 'attack',
    defense: 'defense',
    march: 'march',
    weather: 'weather'  
};

/**
* удаление дочерних узлов у DOM элемента
* @param node DOM элемент
**/
Interface.destroyChildren = function(node){
  if (!node) return;
  node.innerHTML = '';
  while (node.firstChild)
      node.removeChild(node.firstChild);
}

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
        if ( typeof(value) == 'boolean' && value == false ) value = this.dict['no'];
        if ( typeof(value) == 'boolean' && value == true ) value = this.dict['yes'];
        if ( typeof(value) == 'string' && this.dict[this.translate[value]] != undefined ) value = this.dict[this.translate[value]];
        if ( typeof(value) == 'string' && this.dict[value] != undefined) value = this.dict[value];
        var text = this.dict[this.translate[item]] + ': ' + value;
        li.innerText = text;
        li.textContent = text;
        ul.appendChild(li);
    }
    this.destroyChildren(this.unitinfo_div);
    this.destroyChildren(this.weatherinfo_div);
    this.weatherinfo_div.style.display = 'block';
    this.weatherinfo_div.innerHTML = this.formatWeatherData(unit.weather);
    this.unitinfo_div.style.display = 'block';
    this.unitinfo_div.appendChild(ul);
};

/**
* скрытие информации о юните
**/
Interface.hideUnit = function(){
    
    this.destroyChildren(this.unitinfo_div);
    this.unitinfo_div.style.display = 'none';
    this.destroyChildren(this.weatherinfo_div);
    this.weatherinfo_div.style.display = 'none';
};

/**
* показ описания миссии
**/
Interface.showMission = function(){
    var p = document.createElement('p');
    var text = App.game.location.mission;
    p.innerText = this.dict[text];
    p.textContent = this.dict[text];
    this.missioninfo_div.style.display = 'block';
    this.missioninfo_div.appendChild(p);
};

/**
* скрытие описания миссии
**/
Interface.hideMission = function(){
    this.destroyChildren(this.missioninfo_div);
    this.unitinfo_div.style.display = 'none';
};

Interface.setMissionDecs = function(text){
    this.missiondesc_p.innerText = this.dict[text];
    this.missiondesc_p.textContent = this.dict[text]; 
};

/**
* показ контекстного меню юнита
* @param unit объект юнита
**/
Interface.showMenu = function(unit){
    if ( unit.type.id == 'base' ) {
        return this.getBaseMenu(unit);
    }else{
        return this.getRegimentMenu(unit);
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

/**
* функция для скрытия/развертывания блока
* @param el элемент по которому кликаем 
* @param textHide текст элемента для сворачивания
* @param textShow текст элемента для разворачивания
* @param classHide класс присваиваемый для сокрытия
* @param classShow класс присваиваемый для разворачивания
**/
Interface.hideShowElement = function(el, textHide, textShow, classHide, classShow){
    if (!el) return;
    var parent = el.parentNode;
    el.onclick = function(){
        if ( el.innerText == textHide || el.textContent == textHide ){
        el.innerText = textShow;
        el.textContent = textShow;
        parent.className = classHide;
        }else{
            el.innerText = textHide;
            el.textContent = textHide;
            parent.className = classShow;
        }
    }
};

/**
* показ элемента
* @param el объект элемента
**/
Interface.showElem = function(el){
	if (el) el.style.display = 'inline-block';
}
/**
* скрытие элемента
* @param el объект элемента
**/
Interface.hideElem = function(el){
	if (el) el.style.display = 'none';
}




/**
* обновление информации об юните во всплывающем блоке
**/
Interface.updateInfoUnit = function(){
    if ( Interface.unitinfo_div.style.display == 'block' && Mouse.overUnit != null){
        this.showUnit(Mouse.overUnit.getInfo());
    }  
};

/**
* возвращает html код меню для полка
* @param object объект юнита
**/
Interface.getRegimentMenu = function(object){ 
    var menu = '';
    if (object.OWN ){
        var menu = "<ul id='" + object.id + "'class='regiment unit-menu'>\
                        <li onclick='Mouse.unitcontextmenu(0,"+object.id+")'>"+this.dict['stop']+"</li>\
                        <li onclick='Mouse.unitcontextmenu(1,"+object.id+")'>"+this.dict['march']+"</li>\
                        <li onclick='Mouse.unitcontextmenu(2,"+object.id+")'>"+this.dict['defense']+"</li>\
                        <li onclick='Mouse.unitcontextmenu(3,"+object.id+")'>"+this.dict['attack']+"</li>\
                    </ul>";
    }else{
        var menu = "<ul id='" + object.id + "'class='regiment unit-menu'>\
                        <li onclick='Mouse.unitcontextmenu(4,"+object.id+")'>"+this.dict['attack']+"</li>\
                    </ul>";
    }
    return menu;
};

/**
* возвращает html код меню для базы
* @param object объект юнита
**/
Interface.getBaseMenu = function(object){ 
    var menu = '';
    if (object.OWN ){
        var menu = "<ul id='" + object.id + "'class='regiment unit-menu'>\
                        <li onclick='Mouse.unitcontextmenu(5,"+object.id+")'>"+this.dict['stop']+"</li>\
                        <li onclick='Mouse.unitcontextmenu(6,"+object.id+")'>"+this.dict['march']+"</li>\
                        <li onclick='Mouse.unitcontextmenu(7,"+object.id+")'>"+this.dict['defense']+"</li>\
                        <li onclick='Mouse.unitcontextmenu(9,"+object.id+")'>"+this.dict['convoy']+"</li>\
                    </ul>";
    }else{
        var menu = "<ul id='" + object.id + "'class='regiment unit-menu'>\
                        <li onclick='Mouse.unitcontextmenu(8,"+object.id+")'>"+this.dict['destroy_']+"</li>\
                    </ul>";
    }
    return menu;
};


/**
* показ блоков с кнопками и сообщениями
**/
Interface.showControlBlocks = function(){
    var blocks = document.getElementsByClassName('control-block');
        for ( var i = 0; i < blocks.length; i++ ){
            blocks[i].style.display = 'block';
        }
}

/**
* возвращает html представление для погодных данных
* @param weather объект содержащий погодные данные
* @return html код для отображения в панели погодных данных
**/
Interface.formatWeatherData = function(weather){
    if (weather == null)return '';
    
    var content = '<div class="weather-img">';
    content += (weather.frshht.slice(0,6) == '000000')? '<img class="weather-icon" src="/img/weather/sun.png"/>' : '';
    content += (weather.frshht.slice(0,1) == '1')? '<img class="weather-icon" src="/img/weather/Fog.png"/>' : '';
    content += (weather.frshht.slice(1,2) == '1')? '<img class="weather-icon" src="/img/weather/Rain.png"/>' : '';
    content += (weather.frshht.slice(2,3) == '1')? '<img class="weather-icon" src="/img/weather/Snow.png"/>' : '';
    content += (weather.frshht.slice(3,4) == '1')? '<img class="weather-icon" src="/img/weather/Hail.png"/>' : '';
    content += (weather.frshht.slice(4,5) == '1')? '<img class="weather-icon" src="/img/weather/Thunder.png"/>' : '';
    content += (weather.frshht.slice(5,6) == '1')? '<img class="weather-icon" src="/img/weather/Tornado.png"/>' : '';
    content += '</div>';
    
    content += '<div class="weather-line">';
    content += (weather.frshht.slice(0,1) == '1')? ' '+this.dict['fog']+' ' : '';
    content += (weather.frshht.slice(1,2) == '1')? ' '+this.dict['rain']+'  ' : '';
    content += (weather.frshht.slice(2,3) == '1')? ' '+this.dict['snow']+' ' : '';
    content += (weather.frshht.slice(3,4) == '1')? ' '+this.dict['thunder']+' ' : '';
    content += (weather.frshht.slice(4,5) == '1')? ' '+this.dict['fog']+' ' : '';
    content += (weather.frshht.slice(5,6) == '1')? ' '+this.dict['tornado']+' ' : '';
    content += this.dict['temperature'] + weather.temperature.toFixed(1);
    content += this.dict['wind'];
    content += (weather.wind != null)? weather.wind.toFixed(1): '---';
    content += this.dict['pressure'];
    content += (weather.pressure != null)? 760 * weather.pressure.toFixed(1):'---';
    content += this.dict['visib'];
    content += (weather.visib != '999.9')? (parseFloat(weather.visib) * 1609).toFixed(1) : '---';
    content += this.dict['prcp'];
    content += (weather.prcp != '99.99')? (parseFloat(weather.prcp.slice(0,4))*2.54).toFixed(1) : 0;
    
    content += '</div>';
    return content;
};

/**
* Показ модального диалогового окна типа alert
* @rapam msg текст сообщения
* @param callback функция обратного вызова, после закрытия диалога
**/
Interface.showAlert = function(msg, callback){
    this.alert.style.display = 'block';
    this.alert_text.innerText = msg;
    this.alert_text.textContent = msg;
    this.alert_callback = (callback)? callback : false;
};

/**
* Закрытие модального диалогового окна типа alert
**/
Interface.closeAlert = function(){
    Interface.alert.style.display = 'none';
    if (Interface.alert_callback) Interface.alert_callback();
};

/**
* Показ прелоадера
**/
Interface.showPreloader = function(){
    if (Interface.preloader) Interface.preloader.style.display = 'block';
};

/**
* Скрытие прелоадера
**/
Interface.hidePreloader = function(){
    if (Interface.preloader) Interface.preloader.style.display = 'none';
};  

    