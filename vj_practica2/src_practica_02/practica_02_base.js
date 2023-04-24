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
// MODEL DATA 
//----------------------------------------------------------------------------

//Define points' position vectors
const cubeVerts = [
	[ 0.5, 0.5, 0.5, 1], //0
	[ 0.5, 0.5,-0.5, 1], //1
	[ 0.5,-0.5, 0.5, 1], //2
	[ 0.5,-0.5,-0.5, 1], //3
	[-0.5, 0.5, 0.5, 1], //4
	[-0.5, 0.5,-0.5, 1], //5
	[-0.5,-0.5, 0.5, 1], //6
	[-0.5,-0.5,-0.5, 1], //7
];

const wireCubeIndices = [
//Wire Cube - use LINE_STRIP, starts at 0, 30 vertices
	0,4,6,2,0, //front
	1,0,2,3,1, //right
	5,1,3,7,5, //back
	4,5,7,6,4, //right
	4,0,1,5,4, //top
	6,7,3,2,6, //bottom
];

const cubeIndices = [	
//Solid Cube - use TRIANGLES, starts at 0, 36 vertices
	0,4,6, //front
	0,6,2,
	1,0,2, //right
	1,2,3, 
	5,1,3, //back
	5,3,7,
	4,5,7, //left
	4,7,6,
	4,0,1, //top
	4,1,5,
	6,7,3, //bottom
	6,3,2,
];

const pointsAxes = [];
pointsAxes.push([ 2.0, 0.0, 0.0, 1.0]); //x axis is green
pointsAxes.push([-2.0, 0.0, 0.0, 1.0]);
pointsAxes.push([ 0.0, 2.0, 0.0, 1.0]); //y axis is red
pointsAxes.push([ 0.0,-2.0, 0.0, 1.0]); 
pointsAxes.push([ 0.0, 0.0, 2.0, 1.0]); //z axis is blue
pointsAxes.push([ 0.0, 0.0,-2.0, 1.0]);

const pointsWireCube = [];
for (let i=0; i < wireCubeIndices.length; i++)
{
	pointsWireCube.push(cubeVerts[wireCubeIndices[i]]);
}

const pointsCube = [];
for (let i=0; i < cubeIndices.length; i++)
{
	pointsCube.push(cubeVerts[cubeIndices[i]]);
}

const shapes = {
	wireCube: {Start: 0, Vertices: 30},
	cube: {Start: 0, Vertices: 36},
	axes: {Start: 0, Vertices: 6}
};
	
//Declaración de los colores de los diferentes cubos
const red =			[1.0, 0.0, 0.0, 1.0];
const green =		[0.0, 1.0, 0.0, 1.0];
const blue =		[0.0, 0.0, 1.0, 1.0];
const lightred =	[1.0, 0.5, 0.5, 1.0];
const lightgreen =	[0.5, 1.0, 0.5, 1.0];

const darkgreen = 	[6/255, 114/255, 60/255, 1.0];
const lightblue = 	[0.5, 0.5, 1.0, 1.0];
const darkblue = 	[10/255, 6/255, 114/255, 1.0];
const greenblue =	[27/255, 165/255, 119/255, 1.0];
const white =		[1.0, 1.0, 1.0, 1.0];

const ligthyellow = [227/255, 239/255, 112/255, 1.0];
const yellow =		[247/255, 219/255, 5/255, 1.0];
const pink = 		[240/255, 138/255, 234/255, 1.0];
const purple = 		[146/255, 11.0, 138/255, 1.0];
const darkpurple =	[91/255, 22/255, 149/255, 1.0];

const orange = 		[254/255, 116/255, 5/255, 1.0];
const brown =		[133/255, 75/255, 12/255, 1.0];
const grey = 		[198/255, 214/255, 200/255, 1.0];
const darkred = 	[163/255, 7/255, 7/255, 1.0];
const darkyellow = 	[148/255, 160/255, 11/255, 1.0];

const colorsAxes = [
	green, green, //x
	red, red,     //y
	blue, blue,   //z
];

const colorsWireCube = white;

//Vector de colores
const colorsCube = [red, green, blue, lightred, lightgreen, darkgreen, lightblue, 
	darkblue, greenblue, white, ligthyellow, yellow, pink, purple, darkpurple, orange, brown, grey, darkred, darkyellow];

