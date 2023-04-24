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
	console.log("copia");
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



eye = vec3(10.0 + spheres[0].position[0], spheres[0].position[1], 10.0);
target = vec3(spheres[0].position[0], spheres[0].position[1], spheres[0].position[2]);