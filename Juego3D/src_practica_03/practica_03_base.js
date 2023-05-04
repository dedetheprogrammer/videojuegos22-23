/*
* 
* Practica_02_base.js
* Videojuegos (30262) - Curso 2019-2020
* 
* Parte adaptada de: Alex Clarke, 2016, y Ed Angel, 2015.
* 
*/

// Variable to store the WebGL rendering context
var gl;

//----------------------------------------------------------------------------
// OTHER DATA 
//----------------------------------------------------------------------------

var model = new mat4();   		// create a model matrix and set it to the identity matrix
var view = new mat4();   		// create a view matrix and set it to the identity matrix
var projection = new mat4();	// create a projection matrix and set it to the identity matrix

var eye, target, up;			// for view matrix

var planeProgramInfo = {
	program: {},
	uniformLocations: {},
	attribLocations: {},
};

var sphereProgramInfo = {
	program: {},
	uniformLocations: {},
	attribLocations: {},
};

// List of objects to draw
var objectsToDraw = [
	{
		name: "plane",
		programInfo: planeProgramInfo,
		pointsArray: pointsPlane, 
		uniforms: {
			u_color: [0.0, 1.0, 0.0, 1.0],
			u_model: new mat4(),
			position: vec3(0.0, 0.0, 0.0), // initial position of sphere
			velocity: vec3(0.0, 0.0, 0.0),  // initial velocity of sphere
		},
		primType: "triangles",
	},
	{
		name: "plane",
		programInfo: planeProgramInfo,
		pointsArray: pointsPlane2, 
		uniforms: {
			u_color: [1.0, 1.0, 1.0, 1.0],
			u_model: new mat4(),
			position: vec3(0.0, 0.0, 0.0), // initial position of sphere
			velocity: vec3(0.0, 0.0, 0.0),  // initial velocity of sphere
		},
		primType: "triangles",
	},
	{
		name: "plane",
		programInfo: planeProgramInfo,
		pointsArray: pointsPlane3, 
		uniforms: {
			u_color: [1.0, 1.0, 1.0, 1.0],
			u_model: new mat4(),
			position: vec3(0.0, 0.0, 0.0), // initial position of sphere
			velocity: vec3(0.0, 0.0, 0.0),  // initial velocity of sphere
		},
		primType: "triangles",
	},
	{
		name: "plane",
		programInfo: planeProgramInfo,
		pointsArray: pointsPlane4, 
		uniforms: {
			u_color: [1.0, 1.0, 1.0, 1.0],
			u_model: new mat4(),
			position: vec3(0.0, 0.0, 0.0), // initial position of sphere
			velocity: vec3(0.0, 0.0, 0.0),  // initial velocity of sphere
		},
		primType: "triangles",
	},
	{
		name: "plane",
		programInfo: planeProgramInfo,
		pointsArray: pointsPlane5, 
		uniforms: {
			u_color: [1.0, 1.0, 1.0, 1.0],
			u_model: new mat4(),
			position: vec3(0.0, 0.0, 0.0), // initial position of sphere
			velocity: vec3(0.0, 0.0, 0.0),  // initial velocity of sphere
		},
		primType: "triangles",
	},
	{
		name: "sphere",
		programInfo: sphereProgramInfo,
		pointsArray: pointsSphere, 
		uniforms: {
			u_color: [1.0, 1.0, 1.0, 1.0],
			u_model: new mat4(),
			position: vec3(0.0, 0.0, 0.0), // initial position of sphere
			velocity: vec3(0.0, 0.0, 0.0),  // initial velocity of sphere
		},
		primType: "triangles",
	},
	{
		name: "sphere",
		programInfo: sphereProgramInfo,
		pointsArray: pointsSphere, 
		uniforms: {
			u_color: [1.0, 0.5, 0.5, 1.0],
			u_model: new mat4(),
			position: vec3(0.0, 0.0, 0.0), // initial position of sphere
			velocity: vec3(0.0, 0.0, 0.0),  // initial velocity of sphere
		},
		primType: "triangles",
	},
	{
		name: "sphere",
		programInfo: sphereProgramInfo,
		pointsArray: pointsSphere, 
		uniforms: {
			u_color: [0.5, 1.0, 0.5, 1.0],
			u_model: new mat4(),
			position: vec3(0.0, 0.0, 0.0), // initial position of sphere
			velocity: vec3(0.0, 0.0, 0.0),  // initial velocity of sphere
		},
		primType: "triangles",
	},
	{
		name: "sphere",
		programInfo: sphereProgramInfo,
		pointsArray: pointsSphere, 
		uniforms: {
			u_color: [0.5, 0.5, 1.0, 1.0],
			u_model: new mat4(),
			position: vec3(0.0, 0.0, 0.0), // initial position of sphere
			velocity: vec3(0.0, 0.0, 0.0),  // initial velocity of sphere
		},
		primType: "triangles",
	},
	{
		name: "sphere",
		programInfo: sphereProgramInfo,
		pointsArray: pointsSphere, 
		uniforms: {
			u_color: [1.0, 1.0, 0.5, 1.0],
			u_model: new mat4(),
			position: vec3(0.0, 0.0, 0.0), // initial position of sphere
			velocity: vec3(0.0, 0.0, 0.0),  // initial velocity of sphere
		},
		primType: "triangles",
	},
	{
		name: "sphere",
		programInfo: sphereProgramInfo,
		pointsArray: pointsSphere, 
		uniforms: {
			u_color: [1.0, 0.5, 1.0, 1.0],
			u_model: new mat4(),
			position: vec3(0.0, 0.0, 0.0), // initial position of sphere
			velocity: vec3(0.0, 0.0, 0.0),  // initial velocity of sphere
		},
		primType: "triangles",
	},
	{
		name: "sphere",
		programInfo: sphereProgramInfo,
		pointsArray: pointsSphere, 
		uniforms: {
			u_color: [0.5, 1.0, 1.0, 1.0],
			u_model: new mat4(),
			position: vec3(0.0, 0.0, 0.0), // initial position of sphere
			velocity: vec3(0.0, 0.0, 0.0),  // initial velocity of sphere
		},
		primType: "triangles",
	},
];

