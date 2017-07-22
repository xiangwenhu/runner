(function() {

	
	window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	window.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame|| window.msCancelAnimationFrame;

	var canvasElement = document.getElementById("programerRun"),
    context = canvasElement.getContext("2d"),
    
    rector = new rectFactory(context),
	msger = new messager(context),
	rner = new runner(context,rector,msger,{
		runnerImgSrc : "img/runner.png"
	});
	rner.run();	
	rner.pause();

})();