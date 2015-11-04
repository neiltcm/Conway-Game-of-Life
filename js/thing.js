var game;
var SIZE = 15;
(function() {
	function Cell(x, y, index) {
		this.x = x;
		this.y = y;
		this.index = index;
		this.alive = false;
		this.nextStatus = false;
	}

	Cell.prototype = {

		update: function() {
			var grid = game.grid;
			var size = game.size;
			var x = this.x;
			var y = this.y;			
			var alive = this.alive;
			var count = 0;
			if (x > 0) {
				if (grid[x-1][y].alive) count++;			
				if (y > 0)
					if (grid[x-1][y-1].alive) count++;	
				if (y < size-1)		
					if (grid[x-1][y+1].alive) count++;	
			}
			if (x < size-1) {
				if (grid[x+1][y].alive) count++;
				if (y > 0)
					if (grid[x+1][y-1].alive) count++;	
				if (y < size-1)
					if (grid[x+1][y+1].alive) count++;	
			}
			if (y > 0)
				if (grid[x][y-1].alive) count++;
			if (y < size-1)
				if (grid[x][y+1].alive) count++;

			this.nextStatus = count == 3 || (alive && count == 2);
		},

		render: function(cells) {
			if (this.alive) {
				cells[this.index].className = "cell on";
			}
			else {
				cells[this.index].className = "cell";
			}
		}
	}

	game = {
		size: 15,
		running: false,
		ticker: false,
		grid: [],
		speed: 400
	};

	// initialize grid
	for (var i = 0; i < game.size; i++) {
		var row = [];
		for (var j = 0; j < game.size; j++) {
			var index = (i * game.size) + j;
			var c = new Cell(i,  j, index);
			row.push(c);
		}
		game.grid.push(row);
	}

	function update() {
		for (var i = 0; i < game.size; i++) {
			for (var j = 0; j < game.size; j++) {
				game.grid[i][j].update();
			}
		}
		for (var i = 0; i < game.size; i++) {
			for (var j = 0; j < game.size; j++) {
				var cell = game.grid[i][j];
				cell.alive = cell.nextStatus;
				cell.nextStatus = false;
			}
		}
	}

	function render() {
		// get all cells on screen
		var cells = document.getElementsByClassName('cell');
		for (var i = 0; i < game.size; i++) {
			for (var j = 0; j < game.size; j++) {
				game.grid[i][j].render(cells);
			}
		}
	}

	$(function() {
		for (var i = 0; i < SIZE; i++) {
			var row = document.createElement('div');
			$(row).addClass('row');
			for (var j = 0; j < SIZE; j++) {
				var cell = document.createElement('div');
				$(cell).addClass('cell').appendTo($(row));
			}
			$(row).appendTo($("#grid"));
		}	

		$("#run").on('click', function() {
			game.running = !game.running;
			if (game.running)
				game.ticker = setInterval(function() {
					update();
					render();
				}, game.speed);
			else
				clearInterval(game.ticker);
			$(this).html(game.running ? 'Pause' : 'Run');
		});

		$("#randomize").on('click', function() {
			for (var i = 0; i < game.size; i++) {
				for (var j = 0; j < game.size; j++) {
					var cell = game.grid[i][j];
					cell.alive = Math.random() > 0.5 ? true : false;
				}
			}
			update();
			render();
		});	

		$("#clear").on('click', function() {
			if (game.running) {
				console.log("game running");
				game.running = false;
				clearInterval(game.ticker);
				$("#run").html('Run');
			}
			for (var i = 0; i < game.size; i++) {
				for (var j = 0; j < game.size; j++) {
					var cell = game.grid[i][j];
					cell.alive = false;
				}
			}
			update();
			render();
		});

		var cells = document.getElementsByClassName('cell');		
		for (var i = 0; i < cells.length; i++) {
			cells[i].onclick = function(arg) {
				return function() {					
					var row = Math.floor(arg / game.size);								
					var col = arg % game.size;									
					var cell = game.grid[row][col];
					cell.alive = !cell.alive;
					cell.render(cells);
				}				
			}(i);
		}
	});


})();