// RKR Physics Engine
// Michael McGee
// Today
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

class Wall{
  constructor(x,y,width,height,color){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.hit = false;
  }

  show(aparentObject){
    if(!this.hit){
      fill(this.color);
      rect(this.x,this.y,this.width,this.height);
    }
  }
}

class Box {
  constructor(x,y,width,height,dx,dy,color,g,mass,energyLoss,airResistanceX,airResistanceY){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.dx = dx;
    this.dy = dy;
    this.color = color;
    this.g = g;
    this.radius = width/2;
    this.mass = mass;
    this.isCollide = false;
    this.energyLoss = energyLoss;
    this.airX = airResistanceX;
    this.airY = airResistanceY;
    this.onePassMade = false;
    this.isABox = true;
  }

  show(){
    fill(this.color);
    rect(this.x,this.y,this.width,this.height);
  }

  update(){
    this.x = this.x + this.dx;
    this.y = this.y + this.dy;
  }

  surfaceGravity(){
    if(this.mass > 0){
      this.dy = this.dy + this.g/50;
    }
  }

  altitudeGravity(){
    if(this.mass > 0){
      this.dy = this.dy + this.g/55;
    }
  }

  suddenChangeInAttitude(){
    if(this.y > windowHeight - 30 - this.height){
      this.y = windowHeight - 30 - this.height;
      if(this.dy > 2 || this.dy < -2){
        this.dy = this.dy * 0.6;
      }
      else if(this.dy > -2 || this.dy < 2){
        this.dy = 0;
        this.y = windowHeight - 30 - this.height;
      }
      this.dy = 0 - this.dy;
    }
  }

  checkMouse(){
    if(mouseX > this.x && mouseX < this.x + this.width && mouseY < this.y + this.height && mouseY > this.y){
      return true;
    }
    else{
      return false;
    }
  }

  collision(otherSphere){
    if(dist(this.x+this.width/2,this.y+this.height/2,otherSphere.x,otherSphere.y) < this.width / 2 + otherSphere.radius + 2){//add two so not as many balls get stuck in eachother
      let massRatioOther = this.mass/otherSphere.mass;
      let massRatioThis = otherSphere.mass/this.mass;
      if(this.x < otherSphere.x + otherSphere.radius/5 && this.x > otherSphere.x - otherSphere.radius/5 || this.y < otherSphere.y + otherSphere.radius/5 && this.y > otherSphere.y - otherSphere.radius/5){
        this.isCollide = true;
        otherSphere.isCollide = true;
        if(this.x < otherSphere.x){
          //
          addX = -10;
          addOX = 10;
        }
        else{
          //
          addX = 10;
          addOX = -10;
        }
        this.x += addX;
        //this.y += addY;
        otherSphere.x += addOX;
        //otherSphere.y += addOY;
        let tempDx = this.dx;
        let tempDy = this.dy;
        this.dx = otherSphere.dx * massRatioThis;
        this.dy = otherSphere.dy * massRatioThis;
        otherSphere.dx = tempDx * massRatioOther;
        otherSphere.dy = tempDy * massRatioOther;
      }
      else{
        if(this.x < otherSphere.x && this.y < otherSphere.y){
          //
          totalSpeed = abs(this.dx) + abs(this.dy) + abs(otherSphere.dx) + abs(otherSphere.dy);
          quarterSpeed = totalSpeed / 4;
          addThisX = 0 - quarterSpeed + this.energyLoss/25;
          addThisY = 0 - quarterSpeed + this.energyLoss/25;
          addOtherX = quarterSpeed - this.energyLoss/25;
          addOtherY = quarterSpeed - this.energyLoss/25;
        }
        else if(this.x > otherSphere.x && this.y < otherSphere.y){
          //
          totalSpeed = abs(this.dx) + abs(this.dy) + abs(otherSphere.dx) + abs(otherSphere.dy);
          quarterSpeed = totalSpeed / 4;
          addThisX = quarterSpeed - this.energyLoss/25;
          addThisY = 0 - quarterSpeed + this.energyLoss/25;
          addOtherX = 0 - quarterSpeed + this.energyLoss/25;
          addOtherY = quarterSpeed - this.energyLoss/25;
        }
        else if(this.x > otherSphere.x && this.y > otherSphere.y){
          //
          totalSpeed = abs(this.dx) + abs(this.dy) + abs(otherSphere.dx) + abs(otherSphere.dy);
          quarterSpeed = totalSpeed / 4;
          addThisX = quarterSpeed - this.energyLoss/25;
          addThisY = quarterSpeed - this.energyLoss/25;
          addOtherX = 0 - quarterSpeed + this.energyLoss/25;
          addOtherY = 0 - quarterSpeed + this.energyLoss/25;
        }
        else if(this.x < otherSphere.x && this.y > otherSphere.y){
          //
          totalSpeed = abs(this.dx) + abs(this.dy) + abs(otherSphere.dx) + abs(otherSphere.dy);
          quarterSpeed = totalSpeed / 4;
          addThisX = 0 - quarterSpeed + this.energyLoss/25;
          addThisY = quarterSpeed - this.energyLoss/25;
          addOtherX = quarterSpeed - this.energyLoss/25;
          addOtherY = 0 - quarterSpeed + this.energyLoss/25;
        }
        this.isCollide = true;
        otherSphere.isCollide = true;
        let tempDx = this.dx / 2;
        let tempDy = this.dy / 2;
        let tempOtherDx = otherSphere.dx / 2;
        let tempOtherDy = otherSphere.dy / 2;
        this.dx = (tempOtherDx + addThisX) * massRatioThis;
        this.dy = (tempOtherDy + addThisY) * massRatioThis;
        otherSphere.dx = (tempDx + addOtherX) * massRatioOther;
        otherSphere.dy = (tempDy + addOtherY) * massRatioOther;
      }
    }
  }

