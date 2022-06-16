let color = {
	theme: "rgb(29, 30, 32)",
	themetransparent: "rgba(29, 30, 32, 0.04)",
	entry: "rgb(46, 46, 51)",
	primary: "rgb(218, 218, 219)",
	secondary: "rgb(155, 156, 157)",
	tertiary: "rgb(65, 66, 68)",
	border: "rgb(51, 51, 51)"
}

let len1, len2, mass1, mass2, angle1, angle2, vel1, vel2, g, dampRate, xoffset, yoffset, px2, py2, trail, firstFrame, fr;
let startButtonTime;
let x1, y1, x2, y2;

function setVars() {
	len1 = Number(document.getElementById("len1-input").value);
	len2 = Number(document.getElementById("len2-input").value);
	mass1 = Number(document.getElementById("mass1-input").value);
	mass2 = Number(document.getElementById("mass2-input").value);
	angle1 = Number(document.getElementById("angle1-input").value) * (Math.PI / 180);
	angle2 = Number(document.getElementById("angle2-input").value) * (Math.PI / 180);
	vel1 = 0;
	vel2 = 0;
	g = Number(document.getElementById("g-input").value)
	dampRate = Number(document.getElementById("dampRate-input").value);
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

	let acc1 = (-g*(2*mass1+mass2)*Math.sin(angle1) - mass2*g*Math.sin(angle1-2*angle2) - 2*Math.sin(angle1-angle2)*mass2*(vel2*vel2*len2+vel1*vel1*len1*Math.cos(angle1-angle2))) / (len1*(2*mass1+mass2-mass2*Math.cos(2*angle1-2*angle2)))
	let acc2 = (2*Math.sin(angle1-angle2)*(vel1*vel1*len1*(mass1+mass2)+g*(mass1+mass2)*Math.cos(angle1)+vel2*vel2*len2*mass2*Math.cos(angle1-angle2)))/(len2*(2*mass1+mass2-mass2*Math.cos(2*angle1-2*angle2)))

	let dt = 1 / frameRate()
	if (frameRate() <= 2 || frameRate() >= 9000) { 
		dt = 0.01667 // if low or high just assume 60 fps
		// I don't like this solution but it actually works so whatever
	}

	let netAcc1 = acc1 - (dampRate * vel1)
	let netAcc2 = acc2 - (dampRate * vel2)

	vel1 += netAcc1 * dt;
	vel2 += netAcc2 * dt;
	angle1 += vel1 * dt;
	angle2 += vel2 * dt;

	document.getElementById("angle1-input").value = Math.round(angle1 * (180/Math.PI));
	document.getElementById("angle1-output").innerHTML = Math.round(angle1 * (180/Math.PI)) + "°";

	document.getElementById("angle2-input").value = Math.round(angle2 * (180/Math.PI));
	document.getElementById("angle2-output").innerHTML = Math.round(angle2 * (180/Math.PI)) + "°";

	updateScreen()

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

function updateScreen(updating=false) {
	if (!updating) {image(trail, 0, 0)}
	if (updating) {image(trail, -xoffset, -yoffset)}

	stroke(color.secondary);
	strokeWeight(4);

	if (!updating) {translate(xoffset, yoffset)}

	x1 = (len1*100) * Math.sin(angle1);
	y1 = (len1*100) * Math.cos(angle1);
	x2 = x1 + (len2*100) * Math.sin(angle2);
	y2 = y1 + (len2*100) * Math.cos(angle2);
	
	line(0,0,x1,y1);
	line(x1,y1,x2,y2);

	stroke(color.theme)
	fill(color.primary);
	ellipse(x1,y1,fancyLog(mass1),fancyLog(mass1))
	ellipse(x2,y2,fancyLog(mass2),fancyLog(mass2))
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
	document.getElementById("angle1-input").value = 45;
	document.getElementById("angle1-output").innerHTML = "45°";
	document.getElementById("angle2-input").value = 90;
	document.getElementById("angle2-output").innerHTML = "90°";
	setVars();

	trail.background(color.theme);
	noLoop();
});

document.getElementById("pause-button").addEventListener("click", () => {
	noLoop();
	restartButtonTime = millis();
});

document.getElementById("play-button").addEventListener("click", () => {
	if (millis() - startButtonTime <= 500 || millis() - restartButtonTime <= 500) {
		console.log(`Ignored, it's only been ${millis() - restartButtonTime} ms.`)
		return;
	}
	loop();
});

function fancyLog(n) {
	return 20 * Math.log2(n + 16) - 80;
}

document.getElementById("mass1-input").addEventListener("change", () => {
	mass1 = Number(document.getElementById("mass1-input").value)
	document.getElementById("mass1-output").innerHTML = mass1 + " kg"
	if (!isLooping()) {
		updateScreen(true)
	}
});

document.getElementById("mass2-input").addEventListener("change", () => {
	mass2 = Number(document.getElementById("mass2-input").value)
	document.getElementById("mass2-output").innerHTML = mass2 + " kg"
	if (!isLooping()) {
		updateScreen(true)
	}
});

document.getElementById("len1-input").addEventListener("change", () => {
	len1 = Number(document.getElementById("len1-input").value)
	document.getElementById("len1-output").innerHTML = len1 + " m"
	if (!isLooping()) {
		updateScreen(true)
	}
});

document.getElementById("len2-input").addEventListener("change", () => {
	len2 = Number(document.getElementById("len2-input").value)
	document.getElementById("len2-output").innerHTML = len2 + " m"
	if (!isLooping()) {
		updateScreen(true)
	}
});

document.getElementById("g-input").addEventListener("change", () => {
	g = Number(document.getElementById("g-input").value)
	document.getElementById("g-output").innerHTML = g + " m/s²"
	if (!isLooping()) {
		updateScreen(true)
	}
});

document.getElementById("dampRate-input").addEventListener("change", () => {
	dampRate = Number(document.getElementById("dampRate-input").value);
	document.getElementById("dampRate-output").innerHTML = dampRate + " m/s²"
	if (!isLooping()) {
		updateScreen(true)
	}
});

document.getElementById("angle1-input").addEventListener("change", () => {
	angle1 = Number(document.getElementById("angle1-input").value) * (Math.PI / 180);
	document.getElementById("angle1-output").innerHTML = Math.round(angle1 * (180/Math.PI)) + "°"
	if (!isLooping()) {
		updateScreen(true)
	}
});

document.getElementById("angle2-input").addEventListener("change", () => {
	angle2 = Number(document.getElementById("angle2-input").value) * (Math.PI / 180);
	document.getElementById("angle2-output").innerHTML = Math.round(angle2 * (180/Math.PI)) + "°"
	if (!isLooping()) {
		updateScreen(true)
	}
});