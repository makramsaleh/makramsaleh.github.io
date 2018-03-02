/**
	Agent class
	analyzes game board and decides best moves and outcomes
*/
function Agent() {}

Agent.prototype.performBestMove = function()
{
	var html_board = ACTIVE_GAME.getBoard();
	var moves = html_board.getAllMovesFromType(BOARD_RED);
	
	for (var i=0; i < moves.length; i++) {
		moves[i][1].addReward(Math.random());
	}
	
	console.log(html_board.getGrid().printNodeRewards());
	
	// Sort moves by score
	moves.sort(rewardCompare).reverse();
	
	// If more than one move have the same reward, 
	// pick a random move from those
	var best_moves = [];
	var best_score = moves[0][1].getReward();
	for (var i=0; i < moves.length; i++) {
		if(Math.abs(moves[i][1].getReward() - best_score) < 0.008) {
			best_moves.push(moves[i]);
		}
	}
	shuffle(best_moves);
	
	console.log(">>> BEST REWARD: ");
	console.log(best_moves[0]);
	
	ACTIVE_GAME.commitAIMove(best_moves[0][0], best_moves[0][1]);
}

function rewardCompare(a, b) {
    if (a[1].getReward() === b[1].getReward()) {
        return 0;
    } else {
        return (a[1].getReward() < b[1].getReward()) ? -1 : 1;
    }
}