// List of spheres with their current state
var spheres = [
	{
		position: [0.0, 0.0, 0.0],
		rotation: [0.0, 0.0, 0.0],
		velocity: [0.0, 0.0, 0.0],
		acceleration: [0.01, 0.01, 0.0],
		diametro: 1.5,
		maxVelocity: 3,
		absorption: 0.75,
		mass: 1.0,
		xDir: 0,
		yDir: 0,
		update: true,
	},
	{
		position: [0.0, 0.0, 0.0],
		rotation: [0.0, 0.0, 0.0],
		velocity: [0.0, 0.0, 0.0],
		acceleration: [0.001, 0.001, 0.0],
		diametro: 1.5,
		absorption: 0.75,
		mass: 1.0,
		xDir: 0,
		yDir: 0,
		update: true,
	},
	{
		position: [0.0, 0.0, 0.0],
		rotation: [0.0, 0.0, 0.0],
		velocity: [0.0, 0.0, 0.0],
		acceleration: [0.001, 0.001, 0.0],
		diametro: 1.5,
		absorption: 0.75,
		mass: 1.0,
		xDir: 0,
		yDir: 0,
		update: true,
	},
	{
		position: [0.0, 0.0, 0.0],
		rotation: [0.0, 0.0, 0.0],
		velocity: [0.0, 0.0, 0.0],
		acceleration: [0.001, 0.001, 0.0],
		diametro: 1.5,
		absorption: 0.75,
		mass: 1.0,
		xDir: 0,
		yDir: 0,
		update: true,
	},
	{
		position: [0.0, 0.0, 0.0],
		rotation: [0.0, 0.0, 0.0],
		velocity: [0.0, 0.0, 0.0],
		acceleration: [0.001, 0.001, 0.0],
		diametro: 1.5,
		absorption: 0.75,
		mass: 1.0,
		xDir: 0,
		yDir: 0,
		update: true,
	},
	{
		position: [0.0, 0.0, 0.0],
		rotation: [0.0, 0.0, 0.0],
		velocity: [0.0, 0.0, 0.0],
		acceleration: [0.001, 0.001, 0.0],
		diametro: 1.5,
		absorption: 0.75,
		mass: 1.0,
		xDir: 0,
		yDir: 0,
		update: true,
	},
	{
		position: [0.0, 0.0, 0.0],
		rotation: [0.0, 0.0, 0.0],
		velocity: [0.0, 0.0, 0.0],
		acceleration: [0.001, 0.001, 0.0],
		diametro: 1.5,
		absorption: 0.75,
		mass: 1.0,
		xDir: 0,
		yDir: 0,
		update: true,
	},
]

