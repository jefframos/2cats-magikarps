/*jshint undef:false */
var Ball = Entity.extend({
	init:function(vel, screen){
		this._super( true );
		this.updateable = false;
		this.deading = false;
		this.screen = screen;
		this.range = 80;
		this.width = 1;
		this.height = 1;
		this.type = 'bullet';
		this.target = 'enemy';
		this.fireType = 'physical';
		this.node = null;
		this.velocity.x = vel.x;
		this.velocity.y = vel.y;
		this.power = 1;
		this.defaultVelocity = 1;
		
		this.imgSource = 'bullet.png';
		this.particleSource = 'bullet.png';//APP.appModel.currentBurguerlModel.imgSrc;
		// this.defaultVelocity.y = vel.y;
		//console.log(bulletSource);
	},
	startScaleTween: function(){
		TweenLite.from(this.getContent().scale, 0.3, {x:0, y:0, ease:'easeOutBack'});
	},
	build: function(){

		this.spriteBall = new PIXI.Sprite.fromFrame(this.imgSource);
		this.sprite = new PIXI.Sprite();
        this.sprite.addChild(this.spriteBall);
        this.spriteBall.anchor.x = 0.5;
		this.spriteBall.anchor.y = 0.5;

		this.sprite.anchor.x = 0.5;
		this.sprite.anchor.y = 0.5;
		
		// console.log(this.range);
		this.updateable = true;
		this.collidable = true;

		this.getContent().alpha = 0.1;
		TweenLite.to(this.getContent(), 0.3, {alpha:1});

		this.collideArea = new PIXI.Rectangle(-50, -50, windowWidth + 100, windowHeight + 100);

		this.particlesCounterMax = 2;
        this.particlesCounter = 1;//this.particlesCounterMax *2;
        // this.shadow = new PIXI.Sprite.fromFrame(this.imgSource);
        // this.shadow.anchor.x = 0.4;
        // this.shadow.anchor.y = 0.4;
        // this.shadow.tint = 0;
        // this.shadowAlpha = 0.2;
        // this.shadow.alpha = this.shadowAlpha;
        // this.sprite.addChild(this.shadow);
        // this.sprite.setChildIndex(this.shadow , 0);
        this.floorPos = windowHeight;
        this.gravity = 0;
        this.gravityVal = 0.3;
        this.breakJump = false;
        this.blockCollide = false;

        this.perfectShoot = 0;
        this.perfectShootAcum = 0;
	},
	setFloor: function(pos){
		this.floorPos = pos;
	},
	hideShadows: function(){
		TweenLite.to(this.shadow, 0.1, {alpha:0});
	},
	updateShadow: function(angle){
		TweenLite.to(this.shadow, 0.3, {delay:0.1, alpha:this.shadowAlpha});
		// TweenLite.to(this.shadow, 0.1, {rotation:angle});
		// this.shadow.rotation = angle;
	},
	jump: function(force){
		if(this.breakJump){
			this.screen.miss();
			return;
		}
		this.gravity = 0;
		this.velocity.y = - force;
	},
	update: function(){
		this._super();
		if(!this.blockCollide){
			this.layer.collideChilds(this);
		}
		this.range = this.spriteBall.height / 4;

		// console.log(this.getContent().position.y , this.velocity.y , this.floorPos);
		if(this.getContent().position.y + this.velocity.y >= this.floorPos){
			this.velocity.y = 0;
			this.gravity = 0;
			this.getContent().position.y = this.floorPos;
			this.breakJump = false;
			this.blockCollide = false;
		}else{
			this.velocity.y += this.gravityVal;
			this.breakJump = true;
			// this.velocity.y = this.gravity;
		}
		if(this.velocity.y !== 0){
			this.updateableParticles();
		}else{
			this.perfectShoot ++;
		}
		// console.log(this.perfectShoot);
	},
	updateableParticles:function(){
        this.particlesCounter --;
        if(this.particlesCounter <= 0)
        {
            this.particlesCounter = this.particlesCounterMax;

            //efeito 1
            // var particle = new Particles({x: 0, y:0}, 120, this.particleSource, Math.random() * 0.05);
            // particle.maxScale = this.getContent().scale.x;
            // particle.growType = -1;
            // particle.build();
            // particle.gravity = 0.1;
            // particle.alphadecress = 0.08;
            // particle.scaledecress = -0.08;
            // particle.setPosition(this.getPosition().x - (Math.random() + this.getContent().width * 0.1) / 2,
            //     this.getPosition().y);
            // this.layer.addChild(particle);

            //efeito 2
            // var particle = new Particles({x: Math.random() * 4 - 2, y:Math.random()}, 120, this.particleSource, Math.random() * 0.05);
            // particle.maxScale = this.getContent().scale.x;
            // particle.maxInitScale = 0.4;
            // // particle.growType = -1;
            // particle.build();
            // particle.gravity = 0.1 * Math.random() + 0.2;
            // particle.alphadecress = 0.05;
            // particle.scaledecress = 0.03;
            // particle.setPosition(this.getPosition().x - (Math.random() + this.getContent().width * 0.1) / 2,
            //     this.getPosition().y);
            // this.layer.addChild(particle);


            //efeito 3
            var particle = new Particles({x: Math.random() * 4 - 2, y:Math.random()}, 120, this.particleSource, Math.random() * 0.05);
            particle.maxScale = this.getContent().scale.x / 2;
            // particle.maxInitScale = particle.maxScale / 1.5;
            // particle.growType = -1;
            particle.build();
            particle.gravity = 0.0;
            // particle.getContent().tint = APP.appModel.currentPlayerModel.color;
            particle.alphadecress = 0.05;
            particle.scaledecress = -0.05;
            particle.setPosition(this.getPosition().x - (Math.random() + this.getContent().width * 0.1) / 2,
                this.getPosition().y);
            this.layer.addChild(particle);
            particle.getContent().parent.setChildIndex(particle.getContent() , 0);
        }
    },
	collide:function(arrayCollide){
		// console.log('fireCollide', arrayCollide[0].type);
		if(this.velocity.y === 0){
            return;
        }
		if(this.collidable){
			for (var i = arrayCollide.length - 1; i >= 0; i--) {
				if(arrayCollide[i].type === 'enemy'){
					var enemy = arrayCollide[i];
					this.velocity.y = 0;
					this.getContent().position.y = enemy.getContent().position.y;
					// enemy.kill
					enemy.preKill();
					this.screen.getBall();
					// arrayCollide[i].prekill();
				}else if(arrayCollide[i].type === 'killer'){
					this.screen.gameOver();
					this.preKill();
				}else if(arrayCollide[i].type === 'coin'){
					this.velocity.y = 0;
					if(this.perfectShoot <= 4){
						this.screen.getPerfect();
						if(this.perfectShootAcum === 0){
							this.perfectShootAcum = 4;
						}else{
							this.perfectShootAcum ++;
						}
					}else{
						this.perfectShootAcum = 0;
					}
					this.perfectShoot = 0;
					this.blockCollide = true;
					var value = 1 + this.perfectShootAcum;
					APP.points += value;
					var labelCoin = new Particles({x: 0, y:0}, 120, new PIXI.Text('+'+value, {font:'50px Vagron', fill:'#f5c30c'}));
					labelCoin.maxScale = this.getContent().scale.x;
					labelCoin.build();
					// labelCoin.getContent().tint = 0xf5c30c;
					labelCoin.gravity = -0.2;
					labelCoin.alphadecress = 0.04;
					labelCoin.scaledecress = +0.05;
					labelCoin.setPosition(this.getPosition().x, this.getPosition().y);
					this.screen.layer.addChild(labelCoin);

					this.screen.getCoin();
				}
			}
		}
	},
	charge:function(){
		var angle = degreesToRadians(Math.random() * 360);
		// var angle = degreesToRadians(60);
		var dist = this.spriteBall.height * 0.7;
		var pPos = {x:dist * Math.sin(angle)+ this.getContent().position.x, y:dist * Math.cos(angle)+ this.getContent().position.y};
		// var pPos = {x:this.getPosition().x, y:this.getPosition().y};

		// var vector = Math.atan2(this.getPosition().y - pPos.y, this.getPosition().x - pPos.x);
		var vector = Math.atan2(this.getPosition().x - pPos.x, this.getPosition().y - pPos.y);
		var vel = 2;
		var vecVel = {x: Math.sin(vector) * vel, y: Math.cos(vector) * vel};
		var particle = new Particles(vecVel, 800, this.particleSource, 0);
        particle.maxScale = this.getContent().scale.x / 3;
        // particle.maxInitScale = particle.maxScale / 1.5;
        // particle.growType = -1;
        particle.build();
        particle.gravity = 0.0;
        // particle.getContent().tint = APP.appModel.currentPlayerModel.color;
        // particle.alphadecress = 0.05;
        particle.scaledecress = -0.01;
        particle.setPosition(pPos.x ,pPos.y);
        this.layer.addChild(particle);
        particle.getContent().parent.setChildIndex(particle.getContent() , 0);
	},
	preKill:function(){
		if(this.invencible){
			return;
		}
		this.collidable = false;
		this.kill = true;
		for (var i = 8; i >= 0; i--) {
			console.log('coll');
			var particle = new Particles({x: Math.random() * 4, y:-(Math.random() * 2 + 1)}, 120, this.particleSource, Math.random() * 0.05);
			particle.build();
			// particle.gravity = 0.1 * Math.random() + 0.2;
			particle.alphadecres = 0.1;
			particle.getContent().tint = APP.appModel.currentPlayerModel.color;
			particle.scaledecress = 0.02;
			particle.setPosition(this.getPosition().x - (Math.random() + this.getContent().width * 0.1) / 2,
				this.getPosition().y);
			this.layer.addChild(particle);
		}
	},
});