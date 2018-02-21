
/************************************************************
	VirtualBoard class
	
	// empty: 		8
	// red: 		1
	// blue: 		2
	// coin: 		3
	// fixed-red: 	4
	// fixed-blue: 	5
	
*/
function VirtualBoard() {
	this.board = [];
	this.cage = [];
	this.last_move_score = 0;
	
	// Score settings
	this.move_score_win = 1000;
	this.move_score_lose = -1000;
	this.move_score_trap_blue = 100;
	this.move_score_trap_red = -100;
	this.move_score_coin_red = 50;
	this.move_score_coin_blue = -50;
	this.move_score_freeze = 200;
	this.move_score_row_multiplier = 2;
	this.move_score_danger = 40;
}


VirtualBoard.prototype.initBlankBoard = function() 
{
	this.board = [];
	
	// Populate board with empty blocks
	for (var r=0; r < board_size; r++) {
		var row = [];
		for (var c=0; c < board_size; c++) {
			row.push(BOARD_EMPTY);
		}
		this.board.push(row);
	}
	
	this.initPlayers();
	this.initCoins();
}
VirtualBoard.prototype.initPlayers = function() 
{
	switch(game_mode) {
		case "wall":
		case "easter":
			// full row per player
			// red on top, blue on bottom
			this.board[0] = BOARD_RED.repeat(board_size).split("");
			this.board[board_size-1] = BOARD_BLUE.repeat(board_size).split("");
		break;
		
		case "diamond":
			// only 2 pieces per player
			var per_player = 2;
			var padding = Math.floor((board_size-per_player)/2);
			// red
			for (var i=padding; i < padding+per_player; i++) {
				this.board[0][i] = BOARD_RED;
			}
			// blue
			for (var i=padding; i < padding+per_player; i++) {
				this.board[board_size-1][i] = BOARD_BLUE;
			}
		break;
	}
}
VirtualBoard.prototype.initCoins = function() 
{
	switch(game_mode) {
		case "wall":
			var coin_row = board_size/2;
			for (var i=0; i < board_size; i++) {
				coin_row = (coin_row==board_size/2)?board_size/2-1:board_size/2;
				this.board[coin_row][i] = BOARD_COIN;
			}		
		break;
		
		case "easter":
			var rand = Math.floor(Math.random()*(max_eggs-min_eggs))+min_eggs;
			
			// All rows can host coins except first and last
			var host_rows = board_size-2;
			var coins_distribution = [];
			// fill coins
			for (var i=0; i < rand; i++) {
				coins_distribution.push("x");
			}
			// fill empty spaces
			var host_blocks = host_rows*board_size - rand;
			for (var i=0; i < host_blocks; i++) {
				coins_distribution.push("o");
			}
			
			shuffle(coins_distribution);
			
			var index = 0;
			var curr_row = 1;
			for (var r=1; r < board_size-1; r++) {
				for (var c=0; c < board_size; c++) {
					if(coins_distribution[index] == "x"){
						this.board[r][c] = BOARD_COIN;
					}
					index++;
				};
			}
			
		break;
		
		case "diamond":
			// TODO make this dynamic (now it only works for 8 x 8 board)
			var dist = "oooooooooooxxoooooxxxxooooxxxxoooooxxooooooooooo";
			var coins_distribution = dist.split("");
			var index = 0;
			var curr_row = 1;
			for (var r=1; r < board_size-1; r++) {
				for (var c=0; c < board_size; c++) {
					if(coins_distribution[index] == "x"){
						this.board[r][c] = BOARD_COIN;
					}
					index++;
				};
			}
		break;
	}
}


