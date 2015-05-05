/*jshint undef:false */
var CrazyLogo = Entity.extend({
	init:function(screen){
		this._super( true );
		this.screen = screen;
		this.container = new PIXI.DisplayObjectContainer();
		this.title = 'EPILEPSY';
		this.vecLetters = [];
		this.tempCounter = 0;
		this.colorsCounter = 3;
	},
	build: function(){
		for (var i = 0; i < this.title.length; i++) {
			console.log(this.title[i]);
			// var tempText = new PIXI.Text(this.title[i], {align:'center',font:'48px Vagron',fill:'#FFFFFF', stroke});
			// tempText.resolution = retina;
			// tempText.position.x = i * 70 / tempText.resolution + 2;
			// tempText.position.y = 2;
			// this.container.addChild(tempText);

			tempText = new PIXI.Text(this.title[i], {align:'center',font:'48px Vagron', fill:APP.vecColorsS[this.tempCounter], stroke:'#FFFFFF', strokeThickness:5});
			// tempText = new PIXI.Text(this.title[i], {align:'center',font:'48px Vagron', fill:APP.vecColorsS[this.tempCounter]});//, stroke:'#FFFFFF', strokeThickness:3});
			tempText.resolution = retina;
			tempText.position.x = i * 17 * tempText.resolution;
			this.container.addChild(tempText);


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
		this.colorsCounter --;
		if(this.colorsCounter > 0){
			return;
		}
		this.colorsCounter = 3;
		for (var i = 0; i < this.vecLetters.length; i++) {
			// console.log(this.tempCounter);
			this.vecLetters[i].setStyle({align:'center',font:'48px Vagron', fill:APP.vecColorsS[this.tempCounter], stroke:'#FFFFFF', strokeThickness:5});
			// this.vecLetters[i].setStyle({align:'center',font:'48px Vagron', fill:APP.vecColorsS[this.tempCounter]});//, stroke:'#FFFFFF', strokeThickness:3});
			this.tempCounter = Math.floor(Math.random() * APP.vecColorsS.length);
			if(this.tempCounter >= APP.vecColorsS.length){
				this.tempCounter = 0;
			}
		}
	},
});