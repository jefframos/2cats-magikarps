/*jshint undef:false */
var ShopItem = Class.extend({
	init:function(screen, type, arrayModels, arrayPlaced){
		this.screen = screen;
		this.type = type;
		this.arrayModels = arrayModels;
		this.arrayPlaced = arrayPlaced;
		this.container = new PIXI.DisplayObjectContainer();
	},
	build:function(model){
		this.model = model;
		// console.log(model);

		this.equippedBox = new PIXI.Graphics();
		this.equippedBox.beginFill(0xFFFFFF);
		this.equippedBox.drawRect(-10,-10,windowWidth/ 2.5+20, windowWidth/ 3.5+20);
		this.equippedBox.alpha = 1;
		// this.container.addChild(this.equippedBox);

		this.backScroll = new PIXI.Graphics();
        this.backScroll.beginFill(0xdb453c);
        this.backScroll.drawRect(0,0,windowWidth/ 2.5, windowWidth/ 3.5);
        this.backScroll.alpha = 0.2;
        this.container.addChild(this.backScroll);


        this.backShopItem = new PIXI.Graphics();
        this.backShopItem.beginFill(this.model.color);
        this.backShopItem.drawRect(0,0,this.backScroll.width, this.backScroll.height);
        this.backShopItem.alpha = 1;
        this.container.addChild(this.backShopItem);



		var self = this;

		// alert(this.backShopItem.height);

		this.equipped = new PIXI.Text(this.model.label, {align:'center',font:'20px Vagron', fill:'#FFF', wordWrap:true, wordWrapWidth:500});
		// scaleConverter(this.equipped.width, this.backShopItem.width, 0.75, this.equipped);
		this.equipped.position.x = this.backScroll.width / 2 - this.equipped.width/2;
		this.equipped.position.y = this.backScroll.height / 2 - this.equipped.height/2;

		this.valueLabel = new PIXI.Text(this.model.value+' BUY', {align:'center',font:'50px Vagron', fill:'#ECBC0C', wordWrap:true, wordWrapWidth:500});
		scaleConverter(this.valueLabel.width, this.backShopItem.width, 0.75, this.valueLabel);
		this.valueLabel.position.x = this.backScroll.width / 2 - this.valueLabel.width/2;
		this.valueLabel.position.y = this.backScroll.height / 2 - this.valueLabel.height/2;
		// this.equipped.position.y = 20;

		this.equipButton = new DefaultButton('UI_button_default_1.png', 'UI_button_default_1.png');
		this.equipButton.build(this.backScroll.width, this.backScroll.height);
		this.equipButton.getContent().alpha = 0;
		// this.equipButton.addLabel(new PIXI.Text('EQUIP', {font:'35px Vagron', fill:'#db453c'}), 33,5);
		this.equipButton.setPosition(this.backScroll.width/2 - this.equipButton.getContent().width /2,this.backShopItem.height/2 - this.equipButton.getContent().height/2);//this.backBars.getContent().height - 20 - this.continueButton.height / 2 - 10);
		this.equipButton.clickCallback = this.equipButton.mouseUpCallback = function(){
			if(APP.scrolling){
				return;
			}
			APP.appModel.currentPlayerModel = self.model;
			var targetArray = self.screen.shopList;
			for (var i = targetArray.length - 1; i >= 0; i--) {
				targetArray[i].updateStats();
			}
			self.updateStats();
		};

		this.frontShopBlock = new PIXI.Graphics();
        this.frontShopBlock.beginFill(0xdb453c);
        this.frontShopBlock.drawRect(0,0,this.backScroll.width, this.backScroll.height);
        this.frontShopBlock.alpha = 1;
        this.container.addChild(this.frontShopBlock);


		this.buyButton = new DefaultButton('UI_button_default_2.png', 'UI_button_default_2.png');
		this.buyButton.build(this.backScroll.width, this.backScroll.height);
		this.buyButton.getContent().alpha = 0;
		this.buyButton.setPosition(0,0);//this.backBars.getContent().height - 20 - this.continueButton.height / 2 - 10);
		this.buyButton.clickCallback = this.buyButton.mouseUpCallback = function(){
			// alert(self.model.value);
			if(self.model.value > APP.totalCoins || APP.scrolling){
				return;
			}
			APP.totalCoins -= self.model.value;
			self.screen.updateCoins();
			APP.appModel.currentPlayerModel = self.model;
			APP.appModel.currentPlayerModel.enabled = true;
			APP.appModel.saveScore();
			var targetArray = self.screen.shopList;
			for (var i = targetArray.length - 1; i >= 0; i--) {
				targetArray[i].updateStats();
			}
			self.updateStats();
		};


		// this.updateStats();

		
	},
	updateStats:function(){
		
		console.log('updateStats');
		if(this.equipped && this.equipped.parent){
			this.equipped.parent.removeChild(this.equipped);
		}
		if(this.equipButton.getContent() && this.equipButton.getContent().parent){
			this.equipButton.getContent().parent.removeChild(this.equipButton.getContent());
		}
		if(this.equippedBox && this.equippedBox.parent){
			this.equippedBox.parent.removeChild(this.equippedBox);
		}
		if(this.buyButton.getContent() && this.buyButton.getContent().parent){
			this.buyButton.getContent().parent.removeChild(this.buyButton.getContent());
		}
		if(this.frontShopBlock && this.frontShopBlock.parent){
			this.frontShopBlock.parent.removeChild(this.frontShopBlock);
		}
		if(this.valueLabel && this.valueLabel.parent){
			this.valueLabel.parent.removeChild(this.valueLabel);
		}

		var isEquiped = false;

		if(APP.appModel.currentPlayerModel.id === this.model.id){
			this.container.addChild(this.equipped);
			this.container.addChild(this.equippedBox);
			this.container.setChildIndex(this.equippedBox, 0);
			isEquiped = true;
		}
		
		if(!isEquiped && this.model.enabled){
			this.container.addChild(this.equipped);
			this.container.addChild(this.equipButton.getContent());

		}else if(!this.model.enabled){
			this.container.addChild(this.frontShopBlock);
			this.container.addChild(this.buyButton.getContent());
			this.container.addChild(this.valueLabel);
		}
		// alert('updateStats here');
	},
	getContent:function(){
		return this.container;
	}
});