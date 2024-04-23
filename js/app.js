// *Este proyecto simula a una pagina Web Del Clima,
// *con los 32 estados Mexicanos
// @Grade: 4°D;
// @Date: 4-22-2024;
// @Noctrl: 22308060610341;
// @Author: Morales Tapia Jesus Ivan;
// @Teacher: Treviño Tapia Juan Ruben;

let url ="https://api.openweathermap.org/data/2.5/forecast?q=chihuahua,MX&units=metric&cnt=7&lang=es&appid=33acf38750071dd18bda6f3694cd5069";
let week = ["Domingo","Lunes","Martes","Miercoles","Jueves","Viernes","Sabado",]; //Posicion del dia que se mostrara en pantalla

let boton_aceptar_cookies = document.getElementById('btn-aceptar-cookies');
let boton_cancelar_cookies = document.getElementById('btn-cancelar-cookies');
let theme_button = document.getElementById("theme_button");
let buttons = document.getElementById("buttons");
let states = document.getElementById("states");
let state = document.getElementById("state");
let grad = document.getElementById("grados");
let pre = document.getElementById("pre");
let vel = document.getElementById("vel");
let img = document.getElementById("img");
let dia = document.getElementById("dia");

const date = new Date();

let grados_value_metric_imperial = false; //false = metric, true = imperial;
let dataWin, lat, lon, value_cookie_pest, data_value, num_value;
let accep_api, btn = true;
let variable = "chihuahua";
let array_days = [];
let theme = false; //false = drak, true = light;
let dp = 0,accep_api_num = 0;

clima_index();

api_ifs();

boton_aceptar_cookies.addEventListener('click', (value) => {
    value.preventDefault();

    value.target.parentElement.parentElement.children[0].classList.remove("activo");
    value.target.parentElement.parentElement.children[1].classList.remove("activo");

    document.cookie = "estado = Chihuahua;";

    accep_api = true;
    
    api_ifs();
});

boton_cancelar_cookies.addEventListener('click', (value) => {
    value.preventDefault();
    value.target.parentElement.parentElement.children[0].classList.remove("activo");
    value.target.parentElement.parentElement.children[1].classList.remove("activo");

    accep_api = false;

    localStorage.setItem("validacion","cancelar");
    
    api_ifs();
});

theme_button.addEventListener("click",()=>{
    (theme)? dark_whithe_theme("dark", "dark", "primary", "black") : dark_whithe_theme("light", "white", "warning", "light");
});

states.addEventListener("click", (values) => {
    values.preventDefault();

    if (values.target.textContent.length < 20) {
        variable = values.target.textContent;
        url ="https://api.openweathermap.org/data/2.5/forecast?q="+values.target.textContent+",MX&units=metric&cnt=7&lang=es&appid=33acf38750071dd18bda6f3694cd5069";

        if (accep_api)
            document.cookie = "estado="+values.target.textContent+";max-age=60*60*24*1";

        state.textContent = values.target.textContent;

        clima_index();
    }
});

document.getElementById("grados").addEventListener("click",(values)=>{
    values.preventDefault();

    let url_imperial = "https://api.openweathermap.org/data/2.5/forecast?q="+variable+",MX&units=imperial&cnt=7&lang=es&appid=33acf38750071dd18bda6f3694cd5069";
    let url_metric = "https://api.openweathermap.org/data/2.5/forecast?q="+variable+",MX&units=metric&cnt=7&lang=es&appid=33acf38750071dd18bda6f3694cd5069";

    (grados_value_metric_imperial)? url = url_metric : url = url_imperial;

    btn = false;

    clima_index();
});

buttons.addEventListener("click", (values) => {
    values.preventDefault();

    let i = values.target.className.slice(values.target.className.length - 1);

    if (i >= 0 && i <= 6) {
        if (i==0) 
            inputWeather(dataWin, date.getDay());
        else
            inputWeather(dataWin, date.getDay()+array_days[i-1]);
    }
});

function api_ifs() {
    if (document.cookie.length == 0 && !(localStorage.getItem("validacion") === "cancelar") ) {
        boton_aceptar_cookies.parentElement.parentElement.children[0].classList.add("activo");
        boton_aceptar_cookies.parentElement.parentElement.children[1].classList.add("activo");   
    }
    
    if (document.cookie.length >= 1){
        state.textContent = document.cookie.split("=")[1];
        url ="https://api.openweathermap.org/data/2.5/forecast?q="+document.cookie.split("=")[1]+",MX&units=metric&cnt=7&lang=es&appid=33acf38750071dd18bda6f3694cd5069"
    }  
};

