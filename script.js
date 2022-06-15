let color = {
	theme: "rgb(29, 30, 32)",
	themetransparent: "rgba(29, 30, 32, 0.04)",
	entry: "rgb(46, 46, 51)",
	primary: "rgb(218, 218, 219)",
	secondary: "rgb(155, 156, 157)",
	tertiary: "rgb(65, 66, 68)",
	border: "rgb(51, 51, 51)"
}

let len1, len2, mass1, mass2, angle1, angle2, vel1, vel2, g, damp, xoffset, yoffset, px2, py2, trail, firstFrame, fr;
let startButtonTime;

function setVars() {
	len1 = 1;
	len2 = 1;
	mass1 = 20;
	mass2 = 100;
	angle1 = 5*Math.PI/8;
	angle2 = 6*Math.PI/8;
	vel1 = 0;
	vel2 = 0;
	g = 9.81
	damp = 0.001;
	firstFrame = true;
	xoffset = width/2;
	yoffset = height/4;
}

function setup() {
	var div = document.getElementById("sim");
	var canvas = createCanvas(div.offsetWidth, div.offsetHeight);
	canvas.parent('sim');

	setVars();
	noLoop();

	trail = createGraphics(div.offsetWidth, div.offsetHeight);
	trail.background(color.theme);
	trail.translate(xoffset, yoffset);

	startButtonTime = millis();
}

function draw() {	
	image(trail, 0, 0)

	let acc1 = (-g*(2*mass1+mass2)*Math.sin(angle1) - mass2*g*Math.sin(angle1-2*angle2) - 2*Math.sin(angle1-angle2)*mass2*(vel2*vel2*len2+vel1*vel1*len1*Math.cos(angle1-angle2))) / (len1*(2*mass1+mass2-mass2*Math.cos(2*angle1-2*angle2)))
	let acc2 = (2*Math.sin(angle1-angle2)*(vel1*vel1*len1*(mass1+mass2)+g*(mass1+mass2)*Math.cos(angle1)+vel2*vel2*len2*mass2*Math.cos(angle1-angle2)))/(len2*(2*mass1+mass2-mass2*Math.cos(2*angle1-2*angle2)))

	stroke(color.primary);
	strokeWeight(4);
	translate(xoffset, yoffset)

	let x1 = (len1*100) * Math.sin(angle1);
	let y1 = (len1*100) * Math.cos(angle1);

	let x2 = x1 + (len2*100) * Math.sin(angle2);
	let y2 = y1 + (len2*100) * Math.cos(angle2);
	
	line(0,0,x1,y1);
	line(x1,y1,x2,y2);

	stroke(color.theme)
	fill(color.primary);
	ellipse(x1,y1,fancyLog(mass1),fancyLog(mass1))
	ellipse(x2,y2,fancyLog(mass2),fancyLog(mass2))

	let dt = 1 / frameRate()
	if (frameRate() <= 2 || frameRate() >= 9000) { 
		dt = 0.01667 // if low or high just assume 60 fps
		// I don't like this solution but it actually works so whatever
	}
	document.getElementById("fps").innerHTML = `FPS: ${frameRate()}`
	document.getElementById("delta").innerHTML = `Delta: ${dt}`
	document.getElementById("seconds").innerHTML = `Calculated Seconds: ${Math.floor(frameCount * dt * 10) / 10}`;

	console.log(dt)

	vel1 += acc1 * dt;
	vel2 += acc2 * dt;
	angle1 += vel1 * dt;
	angle2 += vel2 * dt;

	/* vel1 *= (1 - damp) * dt;
	vel2 *= (1 - damp) * dt; */

	trail.stroke(color.secondary)
	trail.strokeWeight(4);
	trail.fill(100);
	if (!firstFrame) {
		trail.line(px2, py2, x2, y2)
	} else {
		firstFrame = false;
	}
	trail.background(color.themetransparent)

	px2 = x2;
	py2 = y2;
}

window.onresize = () => {
	loop();
	setup();
}
let restartButtonTime; // a weird solution to the frame rate jumping around when buttons are clicked too fast and messing with the stuff meant to make the frame rate not matter
// basically theres a half second cooldown on the restart button bc things are weird

document.getElementById("restart-button").addEventListener("click", () => {
	if (millis() - restartButtonTime <= 500) {
		console.log(`Ignored, it's only been ${millis() - restartButtonTime} ms.`)
		restartButtonTime = millis();
		return;
	}
	restartButtonTime = millis();
	
	loop();
	setVars();
	trail.background(color.theme);
	noLoop();
});

document.getElementById("pause-button").addEventListener("click", () => {
	noLoop();
	restartButtonTime = millis();
});

document.getElementById("play-button").addEventListener("click", () => {
	if (millis() - startButtonTime <= 500) {
		console.log(`Ignored, it's only been ${millis() - restartButtonTime} ms.`)
		return;
	}
	loop();
});

function fancyLog(n) {
	return 20 * Math.log2(n + 16) - 80;
}