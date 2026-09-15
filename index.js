const jogo = document.getElementById("jogo");
const nave = document.getElementById("nave");

const pontosTexto = document.getElementById("pontos");
const vidasTexto = document.getElementById("vidas");
const faseTexto = document.getElementById("fase");

const mensagem = document.getElementById("mensagem");
const titulo = document.getElementById("titulo");
const texto = document.getElementById("texto");

let pontos = 0;
let vidas = 3;
let fase = 1;
let ativo = true;

let esquerda = false;
let direita = false;

let inimigos = [];
let tiros = [];


document.addEventListener("keydown", function(e) {

    if (e.key == "a") {
        esquerda = true;
    }

    if (e.key == "d") {
        direita = true;
    }

    if (e.code == "Space") {
        atirar();
    }
});


document.addEventListener("keyup", function(e) {

    if (e.key == "a") {
        esquerda = false;
    }

    if (e.key == "d") {
        direita = false;
    }
});


function atirar() {

    if (!ativo) return;

    let tiro = document.createElement("div");

    tiro.className = "tiro";
    tiro.innerHTML = "🔸";

    tiro.style.left = nave.offsetLeft + 15 + "px";
    tiro.style.top = nave.offsetTop + "px";

    jogo.appendChild(tiro);
    tiros.push(tiro);
}


function criarInimigo() {

    if (!ativo) return;

    let inimigo = document.createElement("div");

    inimigo.className = "inimigo";
    inimigo.innerHTML = "👾";

    inimigo.style.left =
        Math.random() * (jogo.clientWidth - 40) + "px";

    jogo.appendChild(inimigo);
    inimigos.push(inimigo);
}


setInterval(criarInimigo, 1200);


function atualizar() {

    if (!ativo) return;


    if (esquerda) {
        nave.style.left = nave.offsetLeft - 10 + "px";
    }

    if (direita) {
        nave.style.left = nave.offsetLeft + 10 + "px";
    }


    if (nave.offsetLeft < 0) {
        nave.style.left = "0px";
    }

    if (nave.offsetLeft > jogo.clientWidth - nave.offsetWidth) {
        nave.style.left =
            jogo.clientWidth - nave.offsetWidth + "px";
    }


    tiros.forEach(function(tiro, i) {

        tiro.style.top = tiro.offsetTop - 8 + "px";

        if (tiro.offsetTop < 0) {
            tiro.remove();
            tiros.splice(i, 1);
        }
    });


    inimigos.forEach(function(inimigo, i) {

        inimigo.style.top =
            inimigo.offsetTop + fase + 1 + "px";


        if (inimigo.offsetTop > jogo.clientHeight) {

            inimigo.remove();
            inimigos.splice(i, 1);

            perderVida();
        }


        if (
            inimigo.offsetLeft < nave.offsetLeft + nave.offsetWidth &&
            inimigo.offsetLeft + inimigo.offsetWidth > nave.offsetLeft &&
            inimigo.offsetTop < nave.offsetTop + nave.offsetHeight &&
            inimigo.offsetTop + inimigo.offsetHeight > nave.offsetTop
        ) {

            inimigo.remove();
            inimigos.splice(i, 1);

            perderVida();
        }
    });


    verificarColisao();

    requestAnimationFrame(atualizar);
}


function verificarColisao() {

    tiros.forEach(function(tiro, i) {

        inimigos.forEach(function(inimigo, j) {

            if (
                tiro.offsetLeft < inimigo.offsetLeft + inimigo.offsetWidth &&
                tiro.offsetLeft + tiro.offsetWidth > inimigo.offsetLeft &&
                tiro.offsetTop < inimigo.offsetTop + inimigo.offsetHeight &&
                tiro.offsetTop + tiro.offsetHeight > inimigo.offsetTop
            ) {

                tiro.remove();
                inimigo.remove();

                tiros.splice(i, 1);
                inimigos.splice(j, 1);

                pontos++;

                pontosTexto.innerHTML = pontos;


                fase = Math.floor(pontos / 20) + 1;

                if (fase > 5) {
                    fase = 5;
                }

                faseTexto.innerHTML = fase;


                if (pontos >= 100) {
                    vencer();
                }
            }
        });
    });
}


function perderVida() {

    vidas--;

    vidasTexto.innerHTML = vidas;

    if (vidas == 0) {
        gameOver();
    }
}


function gameOver() {

    ativo = false;

    titulo.innerHTML = "💀 GAME OVER";
    texto.innerHTML = "Você fez " + pontos + " pontos.";

    mensagem.classList.remove("escondido");
}


function vencer() {

    ativo = false;

    titulo.innerHTML = "🏆 VOCÊ VENCEU!";
    texto.innerHTML = "Você chegou aos 100 pontos!";

    mensagem.classList.remove("escondido");
}


function reiniciar() {

    pontos = 0;
    vidas = 3;
    fase = 1;
    ativo = true;

    pontosTexto.innerHTML = 0;
    vidasTexto.innerHTML = 3;
    faseTexto.innerHTML = 1;


    inimigos.forEach(function(inimigo) {
        inimigo.remove();
    });

    tiros.forEach(function(tiro) {
        tiro.remove();
    });


    inimigos = [];
    tiros = [];


    nave.style.left = "50%";

    mensagem.classList.add("escondido");

    atualizar();
}


atualizar();