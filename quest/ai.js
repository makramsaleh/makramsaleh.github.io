////// AI //////////////////////////////
// Assuming AI is playing RED

var AI = {
	playTurn: function () {
		new Analyzer().performBestMove();
		update();
	}
}

