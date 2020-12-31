// Game State
const STATE_RUNNING = 1;
const STATE_LOSING = 2;

const TIME_MOTION = 80;

const SQUARE_SIZE_PIXEL = 10;

const SPACING_WIDTH = 50;
const SPACING_HEIGHT = 50;

const GROWING_SNAKE = 10;

const KEYS_MAP = {
	'A':[-1 , 0],
	'D':[1, 0],
	'S':[0, 1],
	'W': [0, -1],
	'a':[-1 , 0],
	'd':[1, 0],
	's':[0, 1],
	'w': [0, -1]
}

let gameStates = {
	canvas_html: null,
	ctx: null,
	snake_points: [{
		x: 0, 
		y: 0
	}],

	get_direction: {
		x: 1, 
		y: 0
	},

	fruit: {
		x:0,
		y:0
	},
	growing_rest: 0,
	runState: STATE_RUNNING,
};

// Funcion para posiciones aleatorias

function randomPositionXY(){
	return {
		x: parseInt(Math.random() * SPACING_WIDTH),
		y: parseInt(Math.random() * SPACING_HEIGHT)
	}
}

function main() {
	const head = gameStates.snake_points[0];
	const dx = gameStates.get_direction.x;
	const dy = gameStates.get_direction.y;
	const highIndex = gameStates.snake_points.length - 1;
	let timeIn = TIME_MOTION;
	let tail = {};
	  const objSnake = gameStates.snake_points;

	Object.assign(tail, objSnake[gameStates.snake_points.length - 1])

	let score = (
		head.x === gameStates.fruit.x
		&& head.y === gameStates.fruit.y
	);

	if(gameStates.runState === STATE_RUNNING){
		for(let j = highIndex; j > -1; j--){
			const sq = gameStates.snake_points[j];
			if(j === 0){
				sq.x += dx;
				sq.y += dy;
			}else {
				sq.x = gameStates.snake_points[j - 1].x;
				sq.y = gameStates.snake_points[j - 1].y;
			}
		}
	}else if(gameStates.runState === STATE_LOSING){
		timeIn = 10;

		if(gameStates.snake_points.length > 0){
			gameStates.snake_points.splice(0,1);
		}

		if(gameStates.snake_points.length === 0){
			gameStates.runState = STATE_RUNNING;
			gameStates.snake_points.push(randomPositionXY());
			gameStates.fruit = randomPositionXY();
		}

	}

	if(collision()){
		gameStates.runState = STATE_LOSING;
		gameStates.growing_rest = 0;

	}

	if(score){
	    gameStates.growing_rest += GROWING_SNAKE;
		gameStates.fruit = randomPositionXY();
	}

	if(gameStates.growing_rest > 0){
		gameStates.snake_points.push(tail);
	    gameStates.growing_rest -= 1;
	}

	function collision(){
		const head = gameStates.snake_points[0];
			if(Headers.x < 0 || head.y >=SPACING_WIDTH || head.y >= SPACING_HEIGHT || head.y < 0){
				return true;
			}

			for(let idx = 1; idx < gameStates.snake_points.length; idx++){
				const sq = gameStates.snake_points[idx];

				if(sq.x === head.x && sq.y === head.y){
					return true;
				}

			}

		return false;	
	}

	requestAnimationFrame(mainDrawn);
	setTimeout(main, timeIn);

}



function printPixel(color, x, y){
	gameStates.ctx.fillStyle = color;
	gameStates.ctx.fillRect(
		x * SQUARE_SIZE_PIXEL,
		y * SQUARE_SIZE_PIXEL,
		SQUARE_SIZE_PIXEL,
		SQUARE_SIZE_PIXEL
	)
}


function mainDrawn(){
	gameStates.ctx.clearRect(0,0,500,500);
	const len = gameStates.snake_points.length;
		for(var i = 0; i < len; i++){
		  const {x,y} = gameStates.snake_points[i];
			printPixel('#22dd22', x, y);
		}

		const {x,y} = gameStates.fruit;
			printPixel('yellow',x,y);
}

window.onload = function() {
	gameStates.canvas_html = document.querySelector('canvas');
	gameStates.ctx = gameStates.canvas_html.getContext('2d');

		window.onkeydown = function(e) {
			const direction = KEYS_MAP[e.key];
				if(direction) {
					const [ x, y] = direction;
					if(-x !== gameStates.get_direction.x && -y !== gameStates.get_direction.y) {
							gameStates.get_direction.x = x;
							gameStates.get_direction.y = y;

						}

				}

			

		}
	
	main();	

}