  //collide with wall
  wallCollision(wall){
    if(!wall.hit && this.dx > 0 && this.x + this.radius >= wall.x - wall.width/10 && this.x + this.radius <= wall.x + wall.width/4 && this.y + this.radius >= wall.y && this.y - this.radius*2 <= wall.y){
      let tempVar = this.dx;
      tempVar = tempVar - this.energyLoss/100;
      this.dx = 0 - tempVar;
    }
    else if(!wall.hit && this.dx < 0 && this.x - this.radius <= wall.x + wall.width + wall.width/10 && this.x - this.radius >= wall.x + wall.width*0.75 && this.y + this.radius >= wall.y && this.y - this.radius*2 <= wall.y){
      let tempVar = this.dx;
      tempVar = tempVar - this.energyLoss/100;
      this.dx = 0 - tempVar;
    }
    else if(!wall.hit && this.dy > 0 && this.y + this.height >= wall.y && this.y + this.height <= wall.y + wall.height && this.x + this.radius > wall.x && this.x - this.radius < wall.x + wall.width){
      let tempVar = this.dy;
      tempVar = tempVar - this.energyLoss/100;
      this.dy = 0 - tempVar;
    }
    else if(!wall.hit && this.dy < 0 && this.y - this.height <= wall.y + wall.height && this.y - this.height >= wall.y && this.x + this.radius > wall.x && this.x - this.radius < wall.x + wall.width){
      let tempVar = this.dy;
      tempVar = tempVar - this.energyLoss/100;
      this.dy = 0 - tempVar;
    }
  }

  dragObject(){
    this.x = mouseX;
    this.y = mouseY;
  }

  buoyancy(){
    if(this.dy > -0.9 && this.y > 500 && this.mass/this.radius < 1){//apply buoyancy
      this.dy = this.dy - g/30;
    }
    else if(this.y > 500){//slow down x axis speed in water
      if(this.dx > 0.1){
        this.dx = this.dx - 0.1;
      }
      else if(this.dx < -0.1){
        this.dx = this.dx + 0.1;
      }
    }
  }

  cheapOrbitalRipoff(){
    if(this.dx > 30 || this.dx < -30){
      if(this.onePassMade && this.x > windowWidth && this.y > windowHeight/2 || this.x < 0 && this.y > windowHeight/2){
        this.y = this.y - windowWidth/4;
        this.dy = 0;
      }
      if(this.x < -3000){
        this.x = windowWidth + 100;
        this.onePassMade = true;
      }
      else if(this.x > windowWidth + 3000){
        this.x = -100;
        this.onePassMade = true;
      }
    }
  }

  airResistance(){
    if(this.dx > 0 && this.airX !== 0){
      this.dx = this.dx - this.airX/100;
    }
    else if(this.dx < 0 && this.airX !== 0){
      this.dx = this.dx + this.airX/100;
    }
  }
}

class Sphere {
  constructor(x,y,radius,dx,dy,color,g,mass,energyLoss,airResistanceX,airResistanceY,explosive){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.dx = dx;
    this.dy = dy;
    this.color = color;
    this.g = g;
    this.mass = mass;
    this.isCollide = false;
    this.energyLoss = energyLoss;
    this.airX = airResistanceX;
    this.airY = airResistanceY;
    this.onePassMade = false;
    this.isABox = false;
    this.explosive = explosive;
  }

  //displays sphere
  show(){
    fill(this.color);
    ellipse(this.x,this.y,this.radius*2,this.radius*2);
  }

  //updates position
  update(){
    this.x = this.x + this.dx;
    this.y = this.y + this.dy;
  }

  //applies gravitational acceleration at surface
  surfaceGravity(){
    if(this.mass > 0){
      this.dy = this.dy + this.g/50;
    }
  }

  //high altitude gravity
  altitudeGravity(){
    if(this.mass > 0){
      this.dy = this.dy + this.g/55;
    }
  }

  //bounces ball off the surface
  suddenChangeInAttitude(){
    if(this.y > windowHeight - 30 - this.radius){
      this.y = windowHeight - 30 - this.radius;
      this.dy = this.dy - this.energyLoss/100;
      this.dy = 0 - this.dy;
    }
  }

  airResistance(){
    if(this.dx > 0 && this.airX !== 0){
      this.dx = this.dx - this.airX/100;
    }
    else if(this.dx < 0 && this.airX !== 0){
      this.dx = this.dx + this.airX/100;
    }
  }

