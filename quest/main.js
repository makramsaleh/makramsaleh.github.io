var board_size = 6;
var moves_red = 0;
var moves_blue = 0;
var self = this;

var sound_enabled = true;
var against_AI = false;
var game_mode = "wall";

var ENABLE_CONSOLE_LOG = true;
var ENABLE_BOARD_PRINT = false;

// Easter eggs mode
var max_eggs = 8;
var min_eggs = 2;

var anim_speed = 200;

// Start with a random turn
var current_turn = Math.random()>.5?"red":"blue";
var ACTIVE_GAME;

var start_drag_block;
var drop_block;

// Board piece codes
var BOARD_EMPTY = 		"8";
var BOARD_RED = 		"1";
var BOARD_BLUE =  		"2";
var BOARD_COIN = 		"3";
var BOARD_FIXED_RED = 	"4";
var BOARD_FIXED_BLUE = 	"5";



$(function() {
	
	initAllAudio();
	
	initInteractions();
	
	showPopup("#popup_newgame");
});

function resetGame() 
{
	drawBoardBlocks();
	
	ACTIVE_GAME = new LiveGame();

	switchTurn();
	
	startAudioStart();
}


function switchTurn() 
{
	current_turn = current_turn=="blue"?"red":"blue";
	
	$(".turnstrip").css({"opacity":0});	
	$(".turnstrip."+current_turn).css({"opacity":1});
	
	$(".piece").draggable();
	$(".piece").draggable("destroy");
	$(".piece."+current_turn).draggable({
		start: function(){
			start_drag_block = $(this).parent();
			var ad = getAdjacentBlocks($(this).parent());
			$.each(ad, function(j,e) { 
				if(!$(e).has(".piece").length && !$(e).has(".coin").length) { $(e).addClass("active"); }
			});
			// raise dragged piece above all others
			$(".block").css({"z-index":100});
			$(this).parent().css({"z-index":3000});
		},
		stop: function () 
		{
			$(this).css({top:0,left:0});
			$(".active").removeClass("active");
		}
	});
	
	if(current_turn == "red" && against_AI) AI.playTurn();
}

function replaceCoin(coin, piece_color) 
{
	var p = $('<div class="piece '+piece_color+'"></div>');
	p.prependTo($(coin).parent());
	
	$(coin).toggle("drop", function() {$(this).remove()});
	$(p).hide().toggle("drop", {direction:"right"});
	
	startAudioCoin();
}

function replaceCaptured(piece) 
{
	log("replaceCaptured------------------");
	var captured = $(piece).clone()
	$(captured).removeClass("piece").addClass("captured").appendTo(".cage").hide().toggle("drop", {direction:"right"});
	$(piece).toggle("drop", function() {$(this).remove()});
	startAudioCapture();
}

function update() 
{	
	if(current_turn == "red") moves_red++;
	if(current_turn == "blue") moves_blue++;
	
	if(current_turn=="blue" || (current_turn=="red" && !against_AI)) {
		
		// Update active game virtual board
		ACTIVE_GAME.updateAfterHumanMove();
		
	}
	
	var winner = checkGameOver();
	if(winner == "tie") {
		$(".board").removeClass("blue").removeClass("red").addClass("off");
		showWinnerPopup("IT'S A TIE!");
		startAudioWin();
		return;
	} else if(winner.length) {
		$(".board").removeClass("blue").removeClass("red").addClass(winner);
		showWinnerPopup(winner+" wins!");
		startAudioWin();
		return;
	}
	
	switchTurn();
}

function checkGameOver() 
{
	// TODO what if last piece was trapped between 3 coins and opponent => no more possible moves
	
	var pieces_red = $(".piece.red").length;
	var frozen_red = $(".red-fixed").length;
	var pieces_blue = $(".piece.blue").length;
	var frozen_blue = $(".blue-fixed").length;
	
	// rule: only check winners when both players played same number of moves or when both 
	//       players have no more unfrozen pieces 
	// rule: red wins if all blue pieces are captured and red frozen and active are more than blue frozen
	// rule: red wins also if all pieces of red are frozen and are more than blue frozen pieces, even if 
	//       blue still has unfrozen pieces
	
	// Do nothing if both players still have free (unfrozen) pieces
	if(pieces_red && pieces_blue) {
		return false;
	}
	
	// ...now we know at least one of the players don't have free pieces,
	//    let's check if both played the same number of moves and can still play
	var red_can_play = (pieces_red>0) && moves_red<moves_blue && current_turn=="blue";
	var blue_can_play = (pieces_blue>0) && moves_blue<moves_red && current_turn=="red";
	if(red_can_play || blue_can_play) {
		return false;
	}
	
	// ...now we know that both players played the same number of moves. Let's check if we have a tie
	// TIE
	if( (!pieces_blue && !pieces_red) && (frozen_red == frozen_blue) ) {
		return "tie";
	}
	
	//...now that we know it's not a tie, let's see who won
	
	// red wins
	if(  (!pieces_blue && (frozen_red+pieces_red > frozen_blue)) || (!pieces_red && frozen_red>frozen_blue)  ) {
		return "red";
	}
	// blue wins
	if(  (!pieces_red && (frozen_blue+pieces_blue > frozen_red)) || (!pieces_blue && frozen_blue>frozen_red)  ) {
		return "blue";
	}
	
	return false;
}

