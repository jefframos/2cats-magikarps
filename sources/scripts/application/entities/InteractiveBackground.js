/*jshint undef:false */
var InteractiveBackground = Entity.extend({
	init:function(screen){
		this._super( true );
		this.screen = screen;
		this.container = new PIXI.DisplayObjectContainer();
		this.vecDots = [];
		this.accel = 0;
	},
	build: function(){
		var dist = 60;
		var _w = windowWidth / dist;
		var _h = windowHeight / dist;
		for (var i = 0; i < _w; i++) {
			for (var j = 0; j < _h; j++) {
				if(Math.random() > 0.2){
					var dot = new PIXI.Graphics();
					dot.beginFill(0xFFFFFF);
					dot.vel = 0.1 + Math.random() * 0.2;
					dot.drawRect(0,0,Math.ceil(5 * dot.vel), Math.ceil(8 * dot.vel));
					dot.position.x = dist * i + (Math.random()*dist) / 2;
					dot.position.y = dist * j + (Math.random()*dist) / 2;
					this.container.addChild(dot);
					dot.alpha = 0.5 * Math.random() + 0.3;
					dot.side = Math.random() < 0.5 ? 1 : -1;
					this.vecDots.push(dot);
				}
			}
		}

	},
	getContent: function(){
		return this.container;
	},
	update: function(){
		for (var i = this.vecDots.length - 1; i >= 0; i--) {
			this.vecDots[i].position.y += this.vecDots[i].vel + this.accel;
			this.vecDots[i].alpha += 0.01 * this.vecDots[i].side;
			if(this.vecDots[i].alpha <= 0 || this.vecDots[i].alpha >= 0.8){
				// this.vecDots[i].alpha = 0.6 * Math.random() + 0.3;
				this.vecDots[i].side *= -1;
			}
			if(this.vecDots[i].position.y > windowHeight + 60){
				this.vecDots[i].position.y = 0;

			}
		}
		// this._super();
	},
});