  buoyancy(){
    if(this.dy > -0.9 && this.y > 500 && this.mass/this.radius < 1){//apply buoyancy
      this.dy = this.dy - g/30;
    }
    else if(this.y > 500){//slow down x axis speed in water
      if(this.dx > 0.1){
        this.dx = this.dx - 0.1;
      }
      else if(this.dx < -0.1){
        this.dx = this.dx + 0.1;
      }
    }
  }

  cheapOrbitalRipoff(){
    if(this.dx > 30 || this.dx < -30){
      if(this.onePassMade && this.x > windowWidth && this.y > windowHeight/2 || this.x < 0 && this.y > windowHeight/2){
        this.y = this.y - windowWidth/4;
        this.dy = 0;
      }
      if(this.x < -3000){
        this.x = windowWidth + 100;
        this.onePassMade = true;
      }
      else if(this.x > windowWidth + 3000){
        this.x = -100;
        this.onePassMade = true;
      }
    }
  }

  //checks for collisions with other spheres
  collision(otherSphere){
    if(dist(this.x,this.y,otherSphere.x,otherSphere.y) < this.radius + otherSphere.radius + 2){//add two so not as many balls get stuck in eachother
      let massRatioOther = this.mass/otherSphere.mass;
      let massRatioThis = otherSphere.mass/this.mass;
      if(this.x < otherSphere.x + otherSphere.radius/5 && this.x > otherSphere.x - otherSphere.radius/5 || this.y < otherSphere.y + otherSphere.radius/5 && this.y > otherSphere.y - otherSphere.radius/5){
        this.isCollide = true;
        otherSphere.isCollide = true;
        if(this.x < otherSphere.x){
          //
          addX = -10;
          addOX = 10;
        }
        else{
          //
          addX = 10;
          addOX = -10;
        }
        this.x += addX;
        //this.y += addY;
        otherSphere.x += addOX;
        //otherSphere.y += addOY;
        let tempDx = this.dx;
        let tempDy = this.dy;
        this.dx = otherSphere.dx * massRatioThis;
        this.dy = otherSphere.dy * massRatioThis;
        otherSphere.dx = tempDx * massRatioOther;
        otherSphere.dy = tempDy * massRatioOther;
      }
      else{
        if(this.x < otherSphere.x && this.y < otherSphere.y){
          //
          totalSpeed = abs(this.dx) + abs(this.dy) + abs(otherSphere.dx) + abs(otherSphere.dy);
          quarterSpeed = totalSpeed / 4;
          addThisX = 0 - quarterSpeed + this.energyLoss/25;
          addThisY = 0 - quarterSpeed + this.energyLoss/25;
          addOtherX = quarterSpeed - this.energyLoss/25;
          addOtherY = quarterSpeed - this.energyLoss/25;
        }
        else if(this.x > otherSphere.x && this.y < otherSphere.y){
          //
          totalSpeed = abs(this.dx) + abs(this.dy) + abs(otherSphere.dx) + abs(otherSphere.dy);
          quarterSpeed = totalSpeed / 4;
          addThisX = quarterSpeed - this.energyLoss/25;
          addThisY = 0 - quarterSpeed + this.energyLoss/25;
          addOtherX = 0 - quarterSpeed + this.energyLoss/25;
          addOtherY = quarterSpeed - this.energyLoss/25;
        }
        else if(this.x > otherSphere.x && this.y > otherSphere.y){
          //
          totalSpeed = abs(this.dx) + abs(this.dy) + abs(otherSphere.dx) + abs(otherSphere.dy);
          quarterSpeed = totalSpeed / 4;
          addThisX = quarterSpeed - this.energyLoss/25;
          addThisY = quarterSpeed - this.energyLoss/25;
          addOtherX = 0 - quarterSpeed + this.energyLoss/25;
          addOtherY = 0 - quarterSpeed + this.energyLoss/25;
        }
        else if(this.x < otherSphere.x && this.y > otherSphere.y){
          //
          totalSpeed = abs(this.dx) + abs(this.dy) + abs(otherSphere.dx) + abs(otherSphere.dy);
          quarterSpeed = totalSpeed / 4;
          addThisX = 0 - quarterSpeed + this.energyLoss/25;
          addThisY = quarterSpeed - this.energyLoss/25;
          addOtherX = quarterSpeed - this.energyLoss/25;
          addOtherY = 0 - quarterSpeed + this.energyLoss/25;
        }
        this.isCollide = true;
        otherSphere.isCollide = true;
        let tempDx = this.dx / 2;
        let tempDy = this.dy / 2;
        let tempOtherDx = otherSphere.dx / 2;
        let tempOtherDy = otherSphere.dy / 2;
        this.dx = (tempOtherDx + addThisX) * massRatioThis;
        this.dy = (tempOtherDy + addThisY) * massRatioThis;
        otherSphere.dx = (tempDx + addOtherX) * massRatioOther;
        otherSphere.dy = (tempDy + addOtherY) * massRatioOther;
      }
    }
  }

