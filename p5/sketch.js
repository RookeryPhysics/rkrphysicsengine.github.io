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
  }

  show(){
    fill(this.color);
    rect(this.x,this.y,this.width,this.height);
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
    let isCollide = false;
    this.energyLoss = energyLoss;
    this.airX = airResistanceX;
    this.airY = airResistanceY;
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
    this.dy = this.dy + this.g/50;
  }

  altitudeGravity(){
    this.dy = this.dy + this.g/55;
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
    if(this.dx > 0 && this.x + this.radius >= wall.x - wall.width/10 && this.x + this.radius <= wall.x + wall.width/4 && this.y + this.radius >= wall.y && this.y - this.radius*2 <= wall.y){
      let tempVar = this.dx;
      tempVar = tempVar - this.energyLoss/100;
      this.dx = 0 - tempVar;
    }
    else if(this.dx < 0 && this.x - this.radius <= wall.x + wall.width + wall.width/10 && this.x - this.radius >= wall.x + wall.width*0.75 && this.y + this.radius >= wall.y && this.y - this.radius*2 <= wall.y){
      let tempVar = this.dx;
      tempVar = tempVar - this.energyLoss/100;
      this.dx = 0 - tempVar;
    }
    else if(this.dy > 0 && this.y + this.radius >= wall.y && this.y + this.radius <= wall.y + wall.height && this.x + this.radius > wall.x && this.x - this.radius < wall.x + wall.width){
      let tempVar = this.dy;
      tempVar = tempVar - this.energyLoss/100;
      this.dy = 0 - tempVar;
    }
    else if(this.dy < 0 && this.y - this.radius <= wall.y + wall.height && this.y - this.radius >= wall.y && this.x + this.radius > wall.x && this.x - this.radius < wall.x + wall.width){
      let tempVar = this.dy;
      tempVar = tempVar - this.energyLoss/100;
      this.dy = 0 - tempVar;
    }
  }

  dragObject(){
    this.x = mouseX;
    this.y = mouseY;
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
  constructor(x,y,radius,dx,dy,color,g,mass,energyLoss,airResistanceX,airResistanceY){
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
    this.dy = this.dy + this.g/50;
  }

  //high altitude gravity
  altitudeGravity(){
    this.dy = this.dy + this.g/55;
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
    if(this.dx > 0 && this.x + this.radius >= wall.x - wall.width/10 && this.x + this.radius <= wall.x + wall.width/4 && this.y + this.radius >= wall.y && this.y - this.radius*2 <= wall.y){
      let tempVar = this.dx;
      tempVar = tempVar - this.energyLoss/100;
      this.dx = 0 - tempVar;
    }
    else if(this.dx < 0 && this.x - this.radius <= wall.x + wall.width + wall.width/10 && this.x - this.radius >= wall.x + wall.width*0.75 && this.y + this.radius >= wall.y && this.y - this.radius*2 <= wall.y){
      let tempVar = this.dx;
      tempVar = tempVar - this.energyLoss/100;
      this.dx = 0 - tempVar;
    }
    else if(this.dy > 0 && this.y + this.radius >= wall.y && this.y + this.radius <= wall.y + wall.height && this.x + this.radius > wall.x && this.x - this.radius < wall.x + wall.width){
      let tempVar = this.dy;
      tempVar = tempVar - this.energyLoss/100;
      this.dy = 0 - tempVar;
    }
    else if(this.dy < 0 && this.y - this.radius <= wall.y + wall.height && this.y - this.radius >= wall.y && this.x + this.radius > wall.x && this.x - this.radius < wall.x + wall.width){
      let tempVar = this.dy;
      tempVar = tempVar - this.energyLoss/100;
      this.dy = 0 - tempVar;
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
let state;
let planet;
let colorState;
let energyLoss;
let allowed;
let addThisX, addThisY, addOtherX, addOtherY;
let addX, addY, addOX, addOY;
let totalSpeed, quarterSpeed;
let airResistanceY;//coefficient of air resistance
let airResistanceX;//wind
let userRadius;
let userMass;
let userVelocity;
let leftArrow, rightArrow, upArrow, downArrow;

function preload(){
  leftArrow = loadImage("assets/leftarrow.png");
  rightArrow = loadImage("assets/rightarrow.png");
  //upArrow = loadImage("assets/upArrow.png");
  //downArrow = loadImage("assets/downArrow.png");
}

function setup() {
  g = 9.81;
  colorState = 0;
  state = "surface";
  planet = "Earth";
  allowed = true;
  userVelocity = 0;
  userRadius = 50;
  userMass = 10;
  energyLoss = 20;//for some unbeknowns't to me reason 10 seems to simulate fully elastic collisions
  airResistanceY = 0;
  airResistanceX = 0.5;
  createCanvas(windowWidth, windowHeight);
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

image(leftArrow, 50, 350, 70, 100);
image(rightArrow, 150, 350, 70, 100);

//called when mouse is pressed
function mousePressed(){
  checkIfRoom();
  if(state !== "options" && mouseX < 100 && mouseY < 100){
    state = "options";
  }
  else if(state === "options" && mouseX < 100 && mouseY < 100){
    state = "surface";
  }
  else if(state === "options" && mouseX < 120 && mouseX > 50 && mouseY > 350 && mouseY < 450){
    userVelocity--;
  }
  else if(state === "options" && mouseY > 350 && mouseY < 450 && mouseX > 150 && mouseX < 220){
    userVelocity++;
  }
  else if(keyIsDown(49) && state === "surface" || keyIsDown(49) && state === "altitude"){
    checkIfRoom();
    if(allowed){
      //creates a ball
      sphere = new Sphere(mouseX, mouseY, 25, 0, 0, determineColor(), g, 25, energyLoss, airResistanceX, airResistanceY);
      objectArray.push(sphere);
    }
  }
  else if(keyIsDown(50) && state === "surface" || keyIsDown(50) && state === "altitude"){
    checkIfRoom();
    if(allowed){
      //creates a ball
      sphere = new Sphere(mouseX, mouseY, 15, -6, 0, determineColor(), g, 20, energyLoss, airResistanceX, airResistanceY);
      objectArray.push(sphere);
    }
  }
  else if(keyIsDown(51) && state === "surface" || keyIsDown(51) && state === "altitude"){
    checkIfRoom();
    if(allowed){
      //creates a ball
      sphere = new Sphere(mouseX, mouseY, 15, -4, 0, determineColor(), g, 10, energyLoss, airResistanceX, airResistanceY);
      objectArray.push(sphere);
    }
  }
  else if(keyIsDown(52) && state === "surface" || keyIsDown(52) && state === "altitude"){
    checkIfRoom();
    if(allowed){
      //creates a ball
      sphere = new Sphere(mouseX, mouseY, 15, -2, 0, determineColor(), g, 10, energyLoss, airResistanceX, airResistanceY);
      objectArray.push(sphere);
    }
  }
  else if(keyIsDown(53) && state === "surface" || keyIsDown(53) && state === "altitude"){
    checkIfRoom();
    if(allowed){
      spawnBall();
    }
  }
  else if(keyIsDown(54) && state === "surface" || keyIsDown(54) && state === "altitude"){
    checkIfRoom();
    if(allowed){
      //creates a ball
      sphere = new Sphere(mouseX, mouseY, 15, 2, 0, determineColor(), g, 10, energyLoss, airResistanceX, airResistanceY);
      objectArray.push(sphere);
    }
  }
  else if(keyIsDown(55) && state === "surface" || keyIsDown(55) && state === "altitude"){
    checkIfRoom();
    if(allowed){
      //creates a ball
      box = new Box(mouseX, mouseY, 20, 20, 0, 0, determineColor(), g, 10, energyLoss, airResistanceX, airResistanceY);
      objectArray.push(box);
    }
  }
  else if(keyIsDown(56) && state === "surface" || keyIsDown(56) && state === "altitude"){
    checkIfRoom();
    if(allowed){
      //creates a ball
      sphere = new Sphere(mouseX, mouseY, 15, 6, 0, determineColor(), g, 10, energyLoss, airResistanceX, airResistanceY);
      objectArray.push(sphere);
    }
  }
  else if(keyIsDown(57) && state === "surface" || keyIsDown(57) && state === "altitude"){
    checkIfRoom();
    if(allowed){
      //creates a ball
      sphere = new Sphere(mouseX, mouseY, 15, 8, 0, determineColor(), g, 10, energyLoss, airResistanceX, airResistanceY);
      objectArray.push(sphere);
    }
  }
  else if(state === "surface" || state === "altitude"){
    checkIfRoom();
    if(allowed){
      spawnBall();
    }
  }
}

//creates a ball
function spawnBall(){
  sphere = new Sphere(mouseX, mouseY, userRadius, userVelocity, 0, determineColor(), g, userMass, energyLoss, airResistanceX, airResistanceY);
  objectArray.push(sphere);
}

//remake - this is shit
function explosive(){
  let bomb;
  let tempState = colorState;//sets tempState to colorState to store value
  colorState = 2; //makes explosion red
  bomb = new Sphere(mouseX+20,mouseY,10,10,0,determineColor(),g,5,energyLoss,airResistanceX,airResistanceY);
  objectArray.push(bomb);
  bomb = new Sphere(mouseX-20,mouseY,10,-10,0,determineColor(),g,5,energyLoss,airResistanceX,airResistanceY);
  objectArray.push(bomb);
  bomb = new Sphere(mouseX,mouseY-20,10,0,-10,determineColor(),0,5,energyLoss,airResistanceX,airResistanceY);
  objectArray.push(bomb);
  bomb = new Sphere(mouseX,mouseY+20,10,0,10,determineColor(),g,5,energyLoss,airResistanceX,airResistanceY);
  objectArray.push(bomb);
  bomb = new Sphere(mouseX+20,mouseY+20,10,6,7,determineColor(),g,5,energyLoss,airResistanceX,airResistanceY);
  objectArray.push(bomb);
  bomb = new Sphere(mouseX-20,mouseY-20,10,4,-7,determineColor(),g,5,energyLoss,airResistanceX,airResistanceY);
  objectArray.push(bomb);
  bomb = new Sphere(mouseX-20,mouseY-20,10,-6,-5,determineColor(),0,5,energyLoss,airResistanceX,airResistanceY);
  objectArray.push(bomb);
  bomb = new Sphere(mouseX-20,mouseY+20,10,-6,6,determineColor(),g,5,energyLoss,airResistanceX,airResistanceY);
  objectArray.push(bomb);
  colorState = tempState;//puts colorState back to normal
}

//called when key pressed
function keyPressed(){
  if(keyIsDown(87)){
    wall = new Wall(mouseX,mouseY,100,20,determineColor());
    staticObjectArray.push(wall);
  }
  if(keyIsDown(32)){
    explosive();
  }
  if(keyIsDown(84)){
    wall = new Wall(mouseX,mouseY,300,10,determineColor());
    staticObjectArray.push(wall);
    wall = new Wall(mouseX,mouseY + 100,300,10,determineColor());
    staticObjectArray.push(wall);
  }
}

//determines object color based off of variable
function determineColor(){
  if(colorState === 0){
    return color(100,100,100,255);//grey
  }
  else if(colorState === 1){
    return color(255,255,255,255);
  }
  else if(colorState === 2){
    return color(255,0,0,255);
  }
  else if(colorState === 3){
    return color(0,255,0,255);
  }
  else if(colorState === 4){
    return color(0,0,255,255);
  }
  else if(colorState === 5){
    return color(0);
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
    showSurface();
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
      objectArray[i].airResistance();
      objectArray[i].suddenChangeInAttitude();
      if(mouseIsPressed){
        for(let c = 0; c < objectArray.length; c++){
          if(objectArray[c].checkMouse() === true){
            objectArray[c].dragObject();
          }
        }
      }
    }
  }
  else if(state === "altitude"){
    background(0,255,255,255);
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
      objectArray[f].airResistance();
      if(mouseIsPressed){
        for(let c = 0; c < objectArray.length; c++){
          if(objectArray[c].checkMouse() === true){
            objectArray[c].dragObject();//Find a way to make the object stay dragging until mouse released
          }
        }
      }
    }
  }
  else if(state === "ocean"){
    //
    background(0,255,255,255);
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
      objectArray[f].airResistance();
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
  else if(state === "space"){
    background(0);
    for(let s = 0; s < staticObjectArray.length; s++){
      staticObjectArray[s].show();
    }
  }
  else if(state === "options"){
    optionScreen();
  }
}

function optionScreen(){
  background(0);
  textSize(25);
  text("Object Spawn Interface", 900, 150, 100);
  text("Obj. Velocity and Direction -/+", 100, 50, 100);
  text("Obj. Mass", 400, 50, 100);
  text("Obj. Size", 700, 50, 100);
  text(str(userVelocity), 100, 250, 100);
  text(str(userMass), 400, 250, 100);
  text(str(userRadius), 700, 250, 100);
  image(leftArrow, 50, 350, 70, 100);
  image(rightArrow, 150, 350, 70, 100);
}
