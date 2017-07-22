var rectFactory = function (context,options) {
	baseDraw.apply(this,arguments);
	//基本設置
	this.options = utils.extend({
		gameFullHeight:600,  //遊戲高度		
		gameFullWidth:1000,	//遊戲寬度
		gamePreDrawWidth: 300,//提前绘制的宽度

		rectMinWidth:80,		//柱子最小寬度
		rectMaxWidth:150,		//柱子最大寬度

		rectMinHeight: 300- 80,
		rectMaxHeight: 300 + 80,

		fixedSpacing:100,   //兩部分垂直之間的間距

		spaceingMin:50,		//水平最小間距
		spaceingMax:150,	//水平最大間距	

		horizontal:300, //水平線

		maxSkipHeight: 100, //最大跳高
		maxSkipWidth:100,    //最大跳寬

		limitWidth: Number.MAX_VALUE, //屏幕最大宽度

		speed : 1,  //速度4

		refreshMis: 10  //刷新间隔毫秒数
	},options);

	this.rects = [];
	this.movedX = 0;
	this.stopCallBack;
	this.drawCallBack;
	this.status = 1 ; //1运行，0暂停, -1 结束
	this.goneRect = -1;


	var that = this, opt = this.options, handler;
	var //rects = that.rects,
		rdBaseWidth = that.options.rectMaxWidth - that.options.rectMinWidth, //隨機寬度差值
		rdBaseHeight = that.options.rectMaxHeight - that.options.rectMinHeight, //隨機高度差值
		rdBaseSpacing = that.options.spaceingMax - that.options.spaceingMin; //隨機間距差值 

	//製作基本的Rects
	this.begin = function(){	
		that.status = 1;	
		that.goneRect = -1 ;
		that.rects = genarateRects(0,opt.gameFullWidth + opt.gamePreDrawWidth);		
		handler = window.requestAnimationFrame(drawRects);
	}

	//重置
	this.reset = function(){
		that.status = 1;
		that.rects = [];
		that.movedX = 0;
		that.goneRect = -1 ;
		//clearTimeout(timeOutId);
		window.cancelAnimationFrame(handler); 
	}

	//暂停
	this.pause = function(){
		this.status = 0;
	}

	//继续
	this.continue = function(){
		if(that.status != -1){
			that.status = 1;
			handler = window.requestAnimationFrame(drawRects);
		}
	}

	//绘制游戏屏幕的柱子
	function drawRects(){	

		//如果有上次的 timeout，清除
		//if(timeOutId != undefined){
		//	clearTimeout(timeOutId);
		//}
		
		var rect1,rect2;
		context.clearRect(0,0,opt.gameFullWidth,opt.gameFullHeight);
		context.save();
		for(var i =0 ; i < that.rects.length; i++){
			rect1 = utils.extend({}, that.rects[i][0]);
			rect2 = utils.extend({}, that.rects[i][1])

			//重新计算在canvas上的x坐标
			rect1.x  = rect2.x = rect1.x - that.movedX;			

			that.drawRect(rect1);
			that.drawRect(rect2);	
		}
		rect1 = rect2 = null;
		that.movedX += opt.speed;

		//单次绘制完毕的回调			
		if(that.drawCallBack instanceof Function){
			that.drawCallBack();
		}
		//正常绘制
		if(that.movedX < opt.limitWidth && that.status == 1 ){
			refreshRects();
			//timeOutId = setTimeout(drawRects,opt.refreshMis);
			handler =window.requestAnimationFrame(drawRects);
		}else{
			//死亡
			if(that.stopCallBack instanceof Function){
				that.stopCallBack();
			}
		}
	}

	// startX,起始坐标, width需要绘制的长度, 起始是否计算spacing	
	function genarateRects(startX,newWidth){

		var opt = that.options,
			rectParams = randomRectParams(),//随机的参数
			rs = [], //柱子列表
			rect ,	 //柱子，包含上下部分
			color,	//柱子颜色
			width, //宽度数	
			usedWith = 0 ,//已经使用的宽度
			firstRect;
		
		firstRect = startX == 0 ? true:false; //是不是第一个矩形

		if(firstRect){
			rectParams.spacing = 0;//第一個柱子spacing為零			
			width = context.canvas.width/3;
		}else{
			width = rectParams.width;
		}

		usedWith = startX + width  + rectParams.spacing;//已經使用的寬度

		while(usedWith <= startX + newWidth){		
			color = utils.randomColor();	
			rect = [];
			//上半部分
			rect.push({
				x:firstRect ? 0 : usedWith - rectParams.width,
				y:0,
				width:width,
				height: firstRect ? 0 :  rectParams.height,
				color:color
			});
			//下半部分
			rect.push({
				x:firstRect?0 : usedWith - rectParams.width,
				y:  firstRect ? context.canvas.height/2 : rectParams.height + opt.fixedSpacing, //上半部分高度 + 間隔
				width:width,
				height: firstRect ? context.canvas.height/2 :opt.gameFullHeight- rectParams.height - opt.fixedSpacing,
				color:color
			});
			rs.push(rect);

			rectParams = randomRectParams();
			width = rectParams.width;
			usedWith += rectParams.spacing + rectParams.width ;
			
			if(firstRect){
				firstRect = false;
			}
		}
		return rs;
	}

	//獲得柱子需要的隨機參數
	function randomRectParams(){		
		return {
			width: opt.rectMinWidth + Math.floor(  Math.random() * rdBaseWidth ), //隨機的長度
			height: opt.rectMinHeight + Math.floor(  Math.random() * rdBaseHeight ), //隨機的頂部高度
			spacing :  opt.spaceingMin + Math.floor(  Math.random() *rdBaseSpacing ) //隨機的間距
		}
	}

	//刷新柱子
	function refreshRects(){
		//删除出了游戏见面的柱子
		deleteRects();
		//重新绘制后面的新柱子
		appendRects();
	}

	//删除已经出了游戏界面的柱子
	function deleteRects(){		
		var rect , completed = false;
		rect = that.rects.shift();
		do {			
			//如果有柱子，并且柱子的 x坐标 + 宽度 与已经运动的x值之差小于0
			if(rect != undefined && rect[0].x + rect[0].width  - that.movedX < 0 ){
				that.goneRect += 1;
				//继续检查下一个柱子
				rect = that.rects.shift();
			}else{
				//标记检查完成，并且回收检查项
				completed = true;
				that.rects.unshift(rect);
			}
		}while(!completed);  
	}

	//创建新的柱子
	function appendRects(){
		if(that.rects.length > 0){
			var rect = that.rects[that.rects.length-1][0],
				x = rect.x,//x坐标
				newRects = genarateRects(x + rect.width,that.movedX + opt.gameFullWidth + opt.gamePreDrawWidth - x - rect.width);
			that.rects = that.rects.concat(newRects);
		}
	}

}
rectFactory.prototype = Object.create(baseDraw.prototype);