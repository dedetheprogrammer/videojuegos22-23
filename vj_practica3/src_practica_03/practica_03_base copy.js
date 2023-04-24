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
	},
	{
		position: [0.0, 0.0, 0.0],
		rotation: [0.0, 0.0, 0.0],
		velocity: [0.0, 0.0, 0.0],
		acceleration: [0.0, 0.0, 0.0],
		diametro: 1.5,
	},
	{
		position: [0.0, 0.0, 0.0],
		rotation: [0.0, 0.0, 0.0],
		velocity: [0.0, 0.0, 0.0],
		acceleration: [0.0, 0.0, 0.0],
		diametro: 1.5,
	},
	{
		position: [0.0, 0.0, 0.0],
		rotation: [0.0, 0.0, 0.0],
		velocity: [0.0, 0.0, 0.0],
		acceleration: [0.0, 0.0, 0.0],
		diametro: 1.5,
	},
	{
		position: [0.0, 0.0, 0.0],
		rotation: [0.0, 0.0, 0.0],
		velocity: [0.0, 0.0, 0.0],
		acceleration: [0.0, 0.0, 0.0],
		diametro: 1.5,
	},
	{
		position: [0.0, 0.0, 0.0],
		rotation: [0.0, 0.0, 0.0],
		velocity: [0.0, 0.0, 0.0],
		acceleration: [0.0, 0.0, 0.0],
		diametro: 1.5,
	},
	{
		position: [0.0, 0.0, 0.0],
		rotation: [0.0, 0.0, 0.0],
		velocity: [0.0, 0.0, 0.0],
		acceleration: [0.0, 0.0, 0.0],
		diametro: 1.5,
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

	spheres[0].position = [0.0, 0.0, spheres[0].diametro];
	spheres.forEach(function(sphere, index) {
		if(index != 0){
			sphere.position = [5*(2*Math.random() - 1), 5*(2*Math.random() - 1), sphere.diametro];
			i=0
			for(i; i<index; i++){
				if(distance(sphere.position, spheres[i].position) < sphere.diametro){
					sphere.position = [5*(2*Math.random() - 1), 5*(2*Math.random() - 1), sphere.diametro];
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
	console.log("copy");
	// CAMERA MOVEMENT
	// Left arrow: move to the left
	var sphere = spheres[0];
	if (keys_pressed['ArrowLeft']) {
		xDir = -1;
		//console.log("Going left.");
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
	// Up Arrow: move upwards.
    if (keys_pressed['ArrowUp']) {
		yDir = -1;
		//console.log("Going up.");
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
		//console.log("Going right.");
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
		//console.log("Going down.");
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

function distance(a, b) {
	var dx = Math.abs(a[0] - b[0]);
	var dy = Math.abs(a[1] - b[1]);
	var dz = Math.abs(a[2] - b[2]);
	return Math.sqrt(dx*dx + dy*dy + dz*dz);
}

function checkCollision(index1, index2) {
	var sphere1 = spheres[index1];
	var sphere2 = spheres[index2];

	// Calculamos la distancia entre los centros de las esferas
	var futurePos1 = [sphere1.position[0] + sphere1.velocity[0], sphere1.position[1] + sphere1.velocity[1], sphere1.position[2] + sphere1.velocity[2]]
	var futurePos2 = [sphere2.position[0] + sphere2.velocity[0], sphere2.position[1] + sphere2.velocity[1], sphere2.position[2] + sphere2.velocity[2]]
	var dist = distance(futurePos1, futurePos2);
	
	// Si la distancia es menor o igual a la suma de los radios de las esferas, hay colisión
	if (dist < sphere1.diametro) {
		var radius = sphere1.diametro / 2;
		// Calculamos la dirección de la recta que une los centros de las esferas
		var direction = subtract(futurePos2, futurePos1);
		//console.log("Direction: ", direction);
		var normDir = normalize(vec3(direction[0], direction[1], direction[2]));
		var correction = sphere.diametro - dist;
		var desp = [normDir[0] * -correction, normDir[1] * -correction, normDir[2] * -correction];
		sphere1.position[0] = sphere1.position[0] + desp[0];
		sphere1.position[1] = sphere1.position[1] + desp[1];
		sphere1.position[2] = sphere1.position[2] + desp[2];
		//console.log("NormDir: ", normDir);
		
		// Calculamos las velocidades iniciales de las esferas
		var v1i = sphere1.velocity;
		var v2i = sphere2.velocity;
		
		// Calculamos las velocidades finales de las esferas después del choque
		var m = radius * radius * radius;

		var dir = subtract(vec3(v1i[0], v1i[1], v1i[2]), vec3(v2i[0], v2i[1], v2i[2]));
		var v1 = scale((2 * m / (2*m)) * dot(vec3(dir[0], dir[1], dir[2]), vec3(direction[0], direction[1], direction[2])), normDir);
		var v2 = scale((2 * m / (2*m)) * dot(vec3(dir[0], dir[1], dir[2]), vec3(direction[0], direction[1], direction[2])), normDir);
		var v1f = subtract(vec3(v1i[0], v1i[1], v1i[2]), vec3(v1[0], v1[1], v1[2]));
		var v2f = subtract(vec3(v2i[0], v2i[1], v2i[2]), vec3(v2[0], v2[1], v2[2]));
		//console.log(v1f);
		//console.log(v2f);
		
		// Asignamos las velocidades finales a las esferas
		sphere1.velocity = [v1f[0], v1f[1], v1f[2]];
		sphere2.velocity = [v2f[0], v2f[1], v2f[2]];
		
		/*console.log("Velocidad1: ", sphere1.velocity);
		console.log("Velocidad2: ", sphere2.velocity);
		console.log("colision");
		var x2 = sphere2.velocity[0];
		var y2 = sphere2.velocity[1];
		var z2 = sphere2.velocity[2];
		sphere2.velocity = [sphere1.velocity[0], sphere1.velocity[1], sphere1.velocity[2]];
		sphere1.velocity = [x2, y2, z2];*/
		
		spheres[index1] = sphere1;
		spheres[index2] = sphere2;
		return true;
	}
	
	return false;
}

//----------------------------------------------------------------------------
// Math functions
//----------------------------------------------------------------------------

function sqPointDistance(a, b) {
    var dist = [Math.abs(b[0]-a[0]), Math.abs(b[1]-a[1]), Math.abs(b[2]-a[2])];
    return dist[0]*dist[0] + dist[1]*dist[1] + dist[2]*dist[2];
}

function pointDistance(a, b) {
    return Math.sqrt(sqPointDistance(a,b));
}

function vec_mod(v) {
    return Math.sqrt(v.map((x, i) => v[i] * v[i]).reduce((m, n) => m + n));
}

function vec_norm(v) {
    return vec_div_k(v, vec_mod(v));
}

function dotProduct(a, b) {
    return a.map((x, i) => a[i] * b[i]).reduce((m, n) => m + n);
}

function vec_inv(v) {
    return [-v[0], -v[1], -v[2]];
}

function vec_sum(a, b) {
    return [a[0]+b[0], a[1]+b[1], a[2]+b[2]];
}

function vec_sum_k(v, k) {
    return [v[0]+k, v[1]+k, v[2]+k];
}

function vec_diff(a,b) {
    return [a[0]-b[0], a[1]-b[1], a[2]-b[2]];
}

function vec_diff_k(v, k) {
    return [v[0]-k, v[1]-k, v[2]-k];
}

function vec_div_k(v, k) {
    return [v[0]/k, v[1]/k, v[2]/k];
}

function vec_mul_k(v,k) {
    return [v[0]*k, v[1]*k, v[2]*k];
}

function reflection(v, n) {
    //-(2 * (n·v) * n - v)
    //-(n * (2 * (n·v))  - v)
    return vec_inv(vec_diff(vec_mul_k(n, (2 * dotProduct(n, v))), v));
}

//----------------------------------------------------------------------------
// Collision functions
//----------------------------------------------------------------------------
function sphere_plane_intersection(sphere, plane) {
    return (dotProduct(plane.normal, sphere.position) - pointDistance(plane.position, [0, 0, 0])) < sphere.radius;
}

function sphere_sphere_intersection(sphere1, sphere2) {
    var rSum = sphere1.radius + sphere2.radius;
    return sqPointDistance(sphere1.position, sphere2.position) < (rSum * rSum);
}

//----------------------------------------------------------------------------
// Update Event Function 
//----------------------------------------------------------------------------
const gravity = 0.00000098
function update(dt) {
    // Update state
    spheres.forEach(function(sphere, index) {
        // Update state (rotation) of the sphere
        sphere.rotation[0] = (sphere.rotation[0] + 0.02*dt) % 360;
        sphere.rotation[1] = (sphere.rotation[1] + 0.02*dt) % 360;

        // Update other spheres different than index 0
        if (index != 0) {
            // Update velocity
            sphere.velocity[0] -= (air_friction * sphere.velocity[0]) / sphere.mass * dt;                // vx
            sphere.velocity[1] -= (air_friction * sphere.velocity[1]) / sphere.mass * dt;                // vy
            sphere.velocity[2] -= (gravity + air_friction * sphere.velocity[2]) / sphere.mass * dt;        // vz

            // Update position
            sphere.position[0] += sphere.velocity[0] * dt;
            sphere.position[1] += sphere.velocity[1] * dt;
            sphere.position[2] += sphere.velocity[2] * dt;
            // Check if there is sphere-sphere intersection
            spheres.forEach(function(otherSphere, otherIndex) {
                if (otherIndex == index || otherIndex == 0) return;

                if (sphere_sphere_intersection(sphere, otherSphere)) {
                    // Separate both spheres the same distance
                    var N = vec_norm(vec_diff(otherSphere.position, sphere.position));
                    var invN = vec_inv(N);
                    var P = vec_mul_k(N, sphere.radius + otherSphere.radius - pointDistance(sphere.position, otherSphere.position) + 0.01);

                    sphere.position = vec_diff(sphere.position, vec_div_k(P, 2));
                    otherSphere.position = vec_sum(otherSphere.position, vec_div_k(P, 2));

                    // Calculate new velocities
                    var VN1 = vec_mul_k(invN, dotProduct(invN, sphere.velocity));
                    var VT1 = vec_diff(sphere.velocity, VN1);
                    sphere.velocity = vec_diff(VT1, vec_mul_k(VN1, sphere.absorption*0.000001));
                    
                    var VN2 = vec_mul_k(N, dotProduct(N, otherSphere.velocity));
                    var VT2 = vec_diff(otherSphere.velocity, VN2);
                    otherSphere.velocity = vec_diff(VT2, vec_mul_k(VN2, otherSphere.absorption*0.000001));
                }
            });
            
            // Check if there is sphere plane intersection
            if (sphere_plane_intersection(sphere, plane)) {
                // Invert speed along z axis
                sphere.position[2] = sphere.radius;
                sphere.velocity[2] = Math.abs(sphere.velocity[2])*sphere.absorption;
            }
        
		}
		// Update graphical representation
		let transform = scale(2*sphere.radius, 2*sphere.radius, 2*sphere.radius);

		let ejeX = vec3(1.0, 0.0, 0.0);
		transform = mult(rotate(sphere.rotation[0], ejeX), transform);
		let ejeY = vec3(0.0, 1.0, 0.0);
		transform = mult(rotate(sphere.rotation[1], ejeY), transform);
		let ejeZ = vec3(1.0, 0.0, 0.0);
		transform = mult(rotate(sphere.rotation[2], ejeZ), transform);

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
	//eye = vec3(10.0 + spheres[0].position[0], spheres[0].position[1], 10.0);
	//target = vec3(spheres[0].position[0], spheres[0].position[1], spheres[0].position[2]);
	eye = vec3(1.0, 0.0, 15.0);
	target = vec3(0.0, 0.0, 0.0);
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
