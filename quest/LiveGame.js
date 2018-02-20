/************************************************************
	LiveGame class
	
	Maintains and manages the active board
*/


function LiveGame()
{
	this.activeBoard = new VirtualBoard();
	this.activeBoard.initBlankBoard();
	
	this.activeBoard.print(true);
	
	this.activeBoard.applyToHTMLBoard();
}

LiveGame.prototype.getBoard = function () 
{	
	return this.activeBoard;
}

LiveGame.prototype.commitAIMove = function (best_board) 
{
	this.activeBoard.copyFromBoard(best_board);
	this.activeBoard.applyToHTMLBoard();
}
LiveGame.prototype.updateAfterHumanMove = function () 
{	
	var moved_piece_type = (current_turn=="red") ? BOARD_RED : BOARD_BLUE;
	
	var piece = [parseInt($(start_drag_block).attr("id").split("_")[1]), parseInt($(start_drag_block).attr("id").split("_")[2])];
	var empty_block = [parseInt($(drop_block).attr("id").split("_")[1]), parseInt($(drop_block).attr("id").split("_")[2])];
	
	this.activeBoard.movePiece(piece, empty_block, current_turn);
}