//----------------------------------------------------------------------------
// Initialization function
//----------------------------------------------------------------------------

window.onload = function init() {
	
	// Set up a WebGL Rendering Context in an HTML5 Canvas
	var canvas = document.getElementById("gl-canvas");
	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) {
		alert("WebGL isn't available");
	}

	//  Configure WebGL
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);
	gl.disable(gl.CULL_FACE);

	setPrimitive(objectsToDraw);

	// Set up a WebGL program for the plane
	// Load shaders and initialize attribute buffers
	planeProgramInfo.program = initShaders(gl, "plane-vertex-shader", "plane-fragment-shader");
	  
	// Save the attribute and uniform locations
	planeProgramInfo.uniformLocations.model = gl.getUniformLocation(planeProgramInfo.program, "model");
	planeProgramInfo.uniformLocations.view = gl.getUniformLocation(planeProgramInfo.program, "view");
	planeProgramInfo.uniformLocations.projection = gl.getUniformLocation(planeProgramInfo.program, "projection");
	planeProgramInfo.uniformLocations.baseColor = gl.getUniformLocation(planeProgramInfo.program, "baseColor");
	planeProgramInfo.attribLocations.vPosition = gl.getAttribLocation(planeProgramInfo.program, "vPosition");

	// Set up a WebGL program for spheres
	// Load shaders and initialize attribute buffers
	sphereProgramInfo.program = initShaders(gl, "sphere-vertex-shader", "sphere-fragment-shader");
	  
	// Save the attribute and uniform locations
	sphereProgramInfo.uniformLocations.model = gl.getUniformLocation(sphereProgramInfo.program, "model");
	sphereProgramInfo.uniformLocations.view = gl.getUniformLocation(sphereProgramInfo.program, "view");
	sphereProgramInfo.uniformLocations.projection = gl.getUniformLocation(sphereProgramInfo.program, "projection");
	sphereProgramInfo.uniformLocations.baseColor = gl.getUniformLocation(sphereProgramInfo.program, "baseColor");
	sphereProgramInfo.attribLocations.vPosition = gl.getAttribLocation(sphereProgramInfo.program, "vPosition");

	// Set up viewport 
	gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

	// Set initial positions

	spheres[0].position = [0.0, 0.0, spheres[0].diametro/2];
	spheres.forEach(function(sphere, index) {
		if(index != 0){
			sphere.position = [5*(2*Math.random() - 1), 5*(2*Math.random() - 1), sphere.diametro/2];
			i=0
			for(i; i<index; i++){
				if(distance(sphere.position, spheres[i].position) < sphere.diametro){
					sphere.position = [5*(2*Math.random() - 1), 5*(2*Math.random() - 1), sphere.diametro/2];
					i = -1;
				}
			}
			sphere.rotation = [Math.random()*360, Math.random()*360, Math.random()*360];
		}
	});
	
	lastTick = Date.now();
	requestAnimFrame(tick);
};

//----------------------------------------------------------------------------
// Tick Event Function
//----------------------------------------------------------------------------

var lastTick;

function tick(nowish) {
	var now = Date.now();

    var dt = now - lastTick;
    lastTick = now;

	update(dt)
	render(dt)

	window.requestAnimationFrame(tick)
}

let keys_pressed = {}; // Mapa para guardar las teclas presionadas.
document.addEventListener('keydown', (event) => {
	// Si no se presiona ninguna de las teclas utilizadas en el programa, no se meten.
	if (event.key == 'ArrowLeft' || event.key == 'ArrowUp' || event.key == 'ArrowRight' || event.key == 'ArrowDown' || event.key == 'a' || event.key == 'd') {
		keys_pressed[event.key] = true;
	}
});