//----------------------------------------------------------------------------
// CAMARA DATA
//----------------------------------------------------------------------------
var camera_mov      = 0.1;   // Camera speed movement.
var aspect_ratio    = 0.0;   // Canvas aspect ratio.
var current_fov     = 45.0;  // Current FOV.
var min_fov   	    = 10.0;  // Mininum FOV.
var max_fov   	    = 170.0; // Maximum FOV.
var near_clip 	    = 0.1;   // Near clip.
var far_clip  	    = 100.0; // Far clip.
var has_perspective = true;  // The camera is in perspective projection.
var previous_x 		= 0.0;   // Previous x position before moving the camera again.
var previous_y      = 0.0;   // Previous y position before moving the camera again.
var can_rotate		= false; // Indicates if the camera can rotate.
var rotating_factor = 0.05;	 // Distance to degrees.
var current_pitch   = 0.0;   // Current rotation in X-axis.
var current_yaw		= 0.0;   // Current rotation in Y-axis.
var max_pitch 	 	= 90.0;  // Rotation in X-axis.
var max_yaw   	 	= 90.0;  // Rotation in Y-axis.
//----------------------------------------------------------------------------
// OTHER DATA 
//----------------------------------------------------------------------------

var model = new mat4();   		// create a model matrix and set it to the identity matrix
var view = new mat4();   		// create a view matrix and set it to the identity matrix
var projection = new mat4();	// create a projection matrix and set it to the identity matrix

var eye, target, up;			// for view matrix

var rotAngle = 0.0;
var rotChange = 0.5;

var program;
var uLocations = {};
var aLocations = {};

var timer;

var programInfo = {
			program,
			uniformLocations: {},
			attribLocations: {},
};

var objectsToDraw = [
		{
		  programInfo: programInfo,
		  pointsArray: pointsAxes, 
		  colorsArray: colorsAxes, 
		  uniforms: {
			u_colorMult: [1.0, 1.0, 1.0, 1.0],
			u_model: new mat4(),
		  },
		  primType: "lines",
		},
		{
		  programInfo: programInfo,
		  pointsArray: pointsWireCube,
		  colorsArray: colorsWireCube, 
		  uniforms: {
			u_colorMult: [1.0, 1.0, 1.0, 1.0],
			u_model: new mat4(),
		  },
		  primType: "line_strip",
		},
];

for (let i=0; i < 20; i++)
{
	var cube = {
		programInfo: programInfo,
		pointsArray: pointsCube,
		colorsArray: colorsCube[i], 
		uniforms: {
			u_colorMult: [1.0, 1.0, 1.0, 1.0],
			u_model: new mat4(),
		},
		primType: "triangles",
	  };
	objectsToDraw.push(cube);
}

// Producto matriz*vector.
function product(m, v) {
	let r = vec4(0.0, 0.0, 0.0, 0.0);
	for (let i = 0; i < 4; i++) {
		for (let j = 0; j < 4; j++) {
			r[i] += m[i][j] * v[j];
		}
	}
	return r;
}

/*
var ejes = [];
function random_array() {
	ejes.push(vec3());
	ejes.push(vec3());
	for (let i = 2; i < 22; i++) {
		let choose = Math.floor(Math.random() * 3);
		if (choose == 0) {
			ejes.push(vec3(1.0, 0.0, 0.0));
		} else if (choose == 1) {
			ejes.push(vec3(0.0, 1.0, 0.0));
		} else {
			ejes.push(vec3(0.0, 0.0, 1.0));
		}
	}
}
*/