  checkMouse(){
    if(mouseX > this.x - this.radius  && mouseX < this.x + this.radius && mouseY < this.y + this.radius && mouseY > this.y - this.radius){
      return true;
    }
    else{
      return false;
    }
  }

  dragObject(){
    this.x = mouseX;
    this.y = mouseY;
  }

  //collide with wall
  wallCollision(wall){
    if(!wall.hit && this.dx > 0 && this.x + this.radius >= wall.x - wall.width/10 && this.x + this.radius <= wall.x + wall.width/4 && this.y + this.radius >= wall.y && this.y - this.radius*2 <= wall.y){
      let tempVar = this.dx;
      tempVar = tempVar - this.energyLoss/100;
      this.dx = 0 - tempVar;
      if(this.explosive){
        wall.hit = true;
      }
    }
    else if(!wall.hit && this.dx < 0 && this.x - this.radius <= wall.x + wall.width + wall.width/10 && this.x - this.radius >= wall.x + wall.width*0.75 && this.y + this.radius >= wall.y && this.y - this.radius*2 <= wall.y){
      let tempVar = this.dx;
      tempVar = tempVar - this.energyLoss/100;
      this.dx = 0 - tempVar;
      if(this.explosive){
        wall.hit = true;
      }
    }
    else if(!wall.hit && this.dy > 0 && this.y + this.radius >= wall.y && this.y + this.radius <= wall.y + wall.height && this.x + this.radius > wall.x && this.x - this.radius < wall.x + wall.width){
      let tempVar = this.dy;
      tempVar = tempVar - this.energyLoss/100;
      this.dy = 0 - tempVar;
      if(this.explosive){
        wall.hit = true;
      }
    }
    else if(!wall.hit && this.dy < 0 && this.y - this.radius <= wall.y + wall.height && this.y - this.radius >= wall.y && this.x + this.radius > wall.x && this.x - this.radius < wall.x + wall.width){
      let tempVar = this.dy;
      tempVar = tempVar - this.energyLoss/100;
      this.dy = 0 - tempVar;
      if(this.explosive){
        wall.hit = true;
      }
    }
  }
}

class Timer {
  constructor(waitTime) {
    this.beginTime = millis();
    this.length = waitTime;
  }

  isDone() {
    if (millis() >= this.beginTime + this.length) {
      return true;
    }
    else {
      return false;
    }
  }

  reset(waitTime) {
    this.beginTime = millis();
    this.length = waitTime;
  }
}

let sphere;
let wall;
let ballColor;
let g;//gravitational acceleration
let radius;
let object;
let objectArray = [];
let staticObjectArray = [];
let playerArray = [];
let state;
let planet;
let colorState;//sets color of spawned objects
let energyLoss;
let allowed;
let addThisX, addThisY, addOtherX, addOtherY;
let addX, addY, addOX, addOY;
let totalSpeed, quarterSpeed;
let airResistanceY;//coefficient of air resistance
let airResistanceX;//wind

//determine the properties of the object users spawns
let userRadius;
let userMass;
let userVelocity;
let userShape;
let maxMass;
let minMass;
let maxSize;
let minSize;
let userStaticObjectWidth;
let userStaticObjectHeight;
let maxStaticWidth;
let maxStaticHeight;

let leftArrow, rightArrow, upArrow, downArrow;
let userState;
let time;
let pop;

function preload(){
  pop = loadSound("assets/pop.mp3");
  leftArrow = loadImage("assets/leftarrow.png");
  rightArrow = loadImage("assets/rightarrow.png");
  upArrow = loadImage("assets/upArrow.png");
  downArrow = loadImage("assets/downArrow.png");
}

function setup() {
  g = 9.81;
  colorState = 0;
  state = "surface";
  planet = "Earth";
  allowed = true;
  userVelocity = 0;
  userRadius = 25;
  userMass = 12;
  userShape = 0;
  maxMass = 25; //to keep things looking steady
  minMass = -2; //just because its fun to play with negative gravity
  maxSize = 100;
  minSize = 10;
  userStaticObjectWidth = 100; //same as default wall
  userStaticObjectHeight = 20; //same as default wall
  maxStaticWidth = 200;
  maxStaticHeight = 200;
  //WHERE IS THE MAGIC ENERGY COMING FROM?
  energyLoss = 20;//for some unbeknowns't to me reason 10 seems to simulate fully elastic collisions
  airResistanceY = 0;
  airResistanceX = 0.5;
  createCanvas(windowWidth, windowHeight);
  alert("CLICK!");
}

//checks if there is room to add a ball where the mouse is
function checkIfRoom(){
  for(let c = 0; c < objectArray.length; c++){
    if(objectArray[c].checkMouse() === true){
      objectArray[c].dragObject();
      allowed = false;
    }
    else if(objectArray[c].checkMouse() === false){
      allowed = true;
    }
  }
}