document.addEventListener('keyup', (event) => {
    keys_pressed[event.key] = false;
});
var angle = 0.0;
function camera() {
	// CAMERA MOVEMENT
	// Left arrow: move to the left
	var sphere = spheres[0];

	if (keys_pressed['a']) {
		angle -= 0.1;
	}
	if (keys_pressed['d']) {
		angle += 0.1;
	}
	if (keys_pressed['ArrowLeft']) {
		sphere.xDir = -1;
		
		sphere.velocity[1] -= sphere.acceleration[1];
		if(sphere.velocity[1] < -sphere.maxVelocity){
			sphere.velocity[1] = sphere.maxVelocity;
		}
	}else if(!keys_pressed['ArrowRight'] && sphere.xDir == -1){
		sphere.velocity[1] += sphere.acceleration[1]/1;
		if(sphere.velocity[1] > 0.0) {
			sphere.xDir = 0;
			sphere.velocity[1] = 0.0;
		}
	}
	
    if (keys_pressed['ArrowUp']) {
		sphere.yDir = -1;
        sphere.velocity[0] -= sphere.acceleration[0];
		if(sphere.velocity[0] < -sphere.maxVelocity){
			sphere.velocity[0] = sphere.maxVelocity;
		}
    } else if(!keys_pressed['ArrowDown'] && sphere.yDir == -1) {
		sphere.velocity[0] += sphere.acceleration[0]/1;
		if(sphere.velocity[0] > 0.0){
			sphere.velocity[0] = 0.0;
			sphere.yDir = 0;
		}
	}
	// Right arrow: move to the right.
	if (keys_pressed['ArrowRight']) {
		sphere.xDir = 1;
		sphere.velocity[1] += sphere.acceleration[1];
		if(sphere.velocity[1] > +sphere.maxVelocity) {
			sphere.velocity[1] = sphere.maxVelocity;
		}
	}else if(!keys_pressed['ArrowLeft'] && sphere.xDir == 1) {
		sphere.velocity[1] -= sphere.acceleration[1]/1;
		if(sphere.velocity[1] < 0.0) {
			sphere.velocity[1] = 0.0;
			sphere.xDir = 0;
		}
	}
	// Down arrow: move downwards.
    if (keys_pressed['ArrowDown']) {
		sphere.yDir = 1;
        sphere.velocity[0] += sphere.acceleration[0];
		if(sphere.velocity[0] > +sphere.maxVelocity) {
			sphere.velocity[0] = sphere.maxVelocity;
		}
	}else if(!keys_pressed['ArrowUp'] && sphere.yDir == 1 ){
		sphere.velocity[0] -= sphere.acceleration[0]/1;
		if(sphere.velocity[0] < 0.0) {
			sphere.velocity[0] = 0.0;
			sphere.yDir = 0;
		}
	}
	
	sphere.position[0] += sphere.velocity[0];
	sphere.position[1] += sphere.velocity[1];
	spheres[0] = sphere;
}



//----------------------------------------------------------------------------
// Math functions
//----------------------------------------------------------------------------

function vectorDistance(a, b) {
    var dist = [Math.abs(b[0]-a[0]), Math.abs(b[1]-a[1]), Math.abs(b[2]-a[2])];
    return dist[0]*dist[0] + dist[1]*dist[1] + dist[2]*dist[2];
}

function distance(a, b) {
    return Math.sqrt(vectorDistance(a,b));
}

function modulo(v) {
    return Math.sqrt(v.map((x, i) => v[i] * v[i]).reduce((m, n) => m + n));
}

function normalizacion(v) {
    return division_entero(v, modulo(v));
}

function dot(a, b) {
	return a[0]*b[0] + a[1]*b[1] + a[2]*b[2]
    //return a.map((x, i) => a[i] * b[i]).reduce((m, n) => m + n);
}

function negar(v) {
    return [-v[0], -v[1], -v[2]];
}

function suma(a, b) {
    return [a[0]+b[0], a[1]+b[1], a[2]+b[2]];
}

function resta(a,b) {
    return [a[0]-b[0], a[1]-b[1], a[2]-b[2]];
}

function division_entero(v, k) {
    return [v[0]/k, v[1]/k, v[2]/k];
}

function multiplicacion_entero(v,k) {
    return [v[0]*k, v[1]*k, v[2]*k];
}



function interseccion(sphere1, sphere2) {
    let vec = resta(sphere2.position, sphere1.position)
    return dot(vec, vec) < (sphere1.diametro * sphere1.diametro);
}

