/*jshint undef:false */
var Application = AbstractApplication.extend({
	init:function(){
        var self = this;


        function initialize(){
            self._super(windowWidth, windowHeight);
            self.stage.setBackgroundColor(0xdb453c);
            self.stage.removeChild(self.loadText);

            self.labelDebug = new PIXI.Text('', {font:'15px Arial'});
            // self.stage.addChild(self.labelDebug);
            self.labelDebug.position.y = windowHeight - 20;
            self.labelDebug.position.x = 20;

            self.initialized = true;
            // self.mute = false;

            // self.audioController = new AudioController();

            self.withAPI = false;
            if(window.location.hash === '#withoutAPI'){
                self.withAPI = false;
            }

            // self.build();
        }
        // if(window.intel !== undefined){
        //     document.addEventListener('deviceready', function() {
        //         initialize();
        //     });
        // }else{
        // }
        initialize();

        
	},
    update:function(){
        if(!this.initialized){
            return;
        }
        this._super();
        if(this.withAPI && this.apiLogo && this.apiLogo.getContent().height > 1 && this.apiLogo.getContent().position.x === 0){
            // this.apiLogo.getContent().position.y = windowHeight - this.apiLogo.getContent().height;
            scaleConverter(this.apiLogo.getContent().width, windowWidth, 0.5, this.apiLogo);
            this.apiLogo.getContent().position.x = windowWidth / 2 - this.apiLogo.getContent().width / 2;
        }
        if(!this.screenManager)  {
            return;
        }
        if(!this.screenManager.currentScreen){
            return;
        }
        if(!this.labelDebug || !this.labelDebug.parent){
            return;
        }
        this.childsCounter = 1;
        this.recursiveCounter(this.screenManager.currentScreen);
        this.labelDebug.setText(this.childsCounter);
        // Retrieves the logo from Spil
        
    },
    apiLoaded:function(apiInstance){
        if(!this.withAPI){
            return;
        }
        this.apiInstance = apiInstance;


        //added logo api functions
        var logoData = apiInstance.Branding.getLogo();
        this.apiLogo = new DefaultButton(logoData.image,logoData.image);
        this.apiLogo.build();
        this.apiLogo.clickCallback = function(){
            logoData.action();
        };
        this.stage.addChild(this.apiLogo.getContent());

        //more games function
        this.buttonProperties = apiInstance.Branding.getLink('more_games');

        //call init application after splash screen
        this.apiInstance.Branding.displaySplashScreen(function(){
            APP.initApplication();
        });
    },
    recursiveCounter:function(obj){
        var j = 0;
        if(obj.children){
            for (j = obj.children.length - 1; j >= 0; j--) {
                this.childsCounter ++;
                this.recursiveCounter(obj.children[j]);
            }
        }
        else if(obj.childs){
            for (j = obj.childs.length - 1; j >= 0; j--) {
                this.childsCounter ++;
                this.recursiveCounter(obj.childs[j]);
            }
        }else{
            return;
        }
    },
    build:function(){
        this._super();
        this.cookieManager = new CookieManager();
        this.appModel = new AppModel();
        if(!this.withAPI){
            this.initApplication();
        }
    },
    initApplication:function(){
        this.initScreen = new InitScreen('Init');
        this.choiceScreen = new ChoiceScreen('Choice');
        this.gameScreen = new GameScreen('Game');
        this.loadScreen = new LoadScreen('Loader');
        this.screenManager.addScreen(this.loadScreen);
        this.screenManager.addScreen(this.initScreen);
        this.screenManager.addScreen(this.choiceScreen);
        this.screenManager.addScreen(this.gameScreen);
        this.screenManager.change('Loader');
    },
    show:function(){
    },
    hide:function(){
    },
    destroy:function(){
    }
});