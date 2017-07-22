var runner = function (context,rector,msger,options) {
	baseDraw.apply(this,arguments);
	this.options = utils.extend({
		speed:10, //水平速度
		vspeed:1.2,  //跳躍速度
		vdspeed:1*2 ,//下降速度
		rector:null,	  //背景繪製
		vheight:40,      //點擊一次跳躍的高度
		runnerImgSrc : 'img/runner.png',
	    'sounds' :'sounds'
	},options);

	this.rector = rector; //背景绘制
	this.msger = msger;  // 消息绘制
	this.x = 15; // runner的x坐標
	this.y = context.canvas.height / 2; //runner的y坐標
	this.horizontal = this.y;  //runner的水平線
	this.status  = 0;  //0 水平，1上升，-1下降
	this.clickCounter = 0 ; //可以兩次點擊，點擊技術，允許的值 1,2
	this.dead = false; //是否死亡
	this.width = 0;    //runner图片的宽度
	this.height = 0;   //runner图片的高度
	this.runnerImg = null; //runner图片
	this.centerX  = 0 ;    //runner中心ｘ
	this.centerY = 0;     //runner中心y
	// this.refreshMis = rector.options.refreshMis; 采用背景绘制后回调
	this.rate = 1;  //碰撞计算比例
	this.skipY = 0;  //起跳时y的值
	this.gameStatus = 0;  // -1 死亡 0暂停  1 游戏中
	this.sounder = new sounder(this.options.sounds);

	var that = this, opt = this.options;

	//跑啊跑
	this.run = function(){		
		//重置
		that.reset();		
		//设置参数
		that.dead = false;
		that.gameStatus = 1;
		rector.drawCallBack = function(){
			beginRun();
			if(that.gameStatus == 0){
				msger.message('J:跳跃 R:重新开始 P:暂停 C:继续游戏','operate');
			}
		}
		that.draw(opt.runnerImgSrc,15,context.canvas.height/2,function(){
			//获得图片,以及的高度和宽度
			that.runnerImage = getRunner().img;
			that.width = that.runnerImage.width;
			that.height = that.runnerImage.height;
			that.horizontal =  that.y = context.canvas.height / 2 - that.height;
			//开始,rector推动runner
			rector.begin();
		});
	}

	//重置
	this.reset = function (){
		rector.reset();
		that.status = 0;
		that.dead = false;
		that.gameStatus = 0;		
	}

	//暂停
	this.pause = function(){			
		that.gameStatus = 0;
		rector.pause();
	}

	//继续
	this.continue = function(){	
		if(that.gameStatus != -1){
			that.gameStatus = 1;
			rector.continue();
			beginRun();
		}else{
			rector.continue();
		}
	}

	//不停的跑	
	 function beginRun(){	
		//清除原來的runner
		context.clearRect(that.x,that.y,that.width,that.height);
		context.save();
		
		//重新繪製runner
		that.movedX += that.options.speed;	
		that.drawImage(that.runnerImage,that.x , that.y);
		that.msger.message(that.rector.goneRect <= 0 ? 0: that.rector.goneRect,"rect");  //已经过的柱子数目
		
		//活跃状态
		if( (that.gameStatus = checkStatus()) == 1){			
		
		}else{			
			rector.pause();
			rector.stopCallBack = function(){
				that.drawImage(that.runnerImage,that.x , that.y);
				that.msger.message(that.rector.goneRect <= 0 ? 0: that.rector.goneRect,"rect"); 
				if(that.gameStatus == -1){
					msger.message('成绩 ' + (that.rector.goneRect <= 0 ? '0' : that.rector.goneRect + '') + ' ,弱爆了！','dead');
				}
			}		
		}
	}

	//獲得runner的圖片
	function getRunner(){
		for(var p in that.images){
			return that.images[p];
		}
	}

	//1 跳躍，-1下降，0 或者在柱子上走
	//检查是否死亡
	function checkStatus(){
		//垂直方向的状态
		if(that.status != 0){
			//計算y值，上升減少y，下降增加y
			that.y += that.status == 1 ?  -1 * that.options.vspeed :that.options.vdspeed;		

			if(that.status == 1){
				that.status = Math.abs(that.y - that.skipY) > that.options.vheight ? -1: 1;
			}else if(that.status == -1){
				//that.status = 	Math.floor(that.y) == that.horizontal ? 0: -1;
			}
		}			
		
		//整个游戏的状态
		if(that.gameStatus != 1){
			return that.gameStatus;
		}
		//复制前两个柱子
		var ret = {},
			ked = 1,
		    testedRects = rector.rects.slice(0,2),
		    rectGroup,rectUp, rectDown;
		while(rectGroup = testedRects.shift()){
			rectUp = rectGroup[0];
			rectDown = rectGroup[1];
			//在runner的左侧或者右侧
			if(that.x +  rector.movedX > rectUp.x + rectUp.width ||  rector.movedX  + that.x + that.width < rectUp.x ){				
				continue;
			}
			//出 ：离开柱子
			if(Math.abs ( that.x  + rector.movedX  - rectDown.width - rectDown.x ) <= rector.options.speed * that.rate){
				//状态为下落
				if(that.status != 1){
					that.status = -1;
				}
				break;
			}			
			//入 ：进入柱子
			if( Math.abs(that.y + that.height - rectDown.y) <= rector.options.speed * that.rate ){
				//状态为水平
				that.status = 0;
				break;
			}
			//不在上下两个柱子之间
			if( !(that.y  > rectUp.y + rectUp.height && that.y + that.height < rectDown.y) ){
				ked = -1;
				break;
			}
		}
		return ked;		
	} 
	//控制器
	document.addEventListener('keydown', function(event) {		 	
	 	switch(event.keyCode )
	 	{
	 		case 67:  //C 继续
	 			that.continue();
	 			break;
	 		case  74 : // J跳跃	 	
	 			if(that.gameStatus == 0){
	 				that.continue();
	 			}	
	 			if(that.status != 1){
  					that.status = 1;
  					that.skipY = that.y;  					
  				}
  				that.sounder.play("skip");
  				break;
  			case 80: //P暂停
  				that.pause();
  				break;
  			case 82: //R重新开始
  				that.run();
  				break;
  			default:
  				break;
  			
	 	}	 	
	 	console.log(event.keyCode);
	 }, false);
}
runner.prototype = Object.create(baseDraw.prototype);
