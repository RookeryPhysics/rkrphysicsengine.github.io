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

class Sphere {
  constructor(x,y,radius,dx,dy,color,g,mass){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.dx = dx;
    this.dy = dy;
    this.color = color;
    this.g = g;
    this.mass = mass;
    this.isCollide = false;
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
    this.dy = this.dy + 1/this.g;
  }

  //high altitude gravity
  altitudeGravity(){
    this.dy = this.dy + 1/this.g;
  }

  //bounces ball off the surface
  suddenChangeInAttitude(){
    if(this.y > windowHeight - 30 - this.radius){
      this.dy = this.dy - percentEnergyLoss/100;
      this.dy = 0 - this.dy;
    }
  }

  //checks for collisions with other spheres
  collision(otherSphere){
    if(dist(this.x,this.y,otherSphere.x,otherSphere.y) < this.radius + otherSphere.radius){
      this.isCollide = true;
      otherSphere.isCollide = true;
      let tempDx = this.dx;
      let tempDy = this.dy;
      //let randomX = random()
      tempDx = tempDx - (0.25 * percentEnergyLoss)/100;
      tempDy = tempDy - (0.25 * percentEnergyLoss)/100;
      this.dx = otherSphere.dx - (0.25 * percentEnergyLoss)/100;
      this.dy = otherSphere.dy - (0.25 * percentEnergyLoss)/100;
      otherSphere.dx = tempDx;
      otherSphere.dy = tempDy;
    }
  }

  //collide with wall
  wallCollision(wall){
    if(this.y + this.radius >= wall.y && this.y + this.radius <= wall.y + wall.height && this.x + this.radius > wall.x && this.x - this.radius < wall.x + wall.width){
      let tempVar = this.dy;
      tempVar = tempVar - percentEnergyLoss/100;
      this.dy = 0 - tempVar;
    }
    else if(this.y - this.radius <= wall.y + wall.height && this.y - this.radius >= wall.y && this.x + this.radius > wall.x && this.x - this.radius < wall.x + wall.width){
      let tempVar = this.dy;
      tempVar = tempVar - percentEnergyLoss/100;
      this.dy = 0 - tempVar;
    }
  }
}

let sphere;
let wall;
let ballColor;
let g;
let radius;
let object;
let objectArray = [];
let staticObjectArray = [];
let state;
let planet;
let colorState;
let percentEnergyLoss;

function setup() {
  g = 9.81;
  colorState = 0;
  state = "surface";
  planet = "Earth";
  percentEnergyLoss = 10;//for some unbeknowns't to me reason 10 seems to simulate fully elastic collisions
  createCanvas(windowWidth, windowHeight);
}

function mousePressed(){
  if(keyIsDown(49) && state === "surface" || state === "altitude"){
    sphere = new Sphere(mouseX, mouseY, 15, -8, 0, determineColor(), g, 10);
    objectArray.push(sphere);
  }
  else if(keyIsDown(50) && state === "surface" || state === "altitude"){
    sphere = new Sphere(mouseX, mouseY, 15, -6, 0, determineColor(), g, 10);
    objectArray.push(sphere);
  }
  else if(keyIsDown(51) && state === "surface" || state === "altitude"){
    sphere = new Sphere(mouseX, mouseY, 15, -4, 0, determineColor(), g, 10);
    objectArray.push(sphere);
  }
  else if(keyIsDown(52) && state === "surface" || state === "altitude"){
    sphere = new Sphere(mouseX, mouseY, 15, -2, 0, determineColor(), g, 10);
    objectArray.push(sphere);
  }
  else if(keyIsDown(53) && state === "surface" || state === "altitude"){
    spawnBall();
  }
  else if(keyIsDown(54) && state === "surface" || state === "altitude"){
    sphere = new Sphere(mouseX, mouseY, 15, 2, 0, determineColor(), g, 10);
    objectArray.push(sphere);
  }
  else if(keyIsDown(55) && state === "surface" || state === "altitude"){
    sphere = new Sphere(mouseX, mouseY, 15, 4, 0, determineColor(), g, 10);
    objectArray.push(sphere);
  }
  else if(keyIsDown(56) && state === "surface" || state === "altitude"){
    sphere = new Sphere(mouseX, mouseY, 15, 6, 0, determineColor(), g, 10);
    objectArray.push(sphere);
  }
  else if(keyIsDown(57) && state === "surface" || state === "altitude"){
    sphere = new Sphere(mouseX, mouseY, 15, 8, 0, determineColor(), g, 10);
    objectArray.push(sphere);
  }
  else if(state === "surface" || state === "altitude"){
    spawnBall();
  }
}

function spawnBall(){
  sphere = new Sphere(mouseX, mouseY, 15, 0, 0, determineColor(), g, 10);
  objectArray.push(sphere);
}

//remake - this is shit
function explosive(){
  let bomb;
  bomb = new Sphere(mouseX+20,mouseY,10,10,0,determineColor(),g,5);
  objectArray.push(bomb);
  bomb = new Sphere(mouseX-20,mouseY,10,-10,0,determineColor(),g,5);
  objectArray.push(bomb);
  bomb = new Sphere(mouseX,mouseY-20,10,0,-10,determineColor(),0,5);
  objectArray.push(bomb);
  bomb = new Sphere(mouseX,mouseY+20,10,0,10,determineColor(),g,5);
  objectArray.push(bomb);
  bomb = new Sphere(mouseX+20,mouseY+20,10,6,7,determineColor(),g,5);
  objectArray.push(bomb);
  bomb = new Sphere(mouseX-20,mouseY-20,10,4,-7,determineColor(),g,5);
  objectArray.push(bomb);
  bomb = new Sphere(mouseX-20,mouseY-20,10,-6,-5,determineColor(),0,5);
  objectArray.push(bomb);
  bomb = new Sphere(mouseX-20,mouseY+20,10,-6,6,determineColor(),g,5);
  objectArray.push(bomb);
}

function keyPressed(){
  if(keyIsDown(87)){
    wall = new Wall(mouseX,mouseY,100,20,determineColor());
    staticObjectArray.push(wall);
  }
  if(keyIsDown(32)){
    explosive();
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
      objectArray[i].suddenChangeInAttitude();
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
    }
  }
  else if(state === 2){
    //
  }
}