function dark_whithe_theme(dark_light, dark_white, primary_warning, black_light){
    theme = !theme;
    theme_button.src = "img/theme_"+dark_white+".svg";
    state.className = "text-"+primary_warning+" font-monospace";
    states.className = "dropdown-menu bg-"+black_light+" list_data_scroll";
    document.getElementById("body").className = "color_bg_"+dark_light;
    document.getElementById("container_2").className = "container backGround_"+dark_light+"_2";
    document.getElementById("container_1").className = "container-fluid my-5 backGround_"+dark_light+"_1";
    document.getElementById("button_dropdawn_2").className = "btn btn-outline-"+primary_warning+" font-monospace";
}

function clima_index() {
    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            dataWin = data;

            selectDay(date.getDay());

            dp = date.getDay();

            inputWeather(data, dp);

            for (let i = 0; i <= 6; i++) {
                if (i == 0) {
                    buttons.children[i].children[0].textContent = week[dp];
                    buttons.children[i].children[1].src = "img/" + data.list[dp].weather[0].icon + ".svg";
                } else {
                    buttons.children[i].children[0].textContent = week[dp + array_days[i - 1]];
                    buttons.children[i].children[1].src ="img/"+data.list[dp + array_days[i - 1]].weather[0].icon+".svg";
                }
            }
        })
        .catch((error) => {
            // console.log(boton_cancelar_cookies);
            boton_cancelar_cookies.parentElement.parentElement.children[0].classList.remove("activo");
            // boton_cancelar_cookies.parentElement.parentElement.children[1].classList.remove("activo");

            document.getElementById("ethernet_error").classList.remove("d-none");
            document.getElementById("ethernet_error").classList.add("d-block");

            document.getElementById("img").classList.add("d-none");     
        });
}

function colocar(value) { 
    switch (value) {
        case "0":
            inputWeather(dataWin, date.getDay());
            return;
        case "1":
            inputWeather(dataWin, date.getDay()+array_days[0]);
            return;
        case "2":
            inputWeather(dataWin, date.getDay()+array_days[1]);
            return;
        case "3":
            inputWeather(dataWin, date.getDay()+array_days[2]);
            return;
        case "4":
            inputWeather(dataWin, date.getDay()+array_days[3]);
            return;
        case "5":
            inputWeather(dataWin, date.getDay()+array_days[4]);
            return;
        case "6":
            inputWeather(dataWin, date.getDay()+array_days[5]);
            return;
    }
}
function inputWeather(data, num) {
    dia.textContent = week[num];

    data_value = data;
    num_value = num;

    (btn) ? kmh_mph("°C|F", "km/h", 1, data, num) : validation_m_or_k(data, num);
   
    pre.textContent = data.list[num].main.humidity + "% - ";

    img.src = "img/" + data.list[num].weather[0].icon + ".svg";
}

function validation_m_or_k(data, num){
    console.log("cargando");
    (grados_value_metric_imperial)? kmh_mph("°C|F", "km/h", 1, data, num) : kmh_mph("°F|C", "mph", 1.609, data, num);

    grados_value_metric_imperial = !grados_value_metric_imperial;
};

function kmh_mph(string, string2, number, data, num){
    grad.textContent = Math.round(data.list[num].main.temp) + string;  

    vel.textContent = Math.round((data.list[num].wind.speed * 3.6) / number) + string2;
    console.log("cargado");
};

function selectDay(day) {
    switch (day) {
        case 0: //domingo
            array_days = [1, 2, 3, 4, 5, 6];
            break;
        case 1: //lunes
            array_days = [1, 2, 3, 4, 5, -1];
            break;
        case 2: //martes
            array_days = [1, 2, 3, 4, -2, -1];
            break;
        case 3: //miercoles
            array_days = [1, 2, 3, -3, -2, -1];
            break;
        case 4: //jueves
            array_days = [1, 2, -4, -3, -2, -1];
            break;
        case 5: //viernes
            array_days = [1, -5, -4, -3, -2, -1];
            break;
        case 6: //sabado
            array_days = [-6, -5, -4, -3, -2, -1];
            break;
    }
}