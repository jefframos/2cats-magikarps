/*jshint undef:false */
var InitScreen = AbstractScreen.extend({
	init: function (label) {
		this._super(label);
		this.isLoaded = false;
		APP.seed = new Float(Math.random() * 0xFFFF);
		APP.seed.applySeed();
		
		// alert(this.isLoaded);
	},
	destroy: function () {
		this._super();
	},
	build: function () {
		this._super();

		var assetsToLoader = ['dist/img/atlas2.json'];
		this.loader = new PIXI.AssetLoader(assetsToLoader);

		if(assetsToLoader.length > 0){
			this.initLoad();
		}else{
			this.onAssetsLoaded();
		}
		this.updateable = true;
	},
	onProgress:function(){
		this._super();
	},
	onAssetsLoaded:function()
	{
		this.initApplication();
		// APP.labelDebug.visible = false;
	},
	initApplication:function(){
		var self = this;

		this.bg = new SimpleSprite(APP.appModel.currentTowelModel.imgSrc);
		this.container.addChild(this.bg.getContent());
		scaleConverter(this.bg.getContent().width, windowWidth, 1.2, this.bg);
		this.bg.getContent().position.x = windowWidth / 2 - this.bg.getContent().width / 2;
		this.bg.getContent().position.y = windowHeight / 2 - this.bg.getContent().height / 2;

		this.brilhoBase = new SimpleSprite('brilho_base.png');
		this.container.addChild(this.brilhoBase.getContent());
		scaleConverter(this.brilhoBase.getContent().width, windowWidth, 1, this.brilhoBase);
		this.brilhoBase.getContent().position.x = windowWidth / 2 - this.brilhoBase.getContent().width / 2;
		this.brilhoBase.getContent().position.y = windowHeight / 2 - this.brilhoBase.getContent().height;
		// this.brilhoBase.blendMode = PIXI.blendModes.OVERLAY;
		// this.brilhoBase.getContent().tint = 0xf2c10c;
		this.brilhoBase.getContent().alpha = 0;
		

		this.brilhoMeio = new SimpleSprite('brilho.png');
		this.container.addChild(this.brilhoMeio.getContent());
		scaleConverter(this.brilhoMeio.getContent().width, windowWidth, 1, this.brilhoMeio);
		this.brilhoMeio.getContent().position.x = windowWidth / 2;
		this.brilhoMeio.getContent().position.y = windowHeight / 2;
		// this.brilhoMeio.blendMode = PIXI.blendModes.OVERLAY;
		// this.brilhoMeio.getContent().tint = 0xf2c10c;
		this.brilhoMeio.getContent().alpha = 0;
		this.brilhoMeio.getContent().anchor.x = 0.5;
		this.brilhoMeio.getContent().anchor.y = 0.5;
		

		this.rotuloContainer = new PIXI.DisplayObjectContainer();
		this.container.addChild(this.rotuloContainer);

		this.rotuloImg = new SimpleSprite('TITLE_rotulo.png');
		this.rotuloContainer.addChild(this.rotuloImg.getContent());

		this.logoGame = new SimpleSprite('TITLE.png');
		this.rotuloContainer.addChild(this.logoGame.getContent());
		this.logoGame.getContent().position.x = 10;
		this.logoGame.getContent().position.y = 80;

		// scaleConverter(this.rotuloImg.getContent().width, windowWidth, 1, this.rotuloImg);
		this.rotuloContainer.position.x = windowWidth / 2 - this.rotuloContainer.width / 2;
		this.rotuloContainer.position.y = windowHeight / 2 - this.rotuloContainer.height / 2;
		// this.rotuloImg.blendMode = PIXI.blendModes.OVERLAY;
		// this.rotuloImg.getContent().tint = 0xf2c10c;
		// this.rotuloImg.getContent().alpha = 0;

		this.playButton = new DefaultButton('botao_play.png', 'botao_play.png');
		this.playButton.build();
		// scaleConverter(this.playButton.getContent().width, windowWidth, 0.4, this.playButton);
		this.rotuloContainer.addChild(this.playButton.getContent());
	  
		this.playButton.clickCallback = function(){
			if(testMobile() && possibleFullscreen()){
				fullscreen();
			}
			self.startGame();
		};

		this.shopButton = new DefaultButton('botao_config.png', 'botao_config.png');
		this.shopButton.build();
		// this.shopButton.addLabel(new PIXI.Text('SHOP', {font:'30px Vagron', fill:'#db453c'}), 45,2);
		// scaleConverter(this.shopButton.getContent().width, windowWidth, 0.4, this.shopButton);
		this.rotuloContainer.addChild(this.shopButton.getContent());
	  
		this.shopButton.clickCallback = function(){
			if(testMobile() && possibleFullscreen()){
				fullscreen();
			}
			self.screenManager.change('Choice');
		};

		this.rankingButton = new DefaultButton('botao_rankin.png', 'botao_rankin.png');
		this.rankingButton.build();
		// scaleConverter(this.rankingButton.getContent().width, windowWidth, 0.4, this.rankingButton);
		this.rotuloContainer.addChild(this.rankingButton.getContent());
	  
		this.rankingButton.clickCallback = function(){
			if(testMobile() && possibleFullscreen()){
				fullscreen();
			}
			self.screenManager.change('Choice');
		};


		this.playButton.setPosition(this.rotuloContainer.width / 2 - this.playButton.getContent().width/2,
			420);

		this.shopButton.setPosition(this.rotuloContainer.width / 2 + this.shopButton.getContent().width/2 + 50,
			this.playButton.getContent().position.y + this.playButton.getContent().height + 10);

		this.rankingButton.setPosition(this.rotuloContainer.width / 2 - this.rankingButton.getContent().width*1.5 - 50,
			this.playButton.getContent().position.y + this.playButton.getContent().height + 10);


        this.tuboContent = new SimpleSprite('conteudo.png');
        this.addChild(this.tuboContent.getContent());
        this.tuboContent.getContent().anchor.x = 0.5;
        this.tuboContent.getContent().anchor.y = 1;
        // scaleConverter(this.tuboContent.getContent().width, windowWidth, 1.2, this.tuboContent);
        this.tuboContent.getContent().position.x = windowWidth / 2;
        this.tuboContent.getContent().position.y = windowHeight + this.tuboContent.getContent().height;

		this.tubo = new SimpleSprite('tubo.png');
        this.addChild(this.tubo.getContent());
        this.tubo.getContent().anchor.x = 0.5;
        this.tubo.getContent().anchor.y = 1;
        // scaleConverter(this.tubo.getContent().width, windowWidth, 1.2, this.tubo);
        this.tubo.getContent().position.x = windowWidth / 2;
        this.tubo.getContent().position.y = windowHeight + this.tubo.getContent().height;

        this.tuboContent.getContent().tint = APP.appModel.currentPlayerModel.color;

		// this.setAudioButtons();

		
		this.fromTween();

		this.layerManager = new LayerManager();
		this.layerManager.build('Main');

		this.addChild(this.layerManager);

		//adiciona uma camada
		this.layer = new Layer();
		this.layer.build('EntityLayer');
		this.layerManager.addLayer(this.layer);




		this.hitTouch = new PIXI.Graphics();
		this.hitTouch.interactive = true;
		this.hitTouch.beginFill(0);
		this.hitTouch.drawRect(0,0,windowWidth, windowHeight);
		this.hitTouch.alpha = 0;
		this.hitTouch.hitArea = new PIXI.Rectangle(0, 0, windowWidth, windowHeight);
	   

		this.hitTouch.mouseup = function(mouseData){
			self.moveBall();
		};

		this.hitTouch.touchstart = function(touchData){
			self.moveBall();
		};

		this.behaviours = [];
		this.behaviours.push(new StoppedBehaviour({}));
		this.behaviours.push(new RadiusPingPongBehaviour({}));
		this.behaviours.push(new RadiusBehaviour({}));
		this.behaviours.push(new SiderBehaviour({}));
		this.behaviours.push(new DiagBehaviour({}));

		this.tapToPlay = new PIXI.Text('TAP TO PLAY', {align:'center',font:'30px Vagron', fill:'#FFF', wordWrap:true, wordWrapWidth:500});
		scaleConverter(this.tapToPlay.height, windowHeight, 0.06, this.tapToPlay);
		this.addChild(this.tapToPlay);
		this.tapToPlay.alpha = 0;
		this.tapToPlay.position.y = windowHeight / 2;
		this.tapToPlay.position.x = windowWidth / 2 - this.tapToPlay.width / 2;

		this.pointsLabel = new PIXI.Text('0', {align:'center',font:'30px Vagron', fill:'#FFF', wordWrap:true, wordWrapWidth:500});
		scaleConverter(this.pointsLabel.height, windowHeight, 0.06, this.pointsLabel);
		this.addChild(this.pointsLabel);
		this.pointsLabel.position.y = -500;

		this.coinsLabel = new PIXI.Text('0', {align:'center',font:'30px Vagron', fill:'#f5c30c', wordWrap:true, wordWrapWidth:500});
		scaleConverter(this.coinsLabel.height, windowHeight, 0.06, this.coinsLabel);
		this.addChild(this.coinsLabel);
		this.coinsLabel.position.y = -500;

		this.endModal = new EndModal(this);
		// this.endModal.show();

		if(APP.goDirect){
			this.startGame();
		}
		APP.goDirect = false;

		// alert(window.plugins.socialsharing);
		// if(intel !== undefined){
		// 	alert(window.plugins.socialsharing);
		// }
	},
	updateLabel:function(){
		this.pointsLabel.setText(APP.currentPoints);
		this.pointsLabel.position.x = windowWidth - this.pointsLabel.width - windowWidth * 0.1;
		this.pointsLabel.position.y = windowWidth * 0.1;
	},

	getCoin:function(){
		APP.totalCoins ++;
		this.updateCoins();
	},
	updateCoins:function(){
		this.coinsLabel.setText(APP.totalCoins);
		this.coinsLabel.position.x = windowWidth * 0.1;
		this.coinsLabel.position.y = windowWidth * 0.1;
	},

	getBall:function(){
		this.nextHorde();
		APP.currentPoints ++;
		this.updateLabel();
	},
	moveBall:function(){
		this.tubo.getContent().scale.y = 0.5;
		this.tubo.getContent().scale.x = 1.2;
		TweenLite.to(this.tubo.getContent().scale, 0.3, {y:1, x:1, ease:'easeOutBack'});

		this.tuboContent.getContent().scale.y = 0.5;
		this.tuboContent.getContent().scale.x = 1.2;
		TweenLite.to(this.tuboContent.getContent().scale, 0.3, {y:1, x:1, ease:'easeOutBack'});


		TweenLite.to(this.tapToPlay, 0.5, {alpha:0});
		this.ball.velocity.y = -20;
	},
	nextHorde:function(){
		var self = this;
		var posDest = windowHeight - this.ball.getContent().height - windowHeight * 0.1;
		TweenLite.to(this.brilhoMeio.getContent(), 0.2, {alpha:0});
		for (var i = this.layer.childs.length - 1; i >= 0; i--) {
			if(this.layer.childs[i].type !== 'bullet' && this.layer.childs[i].type !== 'particle'){
				this.layer.childs[i].preKill();
			}
		}

		this.currentHorde ++;
		if(APP.accelGame < 3){
			APP.accelGame += this.currentHorde / 500;
		}
		// console.log((APP.accelGame));

		TweenLite.to(this.ball.getContent().position, 0.3, {y:posDest, ease:'easeOutBack', onComplete:function(){
			var tempId = 0;
			if(self.currentHorde > 1){
				tempId = Math.floor(APP.seed.getNextFloat() * self.behaviours.length);
			}
			var behaviour = self.behaviours[tempId].clone();
		// var behaviour = self.behaviours[3].clone();
			var tempEnemy = new EnemyBall({x:0,y:0}, behaviour);
			tempEnemy.build();
			tempEnemy.getContent().position.x = behaviour.position.x;
			tempEnemy.getContent().position.y = behaviour.position.y;
			scaleConverter(tempEnemy.getContent().height, windowHeight, 0.2, tempEnemy.getContent());
			TweenLite.to(self.brilhoMeio.getContent(), 0.3, {alpha:0.3});

			self.layer.addChild(tempEnemy);
			self.currentEnemy = tempEnemy;
			if(self.currentHorde < 2){
				return;
			}
			if(behaviour.killerBehaviour){
				var tempEnemyKiller = null;
				var hasEnemy = false;
				if(APP.seed.getNextFloat() < 0.5){
					hasEnemy = true;
					tempEnemyKiller = new KillerBall({x:0,y:0}, behaviour.killerBehaviour);
				}else{
					tempEnemyKiller = new Coin({x:0,y:0}, behaviour.killerBehaviour);
				}
				tempEnemyKiller.build();
				tempEnemyKiller.getContent().position.x = behaviour.killerBehaviour.position.x;
				tempEnemyKiller.getContent().position.y = behaviour.killerBehaviour.position.y;

				scaleConverter(tempEnemyKiller.getContent().height, windowHeight, hasEnemy?0.1:0.2, tempEnemyKiller.getContent());

				self.layer.addChild(tempEnemyKiller);
			}

		}});
	},
	startGame:function(){
		this.toTween();
		TweenLite.to(this.tapToPlay, 0.5, {alpha:1});
		APP.currentPoints = 0;
		this.currentHorde = 0;
		APP.accelGame = 1;

		TweenLite.to(this.tubo.getContent().position, 0.5, {y:windowHeight});
		TweenLite.to(this.tuboContent.getContent().position, 0.5, {y:windowHeight});

		APP.seed.applySeed();
		this.updateLabel();
		this.updateCoins();
		this.ball = new Ball({x:0,y:0}, this);
		this.ball.build();
		scaleConverter(this.ball.spriteBall.width, windowWidth, 0.15, this.ball.spriteBall);
		scaleConverter(this.ball.shadow.width, windowWidth, 0.15, this.ball.shadow);
		this.ball.getContent().position.x = windowWidth / 2;
		this.ball.getContent().position.y = windowHeight - this.ball.getContent().height - windowHeight * 0.1;

		
		this.layer.addChild(this.ball);
		this.ball.spriteBall.tint = APP.appModel.currentPlayerModel.color;
		this.tuboContent.getContent().tint = APP.appModel.currentPlayerModel.color;
		this.nextHorde();

		this.addChild(this.hitTouch);
	},
	gameOver:function(){
		this.removeChild(this.hitTouch);
		this.pointsLabel.position.y = -500;
		this.coinsLabel.position.y = -500;
		TweenLite.to(this.tubo.getContent().position, 0.5, {y:windowHeight + this.tubo.getContent().height});
		TweenLite.to(this.tuboContent.getContent().position, 0.5, {y:windowHeight + this.tuboContent.getContent().height});
		for (var i = this.layer.childs.length - 1; i >= 0; i--) {
			this.layer.childs[i].preKill();
		}
		// this.layer.childs
		// this.fromTween();
		APP.plays ++;
		APP.appModel.saveScore();
		this.endModal.show();
	},
	update:function(){
		if(!this.updateable){
			return;
		}
		if(this.currentEnemy && this.ball){
			this.brilhoMeio.getContent().position.x = this.currentEnemy.getContent().position.x;
			this.brilhoMeio.getContent().position.y = this.currentEnemy.getContent().position.y;
			// this.ball.updateShadow(Math.atan2(
			// 	this.ball.getContent().position.y - this.currentEnemy.getContent().position.y,
			// 	this.ball.getContent().position.x - this.currentEnemy.getContent().position.x) - degreesToRadians(90)
			// );
		}else if(this.ball){
			this.ball.hideShadows();
		}
		this._super();
	},
	toTween:function(callback){
		// TweenLite.to(this.bg.getContent(), 0.5, {delay:0.7, alpha:0, ease:'easeOutCubic'});
		// TweenLite.to(this.logo.getContent(), 0.5, {delay:0.1, alpha:0});

	   
		if(this.audioOn){
			TweenLite.to(this.audioOn.getContent(), 0.5, {delay:0.1,y:-this.audioOn.getContent().height, ease:'easeOutBack'});
		}
		if(this.audioOff){
			TweenLite.to(this.audioOff.getContent(), 0.5, {delay:0.1,y:-this.audioOn.getContent().height, ease:'easeOutBack'});
		}

		// if(this.fullscreenButton){
		// 	TweenLite.to(this.fullscreenButton.getContent(), 0.5, {delay:0.3, y:windowHeight, ease:'easeOutBack'});
		// }
		// if(this.moreGames){
		// 	TweenLite.to(this.moreGames.getContent(), 0.5, {delay:0.4, y:windowHeight, ease:'easeOutBack'});
		// }
		var self = this;
		TweenLite.to(this.rotuloContainer, 0.2, {y:-this.rotuloContainer.height, onComplete:function(){
			if(self.rotuloContainer.parent)
			{
				self.rotuloContainer.parent.removeChild(self.rotuloContainer);
			}
		}});
		// TweenLite.to(this.rankingButton.getContent(), 0.2, {y:windowHeight, ease:'easeOutBack'});
		// TweenLite.to(this.shopButton.getContent(), 0.2, {y:windowHeight, ease:'easeOutBack'});
		// TweenLite.to(this.playButton.getContent(), 0.2, {y:windowHeight, ease:'easeOutBack', onComplete:function(){
		// 	if(callback){
		// 		callback();
		// 	}
		// }});
	},
	fromTween:function(callback){

		
		// TweenLite.from(this.bg.getContent(), 0.5, {alpha:0, ease:'easeOutCubic'});
		// TweenLite.from(this.logo.getContent(), 0.5, {delay:0.1, alpha:0});
	   
		if(this.audioOn){
			TweenLite.from(this.audioOn.getContent(), 0.5, {delay:0.1,y:-this.audioOn.getContent().height, ease:'easeOutBack'});
		}
		if(this.audioOff){
			TweenLite.from(this.audioOff.getContent(), 0.5, {delay:0.1,y:-this.audioOn.getContent().height, ease:'easeOutBack'});
		}
		// if(this.fullscreenButton){
		// 	TweenLite.from(this.fullscreenButton.getContent(), 0.5, {delay:0.3, y:windowHeight, ease:'easeOutBack'});
		// }
		TweenLite.from(this.rankingButton.getContent(), 0.2, {y:windowHeight, ease:'easeOutBack'});
		TweenLite.from(this.shopButton.getContent(), 0.2, {y:windowHeight, ease:'easeOutBack'});
		TweenLite.from(this.playButton.getContent(), 0.2, {y:windowHeight, ease:'easeOutBack', onComplete:function(){
			if(callback){
				callback();
			}
		}});
		// if(this.moreGames){
		// 	TweenLite.from(this.moreGames.getContent(), 0.5, {delay:0.5, y:windowHeight, ease:'easeOutBack'});
		// }
	},
	setAudioButtons:function(){
		var self = this;

		APP.mute = true;
		Howler.mute();

		this.audioOn = new DefaultButton('volumeButton_on.png', 'volumeButton_on_over.png');
		this.audioOn.build();
		scaleConverter(this.audioOn.width, windowWidth, 0.15, this.audioOn);
		this.audioOn.setPosition(windowWidth - this.audioOn.getContent().width - 20, 20);
		// this.audioOn.setPosition( windowWidth - this.audioOn.getContent().width  - 20, 20);

		this.audioOff = new DefaultButton('volumeButton_off.png', 'volumeButton_off_over.png');
		this.audioOff.build();
		scaleConverter(this.audioOff.width, windowWidth, 0.15, this.audioOff);
		this.audioOff.setPosition(windowWidth - this.audioOn.getContent().width - 20, 20);

		if(!APP.mute){
			this.addChild(this.audioOn);
		}else{
			this.addChild(this.audioOff);
		}

		this.audioOn.clickCallback = function(){
			APP.mute = true;
			Howler.mute();
			if(self.audioOn.getContent().parent)
			{
				self.audioOn.getContent().parent.removeChild(self.audioOn.getContent());
			}
			if(self.audioOff.getContent())
			{
				self.addChild(self.audioOff);
			}
		};
		this.audioOff.clickCallback = function(){
			APP.mute = false;
			Howler.unmute();
			if(self.audioOff.getContent().parent)
			{
				self.audioOff.getContent().parent.removeChild(self.audioOff.getContent());
			}
			if(self.audioOn.getContent())
			{
				self.addChild(self.audioOn);
			}
		};
	},
	// transitionIn:function()
	// {
	//     console.log('init');
	//     this.frontShape = new PIXI.Graphics();
	//     this.frontShape.beginFill(0x2c2359);
	//     this.frontShape.drawRect(0,0,windowWidth, windowHeight);
	//     this.addChild(this.frontShape);
	//     this.build();

	// },
	// transitionOut:function(nextScreen, container)
	// {
	//     console.log('out');
	//     // this._super();
	//     var self = this;
	//     if(this.frontShape){
	//         this.frontShape.parent.setChildIndex(this.frontShape, this.frontShape.parent.children.length - 1);
	//         TweenLite.to(this.frontShape, 0.3, {alpha:1, onComplete:function(){
	//             self.destroy();
	//             container.removeChild(self.getContent());
	//             nextScreen.transitionIn();
	//         }});
	//     }else{
	//         self.destroy();
	//         container.removeChild(self.getContent());
	//         nextScreen.transitionIn();
	//     }

		
	// },
});