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


		// this.spriteBall = new PIXI.Sprite.fromFrame(this.imgSource);
		this.color = 0xFFFFFF;
		this.spriteBall = new PIXI.Graphics();
		this.spriteBall.beginFill(this.color);
		this.maxSize = windowHeight * 0.05;
		this.spriteBall.drawCircle(0,-this.maxSize,this.maxSize);

		this.sprite = new PIXI.Sprite();
        this.sprite.addChild(this.spriteBall);
  //       this.spriteBall.anchor.x = 0.5;
		// this.spriteBall.anchor.y = 0.5;

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
        this.gravityVal = 0.15;
        this.breakJump = false;
        this.blockCollide = false;
        this.inError = false;

        this.perfectShoot = 0;
        this.perfectShootAcum = 0;
        this.force = 0;
	},
	setFloor: function(pos){
		this.floorPos = pos;
		this.velocity.y += this.gravityVal;
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
		this.velocity.y = - force - ((this.gravityVal * this.gravityVal) / 1.5) * 10;
		console.log(this.velocity.y, this.gravityVal);
		this.firstJump = true;
	},
	improveGravity: function(){
		if(this.gravityVal >= 1.2){
			return;
		}
		
		this.gravityVal += 0.05;
		// console.log(this.gravityVal);
	},
	update: function(){
		this._super();
		if(!this.blockCollide){
			this.layer.collideChilds(this);
		}

		this.spriteBall.width = this.force + this.maxSize - Math.abs(this.velocity.y);
		if(this.spriteBall.width < this.maxSize)
		{
			this.spriteBall.width = this.maxSize;
		}
        this.spriteBall.height = this.force + this.maxSize + Math.abs(this.velocity.y);

		this.range = this.spriteBall.height / 2;

		if(this.getContent().position.y + this.velocity.y >= this.floorPos + this.maxSize){//} + this.spriteBall.height / 2){
			if(this.firstJump){
				this.screen.addCrazyMessage('RELEASE');
			}
			this.getContent().position.y = this.floorPos + this.maxSize;// + this.spriteBall.height / 2;
			this.velocity.y = 0;
			this.gravity = 0;
			this.breakJump = false;
			this.blockCollide = false;
			this.inError = false;
			this.force = 0;
		}else if(this.breakJump||this.velocity.y !==0){
			this.velocity.y += this.gravityVal;
			this.breakJump = true;
		}

		if(this.velocity.y !== 0){
			this.updateableParticles();
		}else{
			this.perfectShoot ++;
		}
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


            var tempPart = new PIXI.Graphics();
			tempPart.beginFill(this.color);
			tempPart.drawCircle(0,0,this.spriteBall.width);

            //efeito 3
            var particle = new Particles({x: Math.random() * 4 - 2, y:Math.random()}, 120, tempPart, Math.random() * 0.05);
            // particle.maxScale = this.getContent().scale.x / 2;
            particle.initScale = this.getContent().scale.x / 2;
            // particle.maxInitScale = particle.maxScale / 1.5;
            // particle.growType = -1;
            particle.build();
            particle.gravity = 0.0;
            // particle.getContent().tint = APP.appModel.currentPlayerModel.color;
            particle.alphadecress = 0.05;
            particle.scaledecress = -0.05;
            particle.setPosition(this.getPosition().x - (Math.random() + this.getContent().width * 0.1) / 2,
                this.getPosition().y - this.spriteBall.height / 2);
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
					var isPerfect = false;
					if(this.perfectShoot <= 4){
						this.screen.getPerfect();
						isPerfect = true;
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



					var rot = Math.random() * 0.005;
					var tempLabel = new PIXI.Text('+'+value, {font:'50px Vagron', fill:'#13c2b6'});
					// var tempLabel = new PIXI.Text('+'+value, {font:'50px Vagron', fill:'#9d47e0'});

					var labelCoin = new Particles({x: 0, y:0}, 120, tempLabel,rot);
					labelCoin.maxScale = this.getContent().scale.x;
					labelCoin.build();
					// labelCoin.getContent().tint = 0xf5c30c;
					labelCoin.gravity = -0.2;
					labelCoin.alphadecress = 0.01;
					labelCoin.scaledecress = +0.05;
					labelCoin.setPosition(this.getPosition().x - tempLabel.width / 2, this.getPosition().y);
					this.screen.layer.addChild(labelCoin);

					var labelCoin2 = new Particles({x: 0, y:0}, 120, new PIXI.Text('+'+value, {font:'50px Vagron', fill:'#9d47e0'}),-rot);
					// var labelCoin2 = new Particles({x: 0, y:0}, 120, new PIXI.Text('+'+value, {font:'50px Vagron', fill:'#13c2b6'}),-rot);
					labelCoin2.maxScale = this.getContent().scale.x;
					labelCoin2.build();
					// labelCoin2.getContent().tint = 0xf5c30c;
					labelCoin2.gravity = -0.2;
					labelCoin2.alphadecress = 0.01;
					labelCoin2.scaledecress = +0.05;
					labelCoin2.setPosition(this.getPosition().x - tempLabel.width / 2+2, this.getPosition().y+2);
					this.screen.layer.addChild(labelCoin2);


					// var labelCoin = new Particles({x: 0, y:0}, 120, new PIXI.Text('+'+value, {font:'50px Vagron', fill:'#f5c30c'}));
					// labelCoin.maxScale = this.getContent().scale.x;
					// labelCoin.build();
					// // labelCoin.getContent().tint = 0xf5c30c;
					// labelCoin.gravity = -0.2;
					// labelCoin.alphadecress = 0.04;
					// labelCoin.scaledecress = +0.05;
					// labelCoin.setPosition(this.getPosition().x, this.getPosition().y);
					// this.screen.layer.addChild(labelCoin);

					this.screen.getCoin(isPerfect);
				}
			}
		}
	},
	setColor:function(color){
		this.color = color;
		this.spriteBall.clear();
		this.spriteBall.beginFill(color);
		this.spriteBall.drawCircle(0,-this.maxSize,this.maxSize);
		// this.spriteBall.drawCircle(0,0,this.maxSize);
	},
	charge:function(force){
		var angle = degreesToRadians(Math.random() * 360);
		// var angle = degreesToRadians(60);
		var dist = this.spriteBall.height * 0.9;
		var pPos = {x:dist * Math.sin(angle)+ this.getContent().position.x, y:dist * Math.cos(angle)+ this.getContent().position.y};
		// var pPos = {x:this.getPosition().x, y:this.getPosition().y};

		// var vector = Math.atan2(this.getPosition().y - pPos.y, this.getPosition().x - pPos.x);
		var vector = Math.atan2(this.getPosition().x - pPos.x, this.getPosition().y - pPos.y);
		var vel = 2;
		var vecVel = {x: Math.sin(vector) * vel, y: Math.cos(vector) * vel};

		console.log('charge');
		var tempPart = new PIXI.Graphics();
		tempPart.beginFill(this.color);
		tempPart.drawCircle(0,0,windowHeight * 0.05);
		var particle = new Particles(vecVel, 800, tempPart, 0);

		particle.initScale = this.getContent().scale.x / 10;
        particle.maxScale = this.getContent().scale.x / 3;

        // particle.maxInitScale = particle.maxScale / 1.5;
        // particle.growType = -1;
        particle.build();
        particle.gravity = 0.0;
        // particle.getContent().tint = APP.appModel.currentPlayerModel.color;
        // particle.alphadecress = 0.05;
        particle.scaledecress = -0.01;
        particle.setPosition(pPos.x ,pPos.y- this.spriteBall.height / 2);
        this.layer.addChild(particle);
        particle.getContent().parent.setChildIndex(particle.getContent() , 0);

        
	},
	preKill:function(){
		if(this.invencible){
			return;
		}
		this.collidable = false;
		this.kill = true;
		for (var i = 10; i >= 0; i--) {

			tempParticle = new PIXI.Graphics();
			tempParticle.beginFill(this.color);
			tempParticle.drawCircle(0,0,this.spriteBall.width * 0.2);
			// this.spriteBall.drawCircle(0,0,windowHeight * 0.02);

			particle = new Particles({x: Math.random() * 10 - 5 - 10, y:Math.random() * 10 - 5 + 10}, 600, tempParticle, Math.random() * 0.05);
			// particle.maxScale = this.getContent().scale.x / 2;
            // particle.maxInitScale = particle.maxScale;
			particle.build();
			// particle.getContent().tint = 0xf5c30c;
			// particle.gravity = 0.3 * Math.random();
			particle.alphadecress = 0.008;
			// particle.scaledecress = -0.005;
			particle.setPosition(this.getPosition().x - (Math.random() + this.getContent().width * 0.4) + this.getContent().width * 0.2,
                this.getPosition().y - (Math.random() + this.getContent().width * 0.4)+ this.getContent().width * 0.2);
			this.layer.addChild(particle);
		}

		tempParticle = new PIXI.Graphics();
		tempParticle.beginFill(this.color);
		tempParticle.drawCircle(0,0,this.spriteBall.width);

		particle = new Particles({x: 0, y:0}, 600, tempParticle, 0);
		particle.maxScale = this.getContent().scale.x * 5;
        particle.maxInitScale = 1;
		particle.build();
		// particle.getContent().tint = 0xf5c30c;
		// particle.gravity = 0.3 * Math.random();
		particle.alphadecress = 0.05;
		particle.scaledecress = 0.1;
		particle.setPosition(this.getPosition().x,this.getPosition().y);
		this.layer.addChild(particle);
	},
});