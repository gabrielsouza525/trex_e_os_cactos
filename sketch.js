var gameOver,gameOverImagem;

var restart,restartImagem;

var trex, trexCorrendo,trexColidiu, trexParado;

var chao, chaoMovendo,chaoInvisivel;

var nuvemImg, grupoDeNuvens;

var obstaculo1,obstaculo2,obstaculo3,obstaculo4,obstaculo5,obstaculo6, grupoDeObstaculos;

var pontuacao =0;

var morte;

var pulo;

var checkPoint;

var estado = "inicio";

var larguraTela=window.innerWidth

function reset(){
  estado ="jogar"
  
  gameOver.visible=false
  restart.visible=false
  
  grupoDeObstaculos.destroyEach();
  grupoDeNuvens.destroyEach();
  
  trex.changeAnimation("correndo",trexCorrendo)
  
  pontuacao=0
}

function obstaculos() {  
  if (frameCount % 60 === 0){
   var obstaculo =createSprite(larguraTela,180,20,60);
    obstaculo.velocityX = -(6+pontuacao/100)
    
    var indice = Math.round(random(1,6))
   
    switch(indice){
      case 1: obstaculo.addImage(obstaculo1);
        break;
      case 2: obstaculo.addImage(obstaculo2);
        break;
      case 3: obstaculo.addImage(obstaculo3);
        break;
      case 4: obstaculo.addImage(obstaculo4);
        break;
      case 5: obstaculo.addImage(obstaculo5);
        break;
      case 6: obstaculo.addImage(obstaculo6);
        break;
        default:break
    }
        
    obstaculo.lifetime = larguraTela/2                    
        
    grupoDeObstaculos.add(obstaculo);
  }
}

function nuvens() {
  if (frameCount % 60 === 0){
    var nuvem =createSprite(larguraTela,100,40,10);
    nuvem.addImage(nuvemImg);
    nuvem.velocityX = -3;
    nuvem.y = Math.round(random(10,60));
    nuvem.lifetime = larguraTela;
    nuvem.depth= trex.depth;
    trex.depth = trex.depth +1;
    
    grupoDeNuvens.add(nuvem);
  }
}
  
function preload() {
  // carrega as imagens do trex dentro do trexCorrendo para a    animacao
  trexCorrendo = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trexColidiu = loadAnimation("trex_collided.png");
  trexParado = loadAnimation("trex1.png")
  
  // carrega a imagem do chao dentro do chaoMovendo para a animacao
    chaoMovendo = loadAnimation("ground2.png");
  
  nuvemImg =loadImage("cloud.png")
  
  obstaculo1 =loadImage("obstacle1.png")
  obstaculo2 =loadImage("obstacle2.png")
  obstaculo3 =loadImage("obstacle3.png")
  obstaculo4 =loadImage("obstacle4.png")
  obstaculo5 =loadImage("obstacle5.png")
  obstaculo6 =loadImage("obstacle6.png")
  
  restartImagem =loadImage("restart.png")

  gameOverImagem =loadImage("gameOver.png")
  
  morte =loadSound("die.mp3")
  pulo =loadSound("jump.mp3")
  checkPoint =loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(larguraTela, 200);
  
  var mensagem ="O gabriel é bonito"
  
  
  restart=createSprite(larguraTela/2, 140);
  restart.addImage(restartImagem)
  restart.scale=0.7
  
  gameOver=createSprite(larguraTela/2, 100);
  gameOver.addImage(gameOverImagem)
  
  trex = createSprite(50, 150,  20, 50);
  
  // adicionei animacao do trexCorrendo no trex
  trex.addAnimation("correndo", trexCorrendo);
  trex.addAnimation("colidiu", trexColidiu);
  trex.addAnimation("parado", trexParado)
  // alterei a escala do tamanho do trex
  trex.scale = 0.7;
  
  chao = createSprite(larguraTela/2, 190, larguraTela, 20);
  
  // adicionei animacao chaoMovendo no chao
  chao.addAnimation("chaoAnimado", chaoMovendo);
  
  chaoInvisivel = createSprite(larguraTela/2, 205, larguraTela, 20);
  chaoInvisivel.visible=false;
  
  grupoDeObstaculos = new Group();
  grupoDeNuvens = new Group();
  
  trex.setCollider("circle", 0,0,37)
}

function draw() {
  background("white");
  
  text("pontuação: "+ pontuacao, larguraTela/2,50)
  
  // adicionei gravidade ao trex
    trex.velocityY = trex.velocityY + 1;
 
  if (estado === "jogar") {
    trex.changeAnimation("correndo",trexCorrendo)
    restart.visible=false
    gameOver.visible=false
    
    // faço alguma ação
    chao.velocityX = -(4+3*pontuacao/100);
    
    // se a posicao x do chao for menor que 0, faço
    // ele voltar para a metade do tamanho dele
    if (chao.x < 0) {
      chao.x = chao.width / 2;
    }
    
     if ((keyDown("space") || touches.length > 0) && trex.y >= 97) {
      trex.velocityY = -12;
       pulo.play()
       touches=[]
    }
    
    obstaculos();
    nuvens();
    
    
    
    if (grupoDeObstaculos.isTouching(trex)){
      estado ="encerrar"
      morte.play();
    }
    
    pontuacao= pontuacao + Math.round(frameRate()/60);
    
  } else if (estado === "encerrar") {
    
    restart.visible=true
    gameOver.visible=true
    
    // faço outra coisa
    chao.velocityX = 0;
    
    trex.changeAnimation("colidiu",trexColidiu)
    
    grupoDeObstaculos.setLifetimeEach(-1);
    grupoDeNuvens.setLifetimeEach(-1);
    
    grupoDeObstaculos.setVelocityXEach(0);
    grupoDeNuvens.setVelocityXEach(0);
    
    if(mousePressedOver(restart) || touches.length > 0){
     reset();
     touches=[]
    }
  } else if (estado === "inicio"){
    restart.visible=false
    gameOver.visible=false
    trex.changeAnimation("parado",trexParado)
   if (keyDown("space") || touches.length > 0){
    estado = "jogar"
    touches=[]
 }      
}
  
  if (pontuacao>0 && pontuacao % 100 ==0){
    checkPoint.play();
    
  }

  // nao deixei ele ultrapassar a borda de baixo
  trex.collide(chaoInvisivel);
  
  drawSprites();
}