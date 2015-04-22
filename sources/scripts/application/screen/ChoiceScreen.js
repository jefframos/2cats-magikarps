/*jshint undef:false */
var ChoiceScreen = AbstractScreen.extend({
    init: function (label) {
        this._super(label);
        this.isLoaded = false;
        // alert(this.isLoaded);
    },
    destroy: function () {
        this._super();
    },
    build: function () {
        this._super();

        var assetsToLoader = [];
        this.loader = new PIXI.AssetLoader(assetsToLoader);

        if(assetsToLoader.length > 0){
            this.initLoad();
        }else{
            this.onAssetsLoaded();
        }
        this.updateable = true;
    },
    update:function(){
        if(!this.updateable){
            return;
        }
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

        // this.bg = new SimpleSprite('bg1.jpg');
        
        
        
        

        this.scrollContainer1 = new PIXI.DisplayObjectContainer();
        this.addChild(this.scrollContainer1);
        this.scrollContainer2 = new PIXI.DisplayObjectContainer();
        this.addChild(this.scrollContainer2);
        this.scrollContainer3 = new PIXI.DisplayObjectContainer();
        this.addChild(this.scrollContainer3);
        var tempGraphics = new PIXI.Graphics();
        var marginTopBottom = windowHeight * 0.3;
        this.shopList = [];
        this.towelList = [];
        this.burgerList = [];

        this.saucesLabel = new PIXI.Text('SAUCES', {font:'50px Vagron', fill:'#FFFFFF'});
        // scaleConverter(this.saucesLabel.width, windowWidth, 0.25, this.saucesLabel);
        this.saucesLabel.position.x = windowWidth / 2 - this.saucesLabel.width / 2;
        this.saucesLabel.position.y = 100;
        this.scrollContainer1.addChild(this.saucesLabel);


        var line = -1;
        var col = 0;
        var i = 0;
        var shopItem;
        var shopItemTowel;
        var shopItemBurger;
        var margin = 0;
        var initY = this.saucesLabel.position.y + (this.saucesLabel.height * 1.5);
        for (i = 0; i < APP.appModel.playerModels.length; i++) {
            shopItem = new ShopItem(this);
            shopItem.build(APP.appModel.playerModels[i]);
            this.scrollContainer1.addChild(shopItem.getContent());
            if(i % 2 === 0){
                col = 0;
                line++;
            }else{
                col ++;
            }
            // scaleConverter(shopItem.getContent().width, windowWidth, 0.4, shopItem.getContent());
            if(margin === 0){
                margin = 5+(windowWidth - (shopItem.getContent().width * 1.2 + shopItem.getContent().width))/2;
            }
            shopItem.getContent().position.y = line * (shopItem.getContent().height * 1.2) + initY;
            shopItem.getContent().position.x = (shopItem.getContent().width + shopItem.getContent().height*0.2) * col + margin;
            this.shopList.push(shopItem);
            shopItem.updateStats();

        }

        console.log('INIT');

       

        this.foodLabel = new PIXI.Text('FOOD', {font:'50px Vagron', fill:'#FFFFFF'});
        // scaleConverter(this.foodLabel.width, windowWidth, 0.25, this.foodLabel);
        this.foodLabel.position.x = windowWidth / 2 - this.foodLabel.width / 2;
        this.foodLabel.position.y = shopItem.getContent().position.y + shopItem.getContent().height * 1.5;
        this.foodLabel.position.y = 100;
        this.scrollContainer2.addChild(this.foodLabel);

        line = -1;
        col = 0;
        initY = this.foodLabel.position.y + (this.foodLabel.height * 1.5);

        for (i = 0; i < APP.appModel.burguersModels.length; i++) {
            shopItemBurger = new ShopItemBurger(this);
            shopItemBurger.build(APP.appModel.burguersModels[i]);
            this.scrollContainer2.addChild(shopItemBurger.getContent());
            if(i % 2 === 0){
                col = 0;
                line++;
            }else{
                col ++;
            }
            scaleConverter(shopItemBurger.getContent().width, windowWidth, 0.4, shopItemBurger.getContent());
            shopItemBurger.getContent().position.y = line * (shopItemBurger.getContent().height * 1.2) + initY;
            shopItemBurger.getContent().position.x = (shopItemBurger.getContent().width + shopItemBurger.getContent().height*0.2) * col  + margin;
            this.burgerList.push(shopItemBurger);
            shopItemBurger.updateStats();
        }

        this.tableLabel = new PIXI.Text('TABLE', {font:'50px Vagron', fill:'#FFFFFF'});
        // scaleConverter(this.tableLabel.width, windowWidth, 0.25, this.tableLabel);
        this.tableLabel.position.x = windowWidth / 2 - this.tableLabel.width / 2;
        this.tableLabel.position.y = shopItemBurger.getContent().position.y + shopItemBurger.getContent().height * 1.5;
        this.tableLabel.position.y = 100;
        this.scrollContainer3.addChild(this.tableLabel);

        initY = this.tableLabel.position.y + (this.tableLabel.height * 1.5);

        line = -1;
        col = 0;
        for (i = 0; i < APP.appModel.towelModels.length; i++) {
            shopItemTowel = new ShopItemTowel(this);
            shopItemTowel.build(APP.appModel.towelModels[i]);
            this.scrollContainer3.addChild(shopItemTowel.getContent());
            if(i % 2 === 0){
                col = 0;
                line++;
            }else{
                col ++;
            }
            scaleConverter(shopItemTowel.getContent().width, windowWidth, 0.4, shopItemTowel.getContent());
            shopItemTowel.getContent().position.y = line * (shopItemTowel.getContent().height * 1.2) + initY;//line * (shopItemTowel.getContent().height * 1.2) + marginTopBottom * 0.5 + shopItem.getContent().position.y;
            shopItemTowel.getContent().position.x = (shopItemTowel.getContent().width + shopItemTowel.getContent().height*0.2) * col + margin;//(shopItemTowel.getContent().width * 1.2) * col  + margin;
            this.towelList.push(shopItemTowel);
            shopItemTowel.updateStats();
        }

        


        this.back = new PIXI.Graphics();
        this.back.beginFill(0xECBC0C);
        this.back.drawRect(0,0,windowWidth,windowHeight);
        this.back.height = shopItemTowel.getContent().position.y + shopItemTowel.getContent().height + marginTopBottom / 2;
        this.addChild(this.back);
        this.back.parent.setChildIndex(this.back, 0);

        // this.backMiddle = new PIXI.Graphics();
        // this.backMiddle.beginFill(0xdb453c);
        // this.backMiddle.drawRect(0,0,windowWidth,this.scrollContainer1.height);
        // this.backMiddle.position.y = this.burgerList[0].getContent().position.y - 30;
        // this.backMiddle.height = (shopItemBurger.getContent().position.y + shopItemBurger.getContent().height) - this.burgerList[0].getContent().position.y + 60;
        // this.scrollContainer2.addChild(this.backMiddle);
        // this.scrollContainer2.setChildIndex(this.backMiddle, 1);

        // this.applyScroll(this.scrollContainer);

        this.backTop = new PIXI.Graphics();
        this.backTop.beginFill(0xdb453c);
        this.backTop.drawRect(0,0,windowWidth,windowHeight*0.1);
        this.container.addChild(this.backTop);
        // this.scrollContainer1.setChildIndex(this.backTop, 0);

        this.textScreen = new PIXI.Text('SHOP', {font:'50px Vagron', fill:'#FFFFFF'});
        scaleConverter(this.textScreen.width, windowWidth, 0.25, this.textScreen);
        this.textScreen.position.x = windowWidth / 2 - this.textScreen.width / 2;
        this.textScreen.position.y = this.backTop.height / 2 - this.textScreen.height / 2;
        this.container.addChild(this.textScreen);


        this.playButton = new DefaultButton('play1.png', 'play1.png');
        this.playButton.build();
        // this.playButton.addLabel(new PIXI.Text('PLAY', {font:'50px Vagron', fill:'#FFFFFF'}), 45,2);
        scaleConverter(this.playButton.getContent().height, this.textScreen.height, 1, this.playButton);
        this.playButton.setPosition(windowWidth - this.playButton.getContent().width  - windowWidth * 0.1,this.backTop.height / 2 - this.playButton.getContent().height / 2);
        this.addChild(this.playButton);
      
        this.playButton.clickCallback = function(){
            self.updateable = false;
            self.toTween(function(){
                self.screenManager.change('Init');
                APP.goDirect = true;
            });
        };

        this.coinsLabel = new PIXI.Text('x'+APP.totalCoins, {font:'50px Vagron', fill:'#FFFFFF'});
        scaleConverter(this.coinsLabel.height, this.playButton.getContent().height, 1, this.coinsLabel);
        this.coinsLabel.position.x = windowWidth * 0.1;
        this.coinsLabel.position.y = this.backTop.height / 2 - this.coinsLabel.height / 2;
        this.container.addChild(this.coinsLabel);

        this.currentPage = 0;
        this.currentPageLast = 1;
        this.vecPages = [this.scrollContainer1, this.scrollContainer2,this.scrollContainer3];
        for (var j = this.vecPages.length - 1; j >= 0; j--) {
            this.vecPages[j].position.x = windowWidth;
        }

        this.balls = [];
        var tempBall;
        this.containerBalls = new PIXI.DisplayObjectContainer();
        this.addChild(this.containerBalls);
        for (var k = 0; k < this.vecPages.length; k++) {
            tempBall = new PIXI.Graphics();
            tempBall.beginFill(0xFFFFFF);
            tempBall.drawCircle(10,0,10);
            tempBall.position.x = tempBall.width * 1.5 * k;
            this.balls.push(tempBall);
            this.containerBalls.addChild(tempBall);

            tempBall.tint = 0xFFFFFF;
        }

        scaleConverter(this.containerBalls.width, windowWidth, 0.12, this.containerBalls);
        this.containerBalls.position.x = windowWidth / 2 - this.containerBalls.width / 2;
        var lalalaTop = (this.scrollContainer1.position.y + shopItem.getContent().position.y + shopItem.getContent().height );
        var lalalal = windowHeight - lalalaTop;
        this.containerBalls.position.y = lalalal / 2 + lalalaTop;


        this.updateShopList('right');

        if(this.hammer){
            this.hammer.off('swiperight');
            this.hammer.off('swipeleft');
        }

        var swipe     = new Hammer.Swipe();
        this.hammer    = new Hammer.Manager(renderer.view);
        this.hammer.add(swipe);


        this.hammer.on('swiperight', function(event) {
            if(self.currentPage <= 0)
            {
                self.currentPage = self.vecPages.length - 1;
            }else{
                self.currentPage --;
            }
            self.updateShopList('right');
        });

        this.hammer.on('swipeleft', function(event) {
            if(self.currentPage >= self.vecPages.length - 1)
            {
                self.currentPage = 0;
            }else{
                self.currentPage ++;
            }
            self.updateShopList('left');
        });

    },
    updateShopList:function( side){

        if(this.initSider){
            return;
        }
        this.initSider = true;
        var self = this;
        if(side === 'right'){
            console.log(this.vecPages[this.currentPage].x, ' - 1', this.currentPage);
            this.vecPages[this.currentPage].position.x = - this.vecPages[this.currentPage].width;
            console.log(this.vecPages[this.currentPage].x, ' - 2');

            TweenLite.to(this.vecPages[this.currentPage], 0.5, {x:0, onComplete:function(){
                self.initSider = false;
            }});
            TweenLite.to(this.vecPages[this.currentPageLast], 0.5, {x:windowWidth});
        }else{
            // console.log('left');
            this.vecPages[this.currentPage].position.x = windowWidth;
            TweenLite.to(this.vecPages[this.currentPageLast], 0.5, {x:-this.vecPages[this.currentPageLast].width * 1.2});
            TweenLite.to(this.vecPages[this.currentPage], 0.5, {x:0, onComplete:function(){
                self.initSider = false;
            }});
        }
        this.balls[this.currentPage].tint = 0xdb453c;
        this.balls[this.currentPageLast].tint = 0xFFFFFF;
        this.currentPageLast = this.currentPage;
    },
    updateCoins:function(){
        this.coinsLabel.setText('x'+APP.totalCoins);
        this.coinsLabel.position.x = windowWidth * 0.1;
        this.coinsLabel.position.y = this.backTop.height / 2 - this.coinsLabel.height / 2;
    },
    applyScroll:function(container){
        container.interactive = true;
        // container.mouseout = container.touchend = function(mouseData){
        //     container.mouseDown = false;
        // };
         
        container.mousedown  = container.touchstart = function(mouseData){
            // APP.scrolling = true;
            setTimeout(function() {
                APP.scrolling = false;
            }, 100);
            container.mouseDown = true;
            container.initGlobalY = mouseData.global.y - container.position.y;
        };

        container.mousemove = container.touchmove  = function(mouseData){
            if(container.mouseDown){
                
                container.lastVelY = (mouseData.global.y - container.initGlobalY) - container.position.y;

                var posDest = verifyPos(mouseData.global.y - container.initGlobalY);
                // if(pointDistance(0,posDest,0, container.position.y) < 31){
                //     return;
                // }
                
                container.position.y = posDest;
                TweenLite.killTweensOf(container.position);
            }
        };
         
        container.mouseup  = container.touchend = function(mouseData){
            container.mouseDown = false;

            var posDest = verifyPos(container.position.y + container.lastVelY * 5);
            console.log(container.initGlobalY, posDest, container.position.y);
            if(pointDistance(0,posDest,0, container.position.y) < 31){
                return;
            }
            TweenLite.to(container.position, Math.abs(container.lastVelY) / 120, {y:posDest, onComplete:function(){
                APP.scrolling = false;
            }});
        };
        function verifyPos(posReturn){
            if(posReturn > 0){
                posReturn = 0;
            }
            if(container.height > windowHeight){
                if(Math.abs(posReturn) + windowHeight > container.height){
                    posReturn = -container.height + windowHeight;
                }
            }else{
                if(posReturn + container.height > windowHeight){
                    posReturn = windowHeight - container.height;
                }
            }
            return posReturn;
        }
    },
    toTween:function(callback){
        
        TweenLite.to(this.textScreen, 0.1, {delay:0.1, alpha:0});
       
        TweenLite.to(this.playButton.getContent(), 0.1, {delay:0.1, y:-this.playButton.getContent().height, ease:'easeOutBack', onComplete:function(){
            if(callback){
                callback();
            }
        }});
    },
    fromTween:function(callback){
        console.log('from');
        
        TweenLite.from(this.textScreen, 0.1, {delay:0.1, alpha:0});
        TweenLite.from(this.playButton.getContent(), 0.1, {delay:0.1, y:windowHeight, ease:'easeOutBack', onComplete:function(){
            if(callback){
                callback();
            }
        }});
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