/**
	Agent class
	analyzes game board and decides best moves and outcomes
*/
function Agent() {}

Agent.prototype.performBestMove = function()
{
	console.log("******************************************");
	var html_board = ACTIVE_GAME.getBoard();
	var moves = html_board.getAllMovesFromType(BOARD_RED);
	var unique_next_nodes = []; // get all possible empty blocks that red can move to
	
    html_board.calculateAllRewards();
	
	console.log(html_board.getGrid().printNodeRewards());
	
	// Sort moves by score to move to positions with lowest score
	moves.sort(rewardCompare);
	
	// pick a random move from the top 3
	var best_moves = moves.slice(0, Math.min(moves.length, 3));
	shuffle(best_moves);
	
	//console.log(">>> PICKED MOVE: ");
	//console.log(best_moves[0]);
	
	ACTIVE_GAME.commitAIMove(best_moves[0][0], best_moves[0][1]);
}

function rewardCompare(a, b) {
    if (a[1].getReward() === b[1].getReward()) {
        return 0;
    } else {
        return (a[1].getReward() < b[1].getReward()) ? -1 : 1;
    }
}


