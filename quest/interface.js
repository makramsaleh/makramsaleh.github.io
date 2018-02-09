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
	
	// Sound toggle
	$("#btn_toggle_sound").click(function() {
		sound_enabled = !sound_enabled;
		updateVolumeIcon();
		Cookies.set("sound", sound_enabled?"yes":"no");
		console.log(Cookies.get("sound"));
	});
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

function updateVolumeIcon() 
{
	if(sound_enabled) {
		$("#btn_toggle_sound i").text("volume_up");
	} else {
		$("#btn_toggle_sound i").text("volume_off");
	}
}