VirtualBoard.prototype.getBoard = function() 
{
	return this.board;
}
VirtualBoard.prototype.getCage = function() 
{
	return this.cage;
}
VirtualBoard.prototype.getLastMoveScore = function() 
{
	return this.last_move_score;
}
VirtualBoard.prototype.getAllFromType = function(type)
{
	var all = [];
	for (var r=0; r < board_size; r++) {
		for (var c=0; c < board_size; c++) {
			if(this.board[r][c] === type) all.push([r,c]);
		}
	}
	return all;
}
VirtualBoard.prototype.getAllMoves = function()
{
	/*

	This array will be a 2D array like this:
	[ [piece, adjacent empty], [piece, adjacent empty]...  ]
	where both piece and adjacent looks like this: [row, col]

	*/
	var moves = [];
	
	var all_reds = this.getAllFromType(BOARD_RED);
	
	// find all empty adjacents to all reds
	for (var i=0; i < all_reds.length; i++) {
		var adjacents = this.getAllAdjacents(all_reds[i][0], all_reds[i][1]);
		// find only empty ones
		for (var k=0; k < adjacents.length; k++) {
			if(this.board[adjacents[k][0]][adjacents[k][1]] === BOARD_EMPTY) {
				moves.push( [all_reds[i], adjacents[k]] );
			}
		}
	}
	
	return moves;
}

VirtualBoard.prototype.getAllAdjacents = function(block_row, block_col) 
{
	// Get all adjacent blocks (cross)
	var adjacents = [];
	
	board = this.board;
	
	// top & bottom
	var tr = block_row-1;
	if(tr >= 0) adjacents.push([tr, block_col]);
	var br = block_row+1;
	if(br < board_size) adjacents.push([br, block_col]);
	
	// left & right
	var c = block_col+1;
	if(c < board_size) adjacents.push([block_row, c]);
	var c = block_col-1;
	if(c < board_size) adjacents.push([block_row, c]);
	
	return adjacents;
}

VirtualBoard.prototype.applyToHTMLBoard = function() {
	for (var r=0; r < board_size; r++) {
		for (var c=0; c < board_size; c++) {
			var block = $("#b_"+r+"_"+c);
			var piece = this.board[r][c];
			
			var piece_class = "";
			switch (piece) {
				case BOARD_RED:
					piece_class = "piece red";
				break;
				case BOARD_BLUE:
					piece_class = "piece blue";
				break;
				case BOARD_COIN:
					piece_class = "coin";
				break;
				case BOARD_FIXED_RED:
					piece_class = "piece red-fixed";
				break;
				case BOARD_FIXED_BLUE:
					piece_class = "piece blue-fixed";
				break;
			}
			
			
			// Replace old piece with new piece with animation
			if(block.children().length > 0) {
				var existing_piece = $(block).children().first();
				
				// Coins
				if( $(existing_piece).hasClass("coin") && piece_class.indexOf("piece")!=-1) {
					var next_color = piece_class.split(" ")[1];
					replaceCoin(existing_piece, next_color);
				} else {
					block.empty();
					if(piece_class != "") {
						$('<div class="'+piece_class+' auto"></div>').prependTo(block);
					}
				}
				
				if(piece_class.indexOf("piece")!=-1 && piece_class=="") {
					replaceCaptured(existing_piece);
				}
				
			} else {
				if(piece_class != "") {
					$('<div class="'+piece_class+' auto"></div>').prependTo(block);
				}
			}
			
			/*
			block.empty();
			if(piece_class != "") {
				$('<div class="'+piece_class+' auto"></div>').appendTo(block);
			}*/
			
		}
	}
	
	// Cage
	$(".cage").empty();
	for (var i=0; i < this.cage.length; i++) {
		var pclass = this.cage[i]===BOARD_RED?"red captured":"blue captured";
		$('<div class="'+pclass+'"></div>').appendTo(".cage");
	};
}

