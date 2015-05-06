/*jshint undef:false */
var CrazyLogo = Entity.extend({
	init:function(screen){
		this._super( true );
		this.screen = screen;
		this.container = new PIXI.DisplayObjectContainer();
		this.title = 'EPILEPSY';
		this.vecLetters = [];
		this.tempCounter = 0;
		this.colorsCounter = 300;
	},
	build: function(){
		this.updateable = true;
		var before = 0;
		for (var i = 1; i <= this.title.length; i++) {
			// var tempText = new PIXI.Text(this.title[i], {align:'center',font:'48px Vagron',fill:'#FFFFFF', stroke});
			// tempText.resolution = retina;
			// tempText.position.x = i * 70 / tempText.resolution + 2;
			// tempText.position.y = 2;
			// this.container.addChild(tempText);

			tempText = new PIXI.Text(this.title[i - 1], {align:'center',font:'48px Vagron', fill:APP.vecColorsS[this.tempCounter], stroke:'#FFFFFF', strokeThickness:5});
			console.log(this.title[i - 1], tempText.width);
			// tempText = new PIXI.Text(this.title[i], {align:'center',font:'48px Vagron', fill:APP.vecColorsS[this.tempCounter]});//, stroke:'#FFFFFF', strokeThickness:3});
			tempText.resolution = 2;
			tempText.sin = i * 0.5;
			tempText.position.x =this.container.width + before / 4 - 35 / 2;
			tempText.position.y = Math.sin(tempText.sin) * 10;
			console.log(tempText.position.y);
			this.container.addChild(tempText);

			before = tempText.width;
			this.vecLetters.push(tempText);
			this.tempCounter ++;
			if(this.tempCounter >= APP.vecColorsS.length){
				this.tempCounter = 0;
			}
		}
	},
	getContent: function(){
		return this.container;
	},
	update: function(){
		if(!this.updateable){
			return;
		}
		console.log('update here');
		var changeColors = false;
		this.colorsCounter --;
		if(this.colorsCounter < 0){
			changeColors = true;
			this.colorsCounter = 200;
		}
		for (var i = 0; i < this.vecLetters.length; i++) {
			// console.log(this.tempCounter);
			this.vecLetters[i].position.y = Math.sin(this.vecLetters[i].sin += 0.25) * 10;
			if(changeColors || Math.random() < 0.05){
				this.tempCounter ++;//Math.floor(Math.random() * APP.vecColorsS.length);
				if(this.tempCounter >= APP.vecColorsS.length){
					this.tempCounter = 0;
				}
				this.vecLetters[i].setStyle({align:'center',font:'48px Vagron', fill:APP.vecColorsS[this.tempCounter], stroke:'#FFFFFF', strokeThickness:5});
			}
			// this.vecLetters[i].setStyle({align:'center',font:'48px Vagron', fill:APP.vecColorsS[this.tempCounter]});//, stroke:'#FFFFFF', strokeThickness:3});
		}
	},
});