function reducirVelocidades(sphere, index){
	if(sphere.xDir > 0) sphere.velocity[1] -= sphere.acceleration[1];
	else if(sphere.xDir < 0) sphere.velocity[1] += sphere.acceleration[1];
	
	if(sphere.yDir > 0){
	 	sphere.velocity[0] -= sphere.acceleration[0];
	}
	else if(sphere.yDir < 0) {
		sphere.velocity[0] += sphere.acceleration[0];
	}
	
	if((sphere.velocity[0] < 0.0001 && sphere.yDir == 1) || (sphere.velocity[0] > -0.0001 &&  sphere.yDir == -1)) {
		sphere.velocity[0] = 0;
		yDir = 0;
	}
	if((sphere.velocity[1] < 0.0001 &&  sphere.xDir == 1) || (sphere.velocity[1] > -0.0001 &&  sphere.xDir == -1)) {
		sphere.velocity[1] = 0;
		xDir = 0;
	}
}

function caida(sphere, index){
	if(sphere.position[0] < -13 && sphere.position[1] < -8){
		sphere.position[2] -= 0.03; 
	}else if(sphere.position[0] < -13 && sphere.position[1] > 8){
		sphere.position[2] -= 0.03; 
	}else if(sphere.position[0] > 13 && sphere.position[1] < -8){
		sphere.position[2] -= 0.03; 
	}else if(sphere.position[0] > 13 && sphere.position[1] > 8){
		sphere.position[2] -= 0.03; 
	}else if((sphere.position[0] > -1 && sphere.position[0] < 1) && sphere.position[1] < -8){
		sphere.position[2] -= 0.03; 
	}else if((sphere.position[0] > -1 && sphere.position[0] < 1) && sphere.position[1] > 8){
		sphere.position[2] -= 0.03; 
	}else{
		sphere.position[2] = sphere.diametro/2;
	}
	
	if(index == 0 && sphere.position[2] < -1.5){
		sphere.position = [13*(2*Math.random() - 1), 8*(2*Math.random() - 1), sphere.diametro/2];
		var i = 1;
		for(i; i<spheres.length; i++){
			if(distance(sphere.position, spheres[i].position) < sphere.diametro){
				sphere.position = [5*(2*Math.random() - 1), 5*(2*Math.random() - 1), sphere.diametro/2];
				i = -1;
			}
		}
		sphere.rotation = [Math.random()*360, Math.random()*360, Math.random()*360];
			
	}else if(sphere.position[2] < -1.5){
		sphere.update = false;
	}
}

function colisionBolasBolas(sphere, index){
	var i = index + 1;
	for(i; i < spheres.length; i++) {

		otherSphere = spheres[i];

		if (interseccion(sphere, otherSphere)) {
			//console.log("choque");
			var div = 0.15;
			if (index == 0) div = 10;
			const masa1 = sphere.mass;
			const masa2 = otherSphere.mass;
			const velocidad1x = sphere.velocity[0];
			const velocidad2x = otherSphere.velocity[0];
			//console.log("Masas: ", masa1, " ",  masa2, " resta: ", masa1-masa2);	


			const velocidad1Nuevax = ( velocidad1x + (2 * masa2) * velocidad2x) / (masa1 + masa2);
			const velocidad2Nuevax = (velocidad2x + (2 * masa1) * velocidad1x) / (masa1 + masa2);
			//console.log("X: ", velocidad1Nuevax, " ",  velocidad2Nuevax);	
			sphere.velocity[0] = velocidad1Nuevax;
			otherSphere.velocity[0] = velocidad2Nuevax/div;


			const velocidad1y = sphere.velocity[1];
			const velocidad2y = otherSphere.velocity[1];

			const velocidad1Nuevay = ( velocidad1y + (2 * masa2) * velocidad2y) / (masa1 + masa2);
			const velocidad2Nuevay = ( velocidad2y + (2 * masa1) * velocidad1y) / (masa1 + masa2);
			//console.log("Y: ", velocidad1Nuevay, " ",  velocidad2Nuevay);	
			sphere.velocity[1] = velocidad1Nuevay;
			otherSphere.velocity[1] = velocidad2Nuevay/div;

			const velocidad1z = sphere.velocity[2];
			const velocidad2z = otherSphere.velocity[2];

			const velocidad1Nuevaz = ((masa1 - masa2) * velocidad1z + (2 * masa2) * velocidad2z) / (masa1 + masa2);
			const velocidad2Nuevaz = ((masa2 - masa1) * velocidad2z + (2 * masa1) * velocidad1z) / (masa1 + masa2);
			//console.log("Z: ", velocidad1Nuevaz, " ",  velocidad2Nuevaz);	
			sphere.velocity[2] = velocidad1Nuevaz;
			otherSphere.velocity[2] = velocidad2Nuevaz/div;
			

				if(sphere.velocity[0] > 0) sphere.yDir = 1;
				else if(sphere.velocity[0] < 0) sphere.yDir = -1

				if(sphere.velocity[1] > 0) sphere.xDir = 1;
				else if(sphere.velocity[1] < 0) sphere.xDir = -1

				if(otherSphere.velocity[0] > 0) otherSphere.yDir = 1;
				else if(otherSphere.velocity[0] < 0) otherSphere.yDir = -1

				if(otherSphere.velocity[1] > 0) otherSphere.xDir = 1;
				else if(otherSphere.velocity[1] < 0) otherSphere.xDir = -1
		}
		if(spheres[i].velocity[0] > 0.5){
			spheres[i].velocity[0] = 0.5;
		}else if(spheres[i].velocity[0] < -0.5){
			spheres[i].velocity[0] = -0.5;
		}
		if(spheres[i].velocity[1] > 0.5){
			spheres[i].velocity[1] = 0.5;
		}else if(spheres[i].velocity[1] < -0.5){
			spheres[i].velocity[1] = -0.5;
		}
		spheres[i] = otherSphere;
	}
}

