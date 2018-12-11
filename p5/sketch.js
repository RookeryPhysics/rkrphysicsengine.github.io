// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

class Sphere {
  constructor(x,y,radius,dx,dy,color,g){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.dx = dx;
    this.dy = dy;
    this.color = color;
    this.g = g;
  }
  show(){
    fill(this.color);
    ellipse(this.x,this.y,this.radius*2,this.radius*2);
  }
  update(){
    this.x = this.x + this.dx;
    this.y = this.y + this.dy;
  }
  surfaceGravity(){
    this.dy = this.dy + 1/g;
  }
  altitudeGravity(){
    this.dy = this.dy + 1.4/g;
  }
}

let sphereColor;
let g;
let radius;
let object;
let objectArray = [];
let state;
let colorState;

function setup() {
  g = 9.81;
  colorState = 0;
  state = 0;
  createCanvas(windowWidth, windowHeight);
}

function mousePressed(){
  if(state === 0){
    sphere = new Sphere(mouseX,mouseY,10,0,0,determineColor(), g);
    objectArray.push(sphere);
  }
}

function determineColor(){
  if(colorState === 0){
    return color(100,100,100,255);
  }
  else{
    return color(100,100,100,255);
  }
}

function draw() {
  background(255,255,255,255);
  for(let i = 0; i < objectArray.length; i++){
    objectArray[i].show();
    objectArray[i].update();
    objectArray[i].surfaceGravity();
  }
}

function stateDiety(){
  if(state === 0){
    //
  }
  else if(state === 1){
    //
  }
  else if(state === 2){
    //
  }
}
