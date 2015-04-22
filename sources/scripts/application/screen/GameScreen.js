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




		this.coinsLabel = new PIXI.Text('0', {align:'center',font:'80px Vagron', fill:'#5E4487', wordWrap:true, wordWrapWidth:500});
		scaleConverter(this.coinsLabel.height, windowHeight, 0.2, this.coinsLabel);
		this.addChild(this.coinsLabel);

		this.tapToPlay = new PIXI.Text('TAP AND HOLD TO PLAY', {align:'center',font:'30px Vagron', fill:'#5E4487', wordWrap:true, wordWrapWidth:500});
		scaleConverter(this.tapToPlay.height, windowHeight, 0.06, this.tapToPlay);
		this.tapToPlay.alpha = 0;
		this.tapToPlay.position.y = windowHeight / 1.1;
		this.tapToPlay.position.x = windowWidth / 2 - this.tapToPlay.width / 2;
		this.addChild(this.tapToPlay);

		this.loaderBar = new LifeBarHUD(windowWidth * 0.6, 20, 0, 0xf5c30c, 0xFF453c);
        this.addChild(this.loaderBar.getContent());
        this.loaderBar.getContent().position.x = windowWidth / 2 - this.loaderBar.getContent().width / 2;
        this.loaderBar.getContent().position.y = windowHeight / 1.1;
        this.loaderBar.updateBar(0, 100);
        this.loaderBar.getContent().alpha = 0;

		this.initLevel();
		this.startLevel = false;
		
	},
	miss:function() {
		var errou = new Particles({x: 0, y:0}, 120, new PIXI.Text('ERROU!', {font:'50px Vagron', fill:'#f5c30c'}));
		errou.maxScale = this.player.getContent().scale.x;
		errou.build();
		// errou.getContent().tint = 0xf5c30c;
		errou.gravity = -0.2;
		errou.alphadecress = 0.04;
		errou.scaledecress = +0.05;
		errou.setPosition(this.player.getPosition().x, this.player.getPosition().y);
		this.layer.addChild(errou);

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
		this.force = 0;
		if(this.tapToPlay.alpha === 0){
			return;
		}
		TweenLite.to(this.tapToPlay, 0.2, {alpha:0});
		TweenLite.to(this.loaderBar.getContent(), 0.2, {delay:0.2, alpha:1});
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
			if(this.tapDown && this.force < 16){
				this.force += 0.75;
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
		if(this.levelCounter <= 0){
			this.gameOver();
		}
		this.loaderBar.updateBar(this.levelCounter, this.levelCounterMax);
		this._super();
	},
	gameOver:function(){
		this.reset();
	},
	getPerfect:function(){
		var perfect = new Particles({x: 0, y:0}, 120, new PIXI.Text('PERFECT!', {font:'50px Vagron', fill:'#f5c30c'}));
		perfect.maxScale = this.player.getContent().scale.x;
		perfect.build();
		// perfect.getContent().tint = 0xf5c30c;
		perfect.gravity = -0.2;
		perfect.alphadecress = 0.04;
		perfect.scaledecress = +0.05;
		perfect.setPosition(this.player.getPosition().x, this.player.getPosition().y + 50);
		this.layer.addChild(perfect);

		this.levelCounter += this.levelCounterMax * 0.02;
		if(this.levelCounter > this.levelCounterMax){
			this.levelCounter = this.levelCounterMax;
		}
	},
	getCoin:function(){
		this.levelCounter += this.levelCounterMax * 0.1;
		if(this.levelCounter > this.levelCounterMax){
			this.levelCounter = this.levelCounterMax;
		}
		this.updateCoins();
	},
	updateCoins:function(){
		this.coinsLabel.setText(APP.points);
		this.coinsLabel.position.x = windowWidth / 2 - this.coinsLabel.width / 2;
		this.coinsLabel.position.y = windowHeight / 2 - this.coinsLabel.height / 2;
		this.coinsLabel.parent.setChildIndex(this.coinsLabel, 0);
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

		TweenLite.to(this.tapToPlay, 0.5, {alpha:1});

		this.force = 0;
        this.levelCounter = 800;
        this.levelCounterMax = 800;

		APP.points = 0;

		this.updateCoins();

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