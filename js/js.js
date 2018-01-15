//ENTORNO
var g = 1.622;
var dt = 0.016683;
var timer = null;
var timerFuel = null;
//NAVE
var y = 0; // altura inicial y0=10%, debe leerse al iniciar si queremos que tenga alturas diferentes dependiendo del dispositivo
var v = 0;
var c = 100;
var a = g; //la aceleración cambia cuando se enciende el motor de a=g a a=-g (simplificado)
//MARCADORES
var velocidad = null;
var altura = null;
var combustible = null;
var aterrizado = false;

//al cargar por completo la página...
window.onload = function () {

    velocidad = document.getElementById("velocidad");
    altura = document.getElementById("altura");
    combustible = document.getElementById("fuel");


    //definición de eventos
    //mostrar menú móvil
    document.getElementById("showm").onclick = function () {
        document.getElementsByClassName("b")[0].style.display = "block";
        document.getElementById("showm").style.display = "none";
        stop();
    };

    document.getElementById("sPausa").onclick = function () {
        document.getElementsByClassName("b")[0].style.display = "none";
        document.getElementById("showm").style.display = "block";
        start();
    }
    document.getElementById("sReiniciar").onclick = function () {
        document.getElementsByClassName("b")[0].style.display = "none";
        document.getElementById("showm").style.display = "block";
        reiniciar();
    }
    document.getElementById("sAjustes").onclick = function () {
        mostrarAjustes();
        document.getElementsByClassName("b")[0].style.display = "none";
    }
    //encender/apagar el motor al hacer click en la pantalla
    document.getElementById("palanca").onclick = function () {
        if (a == g) {
            motorOn();
            document.getElementById("power").src = "img/botonOn.png";
        } else {
            motorOff();
            document.getElementById("power").src = "img/botonOff.png";
        }
    };

    //encender/apagar al apretar/soltar una tecla
    document.onkeydown = function (e) {
        if (document.getElementById("pausa").innerHTML == "Reanudar") {
            motorOff();
        } else {
            if (e.keyCode == 32) {
                motorOn();
            }
        }
    };
    document.onkeyup = motorOff;

    //Empezar a mover la nave justo después de cargar la página
    start();
    //Pausa el juego
    document.getElementById("pausa").onclick = pause;
    document.getElementById("reiniciar").onclick = reiniciar;
    document.getElementById("ajustes").onclick = function () {
        if (document.getElementById("pausa").innerHTML != "Reanudar") {
            pause();
        }
        mostrarAjustes();
    };
    document.getElementById("modo").onclick = modo;
    document.getElementById("instrucciones").onclick = mostrarInstrucciones;
    document.getElementById("acerca").onclick = mostrarAcerca;
    document.getElementsByClassName("cerrar")[0].onclick = function () {
        ocultarVictoria();
        reiniciar();
    };
    document.getElementsByClassName("cerrar")[1].onclick = function () {
        ocultarDerrota();
        reiniciar();
    };
    document.getElementsByClassName("cerrar")[2].onclick = function () {
        document.getElementsByClassName("b")[0].style.display = "block";
        ocultarAjustes();
    }
    document.getElementsByClassName("cerrar")[3].onclick = ocultarInstrucciones;
    document.getElementsByClassName("cerrar")[4].onclick = ocultarAcerca;
};

//Definición de funciones
function start() {
    //cada intervalo de tiempo mueve la nave
    timer = setInterval(function () {
        moverNave();
    }, dt * 1000);
}

function stop() {
    clearInterval(timer);
}

function reiniciar() {
    y = 0;
    v = 0;
    c = 100;
    a = g;
    g = 1.622;
    dt = 0.016683;
    clearInterval(timer);
    start();
    aterrizado = false;
    document.getElementById("fuel").innerHTML = "100";
    document.getElementById("pausa").innerHTML = "Pausa";
    document.getElementById('menu').style.display = 'block';
    document.getElementById('showm').style.display = 'block';
    document.getElementById("power").src = "img/botonOff.png";
}

