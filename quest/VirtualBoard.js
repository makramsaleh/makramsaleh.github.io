
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
	
	var all_reds = this.getAllFromType(1);
	
	// find all empty adjacents to all reds
	for (var i=0; i < all_reds.length; i++) {
		var adjacents = this.getAllAdjacents(all_reds[i][0], all_reds[i][1]);
		// find only empty ones
		for (var k=0; k < adjacents.length; k++) {
			if(this.board[adjacents[k][0]][adjacents[k][1]] === 8) {
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

VirtualBoard.prototype.copyHTMLBoard = function() {
	for (var r=0; r < board_size; r++) {
		var row = [];
		for (var c=0; c < board_size; c++) {
			var block = $("#b_"+r+"_"+c);
			var piece = 8;
			if(block.has(".piece.red").length) piece = 1;
			if(block.has(".piece.blue").length) piece = 2;
			if(block.has(".coin").length) piece = 3;
			if(block.has(".piece.red-fixed").length) piece = 4;
			if(block.has(".piece.blue-fixed").length) piece = 5;
			
			row.push(piece);
		}
		this.board.push(row);
	}
	// Copy cagged pieces
	var self = this;
	$(".cage .captured").each(function(i,e) {
		self.cage.push($(e).hasClass("red")?1:2);
	});
}

VirtualBoard.prototype.applyToHTMLBoard = function() {
	for (var r=0; r < board_size; r++) {
		for (var c=0; c < board_size; c++) {
			var block = $("#b_"+r+"_"+c);
			var piece = this.board[r][c];

			var piece_class = "";
			switch (piece) {
				case 1:
					piece_class = "piece red";
				break;
				case 2:
					piece_class = "piece blue";
				break;
				case 3:
					piece_class = "coin";
				break;
				case 4:
					piece_class = "piece red-fixed";
				break;
				case 5:
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
		var pclass = this.cage[i]===1?"red captured":"blue captured";
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
	this.board[piece[0]][piece[1]] = 8;
	
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
	this.board[piece_block[0]][piece_block[1]] = (type===1 ? 4 : 5);
	this.last_move_score += (type===1)?this.move_score_freeze:0;
}
VirtualBoard.prototype.moveTrapped = function(piece_block, type) 
{
	this.board[piece_block[0]][piece_block[1]] = 8;
	this.cage.push(type);
	this.last_move_score += (type===1)?this.move_score_trap_red:this.move_score_trap_blue;
}
VirtualBoard.prototype.getPiecesInDanger = function(type) 
{
	// Checks which pieces are close to being captured
	// Find the peices that has adjacent opponent, and for those check if any 
	// opponent piece have common adjacents (which means that the opponent might 
	// trap this piece in one move)
	var pieces = this.getAllFromType(type);
	var opponent_type = type===1?2:1;
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
					if(this.board[intersecting[f][0]][intersecting[f][1]] === 8) {
						has_empty_adjacent_intersections = true;
						break;
					}
				}
			}
		}
		if(has_empty_adjacent_intersections) {
			console.log("DANGER PP: "+type+" ---> "+pieces[i][0]+" - "+pieces[i][1]);
			danger_score += this.move_score_danger;
		}
	}
	
	console.log("DANGER: "+type+" ---> "+danger_score);
	
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
		this.checkTrapped(2);
		this.checkTrapped(1);
	} else {
		this.checkTrapped(1);
		this.checkTrapped(2);
	}
	
	// rule: pieces that reach the opposite end row will be frozen (can't be moved anymore) and count towards the player score
	// 
	// rule: if all pieces of any player are captured and/or reached end row the game is over 
	// rule: player with most pieces on the board wins
	this.updateFreeze();
	
	
	this.last_move_score -= this.getPiecesInDanger(1);
	this.last_move_score += this.getPiecesInDanger(2);
	
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
		if(this.board[0][c] === 2) {
			this.freezePiece([0,c], 2);
		}
	}
	for (var i=0; i < board_size; i++) {
		// bottom row for red
		if(this.board[board_size-1][c] === 1) {
			this.freezePiece([board_size-1,c], 1);
		}
	}
}

VirtualBoard.prototype.updateCoins = function() 
{
	var coins = this.getAllFromType(3);
	for (var i=0; i < coins.length; i++) {
		var adjacents = this.getAllAdjacents( coins[i][0], coins[i][1] );
		var blue_adjacent = 0;
		var red_adjacent = 0;
		for (var k=0; k < adjacents.length; k++) {
			if(this.board[adjacents[k][0]][adjacents[k][1]] === 1) red_adjacent++;
			if(this.board[adjacents[k][0]][adjacents[k][1]] === 2) blue_adjacent++;
		}
		if(red_adjacent>=2) {
			this.replaceCoinWithType(coins[i], 1);
			this.last_move_score += this.move_score_coin_red;
		}
		if(blue_adjacent>=2) {
			this.replaceCoinWithType(coins[i], 2);
			this.last_move_score += this.move_score_coin_blue;
		}
	}
}
VirtualBoard.prototype.checkTrapped = function(type) 
{
	var pieces = this.getAllFromType(type);
	for (var i=0; i < pieces.length; i++) {
		var adjacents = this.getAllAdjacents( pieces[i][0], pieces[i][1] );
		var opponent_adjacent = 0;
		var opponent_type = (type===1)?2:1;
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
	var str = "";
	for (var i=0; i < this.board.length; i++) {
		str += (this.board[i].join(" | "));
		str += ("\n______________________\n");
	};
	console.log(str);
}

