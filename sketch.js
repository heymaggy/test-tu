var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloud, cloudsGroup, cloudImage;
var obstaclesGroup,obstacle1,obstacle2,obstacle3,obstacle4,obstacle5,obstacle6;

var score;
var newImage;

var gameOver,restart;


var PLAY=1;
var END=0;
var gamestate=PLAY;
function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
 
  
  obstacle1=loadImage("obstacle1.png");
  obstacle2=loadImage("obstacle2.png");
  obstacle3=loadImage("obstacle3.png");
  obstacle4=loadImage("obstacle4.png");
  obstacle5=loadImage("obstacle5.png");
  obstacle6=loadImage("obstacle6.png");
  
  gameOverI=loadImage("gameOver.png");
  restartImage=loadImage("restart.png");
  
  jumpSound=loadSound("jump.mp3");
  dieSound=loadSound("die.mp3");
  cpSound=loadSound("checkPoint.mp3");

}

function setup() {
  createCanvas(600, 200);

  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collided)
  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  
  gameOver=createSprite(270,80,100,10);
  gameOver.addImage("gameOver",gameOverI);
  gameOver.scale=0.5;
  restart=createSprite(270,120,10,10);
  restart.addImage("restart",restartImage);
  restart.scale=0.5;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  score=0;
  obstaclesGroup=new Group();
  cloudsGroup=new Group();
  
  trex.setCollider("rectangle",0,0,trex.width,trex.height)
  trex.debug=true;
}

function draw() {
  background(255);
  text("score:"+score, 500,30)
  
  
  if(gamestate===PLAY){
    gameOver.visible=false;
    restart.visible=false;
    // move the ground  
    ground.velocityX=-(4+score/100);
    //score
    score = score + Math.round(getFrameRate()/60);
    if (score%100===0&& score>0){
    cpSound.play()
    }
    // ground reset
    if (ground.x < 0){
    ground.x = ground.width/2;
  }
   // trex jump
    if(keyDown("space") && trex.y>160) {
    trex.velocityY = -12;
    jumpSound.play()
  }
    //gravity
    trex.velocityY = trex.velocityY + 0.6
    //spawn the clouds
  spawnClouds();
    //spawn Obstacles
  spawnObstacle();
    if(obstaclesGroup.isTouching(trex)){
      gamestate=END;
      dieSound.play()
      //trex.velocityY = -12;
    }
  }
  else if(gamestate===END){
    gameOver.visible=true;
    restart.visible=true;
    
    ground.velocityX = -0;
    // make Obstacles stop
    obstaclesGroup.setVelocityXEach(0);
    // make clouds stop
    cloudsGroup.setVelocityXEach(0);
    // make sure the trex does not fly(ruald)
    trex.velocityY=20;
    trex.changeAnimation("collided",trex_collided);
    cloudsGroup.setLifetimeEach(-1);
    obstaclesGroup.setLifetimeEach(-1);
    // restart the game
    if(mousePressedOver(restart)){
       reset();  
   }
   }
   
  
  
  
  
  
  trex.collide(invisibleGround);
  
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    cloud = createSprite(600,100,40,10);
    cloud.addImage(cloudImage)
    cloud.y = Math.round(random(10,60))
    cloud.scale = 0.4;
    cloud.velocityX = -3;
    cloud.lifetime=200
    
    //adjust the depth
    cloud.depth = trex.depth
    trex.depth = trex.depth + 1;
    cloudsGroup.add(cloud);
  }
}


function spawnObstacle(){
if(frameCount%60===0){
  var obstacle=createSprite(600,160,10,40)
  obstacle.velocityX=ground.velocityX;
  
  var rand=Math.round(random(1,6))
  switch (rand){
      case 1 : obstacle.addImage(obstacle1);
              break;
      case 2 : obstacle.addImage(obstacle2);
              break;
      case 3 : obstacle.addImage(obstacle3);
              break;           
      case 4 : obstacle.addImage(obstacle4);
              break;
      case 5 : obstacle.addImage(obstacle5);
              break;
      case 6 : obstacle.addImage(obstacle6);
              break;  
      default: break; 
      
}
obstacle.scale=0.5;
obstacle.lifetime=350
obstaclesGroup.add(obstacle);
}
}  

function reset(){
  gamestate=PLAY
  gameOver.visible=false;
  restart.visible=false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  ground.x=200;
  trex.changeAnimation("running",trex_running);
  score=0;
}