//called when mouse is pressed
function mousePressed(){
  checkIfRoom();
  if(state !== "options" && mouseX > windowWidth - 100 && mouseY < 100 ){
    userState = state;
    state = "options";
    pop.play();
  }

  else if(state === "options"){
    optionsMousePress();
  }

  else if(keyIsDown(49) && state === "surface" || keyIsDown(49) && state === "altitude" || keyIsDown(49) && state === "ocean"){
    checkIfRoom();
    if(allowed){
      //creates a ball
      sphere = new Sphere(mouseX, mouseY, 25, 0, 0, determineColor(), g, 25, energyLoss, airResistanceX, airResistanceY, false);
      objectArray.push(sphere);
      pop.play();
    }
  }

  else if(keyIsDown(50) && state === "surface" || keyIsDown(50) && state === "altitude" || keyIsDown(50) && state === "ocean"){
    checkIfRoom();
    if(allowed){
      //creates a ball
      sphere = new Sphere(mouseX, mouseY, 15, -6, 0, determineColor(), g, 20, energyLoss, airResistanceX, airResistanceY, false);
      objectArray.push(sphere);
      pop.play();
    }
  }

  else if(keyIsDown(51) && state === "surface" || keyIsDown(51) && state === "altitude" || keyIsDown(51) && state === "ocean"){
    checkIfRoom();
    if(allowed){
      //creates a ball
      sphere = new Sphere(mouseX, mouseY, 15, -4, 0, determineColor(), g, 10, energyLoss, airResistanceX, airResistanceY, false);
      objectArray.push(sphere);
      pop.play();
    }
  }

  else if(keyIsDown(52) && state === "surface" || keyIsDown(52) && state === "altitude" || keyIsDown(52) && state === "ocean"){
    checkIfRoom();
    if(allowed){
      //creates a ball
      sphere = new Sphere(mouseX, mouseY, 15, -2, 0, determineColor(), g, 10, energyLoss, airResistanceX, airResistanceY, false);
      objectArray.push(sphere);
      pop.play();
    }
  }

  else if(keyIsDown(53) && state === "surface" || keyIsDown(53) && state === "altitude" || keyIsDown(53) && state === "ocean"){
    checkIfRoom();
    if(allowed){
      spawnBall();
    }
  }

  else if(keyIsDown(54) && state === "surface" || keyIsDown(54) && state === "altitude" || keyIsDown(54) && state === "ocean"){
    checkIfRoom();
    if(allowed){
      //creates a ball
      sphere = new Sphere(mouseX, mouseY, 15, 2, 0, determineColor(), g, 10, energyLoss, airResistanceX, airResistanceY, false);
      objectArray.push(sphere);
      pop.play();
    }
  }

  else if(keyIsDown(55) && state === "surface" || keyIsDown(55) && state === "altitude" || keyIsDown(55) && state === "ocean"){
    checkIfRoom();
    if(allowed){
      //creates a ball
      sphere = new Sphere(mouseX, mouseY, 15, 4, 0, determineColor(), g, 10, energyLoss, airResistanceX, airResistanceY, false);
      objectArray.push(sphere);
      pop.play();
    }
  }

  else if(keyIsDown(56) && state === "surface" || keyIsDown(56) && state === "altitude" || keyIsDown(56) && state === "ocean"){
    checkIfRoom();
    if(allowed){
      //creates a ball
      sphere = new Sphere(mouseX, mouseY, 15, 6, 0, determineColor(), g, 10, energyLoss, airResistanceX, airResistanceY, false);
      objectArray.push(sphere);
      pop.play();
    }
  }

  else if(keyIsDown(57) && state === "surface" || keyIsDown(57) && state === "altitude" || keyIsDown(57) && state === "ocean"){
    checkIfRoom();
    if(allowed){
      //creates a ball
      sphere = new Sphere(mouseX, mouseY, 15, 8, 0, determineColor(), g, 10, energyLoss, airResistanceX, airResistanceY, false);
      objectArray.push(sphere);
      pop.play();
    }
  }

  else if(state === "surface" || state === "altitude" || state === "ocean"){
    checkIfRoom();
    if(allowed){
      if(userShape === 0){
        spawnBall();
      }
      else if(userShape === 1){
        spawnBox();
      }
    }
  }
}

//creates a ball
function spawnBall(){
  sphere = new Sphere(mouseX, mouseY, userRadius, userVelocity, 0, determineColor(), g, userMass, energyLoss, airResistanceX, airResistanceY, false);
  objectArray.push(sphere);
  pop.play();
}

//creates a box
function spawnBox(){
  box = new Box(mouseX, mouseY, userRadius, userRadius, userVelocity, 0, determineColor(), g, userMass, energyLoss, airResistanceX, airResistanceY);
  objectArray.push(box);
  pop.play();
}

