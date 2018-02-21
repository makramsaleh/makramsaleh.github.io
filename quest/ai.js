////// AI //////////////////////////////
// Assuming AI is playing RED

var AI = {
	playTurn: function () {
		setTimeout(function() {
			new Analyzer().performBestMove();			
		}, 400);
	}
}

