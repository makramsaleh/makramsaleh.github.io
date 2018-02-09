function initInteractions() 
{
	$("#btn_pause").click(function() {
		showPopup("#popup_pause");
	});
	
	$("#newgame_1player").click(function() {
		against_AI = true;
		resetGame();
		hidePopup();
	});
	$("#newgame_2players").click(function() {
		against_AI = false;
		resetGame();
		hidePopup();
	});
	
	$("#btn_playagain").click(function() { showPopup("#popup_newgame"); });
	$("#btn_replay").click(function() { showPopup("#popup_newgame"); });
	$("#btn_continue").click(function() { hidePopup(); });
}

function showWinnerPopup(message) 
{
	$("#popup_winner h1").html(message);
	showPopup("#popup_winner");
}

function hidePopup() 
{
	$(".popup").fadeOut();
	$(".dim").fadeOut();
}
function showPopup(content_id) 
{
	$(".popup .popupcontent").hide();
	$(content_id).show();
	$(".popup").fadeIn();
	$(".dim").fadeIn(500);
}