//remake - this is shit
function explosive(){
  let bomb;
  let tempState = colorState;//sets tempState to colorState to store value
  colorState = 2; //makes explosion red
  bomb = new Sphere(mouseX+20,mouseY,10,10,0,determineColor(),g,5,energyLoss,airResistanceX,airResistanceY,true);
  objectArray.push(bomb);
  bomb = new Sphere(mouseX-20,mouseY,10,-10,0,determineColor(),g,5,energyLoss,airResistanceX,airResistanceY,true);
  objectArray.push(bomb);
  bomb = new Sphere(mouseX,mouseY-20,10,0,-10,determineColor(),g,5,energyLoss,airResistanceX,airResistanceY,true);
  objectArray.push(bomb);
  bomb = new Sphere(mouseX,mouseY+20,10,0,10,determineColor(),g,5,energyLoss,airResistanceX,airResistanceY,true);
  objectArray.push(bomb);
  bomb = new Sphere(mouseX+20,mouseY+20,10,6,7,determineColor(),g,5,energyLoss,airResistanceX,airResistanceY,true);
  objectArray.push(bomb);
  bomb = new Sphere(mouseX-20,mouseY-20,10,4,-7,determineColor(),g,5,energyLoss,airResistanceX,airResistanceY,true);
  objectArray.push(bomb);
  bomb = new Sphere(mouseX-20,mouseY-20,10,-6,-5,determineColor(),g,5,energyLoss,airResistanceX,airResistanceY,true);
  objectArray.push(bomb);
  bomb = new Sphere(mouseX-20,mouseY+20,10,-6,6,determineColor(),g,5,energyLoss,airResistanceX,airResistanceY,true);
  objectArray.push(bomb);
  colorState = tempState;//puts colorState back to normal
  pop.play();
}

//mouse press options on options screen
function optionsMousePress(){
  if(mouseX < 100 && mouseY < 100){
    state = userState;
    pop.play();
  }

  else if(mouseX < 120 && mouseX > 50 && mouseY > 350 && mouseY < 450){
    userVelocity--;
    pop.play();
  }

  else if(mouseY > 350 && mouseY < 450 && mouseX > 150 && mouseX < 220){
    userVelocity++;
    pop.play();
  }

  else if(mouseY > 350 && mouseY < 420 && mouseX > 350 && mouseX < 450){
    if(userMass < maxMass){
      userMass++;
    }
    pop.play();
  }

  else if(mouseY > 450 && mouseY < 520 && mouseX > 350 && mouseX < 450){
    if(userMass > minMass){
      userMass--;
    }
    pop.play();
  }

  else if(mouseY > 350 && mouseY < 420 && mouseX > 650 && mouseX < 750){
    if(userRadius < maxSize){
      userRadius++;
    }
    pop.play();
  }

  else if(mouseY > 450 && mouseY < 520 && mouseX > 650 && mouseX < 750){
    if(userRadius > minSize){
      userRadius--;
    }
    pop.play();
  }

  else if(mouseY > 650 && mouseY < 720 && mouseX > 40 && mouseX < 250){
    location = self.location;
  }

  else if(mouseY > 650 && mouseY < 720 && mouseX > 260 && mouseX < 470){
    planet = "Earth";
    state = "surface";
    g = 9.81;
    pop.play();
  }

  else if(mouseY > 650 && mouseY < 720 && mouseX > 480 && mouseX < 690){
    state = "surface";
    planet = "Mars";
    g = 3;
    pop.play();
  }

  else if(mouseY > 650 && mouseY < 720 && mouseX > 700 && mouseX < 910){
    state = "surface";
    planet = "Moon";
    g = 1;
    pop.play();
  }

  else if(mouseY > 730 && mouseY < 800 && mouseX > 260 && mouseX < 470){
    planet = "Earth";
    state = "ocean";
    pop.play();
  }

  else if(mouseY > 570 && mouseY < 650 && mouseX > 260 && mouseX < 470){
    planet = "Earth";
    state = "altitude";
    pop.play();
  }

  else if(mouseX > 850 && mouseX < 900 && mouseY > 100 && mouseY < 150){
    colorState = 0;
    pop.play();
  }

  else if(mouseX > 850 && mouseX < 900 && mouseY > 160 && mouseY < 210){
    colorState = 1;
    pop.play();
  }

  else if(mouseX > 850 && mouseX < 900 && mouseY > 220 && mouseY < 270){
    colorState = 2;
    pop.play();
  }

  else if(mouseX > 850 && mouseX < 900 && mouseY > 280 && mouseY < 330){
    colorState = 3;
    pop.play();
  }

  else if(mouseX > 850 && mouseX < 900 && mouseY > 340 && mouseY < 390){
    colorState = 4;
    pop.play();
  }

  else if(mouseX > 850 && mouseX < 900 & mouseY > 400 && mouseY < 450){
    colorState = 5;
    pop.play();
  }

  else if(mouseX > 850 && mouseX < 900 && mouseY > 460 && mouseY < 510){
    colorState = 6;
    pop.play();
  }

  else if(mouseX > 850 && mouseX < 900 && mouseY > 520 && mouseY < 570){
    colorState = 7;
    pop.play();
  }

  else if(mouseX > 850 && mouseX < 900 && mouseY > 580 && mouseY < 630){
    colorState = 8;
    pop.play();
  }

  else if(mouseX > 1300 && mouseX < 1380 && mouseY > 300 && mouseY < 350){
    if(userStaticObjectWidth < maxStaticWidth){
      userStaticObjectWidth++;
      pop.play();
    }
  }

  else if(mouseX > 1300 && mouseX < 1380 && mouseY > 360 && mouseY < 410){
    if(userStaticObjectWidth > 0){
      userStaticObjectWidth--;
      pop.play();
    }
  }

  else if(mouseX > 1470 && mouseX < 1550 && mouseY > 300 && mouseY < 350){
    if(userStaticObjectHeight < maxStaticHeight){
      userStaticObjectHeight++;
      pop.play();
    }
  }

  else if(mouseX > 1470 && mouseX < 1550 && mouseY > 360 && mouseY < 410){
    if(userStaticObjectHeight > 0){
      userStaticObjectHeight--;
      pop.play();
    }
  }
}

