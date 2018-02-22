/************************************************************
	VirtualGame class
	
	Maintains and manages the active board
*/


function VirtualGame()
{
	this.moves_red;			// Int
	this.moves_blue;		// Int
	this.current_turn;		// String
	this.active_board;		// VirtualBoard
	this.against_AI;		// Boolean
	this.updates_html;		// Boolean
}

VirtualGame.prototype.startNewGame = function (against_AI, updates_html) 
{	
	this.current_turn = Math.random()>.5?"red":"blue";
	this.moves_red = 0;
	this.moves_blue = 0;
	this.against_AI = against_AI;
	this.active_board = new VirtualBoard();
	this.active_board.initBlankBoard();
	this.updates_html = updates_html;
	
	if(this.updates_html) {
		this.active_board.applyToHTMLBoard();		
	}
	
	this.switchTurn();
}

VirtualGame.prototype.getBoard = function () 
{	
	return this.active_board;
}
VirtualGame.prototype.getCurrentTurn = function () 
{	
	return this.current_turn;
}
VirtualGame.prototype.checkGameOver = function () 
{	
	return this.active_board.getWinner();
}

VirtualGame.prototype.switchTurn = function () 
{
	this.current_turn = this.current_turn=="blue"?"red":"blue";
	if(this.updates_html) {
		HTMLInterface.updateAfterTurnSwitch();
	}
	
	// TODO 
	// check if current player is trapped 
	// 	    if both player played the same number of moves, declare the other as winner, otherwise
	// 	    pass the turn to the next player
	// 
	// moves_red
	// moves_blue
	//var possible_moves_red = this.getAllMovesFromType(BOARD_RED).length;
	//var possible_moves_blue = this.getAllMovesFromType(BOARD_BLUE).length;
	
	
	if(this.current_turn == "red" && this.against_AI) {
		AI.playTurn();
	}
	
}
VirtualGame.prototype.updateAfterMove = function () 
{	
	if(this.current_turn == "red") this.moves_red++;
	if(this.current_turn == "blue") this.moves_blue++;
	
	var winner = ACTIVE_GAME.checkGameOver();
	if(winner !== false) {
		HTMLInterface.performGameOverCeremony(winner);
	} else {
		this.switchTurn();		
	}
}
VirtualGame.prototype.commitAIMove = function (best_board) 
{
	this.active_board.copyFromBoard(best_board);
	if(this.updates_html) this.active_board.applyToHTMLBoard();

	this.updateAfterMove();
}
VirtualGame.prototype.commitHumanMove = function (piece, empty_block) 
{	
	var moved_piece_type = (this.current_turn=="red") ? BOARD_RED : BOARD_BLUE;
	
	this.active_board.movePiece(piece, empty_block, this.current_turn);
	this.active_board.applyToHTMLBoard();

	this.updateAfterMove();
}


