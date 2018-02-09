////// AUDIO Stuff //////

// A hack to make audio work on Safari Mobile, adapted from: 
// https://stackoverflow.com/questions/10951524/play-and-replay-a-sound-on-safari-mobile

function initAllAudio() 
{
	initAudioStart();
	initAudioMove();
	initAudioCapture();
	initAudioCoin();
	initAudioWin();
	initAudioFreeze();
	
	if(typeof Cookies.get('sound') != "undefined") {
		if(Cookies.get('sound') == "no") {
		    sound_enabled = false;
			updateVolumeIcon();
		}		
	}
}

function initAudioMove() {
    var audioMove = new Audio('assets/sounds/move.mp3');
    
    self.audioMove = audioMove;
    var startAudioMove = function(){
		if(!sound_enabled) return;
        self.audioMove.play();
        document.removeEventListener("touchstart", self.startAudioMove, false);
    }
    self.startAudioMove = startAudioMove;

    var pauseAudioMove = function(){
        self.audioMove.pause();
        self.audioMove.removeEventListener("play", self.pauseAudioMove, false);
    }
    self.pauseAudioMove = pauseAudioMove;
    document.addEventListener("touchstart", self.startAudioMove, false);
    self.audioMove.addEventListener("play", self.pauseAudioMove, false);
}
function initAudioFreeze() {
    var audioFreeze = new Audio('assets/sounds/freeze.mp3');
    
    self.audioFreeze = audioFreeze;
    var startAudioFreeze = function(){
 		if(!sound_enabled) return;
        self.audioFreeze.play();
        document.removeEventListener("touchstart", self.startAudioFreeze, false);
    }
    self.startAudioFreeze = startAudioFreeze;

    var pauseAudioFreeze = function(){
        self.audioFreeze.pause();
        self.audioFreeze.removeEventListener("play", self.pauseAudioFreeze, false);
    }
    self.pauseAudioFreeze = pauseAudioFreeze;
    document.addEventListener("touchstart", self.startAudioFreeze, false);
    self.audioFreeze.addEventListener("play", self.pauseAudioFreeze, false);
}
function initAudioCoin() {
    var audioCoin = new Audio('assets/sounds/coin.mp3');
    
    self.audioCoin = audioCoin;
    var startAudioCoin = function(){
		if(!sound_enabled) return;
        self.audioCoin.play();
        document.removeEventListener("touchstart", self.startAudioCoin, false);
    }
    self.startAudioCoin = startAudioCoin;

    var pauseAudioCoin = function(){
        self.audioCoin.pause();
        self.audioCoin.removeEventListener("play", self.pauseAudioCoin, false);
    }
    self.pauseAudioCoin = pauseAudioCoin;
    document.addEventListener("touchstart", self.startAudioCoin, false);
    self.audioCoin.addEventListener("play", self.pauseAudioCoin, false);
}
function initAudioWin() {
    var audioWin = new Audio('assets/sounds/win.mp3');
    
    self.audioWin = audioWin;
    var startAudioWin = function(){
		if(!sound_enabled) return;
        self.audioWin.play();
        document.removeEventListener("touchstart", self.startAudioWin, false);
    }
    self.startAudioWin = startAudioWin;

    var pauseAudioWin = function(){
        self.audioWin.pause();
        self.audioWin.removeEventListener("play", self.pauseAudioWin, false);
    }
    self.pauseAudioWin = pauseAudioWin;
    document.addEventListener("touchstart", self.startAudioWin, false);
    self.audioWin.addEventListener("play", self.pauseAudioWin, false);
}
function initAudioCapture() {
    var audioCapture = new Audio('assets/sounds/capture.mp3');
    
    self.audioCapture = audioCapture;
    var startAudioCapture = function(){
		if(!sound_enabled) return;
        self.audioCapture.play();
        document.removeEventListener("touchstart", self.startAudioCapture, false);
    }
    self.startAudioCapture = startAudioCapture;

    var pauseAudioCapture = function(){
        self.audioCapture.pause();
        self.audioCapture.removeEventListener("play", self.pauseAudioCapture, false);
    }
    self.pauseAudioCapture = pauseAudioCapture;
    document.addEventListener("touchstart", self.startAudioCapture, false);
    self.audioCapture.addEventListener("play", self.pauseAudioCapture, false);
}
function initAudioStart() {
    var audioStart = new Audio('assets/sounds/start.mp3');
    self.audioStart = audioStart;
    var startAudioStart = function(){
		if(!sound_enabled) return;
        self.audioStart.play();
        document.removeEventListener("touchstart", self.startAudioStart, false);
    }
    self.startAudioStart = startAudioStart;

    var pauseAudioStart = function(){
        self.audioStart.pause();
        self.audioStart.removeEventListener("play", self.pauseAudioStart, false);
    }
    self.pauseAudioStart = pauseAudioStart;
    document.addEventListener("touchstart", self.startAudioStart, false);
    self.audioStart.addEventListener("play", self.pauseAudioStart, false);
}
