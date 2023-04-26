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
		programInfo: planeProgramInfo,
		pointsArray: pointsPlane, 
		uniforms: {
			u_color: [1.0, 1.0, 1.0, 1.0],
			u_model: new mat4(),
			position: vec3(0.0, 0.0, 0.0), // initial position of sphere
			velocity: vec3(0.0, 0.0, 0.0),  // initial velocity of sphere
		},
		primType: "triangles",
	},
	{
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
	},
	{
		position: [0.0, 0.0, 0.0],
		rotation: [0.0, 0.0, 0.0],
		velocity: [0.0, 0.0, 0.0],
		acceleration: [0.0, 0.0, 0.0],
		diametro: 1.5,
		absorption: 0.75,
		mass: 1.0,
	},
	{
		position: [0.0, 0.0, 0.0],
		rotation: [0.0, 0.0, 0.0],
		velocity: [0.0, 0.0, 0.0],
		acceleration: [0.0, 0.0, 0.0],
		diametro: 1.5,
		absorption: 0.75,
		mass: 1.0,
	},
	{
		position: [0.0, 0.0, 0.0],
		rotation: [0.0, 0.0, 0.0],
		velocity: [0.0, 0.0, 0.0],
		acceleration: [0.0, 0.0, 0.0],
		diametro: 1.5,
		absorption: 0.75,
		mass: 1.0,
	},
	{
		position: [0.0, 0.0, 0.0],
		rotation: [0.0, 0.0, 0.0],
		velocity: [0.0, 0.0, 0.0],
		acceleration: [0.0, 0.0, 0.0],
		diametro: 1.5,
		absorption: 0.75,
		mass: 1.0,
	},
	{
		position: [0.0, 0.0, 0.0],
		rotation: [0.0, 0.0, 0.0],
		velocity: [0.0, 0.0, 0.0],
		acceleration: [0.0, 0.0, 0.0],
		diametro: 1.5,
		absorption: 0.75,
		mass: 1.0,
	},
	{
		position: [0.0, 0.0, 0.0],
		rotation: [0.0, 0.0, 0.0],
		velocity: [0.0, 0.0, 0.0],
		acceleration: [0.0, 0.0, 0.0],
		diametro: 1.5,
		absorption: 0.75,
		mass: 1.0,
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

	spheres[0].position = [0.0, 0.0, spheres[0].diametro*2];
	spheres.forEach(function(sphere, index) {
		if(index != 0){
			sphere.position = [5*(2*Math.random() - 1), 5*(2*Math.random() - 1), sphere.diametro*2];
			i=0
			for(i; i<index; i++){
				if(distance(sphere.position, spheres[i].position) < sphere.diametro){
					sphere.position = [5*(2*Math.random() - 1), 5*(2*Math.random() - 1), sphere.diametro*2];
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
	if (event.key == 'ArrowLeft' || event.key == 'ArrowUp' || event.key == 'ArrowRight' || event.key == 'ArrowDown') {
		keys_pressed[event.key] = true;
	}
});

document.addEventListener('keyup', (event) => {
    keys_pressed[event.key] = false;
});

xDir = 0;
yDir = 0;
function camera() {
	// CAMERA MOVEMENT
	// Left arrow: move to the left
	var sphere = spheres[0];
	if (keys_pressed['ArrowLeft']) {
		xDir = -1;
		
		sphere.velocity[1] -= sphere.acceleration[1];
		if(sphere.velocity[1] < -sphere.maxVelocity){
			sphere.velocity[1] = sphere.maxVelocity;
		}
	}else if(!keys_pressed['ArrowRight'] && xDir == -1){
		sphere.velocity[1] += sphere.acceleration[1]/1;
		if(sphere.velocity[1] > 0.0) {
			xDir = 0;
			sphere.velocity[1] = 0.0;
		}
	}
	
    if (keys_pressed['ArrowUp']) {
		yDir = -1;
        sphere.velocity[0] -= sphere.acceleration[0];
		if(sphere.velocity[0] < -sphere.maxVelocity){
			sphere.velocity[0] = sphere.maxVelocity;
		}
    } else if(!keys_pressed['ArrowDown'] && yDir == -1) {
		sphere.velocity[0] += sphere.acceleration[0]/1;
		if(sphere.velocity[0] > 0.0){
			sphere.velocity[0] = 0.0;
			yDir = 0;
		}
	}
	// Right arrow: move to the right.
	if (keys_pressed['ArrowRight']) {
		xDir = 1;
		sphere.velocity[1] += sphere.acceleration[1];
		if(sphere.velocity[1] > +sphere.maxVelocity) {
			sphere.velocity[1] = sphere.maxVelocity;
		}
	}else if(!keys_pressed['ArrowLeft'] && xDir == 1) {
		sphere.velocity[1] -= sphere.acceleration[1]/1;
		if(sphere.velocity[1] < 0.0) {
			sphere.velocity[1] = 0.0;
			xDir = 0;
		}
	}
	// Down arrow: move downwards.
    if (keys_pressed['ArrowDown']) {
		yDir = 1;
        sphere.velocity[0] += sphere.acceleration[0];
		if(sphere.velocity[0] > +sphere.maxVelocity) {
			sphere.velocity[0] = sphere.maxVelocity;
		}
	}else if(!keys_pressed['ArrowUp'] && yDir == 1 ){
		sphere.velocity[0] -= sphere.acceleration[0]/1;
		if(sphere.velocity[0] < 0.0) {
			sphere.velocity[0] = 0.0;
			yDir = 0;
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

//----------------------------------------------------------------------------
// Update Event Function 
//----------------------------------------------------------------------------
const gravity = 0.000098
const air_friction = 0.0000001;
function update(dt) {
	
	// Update state
	spheres.forEach(function(sphere, index) {
		// Update state (rotation) of the sphere
		sphere.rotation[1] += ((sphere.velocity[0]/(2*Math.PI))*10*dt) % 360;
		sphere.rotation[0] += ((sphere.velocity[1]/(2*Math.PI))*10*dt) % 360;

		sphere.velocity[2] = (sphere.velocity[2] - gravity/sphere.mass *dt);
		sphere.position[2] = (sphere.position[2] + sphere.velocity[2]*dt);

		if (sphere.position[2] - (sphere.diametro) <= 0 && Math.abs(sphere.position[0]) < 10 && Math.abs(sphere.position[1]) < 10) {
			sphere.position[2]  = sphere.diametro;
			sphere.velocity[2] *= -0.8;
		}

		if (sphere.position[2] < -1){
			sphere.position = [5*(2*Math.random() - 1), 5*(2*Math.random() - 1), sphere.diametro*3];
			for(i; i<spheres.length; i++){
				if(distance(sphere.position, spheres[i].position) < sphere.diametro){
					sphere.position = [5*(2*Math.random() - 1), 5*(2*Math.random() - 1), sphere.diametro*3];
					i = -1;
				}
			}
			sphere.rotation = [Math.random()*360, Math.random()*360, Math.random()*360];
			sphere.velocity[0] = 0;
			sphere.velocity[1] = 0;
		}
		
		if(index != 0){
			sphere.position[0] += sphere.velocity[0] * dt;
			sphere.position[1] += sphere.velocity[1] * dt;
		}
			
		var i = index + 1;
		for(i; i < spheres.length; i++) {

			otherSphere = spheres[i];

			if (interseccion(sphere, otherSphere)) {
				
				// Se calculan las correcion de las esferas
				var normal = normalizacion(resta(otherSphere.position, sphere.position));
				var normalNegada = negar(normal);
				var correccion = multiplicacion_entero(normal, sphere.diametro - distance(sphere.position, otherSphere.position) + 0.01);

				sphere.position = resta(sphere.position, division_entero(correccion, 2));
				otherSphere.position = suma(otherSphere.position, division_entero(correccion, 2));

				// Se calculan las nuevas velocidades
				var velocidadNormal = multiplicacion_entero(normalNegada, dot(normalNegada, sphere.velocity));
				var velocidadTangencial = resta(sphere.velocity, velocidadNormal);
				sphere.velocity = resta(velocidadTangencial, multiplicacion_entero(velocidadNormal, sphere.absorption*0.01));
				
				var k = 0;
				var velocidadRelativa = resta(otherSphere.position, sphere.position);
				var theta = [Math.atan2(velocidadRelativa[1], velocidadRelativa[0]), Math.atan2(velocidadRelativa[2], velocidadRelativa[0]), Math.atan2(velocidadRelativa[1], velocidadRelativa[2])];

				otherSphere.velocity[0] = (sphere.velocity[0] + otherSphere.velocity[0] * Math.cos(theta[0]) + k * (otherSphere.velocity[0] - sphere.velocity[0]) * Math.cos(theta[0])) / 2;
				otherSphere.velocity[1] = (sphere.velocity[1] + otherSphere.velocity[1] * Math.cos(theta[1]) + k * (otherSphere.velocity[1] - sphere.velocity[1]) * Math.cos(theta[1])) / 2;
				otherSphere.velocity[2] = (sphere.velocity[2] + otherSphere.velocity[2] * Math.cos(theta[2]) + k * (otherSphere.velocity[2] - sphere.velocity[2]) * Math.cos(theta[2])) / 2;

				if(index == 0){
					if(sphere.velocity[0] > 0) yDir = 1;
					else if(sphere.velocity[0] < 0) yDir = -1

					if(sphere.velocity[1] > 0) xDir = 1;
					else if(sphere.velocity[1] < 0) xDir = -1
				}
			}
			spheres[i] = otherSphere;
		}

		let transform = scale(sphere.diametro, sphere.diametro, sphere.diametro);

		let ejeX = vec3(-1.0, 0.0, 0.0);
		transform = mult(transform, rotate(sphere.rotation[0], ejeX));
		let ejeY = vec3(0.0, 1.0, 0.0);
		transform = mult(transform, rotate(sphere.rotation[1], ejeY));
		let ejeZ = vec3(0.0, 0.0, 1.0);
		transform = mult(transform, rotate(sphere.rotation[2], ejeZ));

		transform = mult(translate(sphere.position[0], sphere.position[1], sphere.position[2]), transform);
		
		// Skip the plane
		index += 1;

		objectsToDraw[index].uniforms.u_model = transform;
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
	eye = vec3(10.0 + spheres[0].position[0], spheres[0].position[1], 10.0);
	target = vec3(spheres[0].position[0], spheres[0].position[1], spheres[0].position[2]);
	up = vec3(0.0, 0.0, 1.0);
	view = lookAt(eye,target,up);
	
	gl.uniformMatrix4fv(pInfo.uniformLocations.view, gl.FALSE, view); // copy view to uniform value in shader

	// Copy uniform model values to corresponding values in shaders
	if (pInfo.uniformLocations.baseColor != null) {
		gl.uniform4f(pInfo.uniformLocations.baseColor, uniforms.u_color[0], uniforms.u_color[1], uniforms.u_color[2], uniforms.u_color[3]);
	}
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
