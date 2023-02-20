function newElement (tagName, className) {
    const elem = document.createElement(tagName);
    elem.className = className;
    return elem;
}

function Obstaculo(reversa = false) {
    this.elemento = newElement('div', 'obstaculo');

    const borda = newElement('div', 'borda');
    const corpo = newElement('div', 'corpo');

    this.elemento.appendChild(reversa ? corpo : borda);
    this.elemento.appendChild(reversa ? borda : corpo);

    this.setAltura = altura => corpo.style.height = `${altura}px`;
}

//const b = new Obstaculo(true);
//b.setAltura(200);
//document.querySelector('[tp-flappy]').appendChild(b.elemento);


function ParDeObstaculos(altura, abertura, posicao) {
    this.elemento = newElement('div', 'par-obstaculos');

    this.superior = new Obstaculo(true);
    this.inferior = new Obstaculo(false);

    this.elemento.appendChild(this.superior.elemento);
    this.elemento.appendChild(this.inferior.elemento);

    this.aberturaAleatoria = () => {
        const alturaSuperior = Math.random() * (altura - abertura);
        const alturaInferior = altura - abertura - alturaSuperior;

        this.superior.setAltura(alturaSuperior);
        this.inferior.setAltura(alturaInferior);
    }

    this.getPosicao = () => parseInt(this.elemento.style.left.split(`px`));

    this.setPosicao = posicao => this.elemento.style.left = `${posicao}px`;

    this.getLargura = () => this.elemento.clientWidth;

    this.aberturaAleatoria()
    this.setPosicao(posicao)
}

//const b = new ParDeObstaculos(700, 200, 800);
//document.querySelector('[tp-flappy]').appendChild(b.elemento);

function Obstaculos(altura, largura, abertura, espaco, pontuacao) {
    this.pares = [
        new ParDeObstaculos(altura, abertura, largura),
        new ParDeObstaculos(altura, abertura, largura + espaco),
        new ParDeObstaculos(altura, abertura, largura + espaco * 2),
        new ParDeObstaculos(altura, abertura, largura + espaco * 3)
    ]

    const deslocamento = 3

    this.animar = () => {
        this.pares.forEach(par => {
            par.setPosicao(par.getPosicao() - deslocamento)

            if(par.getPosicao() < par.getLargura()) {
                par.setPosicao(par.getPosicao() + espaco * this.pares.length)
                par.aberturaAleatoria()
            }

            const meio = largura / 2
            const cruzouMeio = par.getPosicao() + deslocamento >= meio && par.getPosicao() < meio
                if (cruzouMeio) pontuacao()
        })
    }
}

function Jogador(alturaGame) {
    let fly = false

    this.elemento = newElement('img', 'jogador')
    this.elemento.src = 'imgs/jogador.png'

    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])
    this.setY = y => this.elemento.style.bottom = `${y}px`

    //window.onmousedown = e => fly = true
    //window.onmouseup = e => fly = false 
    window.onkeydown = e => fly = true
    window.onkeyup = e => fly = false 

    //window.addEventListener('click', function(e){
    //   if (e){
    //    fly = true
    //   } else {
    //    fly = false
    //   }
    //})

    this.animar = () => {
        const newY = this.getY() + (fly ? 8 : -5)
        const alturaMaxima = alturaGame - this.elemento.clientHeight

        if(newY <= 0) {
            this.setY(0)
        }else if(newY >= alturaMaxima){
            this.setY(alturaMaxima)
        }else {
            this.setY(newY)
        }
    }

    this.setY(alturaGame / 2)
}

function Progresso() {
    this.elemento = newElement('span', 'score')

    this.atualizarPontos = pontos => {
        this.elemento.innerHTML = pontos
    }
    this.atualizarPontos(0)
}

function Sobrepostos(elementoA, elementoB) {
    const a = elementoA.getBoundingClientRect()
    const b = elementoB.getBoundingClientRect()

    const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left
    const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top

    return horizontal && vertical
}

function colisao(jogador, obstaculos) {
    let colisao = false

    obstaculos.pares.forEach( ParDeObstaculos => {
        if(!colisao) {
            const superior = ParDeObstaculos.superior.elemento
            const inferior = ParDeObstaculos.inferior.elemento
    
            colisao = Sobrepostos(jogador.elemento, superior)
                || Sobrepostos(jogador.elemento, inferior)

        }
    })

    return colisao
}

function FlappyHarry() {
    let pontos = 0

    const gamePlay = document.querySelector('[tp-flappy]')
    const altura = gamePlay.clientHeight
    const largura = gamePlay.clientWidth

    const progresso = new Progresso()
    const obstaculos = new Obstaculos(altura, largura, 300, 400,
        () => progresso.atualizarPontos(++pontos))

    const jogador = new Jogador(altura)

    gamePlay.appendChild(progresso.elemento)
    gamePlay.appendChild(jogador.elemento)

    obstaculos.pares.forEach(par => gamePlay.appendChild(par.elemento))

    this.start = () => {
        const timer = setInterval( () => {
            obstaculos.animar()
            jogador.animar()

            if(colisao(jogador, obstaculos)){
                clearInterval(timer)
                //location.reload()
            }
        }, 20 )
    }
}

new FlappyHarry().start()



//const obstaculos = new Obstaculos(700, 1200, 300, 400)
//const jogador = new Jogador(700)    
//const gamePlay = document.querySelector('[tp-flappy]')

//gamePlay.appendChild(new Progresso().elemento)
//gamePlay.appendChild(jogador.elemento)
//obstaculos.pares.forEach(par => gamePlay.appendChild(par.elemento))

//setInterval( () => {
//    obstaculos.animar()
//    jogador.animar()
//}, 20)