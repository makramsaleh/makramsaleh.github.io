function initInteractions() 
{
	$(".reload").click(function() {
		if(confirm("Restart game?")) showPopup("#popup_newgame");
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
