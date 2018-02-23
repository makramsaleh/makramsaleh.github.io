
/************************************************************
	Analyzer class
	analyzes game board and decides best moves and outcomes
*/
function Analyzer() {	
}

Analyzer.prototype.performBestMove = function() 
{
	var html_board = ACTIVE_GAME.getBoard();
	
	log("HTML Board");
	html_board.print();
	
	var moves = html_board.getAllMovesFromType(BOARD_RED);
	
	for (var i=0; i < moves.length; i++) {
		var piece = moves[i][0];
		var empty_block = moves[i][1];
		log("form - to:");
		log(piece);
		log(empty_block);
		
		var move_board = new VirtualBoard();
		move_board.copyFromBoard(html_board);
		move_board.movePiece(piece, empty_block, ACTIVE_GAME.getCurrentTurn());
		moves[i][2] = move_board.getLastMoveScore();
		moves[i][3] = move_board;
		log("OPTION:");
		move_board.print();
	};
	
	// Sort moves by score
	moves.sort(scoreCompare).reverse();
	
	// If more than one move have the same score, pick a random move from those
	var best_moves = [];
	var best_score = moves[0][2];
	for (var i=0; i < moves.length; i++) {
		if(Math.abs(moves[i][2] - best_score) < 8) {
			best_moves.push(moves[i]);
		}
	}
	shuffle(best_moves);
	
	// Update HTML board 
	log("BEST MOVE:");
	log("score: "+best_moves[0][2]);
	move_board.print();
	ACTIVE_GAME.commitAIMove(best_moves[0][3]);
}

function scoreCompare(a, b) {
    if (a[2] === b[2]) {
        return 0;
    } else {
        return (a[2] < b[2]) ? -1 : 1;
    }
}