//----------------------------------------------------------------------------
// Initialization function
//----------------------------------------------------------------------------
var canvas;
// https://stackoverflow.com/questions/19142993/how-draw-in-high-resolution-to-canvas-on-chrome-and-why-if-devicepixelratio
// https://stackoverflow.com/a/15666143
window.onload = function init() {
	canvas = document.getElementById("gl-canvas");
	// Set up a WebGL Rendering Context in an HTML5 Canvas
	// Estas opciones sirven para reescalarar la densisdad de pixeles de acuerdo
	// al monitor desde el que se ve el canvas, ya que aunque se reescale el canvas
	// tiene muchos menos pixeles que los que deberia tener acorde al monitor, por
	// lo que estos se exanden y se ve borroso.
	const device_pixel_ratio = window.devicePixelRatio || 1;
	canvas.width = canvas.clientWidth * device_pixel_ratio;
	canvas.height = canvas.clientHeight * device_pixel_ratio;
	aspect_ratio = canvas.width/canvas.height;
	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) {
		alert("WebGL isn't available");
	}

	//  Configure WebGL
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);

	setPrimitive(objectsToDraw);

	// Set up a WebGL program
	// Load shaders and initialize attribute buffers
	program = initShaders(gl, "vertex-shader", "fragment-shader");
	  
	// Save the attribute and uniform locations
	uLocations.model = gl.getUniformLocation(program, "model");
	uLocations.view = gl.getUniformLocation(program, "view");
	uLocations.projection = gl.getUniformLocation(program, "projection");
	uLocations.colorMult = gl.getUniformLocation(program, "colorMult");
	aLocations.vPosition = gl.getAttribLocation(program, "vPosition");
	aLocations.vColor = gl.getAttribLocation(program, "vColor");

	programInfo.uniformLocations = uLocations;
	programInfo.attribLocations = aLocations;
	programInfo.program = program;

	gl.useProgram(programInfo.program);
	
	// Set up viewport 
	gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

	// Set up camera
	// Projection matrix
	projection = perspective(current_fov, aspect_ratio, near_clip, far_clip);
	gl.uniformMatrix4fv( programInfo.uniformLocations.projection, gl.FALSE, projection ); // copy projection to uniform value in shader
    // View matrix (static cam)
	eye = vec3(-5.0, 5.0, 10.0);
	target = vec3(0.0, 0.0, 0.0);
	up =  vec3(0, 1.0, 0);
	view = lookAt(eye,target,up);
	gl.uniformMatrix4fv(programInfo.uniformLocations.view, gl.FALSE, view); // copy view to uniform value in shader
	
	// Si se pulsa el boton izquierdo, empieza la rotacion.
	canvas.addEventListener('mousedown', (event) => {
		if (event.button === 0) {
			previous_x = event.clientX;
			previous_y = event.clientY;
			can_rotate = true;
		}
	})

	// Si se deja de pulsar el boton izquierdo, reinicia la rotacion.
	canvas.addEventListener("mouseup", (event) => {
		if (event.button === 0) {
			previous_x = 0;
			previous_y = 0;
			current_pitch = 0;
			current_yaw   = 0;
			can_rotate = false;
		}
	});

	// Si el raton se mueve, salta el evento.
	canvas.addEventListener("mousemove", (event) => {
		// Debe poder rotarse para poder modificar la rotacion de la camara.
		if (can_rotate) {
			// 1. Se verifica que el grado de rotacion de pitch actual es menor
			// que el maximo.
			if (Math.abs(current_pitch) < max_pitch) {
				// a. Se obtiene la coordenada y de la posicion del raton
				let aux_y = event.clientY;
				// b. Se obtiene el desplazamiento desde el ultimo punto y se multiplica
				// por un factor (elegido a ojo) que pasa de pixeles a 'grados'.
				let current_y = (event.clientY - previous_y) * rotating_factor;
				// c. Se guarda la nueva ultima posicion y aumenta el grado de
				// desplazamiento.
				previous_y    = aux_y;
				current_pitch += current_y;
				// d. Se calcula la matriz de transformacion para rotar la camara.
				let cos_x = Math.cos(current_y * (Math.PI/180.0)),
					sin_x = Math.sin(current_y * (Math.PI/180.0)),
					rx    = [
						[1.0, 0.0  ,  0.0  , 0.0],
						[0.0, cos_x, -sin_x, 0.0],
						[0.0, sin_x,  cos_x, 0.0],
						[0.0, 0.0  ,  0.0  , 1.0]
					];
				// e. Como la camara no esta en el origen, primero se mueve al mismo.
				let c = vec4(target[0]-eye[0], target[1]-eye[1], target[2]-eye[2], 1.0);
				// f. Producto matricial y actualizacion del target.
				let h = product(rx, c);
				target = vec3(h[0]+eye[0], h[1]+eye[1], h[2]+eye[2]);
				//c  = vec4(up[0], up[1], up[2], 0.0);
				//h  = product(rx, c);
				//up = vec3(h[0], h[1], h[2]);
			}
			// 2. Se verifica que el grado de rotacion de yaw actual es menor
			// que el maximo. Mismo funcionamiento pero alrededor del eje Y.
			if (Math.abs(current_yaw) < max_yaw) {
				let aux_x     = event.clientX;
				let current_x = (event.clientX - previous_x) * rotating_factor;
				previous_x    = aux_x;
				current_yaw  += current_x;
				let cos_y = Math.cos(current_x * (Math.PI/180.0)),
					sin_y = Math.sin(current_x * (Math.PI/180.0)),
					ry    = [
						[ cos_y, 0.0, sin_y, 0.0],
						[ 0.0  , 1.0, 0.0  , 0.0],
					    [-sin_y, 0.0, cos_y, 0.0],
					    [ 0.0  , 0.0, 0.0  , 1.0]
					];
				let c  = vec4(target[0]-eye[0], target[1]-eye[1], target[2]-eye[2], 1.0);
				let h = product(ry, c);
				target = vec3(h[0]+eye[0], h[1]+eye[1], h[2]+eye[2]);	
			}
			// 3. Se actualiza la vista.
			view = lookAt(eye, target, up);
			gl.uniformMatrix4fv(programInfo.uniformLocations.view, gl.FALSE, view);
		}
	});
	// Temporizador para los colores aleatorios del fondo.
	timer = setTimeout(random_color, 1000);
	requestAnimFrame(render);
  
};