function colisionBolasPared(sphere, index){
	var radio = sphere.diametro/2
	if(sphere.position[0] + radio >= 15){
		sphere.velocity[0] = -sphere.velocity[0];
		sphere.position[0] = 15 - radio;
		sphere.yDir = -sphere.yDir;
	}
	if(sphere.position[0] - radio <= -15){
		sphere.velocity[0] = -sphere.velocity[0];
		sphere.position[0] = -15 + radio;
		sphere.yDir = -sphere.yDir;
	}
	if(sphere.position[1] + radio >= 10){
		sphere.velocity[1] = -sphere.velocity[1];
		sphere.position[1] = 10 - radio;
		sphere.xDir = -sphere.xDir
	}
	if(sphere.position[1] - radio <= -10){
		sphere.velocity[1] = -sphere.velocity[1];
		sphere.position[1] = -10 + radio;
		sphere.xDir = -sphere.xDir;
	}
}

//----------------------------------------------------------------------------
// Update Event Function 
//----------------------------------------------------------------------------
const gravity = 0.000098
const air_friction = 0.0000001;
function update(dt) {
	
	// Update state
	spheres.forEach(function(sphere, index) {
		if(sphere.update){
			// Update state (rotation) of the sphere
			sphere.rotation[1] += ((sphere.velocity[0]/(2*Math.PI))*10*dt) % 360;
			sphere.rotation[0] += ((sphere.velocity[1]/(2*Math.PI))*10*dt) % 360;

			//sphere.velocity[2] = (sphere.velocity[2] - gravity/sphere.mass *dt);
			//sphere.position[2] = (sphere.position[2] + sphere.velocity[2]*dt);

			/*if (sphere.position[2] - (sphere.diametro) <= 0 && Math.abs(sphere.position[0]) < 10 && Math.abs(sphere.position[1]) < 10) {
				sphere.position[2]  = sphere.diametro;
				sphere.velocity[2] *= -0.8;
			}

			if (sphere.position[2] < -1){
				sphere.position = [5*(2*Math.random() - 1), 5*(2*Math.random() - 1), sphere.diametro/2];
				for(i; i<spheres.length; i++){
					if(distance(sphere.position, spheres[i].position) < sphere.diametro){
						sphere.position = [5*(2*Math.random() - 1), 5*(2*Math.random() - 1), sphere.diametro/2];
						i = -1;
					}
				}
				sphere.rotation = [Math.random()*360, Math.random()*360, Math.random()*360];
				sphere.velocity[0] = 0;
				sphere.velocity[1] = 0;
			}*/
			
			if(index != 0){
				sphere.position[0] += sphere.velocity[0] * dt;
				sphere.position[1] += sphere.velocity[1] * dt;
			}
				
			colisionBolasBolas(sphere, index);
			colisionBolasPared(sphere, index);


			if(index != 0) reducirVelocidades(sphere, index);

			//Velocidades maximas
			if(sphere.velocity[0] > 0.02 && index != 0){
				sphere.velocity[0] = 0.02;
			}
			if(sphere.velocity[1] > 0.02 && index != 0){
				sphere.velocity[1] = 0.02;
			}

			caida(sphere, index);
			
			
			let transform = scale(sphere.diametro, sphere.diametro, sphere.diametro);

			let ejeX = vec3(-1.0, 0.0, 0.0);
			transform = mult(transform, rotate(sphere.rotation[0], ejeX));
			let ejeY = vec3(0.0, 1.0, 0.0);
			transform = mult(transform, rotate(sphere.rotation[1], ejeY));
			let ejeZ = vec3(0.0, 0.0, 1.0);
			transform = mult(transform, rotate(sphere.rotation[2], ejeZ));

			transform = mult(translate(sphere.position[0], sphere.position[1], sphere.position[2]), transform);
			
			// Skip the plane
			index += 5;

			objectsToDraw[index].uniforms.u_model = transform;
		}
	});
}

