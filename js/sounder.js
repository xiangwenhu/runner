var sounder = function(id) {
	
	this.sounds = {} ;

	var that = this;
	(function getSounds(){
		var soundEls = document.getElementById(id).children,
			len = soundEls.length,child;
		for( var i=0; i < len; i++){
			child = soundEls[i];
			that.sounds[child.id] = child;
		}
		soundEls = null;		
	})();


	this.play = function(soundName){
		if(typeof this.sounds[soundName] != "undefined"){
			this.sounds[soundName].play();
		}
	}
}