// Funcion para reescalar las dimensiones del canvas respecto de las dimensiones
// de la ventana.
function resize_canvas() {
	const width  = window.innerWidth;
	const height = window.innerHeight;
	let device_pixel_ratio = window.devicePixelRatio || 1;
	canvas.width = width * device_pixel_ratio;
	canvas.height = height * device_pixel_ratio;
	projection = perspective(current_fov, aspect_ratio, near_clip, far_clip);
	gl.uniformMatrix4fv( programInfo.uniformLocations.projection, gl.FALSE, projection );
	gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
}
window.addEventListener('resize', resize_canvas);

// Genera un color aleatorio cada segundo para el fondo del canvas.
function random_color() {
	clearTimeout(timer);
	timer = setTimeout(random_color, 1000);
	gl.clearColor(Math.random(), Math.random(), Math.random(), 1);

}

//----------------------------------------------------------------------------
// Camera movement
//----------------------------------------------------------------------------
// NEW. Sources:
// - https://www.gavsblog.com/blog/detect-single-and-multiple-keypress-events-javascript
// - https://www.toptal.com/developers/keycode
// - https://stackoverflow.com/questions/24147546/webgl-orthographic-camera
// - https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
// - https://stackoverflow.com/questions/5203407/how-to-detect-if-multiple-keys-are-pressed-at-once-using-javascript
let keys_pressed = {}; // Mapa para guardar las teclas presionadas.
document.addEventListener('keydown', (event) => {
	// Si no se presiona ninguna de las teclas utilizadas en el programa, no se meten.
	if (event.key == 'ArrowLeft' || event.key == 'ArrowUp' || event.key == 'ArrowRight' || event.key == 'ArrowDown' || event.key == 'o' || event.key == 'p' || event.key == '+' || event.key == '-') {
		keys_pressed[event.key] = true;
	}
});

document.addEventListener('keyup', (event) => {
    keys_pressed[event.key] = false;
});