//----------------------------------------------------------------------------
// Rendering Event Function
//----------------------------------------------------------------------------

function render(dt) {
	// Clear the buffer and draw everything
	gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

	objectsToDraw.forEach(function(object) {
		gl.useProgram(object.programInfo.program);

		// Setup buffers and attributes
		setBuffersAndAttributes(object.programInfo, object);

		// Set the uniforms
		setUniforms(object.programInfo, object.uniforms);

		// Draw
		gl.drawArrays(object.primitive, 0, object.pointsArray.length);
	});

	camera();
}

//----------------------------------------------------------------------------
// Utils functions
//----------------------------------------------------------------------------

function setPrimitive(objectsToDraw) {	
	
	objectsToDraw.forEach(function(object) {
		switch(object.primType) {
		  case "lines":
			object.primitive = gl.LINES;
			break;
		  case "line_strip":
			object.primitive = gl.LINE_STRIP;
			break;
		  case "triangles":
			object.primitive = gl.TRIANGLES;
			break;
		  default:
			object.primitive = gl.TRIANGLES;
		}
	});	
}	

function setUniforms(pInfo, uniforms) {
	var canvas = document.getElementById("gl-canvas");

	// Set up camera
	// Projection matrix
	projection = perspective( 45.0, canvas.width/canvas.height, 0.1, 100.0 );																		
	gl.uniformMatrix4fv( pInfo.uniformLocations.projection, gl.FALSE, projection ); // copy projection to uniform value in shader

	// View matrix (static cam)
	eye = vec3(10.0 + spheres[0].position[0], spheres[0].position[1] + Math.cos(angle), 10.0); //TODO hay que por el sum para cambiar la vista al pulsar 'a' o
	target = vec3(spheres[0].position[0], spheres[0].position[1], spheres[0].position[2]);
	up = vec3(0.0, 0.0, 1.0);
	view = lookAt(eye,target,up);
	
	gl.uniformMatrix4fv(pInfo.uniformLocations.view, gl.FALSE, view); // copy view to uniform value in shader

	// Copy uniform model values to corresponding values in shaders
	//if (pInfo.uniformLocations.baseColor != null) {
		gl.uniform4f(pInfo.uniformLocations.baseColor, uniforms.u_color[0], uniforms.u_color[1], uniforms.u_color[2], uniforms.u_color[3]);
	//}
	gl.uniformMatrix4fv(pInfo.uniformLocations.model, gl.FALSE, uniforms.u_model);
}

function setBuffersAndAttributes(pInfo, object) {
	// Load the data into GPU data buffers
	// Vertices
	var vertexBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );
	gl.bufferData( gl.ARRAY_BUFFER,  flatten(object.pointsArray), gl.STATIC_DRAW );
	gl.vertexAttribPointer( pInfo.attribLocations.vPosition, 4, gl.FLOAT, gl.FALSE, 0, 0 );
	gl.enableVertexAttribArray( pInfo.attribLocations.vPosition );

	// Colors
	if (object.colorsArray != null) {
		
		var colorBuffer = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, colorBuffer );
		gl.bufferData( gl.ARRAY_BUFFER,  flatten( object.colorsArray), gl.STATIC_DRAW );
		gl.vertexAttribPointer( pInfo.attribLocations.vColor, 4, gl.FLOAT, gl.FALSE, 0, 0 );
		gl.enableVertexAttribArray( pInfo.attribLocations.vColor );
	}
}