//called when key pressed
function keyPressed(){
  if(state === "surface" || state === "ocean" || state === "altitude"){
    if(keyIsDown(87)){
      wall = new Wall(mouseX,mouseY,userStaticObjectWidth,userStaticObjectHeight,determineColor());
      staticObjectArray.push(wall);
    }
    else if(keyIsDown(32)){
      explosive();
    }
    else if(keyIsDown(84)){
      wall = new Wall(mouseX,mouseY,300,10,determineColor());
      staticObjectArray.push(wall);
      wall = new Wall(mouseX,mouseY + 100,300,10,determineColor());
      staticObjectArray.push(wall);
    }
  }
  if(keyIsDown(83)){
    if(userShape === 1){
      userShape = 0;
    }
    else if(userShape === 0){
      userShape = 1;
    }
  }
}

//determines object color based off of variable
function determineColor(){
  if(colorState === 0){
    return color(100,100,100,255);//grey
  }

  else if(colorState === 1){
    return color(255);//white
  }

  else if(colorState === 2){
    return color(255,0,0,255);//red
  }

  else if(colorState === 3){
    return color(0,255,0,255);//green
  }

  else if(colorState === 4){
    return color(0,0,255,255);//blue
  }

  else if(colorState === 5){
    return color(0);//black
  }

  else if(colorState === 6){
    return color(220,220,0,255);//yellow
  }

  else if(colorState === 7){
    return color(220,0,220,255);//pink
  }

  else if(colorState === 8){
    return color(0,220,220,255);//cyan
  }

  else{
    return color(100,100,100,255);//makes the game grey if user tries to mess with the color state variable
  }
}

function draw() {
  stateDiety();
}

//displays the surface
function showSurface(){
  if(planet === "Earth"){
    background(0,255,255,255);
    fill(0,200,0);
    rect(0,windowHeight-30,windowWidth,30);
  }

  else if(planet === "Moon"){
    background(0);
    fill(100,100,100,255);
    rect(0,windowHeight-30,windowWidth,30);
    g = 1;
  }

  else if(planet === "Mars"){
    background(0);
    fill(255,0,0,255);
    rect(0,windowHeight-30,windowWidth,30);
    g = 3;
  }
}

//runs code selected by state variable
function stateDiety(){
  if(state === "surface"){
    surface();
  }

  else if(state === "altitude"){
    altitude();
  }

  else if(state === "ocean"){
    ocean();
  }

  else if(state === "space"){
    space();
  }

  else if(state === "options"){
    optionScreen();
  }
}

//runs altitude state
function altitude(){
  background(0,255,255,255);
  showOptionButton();
  for(let r = 0; r < staticObjectArray.length; r++){
    staticObjectArray[r].show();
    for(let e = 0; e < objectArray.length; e++){
      objectArray[e].wallCollision(staticObjectArray[r]);
    }
  }
  for(let f=objectArray.length-1; f>=0; f--){
    objectArray[f].isCollide = false;
    for (let k=objectArray.length-1; k>=0; k--){
      if(f !== k){
        objectArray[f].collision(objectArray[k]);
      }
    }
    objectArray[f].show();
    objectArray[f].update();
    objectArray[f].altitudeGravity();
    if(planet === "Earth"){
      objectArray[f].airResistance();
    }
    if(planet === "Moon"){
      objectArray[f].cheapOrbitalRipoff();
    }
    if(mouseIsPressed){
      for(let c = 0; c < objectArray.length; c++){
        if(objectArray[c].checkMouse() === true){
          objectArray[c].dragObject();//Find a way to make the object stay dragging until mouse released
        }
      }
    }
  }
}

//runs the surface state for any planet
function surface(){
  showSurface();
  showOptionButton();
  for(let r = 0; r < staticObjectArray.length; r++){
    staticObjectArray[r].show();
    for(let e = 0; e < objectArray.length; e++){
      objectArray[e].wallCollision(staticObjectArray[r]);
    }
  }
  for (let i=objectArray.length-1; i >= 0; i--){
    objectArray[i].isCollide = false;
    for (let j=objectArray.length-1; j >= 0; j--){
      if(i !== j){
        //dont check collision against self
        objectArray[i].collision(objectArray[j]);
      }
    }
    objectArray[i].show();
    objectArray[i].update();
    objectArray[i].surfaceGravity();
    objectArray[i].suddenChangeInAttitude();
    if(planet === "Earth"){
      objectArray[i].airResistance();
    }
    if(planet === "Moon"){
      objectArray[i].cheapOrbitalRipoff();
    }
    if(mouseIsPressed){
      for(let c = 0; c < objectArray.length; c++){
        if(objectArray[c].checkMouse() === true){
          objectArray[c].dragObject();
        }
      }
    }
  }
}

