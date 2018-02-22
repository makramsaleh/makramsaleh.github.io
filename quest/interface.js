function initInteractions() 
{
	$("#btn_pause").click(function() {
		showPopup("#popup_pause");
	});
	
	$("#newgame_1player").click(function() {
		HTMLInterface.resetGame(true);
		hidePopup();
	});
	$("#newgame_2players").click(function() {
		HTMLInterface.resetGame(false);
		hidePopup();
	});
	
	// Game modes
	$("#mode_wall").click(function() {
		game_mode = "wall";
		$(".selected").removeClass("selected");
		$(this).addClass("selected");
	});
	$("#mode_easter").click(function() {
		game_mode = "easter";
		$(".selected").removeClass("selected");
		$(this).addClass("selected");
	});
	$("#mode_diamond").click(function() {
		game_mode = "diamond";
		$(".selected").removeClass("selected");
		$(this).addClass("selected");
	});
	
	$("#btn_playagain").click(function() { showPopup("#popup_newgame"); });
	$("#btn_replay").click(function() { showPopup("#popup_newgame"); });
	$("#btn_continue").click(function() { hidePopup(); });
	
	// Sound toggle
	$("#btn_toggle_sound").click(function() {
		sound_enabled = !sound_enabled;
		updateVolumeIcon();
		Cookies.set("sound", sound_enabled?"yes":"no");
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