function checkCaptured(color) 
{
	$(".piece."+color).each(function() {
		var ad = getAdjacentBlocks($(this).parent());
		var opponent_adjacent = 0;
		$.each(ad, function(j,e) { 
			if($(e).find(".piece."+(color=="blue"?"red":"blue")).length) opponent_adjacent++;
		});
		if(opponent_adjacent>=2) { 
			replaceCaptured(this);			
		}
	});
}

function getAdjacentBlocks(block) 
{
	// Get all adjacent blocks (cross)
	
	if(!$(block).hasClass("block")) return;
	
	var block_id = $(block).attr("id");
	var block_row = parseInt(block_id.split("_")[1]);
	var block_col = parseInt(block_id.split("_")[2]);
	
	var adjacents = [];
	
	// top & bottom
	var tr = block_row-1;
	if(tr >= 0) adjacents.push($("#b_"+tr+"_"+block_col));
	var br = block_row+1;
	if(br < board_size) adjacents.push($("#b_"+br+"_"+block_col));
	
	// left & right
	var c = block_col+1;
	if(c < board_size) adjacents.push($("#b_"+block_row+"_"+c));
	var c = block_col-1;
	if(c >= 0) adjacents.push($("#b_"+block_row+"_"+c));
	
	return adjacents;
}
function getDiaginalBlocks(block) 
{
	// Get all adjacent blocks (X)
	var block_id = $(block).attr("id");
	var block_row = parseInt(block_id.split("_")[1]);
	var block_col = parseInt(block_id.split("_")[2]);
	
	var adjacents = [];
	
	// top
	var tr = block_row-1;
	if(tr >= 0) {
		// left
		var bc = block_col-1;
		if(bc >= 0) adjacents.push($("#b_"+tr+"_"+bc));
		// right
		var bc = block_col+1;
		if(bc < board_size) adjacents.push($("#b_"+tr+"_"+bc));
	}
	
	// bottom
	var tr = block_row+1;
	if(tr < board_size) {
		// left
		var bc = block_col-1;
		if(bc >= 0) adjacents.push($("#b_"+tr+"_"+bc));
		// right
		var bc = block_col+1;
		if(bc < board_size) adjacents.push($("#b_"+tr+"_"+bc));
	}
	
	return adjacents;
}

function drawBoardBlocks() 
{
	$(".board *").remove();
	$(".cage *").remove();
	
	var col = -1;
	var row = 0;
	var odd = false;
	
	// reset moves
	moves_red = 0;
	moves_blue = 0;
	
	// board
	for (var i=0; i < board_size*board_size; i++) {
		col++; if(col == board_size) { col=0; row++; }
		
		var b = $('<div class="block" id="b_'+row+'_'+col+'"></div>').addClass(odd?"odd":"");
		b.appendTo(".board");
		if(col!=board_size-1) odd = !odd;	//checkboard
	}
	$(".board").width(board_size*50).height(board_size*50);
	
	// Drop events
	$(".block").droppable({
	  drop: function(event, ui) {
		if(getIfDropTargetIsValid( $(ui.draggable), $(this) )) {
			drop_block = this;
			$(ui.draggable).prependTo(this);
			startAudioMove();
			update();
		}
      }
    });
}


function getIfDropTargetIsValid(piece, droppable) 
{
	// check if it's a block
	if(!$(droppable).hasClass("block")) return false;
	// check if it's empty
	if($(droppable).has(".piece").length) return false;
	if($(droppable).has(".coin").length) return false;
	
	var piece_parent_id = $(piece).parent().attr("id");
	var piece_row = parseInt(piece_parent_id.split("_")[1]);
	var piece_col = parseInt(piece_parent_id.split("_")[2]);
	
	var droppable_row = parseInt($(droppable).attr("id").split("_")[1]);
	var droppable_col = parseInt($(droppable).attr("id").split("_")[2]);
	
	//log(droppable_row+"   "+piece_row+" --- "+droppable_col+"  "+piece_col);
	
	// Allow dropping on top, bottom or sides
	if(droppable_row==piece_row && droppable_col==piece_col-1) return true;
	if(droppable_row==piece_row && droppable_col==piece_col+1) return true;
	if(droppable_row==piece_row+1 && droppable_col==piece_col) return true;
	if(droppable_row==piece_row-1 && droppable_col==piece_col) return true;
	
	return false;
}

function getLastRowBlocks(player_color) 
{
	var blocks = [];
	var rowc = player_color=="red"?board_size-1:0;
	for (var i=0; i < board_size; i++) {
		blocks.push($("#b_"+rowc+"_"+i));
	}
	return blocks;
}

function isBlockEmpty(block) 
{
	return (!$(block).has(".piece").length && !$(block).has(".coin").length);
}