//runs the ocean state to demonstrate buoyancy
function ocean(){
  background(0,255,255,255);
  displayWater();
  showOptionButton();
  for(let r = 0; r < staticObjectArray.length; r++){
    staticObjectArray[r].show();
    for(let e = 0; e < objectArray.length; e++){
      objectArray[e].wallCollision(staticObjectArray[r]);
    }
  }
  for(let f = objectArray.length - 1; f >= 0; f--){
    objectArray[f].isCollide = false;
    for(let k = objectArray.length - 1; k >= 0; k--){
      if(f !== k){
        objectArray[f].collision(objectArray[k]);
      }
    }
    objectArray[f].show();
    objectArray[f].update();
    objectArray[f].surfaceGravity();
    if(planet === "Earth"){
      objectArray[f].airResistance();
    }
    objectArray[f].buoyancy();
    if(mouseIsPressed){
      for(let c = 0; c < objectArray.length; c++){
        if(objectArray[c].checkMouse() === true){
          objectArray[c].dragObject();
        }
      }
    }
  }
}

//displays ocean water
function displayWater(){
  fill(0,0,255);
  rect(0,500,windowWidth,800);
}

//runs the space state
function space(){
  background(0);
  showOptionButton();
  for(let s = 0; s < staticObjectArray.length; s++){
    staticObjectArray[s].show();
  }
}

//displays the options screen
function optionScreen(){
  noStroke();
  background(0);
  fill(0,220,0);
  textSize(30);
  text("<-Object-> <-Spawn-> <-Interface->", 950, 100, 100);
  textSize(25);
  text("Obj. Velocity and Direction -/+", 100, 50, 100);
  text("Obj. Mass", 380, 50, 100);
  text("Obj. Size", 680, 50, 100);
  text("Color", 845, 60, 100);
  text("S Key Toggles Square/Sphere",950,350,100);
  text("W Key Places Static Obj.",950,550,100);
  text("Additional-> Static-> Obj.-> Options-> | | | | | | vvvvvv",1150,200,100);
  text("Static Obj. Width",1300,50,100);
  text("Static Obj. Height",1470,50,100);
  text(str(userVelocity), 100, 250, 100);
  text(str(userMass), 380, 250, 100);
  text(str(userRadius), 680, 250, 100);
  text(str(userStaticObjectWidth), 1310, 250, 100);
  text(str(userStaticObjectHeight), 1490, 250, 100);
  displayArrows();
  planetSelection();
  colorSelection();
}

//displays planet buttons
function planetSelection(){
  fill(255);
  rect(40,650,210,70);//REFRESH
  rect(260,650,210,70);//EARTH
  rect(480,650,210,70);//MARS
  rect(700,650,210,70);//MOON
  rect(260,730,210,70);//ocean
  rect(260,570,210,70)//altitude
  fill(150,100,0);
  textSize(40);
  text("REFRESH",50,700,100);
  fill(0,220,0);
  text("EARTH",295,700,100);
  fill(230,0,0);
  text("MARS",530,700,100);
  fill(150);
  text("MOON",740,700,100);
  fill(0,0,220);
  text("OCEAN",295,780,100);
  fill(0,250,250);
  text("ALTITUDE",270,620,100);
}

//displays color selection bar in options screen
function colorSelection(){
  strokeWeight(4);
  stroke(255);
  fill(100,100,100,255);
  rect(850,100,50,50);
  fill(255);
  rect(850,160,50,50);
  fill(255,0,0,255);
  rect(850,220,50,50);
  fill(0,255,0,255);
  rect(850,280,50,50);
  fill(0,0,255,255);
  rect(850,340,50,50);
  fill(0);
  rect(850,400,50,50);
  fill(220,220,0,255);
  rect(850,460,50,50);
  fill(220,0,220,255);
  rect(850,520,50,50);
  fill(0,220,220,255);
  rect(850,580,50,50);
  strokeWeight(1);
  stroke(0);
}

//shows interface arrows on options screen
function displayArrows(){
  image(leftArrow, 50, 350, 70, 100);//velocity
  image(rightArrow, 150, 350, 70, 100);//velocity
  image(upArrow, 350, 350, 100, 70);//mass
  image(downArrow, 350, 450, 100, 70);//mass
  image(upArrow, 650, 350, 100, 70);//size
  image(downArrow, 650, 450, 100, 70);//size
  image(leftArrow,0,0,100,100);//return
  image(upArrow,1300,300,80,50);//static width
  image(downArrow,1300,360,80,50);//static width
  image(upArrow,1470,300,80,50);//static height
  image(downArrow,1470,360,80,50);//static height
}

//shows the button to get to option screen
function showOptionButton(){
  image(rightArrow,windowWidth-100,0,100,100);
}
