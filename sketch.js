var score = 0;
var PLAY = 0;
var gameState = PLAY;
var END = 1;

var x1 = 0;
var x2;
var x3;
var scrollSpeed = 4;

function preload() {
  //animations
  manRunning = loadAnimation("images/run1.png", "images/run2.png", "images/run3.png", "images/run4.png", 
  "images/run5.png", "images/run6.png");
  manJumping1 = loadAnimation("images/jump1.png");
  manJumping2 = loadAnimation("images/jump2.png");
  coinAnimation = loadAnimation("images/coin1.png", "images/coin2.png", "images/coin3.png", "images/coin4.png", 
  "images/coin5.png", "images/coin6.png");
  tyreRolling = loadAnimation("images/tyre1.png", "images/tyre2.png", "images/tyre3.png", "images/tyre4.png", 
  "images/tyre5.png", "images/tyre6.png", "images/tyre7.png");
  enemyRunning = loadAnimation("images/girl1.png", "images/girl2.png", "images/girl3.png", "images/girl4.png",
  "images/girl5.png", "images/girl6.png");

  //preloading images
  bgImg = loadImage("images/bg.jpg");
  bg1Img = loadImage("images/bg1.jpg");
  gameOverIcon = loadImage("images/gameOver.png");
  restartIcon = loadImage("images/restart.png");
  fireImg = loadImage("images/fire.png");

  //loading sound
  collectSound = loadSound("sounds/collect.wav");
  failSound = loadSound("sounds/failSound.mp3");

  //loading fonts
  font = loadFont("images/font.ttf");

}

function setup() {
  createCanvas(windowWidth, windowHeight);

  //creating the background
  x2 = windowWidth;
  x3 = windowWidth*2;

  //creating the man
  man = createSprite(windowWidth/2 - 200, windowHeight - 300, 50, 50);
  man.addAnimation("running", manRunning);
  man.addAnimation("jump1", manJumping1);
  man.addAnimation("jump2", manJumping2);
  man.scale = 0.3;
  man.setCollider('rectangle',0,0,150, 250);

  //creating the bottom edge
  bottom_edge = createSprite(windowWidth / 2, windowHeight - 90, windowWidth, 10);
  bottom_edge.visible = false
  ground = createSprite(windowWidth / 2, windowHeight - 95, windowWidth, 10);
  ground.visible = false;

  //creating the game over icon
  gameOver = createSprite(windowWidth / 2, windowHeight/2 - 100, 10, 10);
  gameOver.addImage("over", gameOverIcon);
  gameOver.scale = 0.5;
  gameOver.visible = false;

  //creating the restart icon
  restart = createSprite(windowWidth / 2, windowHeight/2 + 200, 10, 10);
  restart.addImage("restart", restartIcon);
  restart.scale = 0.3;
  restart.visible = false;

  //creating the groups
  coinGroup = new Group();
  tyreGroup = new Group();
  enemyGroup = new Group();
  fireGroup = new Group();

  score = 0;
}



function draw() {

  if(gameState === PLAY){

  image(bgImg, x1, 0, width, height);
  image(bgImg, x2, 0, width, height);
  image(bgImg, x3, 0, width, height);
  
  x1 -= scrollSpeed;
  x2 -= scrollSpeed;
  x3 -= scrollSpeed;
  
  if (x1 < -width){
    x1 = width;
  }
  if (x2 < -width){
    x2 = width;
  }
  if (x3 < -width){
    x3 = width;
  }

  scrollSpeed = (4 + 2 * frameCount/1300)

  //making the man jump
  if(man.isTouching(ground) && keyDown("space") && man.y >= windowHeight - 250){
    man.velocityY = -16;
  }

  //changing animation when jumping
  if(man.velocityY < 0){
    man.changeAnimation("jump1", manJumping1);}
  if(man.velocityY > 0){
    man.changeAnimation("jump2", manJumping2);}
  if(man.isTouching(bottom_edge)){
    man.changeAnimation("running", manRunning);}

  
  for (var a = 0; a < coinGroup.length; a++) {
    if (man.isTouching(coinGroup[a])) {
      coinGroup[a].destroy();
      score = score + 1;
      collectSound.play();
    }
  }

  for (var b = 0; b < tyreGroup.length; b++) {
    if (tyreGroup.isTouching(man)) {
      gameState = END;
      failSound.play();
    }
  }

  for (var c = 0; c < enemyGroup.length; c++) {
    if (enemyGroup.isTouching(man)) {
      gameState = END;
      failSound.play();
    }
  }
  for (var d = 0; d < fireGroup.length; d++) {
  if(fireGroup[d].isTouching(enemyGroup)){
    fireGroup[d].destroy();
    enemyGroup.destroyEach();
  }
}

  if(frameCount % 4 === 0 && keyDown("RIGHT_ARROW")){
    spawnFire();
  }

  strokeWeight(10);
  fill(0);
  textSize(20);
  textFont(font);
  text("Score: " + score, 50, 30);
  text("Press space to jump and press the right arrow key to shoot the enemy. You can only shoot the enemy not the tyres!", 200, 30);
  

  man.velocityY = man.velocityY + 0.9;
  man.collide(bottom_edge); 

  spawnEnemy();
  spawnTyres();
  spawnCoins();

  } 
  //gameState = END
  else if (gameState === END){
    background(bg1Img)

    tyreGroup.destroyEach();
    coinGroup.destroyEach();
    enemyGroup.destroyEach();
    fireGroup.destroyEach();
    man.destroy();
    gameOver.visible = true;
    restart.visible = true;

    if(mousePressedOver(restart)){
      reset();
      }
    
    if(mouseIsOver(restart)){
      restart.scale = 0.33;
    } else {
      restart.scale = 0.3;
    }
  }

  
  drawSprites();
}

function spawnCoins(){
  if(frameCount % 100 === 0){
    coin = createSprite(windowWidth + 50, windowHeight - 120, 10, 10);
    coin.y = Math.round(random(windowHeight - 150, windowHeight - 300,))
    coin.addAnimation("coin", coinAnimation);
    coin.scale = 0.15;
    coin.velocityX = -(6 + 2 * frameCount/1300);

    coinGroup.add(coin);
  }
}

function spawnTyres(){
  if(frameCount % 150 === 0){
    tyre = createSprite(windowWidth + 50, windowHeight - 120, 10, 10);
    tyre.addAnimation("rolling", tyreRolling);
    tyre.scale = 0.16;
    tyre.velocityX = -(8 + 4 * frameCount/1000);

    tyreGroup.add(tyre);
  }
}

function spawnEnemy(){
  if(frameCount % 200 === 0){
    enemy = createSprite(windowWidth + 50, windowHeight - 140, 10, 10);
    enemy.addAnimation("rolling", enemyRunning);
    enemy.scale = 0.4;
    enemy.velocityX = -(9 + 4 * frameCount/1000);

    enemyGroup.add(enemy);
  }
}

function spawnFire(){
  fire = createSprite(man.x, man.y, 10, 10);
  fire.addImage(fireImg);
  fire.scale = 0.04;
  fire.velocityX = 14;
  fireGroup.add(fire);
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;

  man = createSprite(windowWidth/2 - 200, windowHeight - 300, 50, 50);
  man.addAnimation("running", manRunning);
  man.addAnimation("jump1", manJumping1);
  man.addAnimation("jump2", manJumping2);
  man.scale = 0.3;
  man.setCollider('rectangle',0,0,150, 250);
  score = 0;           
}