VirtualBoard.prototype.copyFromBoard = function(source_board) 
{
	this.board = JSON.parse(JSON.stringify(source_board.getBoard()));
	this.cage = JSON.parse(JSON.stringify(source_board.getCage()));
}
VirtualBoard.prototype.movePiece = function(piece, empty_block, turn) 
{
	this.last_move_score = 0;
	var piece_value = this.board[piece[0]][piece[1]];
	this.board[empty_block[0]][empty_block[1]] = piece_value;
	this.board[piece[0]][piece[1]] = BOARD_EMPTY;
	
	// favor pieces moving forward towards end line
	if(empty_block[0] > piece[0]) {
		this.last_move_score += empty_block[0]*this.move_score_row_multiplier*this.move_score_row_multiplier;
	}
	if(empty_block[0] == piece[0]) {
		this.last_move_score += empty_block[0]*this.move_score_row_multiplier
	}
	
	this.updateAfterMove(turn);
}
VirtualBoard.prototype.replaceCoinWithType = function(coin_block, type) 
{
	this.board[coin_block[0]][coin_block[1]] = type;
}
VirtualBoard.prototype.freezePiece = function(piece_block, type) 
{
	this.board[piece_block[0]][piece_block[1]] = (type===BOARD_RED ? BOARD_FIXED_RED : BOARD_FIXED_BLUE);
	this.last_move_score += (type===BOARD_RED)?this.move_score_freeze:0;
}
VirtualBoard.prototype.moveTrapped = function(piece_block, type) 
{
	this.board[piece_block[0]][piece_block[1]] = BOARD_EMPTY;
	this.cage.push(type);
	this.last_move_score += (type===BOARD_RED)?this.move_score_trap_red:this.move_score_trap_blue;
}
VirtualBoard.prototype.getPiecesInDanger = function(type) 
{
	// Checks which pieces are close to being captured
	// Find the peices that has adjacent opponent, and for those check if any 
	// opponent piece have common adjacents (which means that the opponent might 
	// trap this piece in one move)
	var pieces = this.getAllFromType(type);
	var opponent_type = type===BOARD_RED?BOARD_BLUE:BOARD_RED;
	var opponent_pieces = this.getAllFromType(opponent_type);
	var danger_score = 0;
	for (var i=0; i < pieces.length; i++) {
		var adjacents = this.getAllAdjacents( pieces[i][0], pieces[i][1] );
		var has_adjacent_opponent = false;
		for (var k=0; k < adjacents.length; k++) {
			if(this.board[adjacents[k][0]][adjacents[k][1]] === opponent_type) {
				has_adjacent_opponent = true;
				break;
			}
		}
		if(has_adjacent_opponent) {
			for(var j=0; j<opponent_pieces.length; j++) {
				var opponent_adjacents = this.getAllAdjacents( opponent_pieces[j][0], opponent_pieces[j][1] );
				var intersecting = this.getIntersection(opponent_adjacents, adjacents);
				var has_empty_adjacent_intersections = false;
				for (var f=0; f<intersecting.length; f++) {
					if(this.board[intersecting[f][0]][intersecting[f][1]] === BOARD_EMPTY) {
						has_empty_adjacent_intersections = true;
						break;
					}
				}
			}
		}
		if(has_empty_adjacent_intersections) {
			log("DANGER PP: "+type+" ---> "+pieces[i][0]+" - "+pieces[i][1]);
			danger_score += this.move_score_danger;
		}
	}
	
	log("DANGER: "+type+" ---> "+danger_score);
	
	return danger_score;
}

