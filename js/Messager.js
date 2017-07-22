var  messager = function (context,options) {	
	this.options = utils.extend({
		rect:{
			x : 20,
			y : 50,
			maxWidth : 50,
			fillStyle :"#00FFFF"
		},
		dead:{
			x : context.canvas.width/2.5,
			y : context.canvas.height/2,
			maxWidth : 400,
		    fillStyle :"#00FFFF"
		},
		operate:{
			x : context.canvas.width/3,
			y : context.canvas.height/2,
			maxWidth : 400,
		    fillStyle :"#00FFFF"
		}
	},options);
	baseDraw.apply(this,arguments);


	var that = this, opt = this.options;

	this.message = function(msg,configName){
		that.drawText(msg,opt[configName]);
	};
}
messager.prototype = Object.create(baseDraw.prototype); 
