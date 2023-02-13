 var PLAY = 1;
 var END = 0;
 var estadoDeJogo = PLAY;
 var trex, trex_correndo, trex_colidindo;
 var chao, chao_imagem, chao_invisivel;
 var nuvem, nuvem_imagem;
 var obstaculo, obstaculo1, obstaculo2, obstaculo3,
 obstaculo4, obstaculo5, obstaculo6;
 var pontos;
 var grupo_obstaculo, grupo_nuvem;
 var gameOver_imagem, restart_imagem;
 var checkpoint_som, die_som, jump_som;

 function preload() {
  trex_correndo = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_colidindo = loadAnimation("trex_collided.png");
  chao_imagem = loadImage("ground2.png");
  nuvem_imagem = loadImage("cloud.png");

  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");

  gameOver_imagem = loadImage("gameOver.png");
  restart_imagem= loadImage("restart.png");

  checkpoint_som = loadSound("checkpoint.mp3");
  die_som = loadSound("die.mp3");
  jump_som = loadSound("jump.mp3");
 }

 function setup(){
  createCanvas(windowWidth, windowHeight);
 
  trex = createSprite(50, height -70, 20, 50);
  trex. addAnimation("correndo", trex_correndo);
  trex.addAnimation("colidindo", trex_colidindo);
  trex.scale = 0.5;

  chao = createSprite(width/2, height-70, width, 2);
  chao.addImage("chao", chao_imagem);
  chao.x = chao.width / 2;

  chao_invisivel = createSprite(width/2, height-5, width, 125);
  chao_invisivel.visible = false;

  gameOver = createSprite(width/2, height/2 - 50);
  gameOver.addImage(gameOver_imagem);
  gameOver.scale = 0.5;

  restart= createSprite(width/2, height/2);
  restart.addImage(restart_imagem);
  restart.scale = 0.5;


  grupo_obstaculo = new Group();
  grupo_nuvem = new Group();
  pontos = 0;
 }

 function draw(){
  background(255);
  text("pontuação: " + pontos, 30, 50);
  trex.setCollider("circle", 0, 0, 40);
  
  if(estadoDeJogo === PLAY){
    gameOver.visible = false;
    restart.visible = false;
     pontos = pontos + Math.round(getFrameRate()/60);
     if(pontos > 0 && pontos % 100 === 0){
        checkpoint_som.play();
     }
     chao.velocityX = -(6 + 3*pontos/100);
     if(chao.x < 0){
     chao.x = chao.width / 2;
       }
      if(touches.length > 0 || keyDown("space") && trex.y >= height-120){
        trex.velocityY = -10;
        jump_som.play();
        touches = [];
       }
       trex.velocityY = trex.velocityY + 0.5;  
       criarNuvens();
       criarObstaculos();

       if(grupo_obstaculo.isTouching(trex)){
        estadoDeJogo = END;
        die_som.play();
        
       }
  }
  else if(estadoDeJogo === END){
      gameOver.visible = true;
      restart.visible = true;
    chao.velocityX = 0;
    trex.velocityY = 0;
    grupo_nuvem.setVelocityXEach(0);
    grupo_obstaculo.setVelocityXEach(0);

    trex.changeAnimation("colidindo", trex_colidindo);

    grupo_nuvem.setLifetimeEach(-1);
    grupo_obstaculo.setLifetimeEach(-1);

    if(mousePressedOver(restart)){
      reset();
    }
  }

  trex.collide(chao_invisivel);

  
  drawSprites();

  console.log(frameCount);
 }

function criarNuvens(){
   if(frameCount % 60 === 0){
    nuvem = createSprite(width+20, height-300, 40, 10);
    nuvem.addImage(nuvem_imagem);
    nuvem.y = Math.round(random(100,220));
    nuvem.scale = 0.7;
    nuvem.velocityX = -3; 
    
    nuvem.lifetime = 800;

    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1; 

    grupo_nuvem.add(nuvem);
  }
 }

 function criarObstaculos(){
  if(frameCount % 60 === 0){
    obstaculo = createSprite(width+20, height-85, 10, 40);
    obstaculo.velocityX = -(6 + 3*pontos/100);
    
    var rand = Math.round(random(1,6));
    switch(rand) {
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
      default: break;
    }

    obstaculo.scale = 0.5;
    obstaculo.lifetime = 800;

    grupo_obstaculo.add(obstaculo);
  }
 }  

 function reset(){
   estadoDeJogo = PLAY;
   gameOver.visible = false;
   restart.visible = false;  
   
   grupo_nuvem.destroyEach();
   grupo_obstaculo.destroyEach();

   trex.changeAnimation("correndo", trex_correndo);
   pontos = 0;
 }