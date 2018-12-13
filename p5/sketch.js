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
			this.dy = this.dy * -1;
		}
	}

  //checks for collisions with other spheres
  collision(otherSphere){
    if(dist(this.x,this.y,otherSphere.x,otherSphere.y) < this.radius + otherSphere.radius){
      this.isCollide = true;
      otherSphere.isCollide = true;
      let tempDx = this.dx;
      let tempDy = this.dy;
      this.dx = otherSphere.dx;
      this.dy = otherSphere.dy;
      otherSphere.dx = tempDx;
      otherSphere.dy = tempDy;
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

function setup() {
  g = 9.81;
  colorState = 0;
  state = "surface";
  planet = "Earth";
  createCanvas(windowWidth, windowHeight);
}

function mousePressed(){
  if(g === 9.806){
    wall = new Wall(mouseX,mouseY,100,20,determineColor());
    staticObjectArray.push(wall);
  }
  else if(state === "surface" || state === "altitude"){
    sphere = new Sphere(mouseX,mouseY,15,0,0,determineColor(), g, 10);
    objectArray.push(sphere);
  }
}

//determines ball color based of variable(make a better system than this)
function determineColor(){
  if(colorState === 0){
    return color(100,100,100,255);
  }
  else{
    return color(100,100,100,255);
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
