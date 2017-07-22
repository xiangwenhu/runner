var baseDraw = function(context){	
	this.context = context;  //canvas 2d上下文
	this.images= {};	//存儲的圖片信息
};
baseDraw.prototype  = {	
	  //通過圖片url繪製圖片
	  draw :function(imgSrc,x,y,callback){
		var that = this;
		x = x? x :0;
		y= y ? y : 0;
		var that = this;
		var img =  document.createElement("img");			
		img.src = imgSrc;
		that.images[imgSrc] = {img:img,loaded:false};
		img.onload = function(ev){
			that.drawImage(img,x,y,callback);
		}						
	},
	//通過圖片繪製圖片
	drawImage:function(img,x,y,callback){
		var that = this;
		that.images[img.src] = {img:img,loaded:true};
		that.context.drawImage(img,x,y);
		if(callback instanceof Function){
			callback();
		}
	},
	//绘制文本
	drawText:function(txt,options){
		var that = this;
		var opt = utils.extend({
			x:0,
			y:0,
			font:"30px Courier New",
			fillStyle :"blue",
			maxWidth:50
		},options);
		that.context.font = opt.font;
   		 //设置字体填充颜色
    	that.context.fillStyle = opt.fillStyle;
    	//从坐标点(x,y)开始绘制文字
    	that.context.fillText(txt, opt.x, opt.y,opt.maxWidth);
	},
	//绘制单个矩形
	drawRect :function(rectInfo){
		var that = this;
		that.context.fillStyle= rectInfo.color;  //填充的颜色
		that.context.strokeStyle="000";  //边框颜色
		that.context.linewidth=10;  //边框宽
		that.context.fillRect(rectInfo.x,rectInfo.y,rectInfo.width,rectInfo.height);  //填充颜色 x y坐标 宽 高
		that.context.strokeRect(rectInfo.x,rectInfo.y,rectInfo.width,rectInfo.height);  //填充边框 x y坐标 宽 高
	}
};