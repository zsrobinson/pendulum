let len1 = 150;
let len2 = 150;
let mass1 = 20;
let mass2 = 20;
let angle1 = Math.PI/4;
let angle2 = Math.PI/2;

let vel1 = 0;
let vel2 = 0;

let g = 1

let xoffset, yoffset;
let px2, py2; // previous x2 and y2 for the trail

let trail;

function setup() {
	var divWidth = document.getElementById("container").offsetWidth;
	var canvas = createCanvas(divWidth, divWidth);
	xoffset = width/2;
	yoffset = height/4;
	trail = createGraphics(divWidth, divWidth);
	trail.background(255);
	trail.translate(xoffset, yoffset);
	canvas.parent('container');
}

function draw() {
	
	//background(255);
	
	image(trail, 0, 0)

	acc1 = (-g*(2*mass1+mass2)*Math.sin(angle1) - mass2*g*Math.sin(angle1-2*angle2) - 2*Math.sin(angle1-angle2)*mass2*(vel2*vel2*len2+vel1*vel1*len1*Math.cos(angle1-angle2))) / (len1*(2*mass1+mass2-mass2*Math.cos(2*angle1-2*angle2)))

	acc2 = (2*Math.sin(angle1-angle2)*(vel1*vel1*len1*(mass1+mass2)+g*(mass1+mass2)*Math.cos(angle1)+vel2*vel2*len2*mass2*Math.cos(angle1-angle2)))/(len2*(2*mass1+mass2-mass2*Math.cos(2*angle1-2*angle2)))

	console.log(acc1,acc2)

	stroke(0);
	strokeWeight(2);
	translate(xoffset, yoffset)

	let x1 = len1 * Math.sin(angle1);
	let y1 = len1 * Math.cos(angle1);

	let x2 = x1 + len2 * Math.sin(angle2);
	let y2 = y1 + len2 * Math.cos(angle2);


	line(0,0,x1,y1);
	fill(0);
	ellipse(x1,y1,mass1,mass1)

	line(x1,y1,x2,y2);
	fill(0);
	ellipse(x2,y2,mass2,mass2)

	


	/* let num1=-g*(2* mass1 + mass2)*Math.sin(angle1);
	let num2=-mass2*g*Math.sin(angle1-2*angle2);
	let num3=-2*Math.sin(angle1-angle2)
	let num4=mass2*(vel2*vel2*len2+vel1*vel1*len1* Math.cos(angle1-angle2));
	let den=len1*(2*mass1+mass2-mass2*Math.cos(2*angle1-2*angle2));

	acc1=(num1+num2+(num3*num4))/den;

	num1=2*Math.sin(angle1-angle2);
	num2=(vel1*vel1*len1*(mass1+mass2));
	num3=g*(mass1+mass2)* Math.cos(angle1);
	num4=vel2*vel2*len2*mass2* Math.cos(angle1-angle2);
	den=len2*(2*mass1+mass2-mass2*Math.cos(2*angle1-2*angle2));

	acc2=(num1*(num2+num3+num4))/den; */


	vel1 += acc1;
	vel2 += acc2;
	angle1 += vel1;
	angle2 += vel2;

	vel1 *= 0.999;
	vel2 *= 0.999;

	trail.stroke(150)
	trail.strokeWeight(4);
	trail.fill(100);
	//trail.point(x2,y2);
	//trail.ellipse(x2,y2,mass2,mass2);
	trail.line(px2, py2, x2, y2)
	trail.background(255,10)

	px2 = x2;
	py2 = y2;
	
}