function pause() {
    if (document.getElementById("pausa").innerHTML == "Reanudar") {
        start();
        document.getElementById("pausa").innerHTML = "Pausa";
    } else {
        document.getElementById("pausa").innerHTML = "Reanudar";
        stop();
    }
}

function modo() {
    if (document.getElementById("modo").innerHTML == "Modo: Fácil") {
        document.getElementById("modo").innerHTML = "Modo: Difícil";
        reiniciar();
        ocultarAjustes();
    } else {
        document.getElementById("modo").innerHTML = "Modo: Fácil";
        reiniciar();
        ocultarAjustes();
    }
}

function moverNave() {
    //cambiar velocidad y posicion
    v += a * dt;
    y += v * dt;
    //actualizar marcadores
    velocidad.innerHTML = v.toFixed(2);
    marcadorAltura = 70 - y;
    if (marcadorAltura < 0) {
        marcadorAltura = 0;
    }
    altura.innerHTML = marcadorAltura.toFixed(2);

    //mover hasta que top sea un 70% de la pantalla
    if (y < 70) {
        if (y < 0) {
            v = 0;
            y = 0;
        }
        document.getElementById("nave").style.top = y + "%";
    } else {
        stop();
        aterrizado = true;//la nave ha aterrizado
        if (document.getElementById("modo").innerHTML == "Modo: Difícil") {
            if (v < 1) {
                mostrarVictoria();
            } else {
                mostrarDerrota();
            }
        } else {
            if (v < 5) {
                mostrarVictoria();
            } else {
                mostrarDerrota();
            }
        }
    }
}

function motorOn() {
    //si ha aterrizado o se quedas sin fuel el motor se apaga
    if (aterrizado || c == 0) {
        motorOff();
    } else {
        //el motor da aceleración a la nave
        a = -g;
        //mientras el motor esté activado gasta combustible
        if (timerFuel == null) {
            timerFuel = setInterval(function () {
                actualizarFuel();
            }, 10);
            document.getElementById("naveimg").src = "img/nave2.gif";
        }
    }
}

function motorOff() {
    a = g;
    clearInterval(timerFuel);
    timerFuel = null;
    document.getElementById("naveimg").src = "img/nave.png";
}

function actualizarFuel() {
    //Restamos combustible hasta que se agota
    c -= 0.1;
    if (c < 0) {
        c = 0;
    }
    combustible.innerHTML = c.toFixed(0);
}

function mostrarVictoria() {
    document.getElementById('vEnhorabuena').style.display = 'block'; // Y lo hacemos visible
    document.getElementById('menu').style.display = 'none';
    document.getElementById('showm').style.display = 'none';
}
function ocultarVictoria() {
    document.getElementById('vEnhorabuena').style.display = 'none';
}

function mostrarDerrota() {
    document.getElementById('vDerrota').style.display = 'block'; // Y lo hacemos visible
    document.getElementById('boom').style.display = 'block';
    document.getElementById('menu').style.display = 'none';
    document.getElementById('showm').style.display = 'none';
}

function ocultarDerrota() {
    document.getElementById('vDerrota').style.display = 'none';
    document.getElementById('boom').style.display = 'none';
}

function mostrarAjustes() {
    document.getElementById('vAjustes').style.display = 'block';// lo hacemos invisible
    document.getElementById('menu').style.display = 'none';
}

function ocultarAjustes() {
    document.getElementById('vAjustes').style.display = 'none'; // Y lo hacemos invisible
    document.getElementById('menu').style.display = 'block';
}

function mostrarInstrucciones() {
    document.getElementById('vInstrucciones').style.display = 'block';// lo hacemos invisible
    document.getElementById('vAjustes').style.display = 'none';
}

function ocultarInstrucciones() {
    document.getElementById('vInstrucciones').style.display = 'none'; // Y lo hacemos invisible
    document.getElementById('vAjustes').style.display = 'block';
}

function mostrarAcerca() {
    document.getElementById('vAcerca').style.display = 'block'; // Y lo hacemos visible
    document.getElementById('vAjustes').style.display = 'none';
}

function ocultarAcerca() {
    document.getElementById('vAcerca').style.display = 'none'; // Y lo hacemos invisible
    document.getElementById('vAjustes').style.display = 'block';
}