VirtualBoard.prototype.updateAfterMove = function(turn) 
{
	// rule: coins switch to either blue or red piece if surrounded by that color from 2 adjacent sides
	// check if any coin is adjacent to red or blue piece
	this.updateCoins();
	
	// rule: any piece surrounded by 2 opponent pieces on sides gets "captured"
	// rule: captured pieces are removed from board
	if(turn == "red") {
		this.checkCaptured(BOARD_BLUE);
		this.checkCaptured(BOARD_RED);
	} else {
		this.checkCaptured(BOARD_RED);
		this.checkCaptured(BOARD_BLUE);
	}
	
	// rule: pieces that reach the opposite end row will be frozen (can't be moved anymore) and count towards the player score
	// 
	// rule: if all pieces of any player are captured and/or reached end row the game is over 
	// rule: player with most pieces on the board wins
	this.updateFreeze();
	
	
	this.last_move_score -= this.getPiecesInDanger(BOARD_RED);
	this.last_move_score += this.getPiecesInDanger(BOARD_BLUE);
	
	// TODO
	/*
	var winner = checkGameOver();
	if(winner == "tie") {
		$(".board").removeClass("blue").removeClass("red").addClass("off");
		alert("IT'S A TIE!");
		startAudioWin();
		return;
	} else if(winner.length) {
		$(".board").removeClass("blue").removeClass("red").addClass(winner);
		alert((winner+" won!").toUpperCase());
		startAudioWin();
		return;
	}
	*/
}

VirtualBoard.prototype.updateFreeze = function() 
{
	// Convert red and blue pieces in the end rows to frozen pieces
	for (var c=0; c < board_size; c++) {
		// top row for blue
		if(this.board[0][c] === BOARD_BLUE) {
			this.freezePiece([0,c], BOARD_BLUE);
		}
	}
	for (var c=0; c < board_size; c++) {
		// bottom row for red
		if(this.board[board_size-1][c] === BOARD_RED) {
			this.freezePiece([board_size-1,c], BOARD_RED);
		}
	}
}

VirtualBoard.prototype.updateCoins = function() 
{
	var coins = this.getAllFromType(BOARD_COIN);
	for (var i=0; i < coins.length; i++) {
		var adjacents = this.getAllAdjacents( coins[i][0], coins[i][1] );
		var blue_adjacent = 0;
		var red_adjacent = 0;
		for (var k=0; k < adjacents.length; k++) {
			if(this.board[adjacents[k][0]][adjacents[k][1]] === BOARD_RED) red_adjacent++;
			if(this.board[adjacents[k][0]][adjacents[k][1]] === BOARD_BLUE) blue_adjacent++;
		}
		if(red_adjacent>=2) {
			this.replaceCoinWithType(coins[i], BOARD_RED);
			this.last_move_score += this.move_score_coin_red;
		}
		if(blue_adjacent>=2) {
			this.replaceCoinWithType(coins[i], BOARD_BLUE);
			this.last_move_score += this.move_score_coin_blue;
		}
	}
}
VirtualBoard.prototype.checkCaptured = function(type) 
{
	var pieces = this.getAllFromType(type);
	for (var i=0; i < pieces.length; i++) {
		var adjacents = this.getAllAdjacents( pieces[i][0], pieces[i][1] );
		var opponent_adjacent = 0;
		var opponent_type = (type===BOARD_RED)?BOARD_BLUE:BOARD_RED;
		for (var k=0; k < adjacents.length; k++) {
			if(this.board[adjacents[k][0]][adjacents[k][1]] === opponent_type) opponent_adjacent++;
		}
		if(opponent_adjacent >= 2) { 
			this.moveTrapped(pieces[i], type);
		}
	}
}

VirtualBoard.prototype.getIntersection = function(pieces_array_a, pieces_array_b) 
{
	var intersection = [];
	for (var i=0; i < pieces_array_a.length; i++) {
		for (var j=0; j < pieces_array_b.length; j++) {
			if(pieces_array_a[i][0] == pieces_array_b[j][0] && pieces_array_a[i][1] == pieces_array_b[j][1]) {
				intersection.push(pieces_array_a[i]);
			}
		};
	}
	return intersection;
}


VirtualBoard.prototype.print = function() 
{
	if(!ENABLE_BOARD_PRINT) return;
	var str = "";
	for (var i=0; i < this.board.length; i++) {
		str += (this.board[i].join(" | "));
		str += ("\n"+"----".repeat(board_size)+"\n");
	};
	log(str);
}

