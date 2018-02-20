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


