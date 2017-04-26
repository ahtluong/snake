var $row    = $('<div/>').addClass('row');
var $square = $('<div/>').addClass('square');

var Board = 
{
	width : 25,
	height: 25,

	render: function() {
		$('body').append($('<div/>').attr('id', 'board'));
		for (var i = 0; i < Board.height; i++) {
			$('#board').append($row.clone());
		}
		for (var i = 0; i < Board.width; i++) {
			$('.row').append($square.clone());
		}

		$('#board').append($('<div/>').attr('id','overlay'));
		$('#overlay').append($('<div/>').attr('id','button').text('PLAY'));
	},
};

var Snake =
{
	position: [ [13,13], [13,12], [13,11] ],
	size: 3,
	direction: 'r',
	isAlive: true,

	draw: function() {
		$('.square').removeClass('snake');		
		for (var i = 0; i < Snake.size; i++) {
			$('.row:nth-child(' + Snake.position[i][0] + ') > .square:nth-child(' + Snake.position[i][1] + ')').addClass('snake');
		}
	},

	turn: function() {
		document.onkeydown = function(e) {
			switch (e.keyCode) {
				case 37:
					if (Snake.direction != 'r') Snake.direction = 'l';
					break;
				case 38:
					if (Snake.direction != 'd') Snake.direction = 'u';
					break;
				case 39:
					if (Snake.direction != 'l') Snake.direction = 'r';
					break;
				case 40:
					if (Snake.direction != 'u') Snake.direction = 'd';
					break;
			}
		};
	},

	move: function() {
		head = Snake.position[0].slice();
		switch (Snake.direction) {
			case 'l':
				head[1]--;
				break;
			case 'u':
				head[0]--;
				break;
			case 'r':
				head[1]++;
				break;
			case 'd':
				head[0]++;
				break;
		}

		// Check wall collision
		if (head[0] > Board.width || head[0] < 1 || head[1] > Board.width || head[1] < 1) {
			Snake.isAlive = false;
		}

		// Check if snake eats itself
		for (var i = 0; i < Snake.size; i++) {
			if (head[0] == Snake.position[i][0] && head[1] == Snake.position[i][1]) {
				Snake.isAlive = false;
			}
		}

		// FIXME Has a bug for some reason
		// Check if snake eats food
		// if (head[0] == Food.position[0] && head[1] == Food.position[1]) {
		// 	Food.eaten = true;
		// }

		// console.log(head);
		// if (Snake.alive(head)) {
		console.log(Food.position);
		console.log(head);
		if (Snake.isAlive) {
    		if (head.every(function(e,i) {
      			return e === Food.position[i];
    		})) {
				Snake.size++;
				Snake.position.unshift(head);    // Add the head
				$('#score').text(++Game.score)   // Update score
				Snake.draw();
				Food.create();
			} else {
				Snake.position.pop();            // Remove the tail
				Snake.position.unshift(head);    // Add the head
				Snake.draw();
			}
		}
	},

	// FIXME undefined for some reason
	// alive: function(h) {
	// 	console.log(h);
	// 	var check_board = function(x) {                              // Check wall collision
	// 		if(x[0] <= Board.width && x[0] >= 0 ) return true;
	// 		else {
	// 			isAlive = false;
	// 			return false;
	// 		}
	// 	};
	// 	var check_eatself = function(x) {                            // Check if snake eats itself
	// 		if (x[0] == h[0] && x[1] == h[1]) {
	// 			Snake.isAlive = false;
	// 			return false;
	// 		}
	// 		else return true;
	// 	};
	// 	return (h.every(check_board) && Snake.position.every(check_eatself));
	// }
};

var Game =
{
	score: 0,
	speed: 100,
	loop: function() {
		setTimeout(function() {
			if ($('.food').length == 0) Food.create();
			Snake.turn();
			Snake.move();
			if (Snake.isAlive) Game.loop();
			else Game.end();
		}, Game.speed);
	},

	start: function() {
		$('#overlay').hide();

		Snake.position = [ [13,13], [13,12], [13,11] ];
		Snake.isAlive = true;
		Snake.size = 3;
		Snake.direction = 'r';
		Snake.draw();
		Game.loop();
	},

	end: function() {
		$('#overlay').append($('<h1/>').text('GAME OVER'));
		$('#overlay').show();
		console.log('over');
	}
};

var Food =
{
	position: [],

	draw: function() {
		$('.square').removeClass('food');
		$('.row:nth-child(' + Food.position[0] + ') > .square:nth-child(' + Food.position[1] + ')').addClass('food');
	}, 

	create: function() {
		var x = Math.floor(Math.random() * Board.width);
		var y = Math.floor(Math.random() * Board.height);
		function check(a) {
			if (a[0] == x && a[1] == y) return false;
			else return true;
		}
		if (Snake.position.every(check)) Food.position = [x, y];
		else Food.create();

		Food.draw();
	}
};

$(document).ready(function() {
	Board.render();
	$('#button').click(Game.start)
});