function camera() {
	// CAMERA MOVEMENT
	// Left arrow: move to the left
	if (keys_pressed['ArrowLeft']) {
		console.log("Going left.");
		eye[0] -= camera_mov;
		target[0] -= camera_mov;
		view = lookAt(eye, target, up);
	}
	// Up Arrow: move upwards.
    if (keys_pressed['ArrowUp']) {
		console.log("Going up.");
        eye[1] += camera_mov;
		target[1] += camera_mov;
		view = lookAt(eye, target, up);
    }
	// Right arrow: move to the right.
	if (keys_pressed['ArrowRight']) {
		console.log("Going right.");
		eye[0] += camera_mov;
		target[0] += camera_mov;
		view = lookAt(eye, target, up);
	}
	// Down arrow: move downwards.
    if (keys_pressed['ArrowDown']) {
		console.log("Going down.");
        eye[1] -= camera_mov;
		target[1] -= camera_mov;
		view = lookAt(eye, target, up);
	}

	// PROJECTION
	// O key: orthogonal projection.
	if (keys_pressed['o']) { 
		console.log("Orthogonal activated.");
		has_perspective = false;
	// P key: perspective projection.
	} else if (keys_pressed['p']) { 
		console.log("Perspective activated.");
		has_perspective = true;
	}
	
	// FOV
	// '+': more fov:
	if (keys_pressed['+']) { 
		if (current_fov < max_fov) {
			console.log("More FOV!");
			current_fov += 5;
		}
	}
	// '-': less fov:
	else if (keys_pressed['-']) { 
		if (current_fov > min_fov) {
			console.log("Less FOV?");
			current_fov -= 5;
		}
	}
	if (!has_perspective) {
		projection = ortho(-aspect_ratio * current_fov * 0.1, aspect_ratio * current_fov * 0.1, -current_fov * 0.1, current_fov * 0.1, near_clip, far_clip);
	} else {
		projection = perspective(current_fov, aspect_ratio, near_clip, far_clip);
	}

	gl.uniformMatrix4fv(programInfo.uniformLocations.projection, gl.FALSE, projection);
	gl.uniformMatrix4fv(programInfo.uniformLocations.view, gl.FALSE, view);
}

//----------------------------------------------------------------------------
// Rendering Event Function
//----------------------------------------------------------------------------

function render() {

	gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
	
	//----------------------------------------------------------------------------
	// MOVE STUFF AROUND
	//----------------------------------------------------------------------------

	let ejeY = vec3(0.0, 1.0, 0.0), ejeX = vec3(1.0, 0.0, 0.0), ejeZ = vec3(0.0, 0.0, 1.0);
	let R = [ rotate(rotAngle, ejeY), rotate(2*rotAngle, ejeY) ];

	var j = -1;
	var k = 0.2;
	var l = 1;

	//Creamos 20 cubos más multiplicando la matriz del cubo por otra matriz de orden inverso
	//para tener rotación sobre el eje como del centro
	for (let i=2; i < 22; i++)
	{
		if(i % 2 == 0) { j++; }
		objectsToDraw[i].uniforms.u_model = translate(1.0 + j, 0.0, 3.0);
		objectsToDraw[i].uniforms.u_model = mult(rotate(rotAngle * l, ejeY), objectsToDraw[i].uniforms.u_model);
		objectsToDraw[i].uniforms.u_model = mult(objectsToDraw[i].uniforms.u_model, rotate(rotAngle * l, ejeY));
		l = l + k;
	}
	
	//----------------------------------------------------------------------------
	// DRAW
	//----------------------------------------------------------------------------

	objectsToDraw.forEach(function(object) {

		gl.useProgram(object.programInfo.program);

		// Setup buffers and attributes
		setBuffersAndAttributes(object.programInfo, object.pointsArray, object.colorsArray);

		// Set the uniforms
		setUniforms(object.programInfo, object.uniforms);

		// Draw
		gl.drawArrays(object.primitive, 0, object.pointsArray.length);
    });	
    
	rotAngle += rotChange;
	camera();
	
	requestAnimationFrame(render);
	
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
	// Copy uniform model values to corresponding values in shaders
	gl.uniform4f(pInfo.uniformLocations.colorMult, uniforms.u_colorMult[0], uniforms.u_colorMult[1], uniforms.u_colorMult[2], uniforms.u_colorMult[3]);
	gl.uniformMatrix4fv(pInfo.uniformLocations.model, gl.FALSE, uniforms.u_model);
}

function setBuffersAndAttributes(pInfo, ptsArray, color) {
	// Load the data into GPU data buffers
	// Vertices
	var vertexBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );
	gl.bufferData( gl.ARRAY_BUFFER,  flatten(ptsArray), gl.STATIC_DRAW );
	gl.vertexAttribPointer( pInfo.attribLocations.vPosition, 4, gl.FLOAT, gl.FALSE, 0, 0 );
	gl.enableVertexAttribArray( pInfo.attribLocations.vPosition );

	// Cambiamos el color del cubo segun el parametro color que nos pasan
	gl.vertexAttrib4fv(pInfo.attribLocations.vColor, color);
}
