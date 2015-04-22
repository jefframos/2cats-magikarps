/*jshint undef:false */
var Coin = Entity.extend({
	init:function(vel, behaviour){
		this._super( true );
		this.updateable = false;
		this.deading = false;
		this.range = 80;
		this.width = 1;
		this.height = 1;
		this.type = 'coin';
		this.node = null;
		this.velocity.x = vel.x;
		this.velocity.y = vel.y;
		this.timeLive = 1000;
		this.power = 1;
		this.defaultVelocity = 1;
		this.imgSource = 'bullet.png';
		this.particleSource = 'bullet.png';
		this.rot = 0;
	},
	startScaleTween: function(){
		TweenLite.from(this.getContent().scale, 0.3, {x:0, y:0, ease:'easeOutBack'});
	},
	build: function(){

		// this.sprite = new PIXI.Sprite.fromFrame(this.imgSource);
		this.spriteBall = new PIXI.Graphics();
		this.spriteBall.beginFill(0xFFFFFF);
		var size = windowHeight * 0.05;
		this.spriteBall.drawRect(-size/2,-size/2,size,size);
		// this.spriteBall.drawCircle(0,0,windowHeight * 0.02);

		this.sprite = new PIXI.Sprite();
        this.sprite.addChild(this.spriteBall);

		// this.sprite.anchor.x = 0.5;
		// this.sprite.anchor.y = 0.5;

		this.updateable = true;
		this.collidable = true;

		this.getContent().alpha = 0.5;
		TweenLite.to(this.getContent(), 0.3, {alpha:1});
		
		this.collideArea = new PIXI.Rectangle(-50, -50, windowWidth + 100, windowHeight + 100);

		this.particlesCounterMax = 5;
        this.particlesCounter = 5;//this.particlesCounterMax *2;

	},
	update: function(){
		this.range = this.spriteBall.width / 2;
		this._super();
	},
	preKill:function(){
		if(this.invencible){
			return;
		}

		

		for (var i = 5; i >= 0; i--) {
			var particle = new Particles({x: Math.random() * 8 - 4, y:Math.random() * 8 - 4}, 120, this.particleSource, Math.random() * 0.05);
			particle.maxScale = this.getContent().scale.x / 2;
            particle.maxInitScale = particle.maxScale;
			particle.build();
			particle.getContent().tint = 0xf5c30c;
			particle.gravity = 0.3 * Math.random();
			particle.alphadecress = 0.04;
			particle.scaledecress = -0.05;
			particle.setPosition(this.getPosition().x - (Math.random() + this.getContent().width * 0.4) + this.getContent().width * 0.2,
                this.getPosition().y - (Math.random() + this.getContent().width * 0.4)+ this.getContent().width * 0.2);
			this.layer.addChild(particle);
		}
		this.collidable = false;
		this.kill = true;
	},
});