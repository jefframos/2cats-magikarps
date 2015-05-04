/*jshint undef:false */
var GameScreen = AbstractScreen.extend({
	init: function (label) {
		this._super(label);
		this.isLoaded = false;
		this.pinDefaultVelocity = 3;
	},
	destroy: function () {
		this._super();
	},
	build: function () {
		this._super();
		var assetsToLoader = [];
		// var assetsToLoader = ['dist/img/atlas.json'];
		// this.loader = new PIXI.AssetLoader(assetsToLoader);
		if(assetsToLoader !== undefined && assetsToLoader.length > 0 && !this.isLoaded){
			this.initLoad();
		}else{
			this.onAssetsLoaded();
		}
		this.pinVel = {x:0, y:0};
		console.log('buid');
	},
	onProgress:function(){
		this._super();
	},
	onAssetsLoaded:function()
	{
		this.initApplication();
	},
	initApplication:function(){
		var self = this;
	   
		this.vecColors = [0xFFCE62,0xE87C1E,0xFF562D,0xE81E55,0xE621FF];
		this.vecPerfects = ['PERFECT!', 'AWESOME!', 'AMAZING!', 'GOD!'];
		this.vecGood = ['GOOD', 'COOL', 'YO', 'NOT BAD'];
		this.vecError = ['NOOOO!', 'BAD', '=(', 'NOT'];
		this.backColor = 0x452E69;
		this.background = new PIXI.Graphics();
		this.background.beginFill(this.backColor);

		this.interactiveBackground = new InteractiveBackground(this);
		this.interactiveBackground.build();
		this.addChild(this.interactiveBackground);

		// this.changeColor();
		// this.background.alpha = 0;

		this.background.drawRect(0,0,windowWidth, windowHeight);
		this.addChild(this.background);

		this.hitTouch = new PIXI.Graphics();
		this.hitTouch.interactive = true;
		this.hitTouch.beginFill(0);
		this.hitTouch.drawRect(0,0,windowWidth, windowHeight);
		this.addChild(this.hitTouch);
		this.hitTouch.alpha = 0;
		this.hitTouch.hitArea = new PIXI.Rectangle(0, 0, windowWidth, windowHeight);

		this.tapDown = false;

		this.hitTouch.touchend = this.hitTouch.mouseup = function(mouseData){
			self.tapDown = false;
			self.shoot(self.force);
		};

		this.hitTouch.touchstart = this.hitTouch.mousedown = function(touchData){
			self.tapDown = true;
		};
		this.updateable = true;



		this.pauseButton = new DefaultButton('UI_button_default_1.png', 'UI_button_default_1.png', 'UI_button_default_1.png');
		this.pauseButton.build();
		scaleConverter(this.pauseButton.getContent().width, windowWidth, 0.1, this.pauseButton);
		this.pauseButton.setPosition(20,20);
		// this.addChild(this.pauseButton);
	  
		this.pauseButton.clickCallback = function(){
			self.pauseModal.show();
		};

		this.backButton = new DefaultButton('UI_button_default_1.png', 'UI_button_default_1.png');
		this.backButton.build();
		this.backButton.addLabel(new PIXI.Text('BACK', {font:'50px Vagron', fill:'#FFFFFF'}), 40);
		scaleConverter(this.backButton.getContent().width, windowWidth, 0.4, this.backButton);
		this.backButton.setPosition(windowWidth / 2 - this.backButton.getContent().width/2,
			windowHeight - this.backButton.getContent().height * 2.5);
		// this.addChild(this.backButton);
	  
		this.backButton.clickCallback = function(){
			self.updateable = false;
			self.toTween(function(){
				self.screenManager.change('Init');
			});
		};

		// this.setAudioButtons();
		

		//MODAIS
		// this.pauseModal = new PauseModal(this);
		// this.endModal = new EndModal(this);

		if(APP.withAPI){
			GameAPI.GameBreak.request(function(){
				self.pauseModal.show();
			}, function(){
				self.pauseModal.hide();
			});
		}



		this.brilhoBase = new SimpleSprite('baseDegrade.png');
		this.container.addChild(this.brilhoBase.getContent());
		scaleConverter(this.brilhoBase.getContent().width, windowWidth, 1, this.brilhoBase);
		this.brilhoBase.getContent().position.x = windowWidth / 2 - this.brilhoBase.getContent().width / 2;
		


		this.layerManager = new LayerManager();
		this.layerManager.build('Main');

		this.addChild(this.layerManager);

		//adiciona uma camada
		this.layer = new Layer();
		this.layer.build('EntityLayer');
		this.layerManager.addLayer(this.layer);




		this.coinsLabel = new PIXI.Text('0', {align:'center',font:'80px Vagron', fill:'#FFFFFF', wordWrap:true, wordWrapWidth:500});
		scaleConverter(this.coinsLabel.height, windowHeight, 0.2, this.coinsLabel);
		this.coinsLabel.alpha = 0.5;
		this.addChild(this.coinsLabel);

		this.crazyContent = new PIXI.DisplayObjectContainer();
		this.addChild(this.crazyContent);
		this.addCrazyMessage('TAP AND HOLD');
		

		this.loaderBar = new LifeBarHUD(windowWidth, 20, 0, 0xFFFFFF, 0xFFFFFF);
		this.addChild(this.loaderBar.getContent());
		this.loaderBar.getContent().position.x = 0;//windowWidth / 2 - this.loaderBar.getContent().width / 2;
		this.loaderBar.getContent().position.y = 0;//windowHeight / 1.1;
		this.loaderBar.updateBar(0, 100);
		this.loaderBar.getContent().alpha = 0;

		this.initLevel();
		this.startLevel = false;
		
	},
	addCrazyMessage:function(message) {
		if(this.crazyLabel && this.crazyLabel.parent){
			if(this.crazyLabel.text === message){
				return;
			}
			this.crazyLabel.parent.removeChild(this.crazyLabel);
		}
		if(this.crazyLabel2 && this.crazyLabel2.parent){
			this.crazyLabel2.parent.removeChild(this.crazyLabel2);
		}
		var rot = Math.random() * 0.01 + 0.04;
		rot = Math.random() < 0.5? -rot:rot;
		var scl = 1;
		this.crazyLabel = new PIXI.Text(message, {align:'center',font:'30px Vagron', fill:'#9d47e0', wordWrap:true, wordWrapWidth:500});
		// scl = scaleConverter(this.crazyLabel.height, windowHeight, 0.06, this.crazyLabel);
		this.crazyLabel.rotation = rot;
		this.crazyLabel.position.y = windowHeight / 1.1 + this.crazyLabel.height / 2;
		this.crazyLabel.position.x = windowWidth / 2;
		this.crazyLabel.anchor = {x:0.5, y:0.5};

		this.crazyLabel2 = new PIXI.Text(message, {align:'center',font:'30px Vagron', fill:'#13c2b6', wordWrap:true, wordWrapWidth:500});
		// scaleConverter(this.crazyLabel2.height, windowHeight, 0.06, this.crazyLabel2);
		this.crazyLabel2.rotation = -rot;
		this.crazyLabel2.position.y = windowHeight / 1.1 + this.crazyLabel2.height / 2;
		this.crazyLabel2.position.x = windowWidth / 2;
		this.crazyLabel2.anchor = {x:0.5, y:0.5};


		this.crazyContent.addChild(this.crazyLabel);
		this.crazyContent.addChild(this.crazyLabel2);
		this.crazyContent.alpha = 1;
		this.crazyContent.rotation = 0;

		// TweenLite.from(this.crazyContent, 0.2, {rotation:Math.random() * 0.8 - 0.4});

		TweenLite.from(this.crazyLabel, 0.4, {rotation:0});
		TweenLite.from(this.crazyLabel2, 0.4, {rotation:0});

		TweenLite.from(this.crazyLabel.scale, 0.2, {x:scl * 2, y:scl * 2});
		TweenLite.from(this.crazyLabel2.scale, 0.2, {x:scl * 2, y:scl * 2});
	},
	miss:function() {

		this.player.breakJump = true;
		this.player.velocity.y = 0;
		var wrongLabel = this.vecError[Math.floor(this.vecError.length * Math.random())];
		var rot = Math.random() * 0.004;
		var tempLabel = new PIXI.Text(wrongLabel, {font:'50px Vagron', fill:'#ec8b78'});

		var errou = new Particles({x: 0, y:0}, 120, tempLabel,rot);
		errou.maxScale = this.player.getContent().scale.x;
		errou.build();
		// errou.getContent().tint = 0xf5c30c;
		errou.gravity = 0.1;
		errou.alphadecress = 0.01;
		errou.scaledecress = +0.05;
		errou.setPosition(this.player.getPosition().x - tempLabel.width / 2, this.player.getPosition().y - 50);
		this.layer.addChild(errou);

		var errou2 = new Particles({x: 0, y:0}, 120, new PIXI.Text(wrongLabel, {font:'50px Vagron', fill:'#e25a30'}),-rot);
		errou2.maxScale = this.player.getContent().scale.x;
		errou2.build();
		// errou2.getContent().tint = 0xf5c30c;
		errou2.gravity = 0.1;
		errou2.alphadecress = 0.01;
		errou2.scaledecress = +0.05;
		errou2.setPosition(this.player.getPosition().x - tempLabel.width / 2+2, this.player.getPosition().y - 50+2);
		this.layer.addChild(errou2);

		errou2.getContent().parent.setChildIndex(errou.getContent(), errou.getContent().parent.children.length - 1);
		errou2.getContent().parent.setChildIndex(errou2.getContent(), errou2.getContent().parent.children.length - 1);


		this.player.inError = true;
		this.levelCounter -= this.levelCounterMax * 0.1;
		if(this.levelCounter < 0){
			this.levelCounter = 0;
		}
	},
	shoot:function(force) {
		if(this.player.inError){
			return;
		}
		this.startLevel = true;
		this.player.jump(force);
		this.player.improveGravity();
		this.force = 0;
		// if(this.crazyContent.alpha === 0){
		// 	return;
		// }
		// TweenLite.to(this.crazyContent, 0.2, {alpha:0});
		TweenLite.to(this.loaderBar.getContent(), 0.2, {delay:0.2, alpha:1});

		this.addCrazyMessage('HOLD');
	},
	reset:function(){
		this.destroy();
		this.build();
	},
	update:function(){
		if(!this.updateable){
			return;
		}
		if(!this.player.inError){
			if(this.tapDown && this.force < 30){
				this.force += 0.9;
				this.player.charge();
				// console.log(this.force);
			}
			// console.log(this.startLevel);
			if(this.startLevel){
				this.levelCounter --;
				if(this.levelCounter < 0){
					this.levelCounter = 0;
				}
			}
		}
		this.player.force = this.force;
		if(this.player.velocity.y < 0){
			this.interactiveBackground.accel =  Math.abs(this.player.velocity.y) / 15;
		}else{
			this.interactiveBackground.accel = 0;
		}
		if(this.levelCounter <= 0){
			this.gameOver();
		}
		this.loaderBar.updateBar(this.levelCounter, this.levelCounterMax);
		this._super();
	},
	gameOver:function(){
		this.reset();
	},
	addRegularLabel:function(label, font){
		var rot = Math.random() * 0.004;
		var tempLabel = new PIXI.Text(label, {font:font, fill:'#9d47e0'});

		var perfect = new Particles({x: 0, y:0}, 120, tempLabel,rot);
		perfect.maxScale = this.player.getContent().scale.x;
		perfect.build();
		// perfect.getContent().tint = 0xf5c30c;
		perfect.gravity = -0.2;
		perfect.alphadecress = 0.01;
		perfect.scaledecress = +0.05;
		perfect.setPosition(this.player.getPosition().x - tempLabel.width / 2, this.player.getPosition().y + 50);
		this.layer.addChild(perfect);

		var perfect2 = new Particles({x: 0, y:0}, 120, new PIXI.Text(label, {font:font, fill:'#13c2b6'}),-rot);
		perfect2.maxScale = this.player.getContent().scale.x;
		perfect2.build();
		// perfect2.getContent().tint = 0xf5c30c;
		perfect2.gravity = -0.2;
		perfect2.alphadecress = 0.01;
		perfect2.scaledecress = +0.05;
		perfect2.setPosition(this.player.getPosition().x - tempLabel.width / 2 + 2, this.player.getPosition().y + 50 + 2);
		this.layer.addChild(perfect2);

		this.levelCounter += this.levelCounterMax * 0.02;
		if(this.levelCounter > this.levelCounterMax){
			this.levelCounter = this.levelCounterMax;
		}
	},
	getPerfect:function(){
		this.addRegularLabel(this.vecPerfects[Math.floor(this.vecPerfects.length * Math.random())], '50px Vagron');
		
		this.earthquake(40);
	},
	getCoin:function(isPerfect){
		this.levelCounter += this.levelCounterMax * 0.05;
		if(this.levelCounter > this.levelCounterMax){
			this.levelCounter = this.levelCounterMax;
		}
		this.targetJump.randomPos(windowHeight * 0.05, windowHeight * 0.4);
		this.updateCoins();
		this.targetJump.explode();

		if(!isPerfect){
			this.addRegularLabel(this.vecGood[Math.floor(this.vecGood.length * Math.random())], '40px Vagron');
		}

		this.earthquake(20);
		this.changeColor();
	},
	changeColor:function(force){
		var tempColor = 0;
		var self = this;
		var temptempColor = this.vecColors[Math.floor(this.vecColors.length * Math.random())];

		if(force){
			self.background.clear();
			self.background.beginFill(temptempColor);
			self.background.drawRect(-80,-80,windowWidth + 160, windowHeight + 160);
		}else{
			TweenLite.to(this, 0.3, {backColor:temptempColor, onUpdate:function(){
				self.background.clear();
				self.background.beginFill(self.backColor);
				self.background.drawRect(-80,-80,windowWidth + 160, windowHeight + 160);
			}});
		}

		tempColor = addBright(temptempColor, 0.65);
		// this.player.spriteBall.tint = tempColor;
		this.player.setColor(tempColor);
		this.loaderBar.setBackColor(tempColor);
		// this.loaderBar.backBaseShape.tint = tempColor;//tempColor;
	},
	earthquake:function(force){
		var earth = new TimelineLite();
		earth.append(TweenLite.to(this.container, 0.2, {y:-Math.random() * force, x:Math.random() * force - force / 2}));
		earth.append(TweenLite.to(this.container, 0.2, {y:-Math.random() * force, x:Math.random() * force - force / 2}));
		earth.append(TweenLite.to(this.container, 0.2, {y:0, x:0}));
	},
	updateCoins:function(){
		this.coinsLabel.setText(APP.points);
		this.coinsLabel.position.x = windowWidth / 2 - this.coinsLabel.width / 2;
		this.coinsLabel.position.y = windowHeight / 2 - this.coinsLabel.height / 2;
		this.background.parent.setChildIndex(this.background, 0);
		this.coinsLabel.parent.setChildIndex(this.coinsLabel, 1);
	},
	initLevel:function(whereInit){
		this.player = new Ball({x:0,y:0}, this);
		this.player.build();
		this.layer.addChild(this.player);
		this.player.getContent().position.x = windowWidth / 2;
		this.player.getContent().position.y = windowHeight / 1.2;
		var base = windowHeight / 1.2;
		this.player.setFloor(base);
		this.brilhoBase.getContent().position.y = base +  this.player.spriteBall.height / 2;

		this.targetJump = new Coin({x:0,y:0});
		this.targetJump.build();
		this.layer.addChild(this.targetJump);
		this.targetJump.getContent().position.x = windowWidth / 2;
		this.targetJump.getContent().position.y = windowHeight * 0.2;

		TweenLite.to(this.crazyContent, 0.5, {alpha:1});

		this.force = 0;
		this.levelCounter = 800;
		this.levelCounterMax = 800;

		APP.points = 0;

		this.updateCoins();
		this.changeColor(true);
	},
	
	transitionIn:function()
	{
		this.build();
	},
	transitionOut:function(nextScreen, container)
	{
		// this._super();
		console.log('out');
		var self = this;
		if(this.frontShape){
			this.frontShape.parent.setChildIndex(this.frontShape, this.frontShape.parent.children.length - 1);
			TweenLite.to(this.frontShape, 0.3, {alpha:1, onComplete:function(){
				self.destroy();
				container.removeChild(self.getContent());
				nextScreen.transitionIn();
			}});
		}else{
			self.destroy();
			container.removeChild(self.getContent());
			nextScreen.transitionIn();
		}

		
	},
});