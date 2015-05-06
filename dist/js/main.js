/*! jefframos 06-05-2015 */
function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    var h, s, max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
    if (max === min) h = s = 0; else {
        var d = max - min;
        switch (s = l > .5 ? d / (2 - max - min) : d / (max + min), max) {
          case r:
            h = (g - b) / d + (b > g ? 6 : 0);
            break;

          case g:
            h = (b - r) / d + 2;
            break;

          case b:
            h = (r - g) / d + 4;
        }
        h /= 6;
    }
    return {
        h: h,
        s: s,
        l: l
    };
}

function hslToRgb(h, s, l) {
    function hue2rgb(p, q, t) {
        return 0 > t && (t += 1), t > 1 && (t -= 1), 1 / 6 > t ? p + 6 * (q - p) * t : .5 > t ? q : 2 / 3 > t ? p + (q - p) * (2 / 3 - t) * 6 : p;
    }
    var r, g, b;
    if (0 === s) r = g = b = l; else {
        var q = .5 > l ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3), g = hue2rgb(p, q, h), b = hue2rgb(p, q, h - 1 / 3);
    }
    return {
        r: Math.round(255 * r),
        g: Math.round(255 * g),
        b: Math.round(255 * b)
    };
}

function toHex(n) {
    return n = parseInt(n, 10), isNaN(n) ? "00" : (n = Math.max(0, Math.min(n, 255)), 
    "0123456789ABCDEF".charAt((n - n % 16) / 16) + "0123456789ABCDEF".charAt(n % 16));
}

function rgbToHex(R, G, B) {
    return parseInt("0x" + toHex(R) + toHex(G) + toHex(B));
}

function hexToRgb(hex) {
    var r = hex >> 16, g = hex >> 8 & 255, b = 255 & hex;
    return {
        r: r,
        g: g,
        b: b
    };
}

function addHue(color, value) {
    var rgb = hexToRgb(color), hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    return hsl.s *= value, hsl.h > 1 && (hsl.h = 1), hsl.h < 0 && (hsl.h = 0), rgb = hslToRgb(hsl.h, hsl.s, hsl.l), 
    rgbToHex(rgb.r, rgb.g, rgb.b);
}

function setSaturation(color, value) {
    var rgb = hexToRgb(color), hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    return hsl.s = value, rgb = hslToRgb(hsl.h, hsl.s, hsl.l), rgbToHex(rgb.r, rgb.g, rgb.b);
}

function addSaturation(color, value) {
    var rgb = hexToRgb(color), hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    return hsl.s *= value, hsl.s > 1 && (hsl.s = 0), hsl.s < 0 && (hsl.s = 1), rgb = hslToRgb(hsl.h, hsl.s, hsl.l), 
    rgbToHex(rgb.r, rgb.g, rgb.b);
}

function addBright(color, value) {
    var rgb = hexToRgb(color), hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    return hsl.l *= value, hsl.l > 1 && (hsl.l = 1), hsl.l < 0 && (hsl.l = 0), rgb = hslToRgb(hsl.h, hsl.s, hsl.l), 
    rgbToHex(rgb.r, rgb.g, rgb.b);
}

function pointDistance(x, y, x0, y0) {
    return Math.sqrt((x -= x0) * x + (y -= y0) * y);
}

function degreesToRadians(deg) {
    return deg * (Math.PI / 180);
}

function radiansToDegrees(rad) {
    return rad / (Math.PI / 180);
}

function scaleConverter(current, max, _scale, object) {
    var scale = max * _scale / current;
    return object ? (object.scale ? object.scale.x = object.scale.y = scale : object.getContent() && object.getContent().scale && (object.getContent().scale.x = object.getContent().scale.y = scale), 
    scale) : scale;
}

function shuffle(array) {
    for (var temp, index, counter = array.length; counter > 0; ) index = Math.floor(Math.random() * counter), 
    counter--, temp = array[counter], array[counter] = array[index], array[index] = temp;
    return array;
}

function testMobile() {
    return Modernizr.touch;
}

function isPortait() {
    return window.innerHeight > window.innerWidth;
}

function possibleFullscreen() {
    var elem = gameView;
    return elem.requestFullscreen || elem.msRequestFullscreen || elem.mozRequestFullScreen || elem.webkitRequestFullscreen;
}

function updateResolution(orientation, scale) {
    "portait" === orientation ? screen.height > screen.width ? (windowWidth = screen.width * scale, 
    windowWidthVar = screen.width, possibleFullscreen() ? (windowHeight = screen.height * scale, 
    windowHeightVar = screen.height) : (windowHeight = window.devicePixelRatio >= 2 ? window.innerHeight * scale : window.outerHeight * scale, 
    windowHeightVar = window.outerHeight * scale)) : (windowWidth = screen.height * scale, 
    windowHeight = screen.width * scale, windowWidthVar = screen.height, windowHeightVar = screen.width) : screen.height < screen.width ? (windowWidth = screen.width * scale, 
    windowHeight = screen.height * scale, windowWidthVar = screen.width, windowHeightVar = screen.height) : (windowWidth = screen.height * scale, 
    windowHeight = screen.width * scale, windowWidthVar = screen.height, windowHeightVar = screen.width), 
    realWindowWidth = windowWidth, realWindowHeight = windowHeight;
}

function update() {
    requestAnimFrame(update), init || !isPortait() && testMobile() || (windowWidth = res.x, 
    windowHeight = res.y, realWindowWidth = res.x, realWindowHeight = res.y, testMobile() ? (updateResolution(screenOrientation, gameScale), 
    renderer = PIXI.autoDetectRecommendedRenderer(realWindowWidth, realWindowHeight, {
        antialias: !0,
        resolution: retina,
        view: gameView
    })) : renderer = PIXI.autoDetectRenderer(realWindowWidth, realWindowHeight, {
        antialias: !0,
        resolution: retina,
        view: gameView
    }), renderer.view.style.width = windowWidth + "px", renderer.view.style.height = windowHeight + "px", 
    APP = new Application(), APP.build(), APP.show(), init = !0);
    var tempRation = window.innerHeight / windowHeight, ratioRez = resizeProportional ? tempRation < window.innerWidth / realWindowWidth ? tempRation : window.innerWidth / realWindowWidth : 1;
    windowWidthVar = realWindowWidth * ratioRez * ratio, windowHeightVar = realWindowHeight * ratioRez * ratio, 
    windowWidthVar > realWindowWidth && (windowWidthVar = realWindowWidth), windowHeightVar > realWindowHeight && (windowHeightVar = realWindowHeight), 
    renderer && (renderer.view.style.width = windowWidthVar + "px", renderer.view.style.height = windowHeightVar + "px", 
    APP.update(), renderer.render(APP.stage));
}

function fullscreen() {
    if (!isfull) {
        var elem = gameView;
        elem.requestFullscreen ? elem.requestFullscreen() : elem.msRequestFullscreen ? elem.msRequestFullscreen() : elem.mozRequestFullScreen ? elem.mozRequestFullScreen() : elem.webkitRequestFullscreen && elem.webkitRequestFullscreen(), 
        updateResolution(screenOrientation, gameScale), isfull = !0;
    }
}

var DungeonGenerator = Class.extend({
    init: function() {
        this.random = 0, this.numActivesNodes = 0, this.maxDist = 5, this.minNodes = 5, 
        this.seeds = 1, this.rooms = [], this.maxNodes = 10, this.mostDistant = new NodeModel(), 
        this.nodeLock = new NodeModel(), this.firstNode = new NodeModel(), this.keyNode = new NodeModel(), 
        this.precision = 1, this.seed = 0, this.rooms = [];
    },
    generate: function(seed, precision, minMax, bounds, maxLenght, start) {
        this.seed = seed, random = 0, 0 > maxLenght && (maxLenght = 99999), this.minNodes = minMax[0], 
        this.maxNodes = minMax[1], this.precision = precision, this.numActivesNodes = 0, 
        this.maxDist = -999999999, this.seeds = 1;
        var i = 0, j = 0;
        if (this.rooms.length <= 0) for (i = 0; i < bounds[0]; i++) {
            var temp = [];
            for (j = 0; j < bounds[1]; j++) {
                var tempModel = new NodeModel();
                tempModel.position = [ i, j ], temp.push(tempModel);
            }
            this.rooms.push(temp);
        }
        this.generateNodes(start ? start[0] : Math.floor(bounds[0] / 2), start ? start[1] : Math.floor(bounds[1] / 2), null, maxLenght), 
        this.mostDistant.mode = 4;
        var keyDistance = -9999999999;
        for (k = 0; k < this.rooms.length; k++) {
            var item = this.rooms[k];
            for (i = 0; i < item.length; i++) {
                var dist = this.pointDistance(this.mostDistant.position[0], this.mostDistant.position[1], item[i].position[0], item[i].position[1]);
                dist >= keyDistance && item[i].active && item[i].parentId > 0 && (keyDistance = dist, 
                this.keyNode = item[i]), item[i].parentId > 0 && item[i].position[0] === this.mostDistant.parentPosition[0] && item[i].position[1] === this.mostDistant.parentPosition[1] && (this.nodeLock = item[i]);
            }
        }
        this.nodeLock && (this.nodeLock.mode = 5), this.keyNode && (this.keyNode.mode = 6);
    },
    log: function() {
        for (var i = 0; i < this.rooms.length; i++) {
            for (var tempStr = "", item = this.rooms[i], j = 0; j < item.length; j++) 0 === item[j].mode && (tempStr += "| - |"), 
            1 === item[j].mode && (tempStr += "| ♥ |"), 2 === item[j].mode && (tempStr += "| o |"), 
            3 === item[j].mode && (tempStr += "| c |"), 4 === item[j].mode && (tempStr += "| b |"), 
            5 === item[j].mode && (tempStr += "| l |"), 6 === item[j].mode && (tempStr += "| K |");
            console.log(tempStr + "   " + i);
        }
        console.log(this.firstNode);
    },
    generateNodes: function(i, j, parent, maxLeght, forceAdd) {
        if (!((this.numActivesNodes >= this.maxNodes || 0 >= maxLeght) && !forceAdd || this.numActivesNodes > 50)) {
            for (var node = null, jj = 0; jj < this.rooms.length; jj++) for (var item = this.rooms[jj], ii = 0; ii < item.length; ii++) item[ii].position[0] === i && item[ii].position[1] === j && (node = item[ii]);
            if (node) {
                if (node.active && !forceAdd) return void this.minNodes++;
                if (this.minNodes--, node.mode = 2, this.numActivesNodes++, node.active = !0, node.id < 0 && (node.id = this.numActivesNodes, 
                node.seed = this.getNextFloat(), node.applySeed()), parent && 1 !== node.id) {
                    node.parentPosition = parent.position, node.parentId = parent.id, node.parent = parent;
                    var dist = this.pointDistance(parent.position[0], parent.position[1], this.firstNode.position[0], this.firstNode.position[1]);
                    for (node.dist = dist, this.maxDist <= dist && node.parentId > 2 && (this.maxDist = dist, 
                    this.mostDistant = node), node.dist = dist, ri = this.rooms.length - 1; ri >= 0; ri--) {
                        var tempNodeArray = this.rooms[ri];
                        for (nj = tempNodeArray.length - 1; nj >= 0; nj--) tempNodeArray[nj].id === node.parentId && (tempNodeArray[nj].position[1] > node.position[1] ? tempNodeArray[nj].childrenSides[0] = node : tempNodeArray[nj].position[1] < node.position[1] ? tempNodeArray[nj].childrenSides[1] = node : tempNodeArray[nj].position[0] > node.position[0] ? tempNodeArray[nj].childrenSides[2] = node : tempNodeArray[nj].position[0] < node.position[0] && (tempNodeArray[nj].childrenSides[3] = node));
                    }
                    node.parent.position[1] < node.position[1] ? node.childrenSides[0] = node.parent : node.parent.position[1] > node.position[1] ? node.childrenSides[1] = node.parent : node.parent.position[0] < node.position[0] ? node.childrenSides[2] = node.parent : node.parent.position[0] > node.position[0] && (node.childrenSides[3] = node.parent);
                } else node.id = 1, node.mode = 1, this.firstNode = node;
                var has = !1;
                if (this.getNextFloat() < this.seeds || this.minNodes > 0) {
                    this.seeds *= this.precision;
                    for (var tmpArr = [ 0, 0 ], arrayGens = [], rndTest = 1 === node.id, rndValue = rndTest ? .9 : .4, k = 0; 4 > k; k++) if (this.getNextFloat() < rndValue) {
                        has = !0, 0 === k ? tmpArr = [ -1, 0 ] : 1 === k ? tmpArr = [ 1, 0 ] : 2 === k ? tmpArr = [ 0, 1 ] : 3 === k && (tmpArr = [ 0, -1 ]);
                        var objGen = {};
                        objGen.i = i + tmpArr[0], objGen.j = j + tmpArr[1], objGen.parentPosition = [ i, j ], 
                        objGen.parent = node, arrayGens.push(objGen);
                    }
                    for (var n = arrayGens.length - 1; n >= 0; n--) {
                        var obj = arrayGens[n];
                        rndTest || maxLeght--, this.generateNodes(obj.i, obj.j, obj.parent, maxLeght, rndTest);
                    }
                    if (this.minNodes > 0 || this.seeds >= 1) {
                        var tempRnd = this.getNextFloat();
                        tmpArr = .25 > tempRnd ? [ -1, 0 ] : .5 > tempRnd ? [ 1, 0 ] : .75 > tempRnd ? [ 0, 1 ] : [ 0, -1 ], 
                        this.generateNodes(i + tmpArr[0], j + tmpArr[1], node, --maxLeght);
                    }
                }
                has || (node.mode = 3);
            }
        }
    },
    pointDistance: function(x, y, x0, y0) {
        return Math.sqrt((x -= x0) * x + (y -= y0) * y);
    },
    getNextFloat: function() {
        var x = 1e4 * Math.sin(this.seed++);
        return x - Math.floor(x);
    }
}), Float = Class.extend({
    init: function(seed) {
        this.seed = seed, this.tempAccSeed = this.seed;
    },
    applySeed: function() {
        this.tempAccSeed = this.seed;
    },
    getNextFloat: function() {
        var x = 1e4 * Math.sin(this.tempAccSeed++);
        return x - Math.floor(x);
    }
}), NodeModel = Class.extend({
    init: function() {
        this.position = [], this.dist = 0, this.parentPosition = [], this.childrenSides = [ null, null, null, null ], 
        this.parentId = -1, this.parent = null, this.active = !1, this.mode = 0, this.id = -1, 
        this.seed = -1, this.tempAccSeed = this.seed, this.bg = null, this.mapData = null, 
        this.topTile = {
            x: 0,
            y: 0
        }, this.bottomTile = {
            x: 0,
            y: 0
        }, this.leftTile = {
            x: 0,
            y: 0
        }, this.rightTile = {
            x: 0,
            y: 0
        }, this.placedTiles = [];
    },
    applySeed: function() {
        this.tempAccSeed = this.seed;
    },
    getNextFloat: function() {
        var x = 1e4 * Math.sin(this.tempAccSeed++);
        return x - Math.floor(x);
    }
}), SmartObject = Class.extend({
    init: function() {
        MicroEvent.mixin(this);
    },
    show: function() {},
    hide: function() {},
    build: function() {},
    destroy: function() {}
}), SmartSocket = Class.extend({
    init: function() {
        MicroEvent.mixin(this);
    },
    build: function() {},
    writeObj: function(obj) {
        this.trigger(SmartSocket.WRITE_OBJ, obj);
    },
    readSocketList: function(obj) {
        this.trigger(SmartSocket.READ_SOCKET_SNAPSHOT, obj);
    },
    readObj: function(obj) {
        this.trigger(SmartSocket.READ_OBJ, obj);
    },
    readLast: function(obj) {
        this.trigger(SmartSocket.READ_LAST, obj);
    },
    setReadCallback: function(callback) {
        this.readCallback = callback;
    },
    socketError: function(error) {
        this.trigger(SmartSocket.SOCKET_ERROR, obj);
    },
    setObj: function(obj) {
        this.trigger(SmartSocket.SET_OBJ, obj);
    },
    updateObj: function(obj) {
        this.trigger(SmartSocket.UPDATE_OBJ, obj);
    },
    destroy: function() {}
});

SmartSocket.UPDATE_OBJ = "updateObj", SmartSocket.READ_OBJ = "readObj", SmartSocket.READ_SOCKET_SNAPSHOT = "readSocketSnapshot", 
SmartSocket.READ_LAST = "readLast", SmartSocket.WRITE_OBJ = "writeObj", SmartSocket.SET_OBJ = "setObj", 
SmartSocket.SOCKET_ERROR = "socketError";

var Application = AbstractApplication.extend({
    init: function() {
        function initialize() {
            self._super(windowWidth, windowHeight), self.stage.setBackgroundColor(self.backColor), 
            self.stage.removeChild(self.loadText), self.labelDebug = new PIXI.Text("", {
                font: "15px Arial"
            }), self.stage.addChild(self.labelDebug), self.labelDebug.position.y = windowHeight - 20, 
            self.labelDebug.position.x = 20, self.initialized = !0, self.withAPI = !1, "#withoutAPI" === window.location.hash && (self.withAPI = !1);
        }
        var self = this;
        this.vecColors = [ 16743382, 16735338, 16746088, 16563797, 5563861, 2783487, 9586937, 14111213 ], 
        this.vecColorsS = [ "#FF7BD6", "#FF5C6A", "#FF8668", "#FCBE55", "#54E5D5", "#2A78FF", "#9248F9", "#D751ED" ], 
        this.vecPerfects = [ "PERFECT!", "AWESOME!", "AMAZING!", "GOD!!!", "WOWOWOW", "YEAHAhah" ], 
        this.vecGood = [ "GOOD", "COOL", "YEP", "NOT BAD" ], this.vecError = [ "NOOOO!", "BAD", "=(", "NOT", "AHHhh" ], 
        this.currentColorID = Math.floor(this.vecColors.length * Math.random()), this.backColor = this.vecColors[this.currentColorID], 
        initialize();
    },
    update: function() {
        this.initialized && (this._super(), this.withAPI && this.apiLogo && this.apiLogo.getContent().height > 1 && 0 === this.apiLogo.getContent().position.x && (scaleConverter(this.apiLogo.getContent().width, windowWidth, .5, this.apiLogo), 
        this.apiLogo.getContent().position.x = windowWidth / 2 - this.apiLogo.getContent().width / 2), 
        this.screenManager && this.screenManager.currentScreen && this.labelDebug && this.labelDebug.parent && (this.childsCounter = 1, 
        this.recursiveCounter(this.screenManager.currentScreen), this.labelDebug.setText(this.childsCounter)));
    },
    apiLoaded: function(apiInstance) {
        if (this.withAPI) {
            this.apiInstance = apiInstance;
            var logoData = apiInstance.Branding.getLogo();
            this.apiLogo = new DefaultButton(logoData.image, logoData.image), this.apiLogo.build(), 
            this.apiLogo.clickCallback = function() {
                logoData.action();
            }, this.stage.addChild(this.apiLogo.getContent()), this.buttonProperties = apiInstance.Branding.getLink("more_games"), 
            this.apiInstance.Branding.displaySplashScreen(function() {
                APP.initApplication();
            });
        }
    },
    recursiveCounter: function(obj) {
        var j = 0;
        if (obj.children) for (j = obj.children.length - 1; j >= 0; j--) this.childsCounter++, 
        this.recursiveCounter(obj.children[j]); else {
            if (!obj.childs) return;
            for (j = obj.childs.length - 1; j >= 0; j--) this.childsCounter++, this.recursiveCounter(obj.childs[j]);
        }
    },
    build: function() {
        this._super(), this.cookieManager = new CookieManager(), this.appModel = new AppModel(), 
        this.withAPI || this.initApplication();
    },
    initApplication: function() {
        this.initScreen = new InitScreen("Init"), this.choiceScreen = new ChoiceScreen("Choice"), 
        this.gameScreen = new GameScreen("Game"), this.loadScreen = new LoadScreen("Loader"), 
        this.screenManager.addScreen(this.loadScreen), this.screenManager.addScreen(this.initScreen), 
        this.screenManager.addScreen(this.choiceScreen), this.screenManager.addScreen(this.gameScreen), 
        this.screenManager.change("Loader");
    },
    show: function() {},
    hide: function() {},
    destroy: function() {}
}), BarView = Class.extend({
    init: function(width, height, maxValue, currentValue) {
        this.maxValue = maxValue, this.text = "default", this.currentValue = currentValue, 
        this.container = new PIXI.DisplayObjectContainer(), this.width = width, this.height = height, 
        this.backShape = new PIXI.Graphics(), this.backShape.beginFill(16711680), this.backShape.drawRect(0, 0, width, height), 
        this.container.addChild(this.backShape), this.frontShape = new PIXI.Graphics(), 
        this.frontShape.beginFill(65280), this.frontShape.drawRect(0, 0, width, height), 
        this.container.addChild(this.frontShape), this.frontShape.scale.x = this.currentValue / this.maxValue;
    },
    addBackShape: function(color, size) {
        this.back = new PIXI.Graphics(), this.back.beginFill(color), this.back.drawRect(-size / 2, -size / 2, this.width + size, this.height + size), 
        this.container.addChildAt(this.back, 0);
    },
    setFrontColor: function(color) {
        this.frontShape && this.container.removeChild(this.frontShape), this.frontShape = new PIXI.Graphics(), 
        this.frontShape.beginFill(color), this.frontShape.drawRect(0, 0, this.width, this.height), 
        this.container.addChild(this.frontShape);
    },
    setBackColor: function(color) {
        this.backShape && this.container.removeChild(this.backShape), this.backShape = new PIXI.Graphics(), 
        this.backShape.beginFill(color), this.backShape.drawRect(0, 0, this.width, this.height), 
        this.container.addChildAt(this.backShape, 0);
    },
    setText: function(text) {
        this.text !== text && (this.lifebar ? this.lifebar.setText(text) : (this.lifebar = new PIXI.Text(text, {
            fill: "white",
            align: "center",
            font: "10px Arial"
        }), this.container.addChild(this.lifebar)));
    },
    updateBar: function(currentValue, maxValue) {
        (this.currentValue !== currentValue || this.maxValue !== maxValue && currentValue >= 0) && (this.currentValue = currentValue, 
        this.maxValue = maxValue, this.frontShape.scale.x = this.currentValue / this.maxValue, 
        this.frontShape.scale.x < 0 && (this.frontShape.scale.x = 0));
    },
    getContent: function() {
        return this.container;
    },
    setPosition: function(x, y) {
        this.container.position.x = x, this.container.position.y = y;
    }
}), ChoiceButton = DefaultButton.extend({
    init: function(imgUp, imgOver, imgDown, imgBorder) {
        this._super(imgUp, imgOver, imgDown), this.color = 16777215, this.background = new PIXI.Sprite(PIXI.Texture.fromImage(imgDown)), 
        this.border = new PIXI.Sprite(PIXI.Texture.fromImage(imgBorder)), this.isBlocked = !1;
    },
    build: function(width, height) {
        var self = this;
        width ? this.width = width : this.width = this.shapeButton.width, height ? this.height = height : this.height = this.shapeButton.height, 
        this.background.width = this.width, this.background.height = this.height, this.shapeButton.buttonMode = !0, 
        this.shapeButton.position.x = 0, this.shapeButton.position.y = 0, width && (this.shapeButton.width = this.width), 
        height && (this.shapeButton.height = this.height), this.shapeButton.interactive = !0, 
        this.shapeButton.mousedown = this.shapeButton.touchstart = function(data) {
            self.isBlocked || (self.selectedFunction(), null !== self.mouseUpCallback && self.mouseUpCallback(), 
            null !== self.clickCallback && self.clickCallback());
        };
    },
    block: function(value) {
        this.isBlocked = !0;
        var desblock = new PIXI.Text(value, {
            align: "center",
            fill: "#FFFFFF",
            font: "30px Roboto"
        });
        this.thumbGray.tint = 0, this.shapeButton.tint = 5592405;
        var coin = new SimpleSprite("coins.png");
        coin.getContent().position.x = this.background.width / 2 - coin.getContent().width / 2, 
        coin.getContent().position.y = this.background.height / 2 - coin.getContent().height / 2 - 10, 
        scaleConverter(desblock.height, this.container.height, .3, desblock), desblock.position.x = this.background.width / 2 - desblock.width / 2, 
        desblock.position.y = this.background.height / 2 - desblock.height / 2 + 15, this.container.addChild(desblock), 
        this.container.addChild(coin.getContent());
    },
    selectedFunction: function() {
        null !== this.mouseDownCallback && this.mouseDownCallback(), this.shapeButton.tint = this.color, 
        this.thumb.visible = !0, this.thumbGray.visible = !1, this.shapeButton.setTexture(this.textureButtonOver), 
        this.container.addChildAt(this.background, 0), this.isdown = !0, this.alpha = 1;
    },
    addThumb: function(thumb, thumbGray) {
        this.thumb && this.thumb.parent && this.thumb.parent.removeChild(this.thumb), this.thumbGray && this.thumbGray.parent && this.thumbGray.parent.removeChild(this.thumbGray), 
        this.containerThumbs = new PIXI.DisplayObjectContainer(), this.thumb = new PIXI.Sprite(PIXI.Texture.fromImage(thumb));
        var scale = scaleConverter(this.thumb.height, this.height, .8);
        this.thumb.scale.x = this.thumb.scale.y = scale, this.containerThumbs.addChild(this.thumb), 
        this.thumb.position.x = this.width / 2 - this.thumb.width / 2, this.thumb.position.y = this.height - this.thumb.height - 4, 
        this.thumb.visible = !1, this.thumbGray = new PIXI.Sprite(PIXI.Texture.fromImage(thumbGray)), 
        this.thumbGray.scale.x = this.thumbGray.scale.y = scale, this.containerThumbs.addChild(this.thumbGray), 
        this.thumbGray.position.x = this.width / 2 - this.thumbGray.width / 2, this.thumbGray.position.y = this.height - this.thumbGray.height - 4, 
        this.thumbGray.visible = !0, this.maskButton = new PIXI.Graphics(), this.maskButton.beginFill(9991763), 
        this.maskButton.drawCircle(this.width / 2, this.width / 2, this.width / 2 + 6), 
        this.containerThumbs.addChild(this.maskButton), this.containerThumbs.mask = this.maskButton, 
        this.container.addChild(this.containerThumbs), this.container.addChild(this.border), 
        this.border.width = this.width, this.border.height = this.height;
    },
    resetTextures: function() {
        this.thumb.visible = !1, this.thumbGray.visible = !0, this.shapeButton.setTexture(this.textureButton), 
        this.shapeButton.tint = 16777215, this.background && this.background.parent && this.background.parent.removeChild(this.background);
    }
}), GasBarView = Class.extend({
    init: function(backSource, frontSource, _x, _y) {
        this.text = "default", this._x = _x, this.container = new PIXI.DisplayObjectContainer(), 
        this.backContainer = new PIXI.DisplayObjectContainer(), this.container.addChild(this.backContainer), 
        this.backShape = new SimpleSprite(backSource), this.backShape.getContent().position.y = _y, 
        this.backContainer.addChild(this.backShape.getContent()), this.mask = new PIXI.Graphics(), 
        this.mask.beginFill(65280), this.mask.drawRect(_x, _y, this.backShape.getContent().width, this.backShape.getContent().height), 
        this.backContainer.addChild(this.mask), this.backContainer.mask = this.mask, this.cover = new SimpleSprite(frontSource), 
        this.container.addChild(this.cover.getContent());
    },
    updateBar: function(currentValue, maxValue) {
        (this.currentValue !== currentValue || this.maxValue !== maxValue && currentValue >= 0) && (this.currentValue = currentValue, 
        this.maxValue = maxValue, this.backShape.getContent().position.x = -this.backShape.getContent().width + this.currentValue / this.maxValue * this.backShape.getContent().width);
    },
    getContent: function() {
        return this.container;
    },
    setPosition: function(x, y) {
        this.container.position.x = x, this.container.position.y = y;
    }
}), LifeBarHUD = Class.extend({
    init: function(width, height, incX, frontColor, baseColor) {
        this.text = "default", this.container = new PIXI.DisplayObjectContainer(), this.width = width, 
        this.height = height, this.incX = incX, this.backShape = new PIXI.Graphics();
        var w = width, xAcc = 0;
        this.rect = [ [ 0, 0 ], [ w, 0 ], [ w + xAcc, 0 ], [ xAcc, 0 ] ], this.frontRect = [ [ 0, 0 ], [ w, 0 ], [ w + xAcc, 0 ], [ xAcc, 0 ] ];
        var i = 0, acc = height, xAcc2 = incX;
        for (this.baseRect = [ this.rect[3], this.rect[2], [ this.rect[2][0] - xAcc2, this.rect[2][1] + acc ], [ this.rect[3][0] - xAcc2, this.rect[3][1] + acc ] ], 
        this.baseFrontRect = [ this.rect[3], this.rect[2], [ this.rect[2][0] - xAcc2, this.rect[2][1] + acc ], [ this.rect[3][0] - xAcc2, this.rect[3][1] + acc ] ], 
        this.backBaseShape = new PIXI.Graphics(), this.backBaseShape.beginFill(baseColor ? baseColor : 9837082), 
        this.backBaseShape.moveTo(this.baseRect[0][0], this.baseRect[0][1]), i = 1; i < this.baseRect.length; i++) this.backBaseShape.lineTo(this.baseRect[i][0], this.baseRect[i][1]);
        for (this.backBaseShape.endFill(), this.container.addChild(this.backBaseShape), 
        this.backFrontShape = new PIXI.Graphics(), this.backFrontShape.beginFill(frontColor ? frontColor : 3192624), 
        this.backFrontShape.moveTo(this.baseFrontRect[0][0], this.baseFrontRect[0][1]), 
        i = 1; i < this.baseFrontRect.length; i++) this.backFrontShape.lineTo(this.baseFrontRect[i][0], this.baseFrontRect[i][1]);
        for (this.backFrontShape.endFill(), this.container.addChild(this.backFrontShape), 
        this.backMask = new PIXI.Graphics(), this.backMask.beginFill(255), this.backMask.moveTo(this.baseRect[0][0], this.baseRect[0][1]), 
        i = 1; i < this.baseRect.length; i++) this.backMask.lineTo(this.baseRect[i][0], this.baseRect[i][1]);
        this.backMask.endFill(), this.container.addChild(this.backMask), this.backFrontShape.mask = this.backMask;
    },
    setBackColor: function(color) {
        var acc = this.height, xAcc2 = this.incX;
        for (this.baseRect = [ this.rect[3], this.rect[2], [ this.rect[2][0] - xAcc2, this.rect[2][1] + acc ], [ this.rect[3][0] - xAcc2, this.rect[3][1] + acc ] ], 
        this.baseFrontRect = [ this.rect[3], this.rect[2], [ this.rect[2][0] - xAcc2, this.rect[2][1] + acc ], [ this.rect[3][0] - xAcc2, this.rect[3][1] + acc ] ], 
        this.backBaseShape.clear(), this.backBaseShape.beginFill(color), this.backBaseShape.moveTo(this.baseRect[0][0], this.baseRect[0][1]), 
        i = 1; i < this.baseRect.length; i++) this.backBaseShape.lineTo(this.baseRect[i][0], this.baseRect[i][1]);
        this.backBaseShape.endFill();
    },
    setText: function(text) {
        this.text !== text && (this.lifebar ? this.lifebar.setText(text) : this.lifebar = new PIXI.Text(text, {
            fill: "white",
            align: "center",
            font: "10px Arial"
        }));
    },
    updateBar: function(currentValue, maxValue) {
        return this.currentValue < 0 ? void (this.backFrontShape.position.x = this.backFrontShape.position.width) : (this.currentValue = currentValue, 
        this.maxValue = maxValue, void (this.backFrontShape.position.x = this.backFrontShape.width * (this.currentValue / this.maxValue) - this.backFrontShape.width));
    },
    getContent: function() {
        return this.container;
    },
    setPosition: function(x, y) {
        this.container.position.x = x, this.container.position.y = y;
    }
}), ShopItem = Class.extend({
    init: function(screen, type, arrayModels, arrayPlaced) {
        this.screen = screen, this.type = type, this.arrayModels = arrayModels, this.arrayPlaced = arrayPlaced, 
        this.container = new PIXI.DisplayObjectContainer();
    },
    build: function(model) {
        this.model = model, this.equippedBox = new PIXI.Graphics(), this.equippedBox.beginFill(16777215), 
        this.equippedBox.drawRect(-10, -10, windowWidth / 2.5 + 20, windowWidth / 3.5 + 20), 
        this.equippedBox.alpha = 1, this.backScroll = new PIXI.Graphics(), this.backScroll.beginFill(14370108), 
        this.backScroll.drawRect(0, 0, windowWidth / 2.5, windowWidth / 3.5), this.backScroll.alpha = .2, 
        this.container.addChild(this.backScroll), this.backShopItem = new PIXI.Graphics(), 
        this.backShopItem.beginFill(this.model.color), this.backShopItem.drawRect(0, 0, this.backScroll.width, this.backScroll.height), 
        this.backShopItem.alpha = 1, this.container.addChild(this.backShopItem);
        var self = this;
        this.equipped = new PIXI.Text(this.model.label, {
            align: "center",
            font: "20px Vagron",
            fill: "#FFF",
            wordWrap: !0,
            wordWrapWidth: 500
        }), this.equipped.position.x = this.backScroll.width / 2 - this.equipped.width / 2, 
        this.equipped.position.y = this.backScroll.height / 2 - this.equipped.height / 2, 
        this.valueLabel = new PIXI.Text(this.model.value + " BUY", {
            align: "center",
            font: "50px Vagron",
            fill: "#ECBC0C",
            wordWrap: !0,
            wordWrapWidth: 500
        }), scaleConverter(this.valueLabel.width, this.backShopItem.width, .75, this.valueLabel), 
        this.valueLabel.position.x = this.backScroll.width / 2 - this.valueLabel.width / 2, 
        this.valueLabel.position.y = this.backScroll.height / 2 - this.valueLabel.height / 2, 
        this.equipButton = new DefaultButton("UI_button_default_1.png", "UI_button_default_1.png"), 
        this.equipButton.build(this.backScroll.width, this.backScroll.height), this.equipButton.getContent().alpha = 0, 
        this.equipButton.setPosition(this.backScroll.width / 2 - this.equipButton.getContent().width / 2, this.backShopItem.height / 2 - this.equipButton.getContent().height / 2), 
        this.equipButton.clickCallback = this.equipButton.mouseUpCallback = function() {
            if (!APP.scrolling) {
                APP.appModel.currentPlayerModel = self.model;
                for (var targetArray = self.screen.shopList, i = targetArray.length - 1; i >= 0; i--) targetArray[i].updateStats();
                self.updateStats();
            }
        }, this.frontShopBlock = new PIXI.Graphics(), this.frontShopBlock.beginFill(14370108), 
        this.frontShopBlock.drawRect(0, 0, this.backScroll.width, this.backScroll.height), 
        this.frontShopBlock.alpha = 1, this.container.addChild(this.frontShopBlock), this.buyButton = new DefaultButton("UI_button_default_2.png", "UI_button_default_2.png"), 
        this.buyButton.build(this.backScroll.width, this.backScroll.height), this.buyButton.getContent().alpha = 0, 
        this.buyButton.setPosition(0, 0), this.buyButton.clickCallback = this.buyButton.mouseUpCallback = function() {
            if (!(self.model.value > APP.totalCoins || APP.scrolling)) {
                APP.totalCoins -= self.model.value, self.screen.updateCoins(), APP.appModel.currentPlayerModel = self.model, 
                APP.appModel.currentPlayerModel.enabled = !0, APP.appModel.saveScore();
                for (var targetArray = self.screen.shopList, i = targetArray.length - 1; i >= 0; i--) targetArray[i].updateStats();
                self.updateStats();
            }
        };
    },
    updateStats: function() {
        console.log("updateStats"), this.equipped && this.equipped.parent && this.equipped.parent.removeChild(this.equipped), 
        this.equipButton.getContent() && this.equipButton.getContent().parent && this.equipButton.getContent().parent.removeChild(this.equipButton.getContent()), 
        this.equippedBox && this.equippedBox.parent && this.equippedBox.parent.removeChild(this.equippedBox), 
        this.buyButton.getContent() && this.buyButton.getContent().parent && this.buyButton.getContent().parent.removeChild(this.buyButton.getContent()), 
        this.frontShopBlock && this.frontShopBlock.parent && this.frontShopBlock.parent.removeChild(this.frontShopBlock), 
        this.valueLabel && this.valueLabel.parent && this.valueLabel.parent.removeChild(this.valueLabel);
        var isEquiped = !1;
        APP.appModel.currentPlayerModel.id === this.model.id && (this.container.addChild(this.equipped), 
        this.container.addChild(this.equippedBox), this.container.setChildIndex(this.equippedBox, 0), 
        isEquiped = !0), !isEquiped && this.model.enabled ? (this.container.addChild(this.equipped), 
        this.container.addChild(this.equipButton.getContent())) : this.model.enabled || (this.container.addChild(this.frontShopBlock), 
        this.container.addChild(this.buyButton.getContent()), this.container.addChild(this.valueLabel));
    },
    getContent: function() {
        return this.container;
    }
}), ShopItemBurger = Class.extend({
    init: function(screen, type, arrayModels, arrayPlaced) {
        this.screen = screen, this.type = type, this.arrayModels = arrayModels, this.arrayPlaced = arrayPlaced, 
        this.container = new PIXI.DisplayObjectContainer();
    },
    build: function(model, isBlock) {
        this.model = model, this.isBlock = isBlock, this.equippedBox = new PIXI.Graphics(), 
        this.equippedBox.beginFill(16777215), this.equippedBox.drawRect(-10, -10, windowWidth / 2.5 + 20, windowWidth / 3.5 + 20), 
        this.equippedBox.alpha = 1, this.backScroll = new PIXI.Graphics(), this.backScroll.beginFill(14370108), 
        this.backScroll.drawRect(0, 0, windowWidth / 2.5, windowWidth / 3.5), this.backScroll.alpha = .2, 
        this.container.addChild(this.backScroll), this.backShopItem = new PIXI.Graphics(), 
        this.backShopItem.beginFill(14370108), this.backShopItem.drawRect(0, 0, this.backScroll.width, this.backScroll.height), 
        this.backShopItem.alpha = 1, this.container.addChild(this.backShopItem), this.pattern = new SimpleSprite(this.model.thumb), 
        scaleConverter(this.pattern.getContent().height, this.backScroll.height, 1, this.pattern.getContent()), 
        this.container.addChild(this.pattern.getContent()), this.pattern.getContent().position.x = this.backScroll.width / 2 - this.pattern.getContent().width / 2, 
        this.pattern.getContent().position.y = this.backScroll.height / 2 - this.pattern.getContent().height / 2;
        var self = this;
        this.equipped = new PIXI.Text("EQUIPPED", {
            align: "center",
            font: "40px Vagron",
            fill: "#ECBC0C",
            wordWrap: !0,
            wordWrapWidth: 500
        }), scaleConverter(this.equipped.width, this.backShopItem.width, .75, this.equipped), 
        this.equipped.position.x = this.backScroll.width / 2 - this.equipped.width / 2, 
        this.equipped.position.y = this.backShopItem.height / 2 - this.equipped.height / 2, 
        this.valueLabel = new PIXI.Text(this.model.value + "\n HIGHSCORE", {
            align: "center",
            font: "30px Vagron",
            fill: "#ECBC0C",
            wordWrap: !0,
            wordWrapWidth: 500
        }), scaleConverter(this.valueLabel.width, this.backShopItem.width, .75, this.valueLabel), 
        this.valueLabel.position.x = this.backScroll.width / 2 - this.valueLabel.width / 2, 
        this.valueLabel.position.y = this.backShopItem.height / 2 - this.valueLabel.height / 2, 
        this.equipButton = new DefaultButton("UI_button_default_1.png", "UI_button_default_1.png"), 
        this.equipButton.build(this.backScroll.width, this.backScroll.height), this.equipButton.getContent().alpha = 0, 
        this.equipButton.setPosition(this.backScroll.width / 2 - this.equipButton.getContent().width / 2, this.backShopItem.height / 2 - this.equipButton.getContent().height / 2), 
        this.equipButton.clickCallback = this.equipButton.mouseUpCallback = function() {
            if (!APP.scrolling) {
                APP.appModel.currentBurguerlModel = self.model;
                for (var targetArray = self.screen.burgerList, i = targetArray.length - 1; i >= 0; i--) targetArray[i].updateStats();
                self.updateStats();
            }
        }, this.frontShopBlock = new PIXI.Graphics(), this.frontShopBlock.beginFill(14370108), 
        this.frontShopBlock.drawRect(0, 0, this.backScroll.width, this.backScroll.height), 
        this.frontShopBlock.alpha = 1, this.container.addChild(this.frontShopBlock), this.buyButton = new DefaultButton("UI_button_default_2.png", "UI_button_default_2.png"), 
        this.buyButton.build(this.backScroll.width, this.backScroll.height), this.buyButton.getContent().alpha = 0, 
        this.buyButton.setPosition(0, 0);
    },
    updateStats: function() {
        this.equipped && this.equipped.parent && this.equipped.parent.removeChild(this.equipped), 
        this.equipButton.getContent() && this.equipButton.getContent().parent && this.equipButton.getContent().parent.removeChild(this.equipButton.getContent()), 
        this.equippedBox && this.equippedBox.parent && this.equippedBox.parent.removeChild(this.equippedBox), 
        this.buyButton.getContent() && this.buyButton.getContent().parent && this.buyButton.getContent().parent.removeChild(this.buyButton.getContent()), 
        this.frontShopBlock && this.frontShopBlock.parent && this.frontShopBlock.parent.removeChild(this.frontShopBlock), 
        this.valueLabel && this.valueLabel.parent && this.valueLabel.parent.removeChild(this.valueLabel);
        var isEquiped = !1;
        APP.appModel.currentBurguerlModel.id === this.model.id && (this.container.addChild(this.equippedBox), 
        this.container.setChildIndex(this.equippedBox, 0), isEquiped = !0), !isEquiped && this.model.enabled ? this.container.addChild(this.equipButton.getContent()) : this.model.enabled || (this.container.addChild(this.frontShopBlock), 
        this.container.addChild(this.buyButton.getContent()), this.container.addChild(this.valueLabel));
    },
    getContent: function() {
        return this.container;
    }
}), ShopItemTowel = Class.extend({
    init: function(screen, type, arrayModels, arrayPlaced) {
        this.screen = screen, this.type = type, this.arrayModels = arrayModels, this.arrayPlaced = arrayPlaced, 
        this.container = new PIXI.DisplayObjectContainer();
    },
    build: function(model, isBlock) {
        this.model = model, this.isBlock = isBlock, this.equippedBox = new PIXI.Graphics(), 
        this.equippedBox.beginFill(16777215), this.equippedBox.drawRect(-10, -10, windowWidth / 2.5 + 20, windowWidth / 3.5 + 20), 
        this.equippedBox.alpha = 1, this.backScroll = new PIXI.Graphics(), this.backScroll.beginFill(14370108), 
        this.backScroll.drawRect(0, 0, windowWidth / 2.5, windowWidth / 3.5), this.backScroll.alpha = .2, 
        this.container.addChild(this.backScroll), this.backShopItem = new PIXI.Graphics(), 
        this.backShopItem.beginFill(this.model.color), this.backShopItem.drawRect(0, 0, this.backScroll.width, this.backScroll.height), 
        this.backShopItem.alpha = 0, this.container.addChild(this.backShopItem);
        var self = this;
        this.equipped = new PIXI.Text("EQUIPPED", {
            align: "center",
            font: "40px Vagron",
            fill: "#db453c",
            wordWrap: !0,
            wordWrapWidth: 500
        }), scaleConverter(this.equipped.width, this.backShopItem.width, .75, this.equipped), 
        this.equipped.position.x = this.backScroll.width / 2 - this.equipped.width / 2, 
        this.equipped.position.y = this.backScroll.height / 2 - this.equipped.height / 2, 
        this.valueLabel = new PIXI.Text(this.model.value + "\nPLAYS", {
            align: "center",
            font: "50px Vagron",
            fill: "#ECBC0C",
            wordWrap: !0,
            wordWrapWidth: 500
        }), scaleConverter(this.valueLabel.width, this.backShopItem.width, .5, this.valueLabel), 
        this.valueLabel.position.x = this.backScroll.width / 2 - this.valueLabel.width / 2, 
        this.valueLabel.position.y = this.backShopItem.height / 2 - this.valueLabel.height / 2, 
        this.equipButton = new DefaultButton("UI_button_default_1.png", "UI_button_default_1.png"), 
        this.equipButton.build(this.backScroll.width, this.backScroll.height), this.equipButton.getContent().alpha = 0, 
        this.equipButton.setPosition(this.backScroll.width / 2 - this.equipButton.getContent().width / 2, 0), 
        this.equipButton.clickCallback = this.equipButton.mouseUpCallback = function() {
            if (!APP.scrolling) {
                APP.appModel.currentTowelModel = self.model;
                for (var targetArray = self.screen.towelList, i = targetArray.length - 1; i >= 0; i--) targetArray[i].updateStats();
                self.updateStats();
            }
        }, this.frontShopBlock = new PIXI.Graphics(), this.frontShopBlock.beginFill(14370108), 
        this.frontShopBlock.drawRect(0, 0, this.backScroll.width, this.backScroll.height), 
        this.frontShopBlock.alpha = 1, this.container.addChild(this.frontShopBlock), this.buyButton = new DefaultButton("UI_button_default_2.png", "UI_button_default_2.png"), 
        this.buyButton.build(this.backScroll.width, this.backScroll.height), this.buyButton.getContent().alpha = 0, 
        this.buyButton.setPosition(0, 0);
    },
    updateStats: function() {
        this.pattern || (this.pattern = new SimpleSprite(this.model.thumb), this.maskk = new PIXI.Graphics(), 
        this.maskk.beginFill(this.model.color), this.maskk.drawRect(0, 0, this.backScroll.width, this.backScroll.height), 
        this.maskk.alpha = 1, this.container.addChild(this.maskk), this.pattern.getContent().mask = this.maskk, 
        this.container.addChild(this.pattern.getContent())), this.equipped && this.equipped.parent && this.equipped.parent.removeChild(this.equipped), 
        this.equippedBox && this.equippedBox.parent && this.equippedBox.parent.removeChild(this.equippedBox), 
        this.equipButton.getContent() && this.equipButton.getContent().parent && this.equipButton.getContent().parent.removeChild(this.equipButton.getContent()), 
        this.buyButton.getContent() && this.buyButton.getContent().parent && this.buyButton.getContent().parent.removeChild(this.buyButton.getContent()), 
        this.frontShopBlock && this.frontShopBlock.parent && this.frontShopBlock.parent.removeChild(this.frontShopBlock), 
        this.valueLabel && this.valueLabel.parent && this.valueLabel.parent.removeChild(this.valueLabel);
        var isEquiped = !1;
        APP.appModel.currentTowelModel.id === this.model.id && (this.container.addChild(this.equippedBox), 
        this.container.setChildIndex(this.equippedBox, 0), isEquiped = !0), !isEquiped && this.model.enabled ? this.container.addChild(this.equipButton.getContent()) : this.model.enabled || (this.container.addChild(this.frontShopBlock), 
        this.container.addChild(this.buyButton.getContent()), this.container.addChild(this.valueLabel));
    },
    getContent: function() {
        return this.container;
    }
}), AudioController = Class.extend({
    init: function() {
        this.ambientSound1 = new Howl({
            urls: [ "dist/audio/trilha.mp3", "dist/audio/trilha.ogg" ],
            volume: .1,
            loop: !0
        }), this.alcemar = new Howl({
            urls: [ "dist/audio/aves_raras.mp3", "dist/audio/aves_raras.ogg" ],
            volume: .8,
            sprite: {
                audio1: [ 0, 7e3 ]
            }
        });
    },
    playAmbientSound: function() {
        this.ambientPlaying || (this.ambientPlaying = !0, this.ambientSound1.play());
    }
}), Ball = Entity.extend({
    init: function(vel, screen) {
        this._super(!0), this.updateable = !1, this.deading = !1, this.screen = screen, 
        this.range = 80, this.width = 1, this.height = 1, this.type = "bullet", this.target = "enemy", 
        this.fireType = "physical", this.node = null, this.velocity.x = vel.x, this.velocity.y = vel.y, 
        this.power = 1, this.defaultVelocity = 1, this.imgSource = "bullet.png", this.particleSource = "bullet.png";
    },
    startScaleTween: function() {
        TweenLite.from(this.getContent().scale, .3, {
            x: 0,
            y: 0,
            ease: "easeOutBack"
        });
    },
    build: function() {
        this.color = 16777215, this.spriteBall = new PIXI.Graphics(), this.spriteBall.beginFill(this.color), 
        this.maxSize = .05 * windowHeight, this.spriteBall.drawCircle(0, -this.maxSize, this.maxSize), 
        this.sprite = new PIXI.Sprite(), this.sprite.addChild(this.spriteBall), this.sprite.anchor.x = .5, 
        this.sprite.anchor.y = .5, this.updateable = !0, this.collidable = !0, this.getContent().alpha = .1, 
        TweenLite.to(this.getContent(), .3, {
            alpha: 1
        }), this.collideArea = new PIXI.Rectangle(-50, -50, windowWidth + 100, windowHeight + 100), 
        this.particlesCounterMax = 2, this.particlesCounter = 1, this.floorPos = windowHeight, 
        this.gravity = 0, this.gravityVal = .15, this.breakJump = !1, this.blockCollide = !1, 
        this.inError = !1, this.perfectShoot = 0, this.perfectShootAcum = 0, this.force = 0;
    },
    setFloor: function(pos) {
        this.floorPos = pos, this.velocity.y += this.gravityVal;
    },
    hideShadows: function() {
        TweenLite.to(this.shadow, .1, {
            alpha: 0
        });
    },
    updateShadow: function(angle) {
        TweenLite.to(this.shadow, .3, {
            delay: .1,
            alpha: this.shadowAlpha
        });
    },
    jump: function(force) {
        return this.breakJump ? void this.screen.miss() : (this.gravity = 0, this.velocity.y = -force - this.gravityVal * this.gravityVal / 1.5 * 10, 
        console.log(this.velocity.y, this.gravityVal), void (this.firstJump = !0));
    },
    improveGravity: function() {
        this.gravityVal >= 1.2 || (this.gravityVal += .05);
    },
    update: function() {
        this._super(), this.blockCollide || this.layer.collideChilds(this), this.spriteBall.width = this.force + this.maxSize - Math.abs(this.velocity.y), 
        this.spriteBall.width < this.maxSize && (this.spriteBall.width = this.maxSize), 
        this.spriteBall.height = this.force + this.maxSize + Math.abs(this.velocity.y), 
        this.range = this.spriteBall.height / 2, this.getContent().position.y + this.velocity.y >= this.floorPos + this.maxSize ? (this.firstJump && this.screen.addCrazyMessage("RELEASE"), 
        this.getContent().position.y = this.floorPos + this.maxSize, this.velocity.y = 0, 
        this.gravity = 0, this.breakJump = !1, this.blockCollide = !1, this.inError = !1, 
        this.force = 0) : (this.breakJump || 0 !== this.velocity.y) && (this.velocity.y += this.gravityVal, 
        this.breakJump = !0), 0 !== this.velocity.y ? this.updateableParticles() : this.perfectShoot++;
    },
    updateableParticles: function() {
        if (this.particlesCounter--, this.particlesCounter <= 0) {
            this.particlesCounter = this.particlesCounterMax;
            var tempPart = new PIXI.Graphics();
            tempPart.beginFill(this.color), tempPart.drawCircle(0, 0, this.spriteBall.width);
            var particle = new Particles({
                x: 4 * Math.random() - 2,
                y: Math.random()
            }, 120, tempPart, .05 * Math.random());
            particle.initScale = this.getContent().scale.x / 2, particle.build(), particle.gravity = 0, 
            particle.alphadecress = .05, particle.scaledecress = -.05, particle.setPosition(this.getPosition().x - (Math.random() + .1 * this.getContent().width) / 2, this.getPosition().y - this.spriteBall.height / 2), 
            this.layer.addChild(particle), particle.getContent().parent.setChildIndex(particle.getContent(), 0);
        }
    },
    collide: function(arrayCollide) {
        if (0 !== this.velocity.y && this.collidable) for (var i = arrayCollide.length - 1; i >= 0; i--) if ("enemy" === arrayCollide[i].type) {
            var enemy = arrayCollide[i];
            this.velocity.y = 0, this.getContent().position.y = enemy.getContent().position.y, 
            enemy.preKill(), this.screen.getBall();
        } else if ("killer" === arrayCollide[i].type) this.screen.gameOver(), this.preKill(); else if ("coin" === arrayCollide[i].type) {
            this.velocity.y = 0;
            var isPerfect = !1;
            this.perfectShoot <= 4 ? (this.screen.getPerfect(), isPerfect = !0, 0 === this.perfectShootAcum ? this.perfectShootAcum = 4 : this.perfectShootAcum++) : this.perfectShootAcum = 0, 
            this.perfectShoot = 0, this.blockCollide = !0;
            var value = 1 + this.perfectShootAcum;
            APP.points += value;
            var rot = .005 * Math.random(), tempLabel = new PIXI.Text("+" + value, {
                font: "50px Vagron",
                fill: "#13c2b6"
            }), labelCoin = new Particles({
                x: 0,
                y: 0
            }, 120, tempLabel, rot);
            labelCoin.maxScale = this.getContent().scale.x, labelCoin.build(), labelCoin.gravity = -.2, 
            labelCoin.alphadecress = .01, labelCoin.scaledecress = .05, labelCoin.setPosition(this.getPosition().x - tempLabel.width / 2, this.getPosition().y), 
            this.screen.layer.addChild(labelCoin);
            var labelCoin2 = new Particles({
                x: 0,
                y: 0
            }, 120, new PIXI.Text("+" + value, {
                font: "50px Vagron",
                fill: "#9d47e0"
            }), -rot);
            labelCoin2.maxScale = this.getContent().scale.x, labelCoin2.build(), labelCoin2.gravity = -.2, 
            labelCoin2.alphadecress = .01, labelCoin2.scaledecress = .05, labelCoin2.setPosition(this.getPosition().x - tempLabel.width / 2 + 2, this.getPosition().y + 2), 
            this.screen.layer.addChild(labelCoin2), this.screen.getCoin(isPerfect);
        }
    },
    setColor: function(color) {
        this.color = color, this.spriteBall.clear(), this.spriteBall.beginFill(color), this.spriteBall.drawCircle(0, -this.maxSize, this.maxSize);
    },
    charge: function(force) {
        var angle = degreesToRadians(360 * Math.random()), dist = .9 * this.spriteBall.height, pPos = {
            x: dist * Math.sin(angle) + this.getContent().position.x,
            y: dist * Math.cos(angle) + this.getContent().position.y
        }, vector = Math.atan2(this.getPosition().x - pPos.x, this.getPosition().y - pPos.y), vel = 2, vecVel = {
            x: Math.sin(vector) * vel,
            y: Math.cos(vector) * vel
        };
        console.log("charge");
        var tempPart = new PIXI.Graphics();
        tempPart.beginFill(this.color), tempPart.drawCircle(0, 0, .05 * windowHeight);
        var particle = new Particles(vecVel, 800, tempPart, 0);
        particle.initScale = this.getContent().scale.x / 10, particle.maxScale = this.getContent().scale.x / 3, 
        particle.build(), particle.gravity = 0, particle.scaledecress = -.01, particle.setPosition(pPos.x, pPos.y - this.spriteBall.height / 2), 
        this.layer.addChild(particle), particle.getContent().parent.setChildIndex(particle.getContent(), 0);
    },
    preKill: function() {
        if (!this.invencible) {
            this.collidable = !1, this.kill = !0;
            for (var i = 10; i >= 0; i--) tempParticle = new PIXI.Graphics(), tempParticle.beginFill(this.color), 
            tempParticle.drawCircle(0, 0, .2 * this.spriteBall.width), particle = new Particles({
                x: 10 * Math.random() - 5 - 10,
                y: 10 * Math.random() - 5 + 10
            }, 600, tempParticle, .05 * Math.random()), particle.build(), particle.alphadecress = .008, 
            particle.setPosition(this.getPosition().x - (Math.random() + .4 * this.getContent().width) + .2 * this.getContent().width, this.getPosition().y - (Math.random() + .4 * this.getContent().width) + .2 * this.getContent().width), 
            this.layer.addChild(particle);
            tempParticle = new PIXI.Graphics(), tempParticle.beginFill(this.color), tempParticle.drawCircle(0, 0, this.spriteBall.width), 
            particle = new Particles({
                x: 0,
                y: 0
            }, 600, tempParticle, 0), particle.maxScale = 5 * this.getContent().scale.x, particle.maxInitScale = 1, 
            particle.build(), particle.alphadecress = .05, particle.scaledecress = .1, particle.setPosition(this.getPosition().x, this.getPosition().y), 
            this.layer.addChild(particle);
        }
    }
}), Coin = Entity.extend({
    init: function(vel, behaviour) {
        this._super(!0), this.updateable = !1, this.deading = !1, this.range = 80, this.width = 1, 
        this.height = 1, this.type = "coin", this.node = null, this.velocity.x = vel.x, 
        this.velocity.y = vel.y, this.timeLive = 1e3, this.power = 1, this.defaultVelocity = 1, 
        this.imgSource = "bullet.png", this.particleSource = "bullet.png", this.rot = 0, 
        this.inMove = !1;
    },
    startScaleTween: function() {
        TweenLite.from(this.getContent().scale, .3, {
            x: 0,
            y: 0,
            ease: "easeOutBack"
        });
    },
    randomPos: function(rangeMin, rangeMax) {
        var yDest = rangeMin + Math.random() * rangeMax;
        this.inMove = !0;
        var self = this;
        TweenLite.to(this.getContent(), .5, {
            delay: .4,
            y: yDest,
            onComplete: function() {
                self.inMove = !1;
            }
        });
    },
    build: function() {
        this.spriteBall = new PIXI.Graphics(), this.spriteBall.beginFill(16777215);
        var size = .05 * windowHeight;
        this.spriteBall.drawRect(-size / 2, -size / 2, size, size), this.sprite = new PIXI.Sprite(), 
        this.sprite.addChild(this.spriteBall), this.updateable = !0, this.collidable = !0, 
        this.getContent().alpha = .5, TweenLite.to(this.getContent(), .3, {
            alpha: 1
        }), this.collideArea = new PIXI.Rectangle(-50, -50, windowWidth + 100, windowHeight + 100), 
        this.particlesCounterMax = 8, this.particlesCounter = 1;
    },
    update: function() {
        this.range = this.spriteBall.width, this._super(), this.inMove && this.updateableParticles();
    },
    changeShape: function() {},
    explode: function(velX, velY) {
        var particle = null, tempParticle = null;
        this.size = 8;
        for (var i = 10; i >= 0; i--) console.log("part"), tempParticle = new PIXI.Graphics(), 
        tempParticle.beginFill(16777215), tempParticle.drawRect(-this.size / 2, -this.size / 2, this.size, this.size), 
        particle = new Particles({
            x: 10 * Math.random() - 5 + (velX ? velX : 0),
            y: 10 * Math.random() - 5 + (velY ? velY : 0)
        }, 600, tempParticle, .05 * Math.random()), particle.build(), particle.alphadecress = .008, 
        particle.setPosition(this.getPosition().x - (Math.random() + .4 * this.getContent().width) + .2 * this.getContent().width, this.getPosition().y - (Math.random() + .4 * this.getContent().width) + .2 * this.getContent().width), 
        this.layer.addChild(particle);
        tempParticle = new PIXI.Graphics(), this.size = .05 * windowHeight, tempParticle.beginFill(16777215), 
        tempParticle.drawRect(-this.size / 2, -this.size / 2, this.size, this.size), particle = new Particles({
            x: 0,
            y: 0
        }, 600, tempParticle, 0), particle.maxScale = 5 * this.getContent().scale.x, particle.maxInitScale = 1, 
        particle.build(), particle.alphadecress = .05, particle.scaledecress = .1, particle.setPosition(this.getPosition().x, this.getPosition().y), 
        this.layer.addChild(particle);
    },
    updateableParticles: function() {
        if (this.particlesCounter--, this.particlesCounter <= 0) {
            this.particlesCounter = this.particlesCounterMax;
            var tempPart = new PIXI.Graphics();
            tempPart.beginFill(16777215), tempPart.drawRect(-this.size / 2, -this.size / 2, this.size, this.size);
            var particle = new Particles({
                x: 0,
                y: 0
            }, 120, tempPart, 0);
            particle.build(), particle.gravity = 0, particle.alphadecress = .04, particle.scaledecress = -.01, 
            particle.setPosition(this.getPosition().x, this.getPosition().y), this.layer.addChild(particle), 
            particle.getContent().parent.setChildIndex(particle.getContent(), 0);
        }
    },
    preKill: function() {
        this.invencible || (this.explode(-2, 2), this.collidable = !1, this.kill = !0);
    }
}), CrazyLogo = Entity.extend({
    init: function(screen) {
        this._super(!0), this.screen = screen, this.container = new PIXI.DisplayObjectContainer(), 
        this.title = "EPILEPSY", this.vecLetters = [], this.tempCounter = 0, this.colorsCounter = 300;
    },
    build: function() {
        this.updateable = !0;
        for (var i = 0; i < this.title.length; i++) tempText = new PIXI.Text(this.title[i], {
            align: "center",
            font: "48px Vagron",
            fill: APP.vecColorsS[this.tempCounter],
            stroke: "#FFFFFF",
            strokeThickness: 5
        }), tempText.resolution = retina, tempText.sin = .5 * i, tempText.position.x = 17 * i * tempText.resolution, 
        tempText.position.y = 10 * Math.sin(tempText.sin), console.log(tempText.position.y), 
        this.container.addChild(tempText), this.vecLetters.push(tempText), this.tempCounter++, 
        this.tempCounter >= APP.vecColorsS.length && (this.tempCounter = 0);
    },
    getContent: function() {
        return this.container;
    },
    update: function() {
        if (this.updateable) {
            console.log("update here");
            var changeColors = !1;
            this.colorsCounter--, this.colorsCounter < 0 && (changeColors = !0, this.colorsCounter = 200);
            for (var i = 0; i < this.vecLetters.length; i++) this.vecLetters[i].position.y = 10 * Math.sin(this.vecLetters[i].sin += .25), 
            (changeColors || Math.random() < .05) && (this.tempCounter++, this.tempCounter >= APP.vecColorsS.length && (this.tempCounter = 0), 
            this.vecLetters[i].setStyle({
                align: "center",
                font: "48px Vagron",
                fill: APP.vecColorsS[this.tempCounter],
                stroke: "#FFFFFF",
                strokeThickness: 5
            }));
        }
    }
}), EnemyBall = Entity.extend({
    init: function(vel, behaviour) {
        this._super(!0), this.updateable = !1, this.deading = !1, this.range = 80, this.width = 1, 
        this.height = 1, this.type = "enemy", this.node = null, this.velocity.x = vel.x, 
        this.velocity.y = vel.y, this.timeLive = 1e3, this.power = 1, this.defaultVelocity = 1, 
        this.behaviour = behaviour.clone(), this.imgSource = "burger.png", this.particleSource = "bullet.png";
    },
    startScaleTween: function() {
        TweenLite.from(this.getContent().scale, .3, {
            x: 0,
            y: 0,
            ease: "easeOutBack"
        });
    },
    build: function() {
        this.sprite = new PIXI.Sprite.fromFrame(this.imgSource), this.sprite.anchor.x = .5, 
        this.sprite.anchor.y = .5, this.updateable = !0, this.collidable = !0, this.getContent().alpha = .5, 
        TweenLite.to(this.getContent(), .3, {
            alpha: 1
        }), this.collideArea = new PIXI.Rectangle(-50, -50, windowWidth + 100, windowHeight + 100), 
        this.particlesCounterMax = 5, this.particlesCounter = 5;
    },
    update: function() {
        this.range = this.sprite.height / 4, this._super(), this.behaviour.update(this);
    },
    updateableParticles: function() {
        if (this.particlesCounter--, this.particlesCounter <= 0) {
            this.particlesCounter = this.particlesCounterMax;
            var particle = new Particles({
                x: 0,
                y: 0
            }, 120, this.particleSource, .05 * Math.random());
            particle.maxScale = this.getContent().scale.x, particle.maxInitScale = particle.maxScale, 
            particle.build(), particle.gravity = 0, particle.alphadecress = .08, particle.scaledecress = -.04, 
            particle.setPosition(this.getPosition().x - (Math.random() + .1 * this.getContent().width) / 2, this.getPosition().y), 
            this.layer.addChild(particle), particle.getContent().parent.setChildIndex(particle.getContent(), 0);
        }
    },
    preKill: function() {
        if (!this.invencible) {
            this.velocity = {
                x: 0,
                y: 0
            };
            var self = this;
            TweenLite.to(this.getContent().scale, .2, {
                x: .5,
                y: .5
            }), TweenLite.to(this.getContent(), .2, {
                alpha: 0,
                onComplete: function() {
                    self.kill = !0;
                }
            });
            for (var i = 6; i >= 0; i--) {
                var particle = new Particles({
                    x: 8 * Math.random() - 4,
                    y: 8 * Math.random() - 4
                }, 120, this.particleSource, .05 * Math.random());
                particle.build(), particle.getContent().tint = APP.appModel.currentPlayerModel.color, 
                particle.alphadecress = .02, particle.scaledecress = -.05, particle.setPosition(this.getPosition().x - (Math.random() + .1 * this.getContent().width) / 2, this.getPosition().y), 
                this.layer.addChild(particle);
            }
            this.collidable = !1, this.updateable = !1;
        }
    }
}), InteractiveBackground = Entity.extend({
    init: function(screen) {
        this._super(!0), this.screen = screen, this.container = new PIXI.DisplayObjectContainer(), 
        this.vecDots = [], this.gravity = 0, this.accel = 0;
    },
    build: function() {
        this.dist = 60;
        for (var _w = windowWidth / this.dist, _h = windowHeight / this.dist, i = 0; _w > i; i++) for (var j = 0; _h > j; j++) if (Math.random() > .2) {
            var dot = new PIXI.Graphics();
            dot.beginFill(16777215), dot.velocity = {
                x: 0,
                y: 0
            }, dot.velocity.y = .1 + .2 * Math.random(), dot.velocity.x = 0, dot.drawRect(0, 0, Math.ceil(6 * dot.velocity.y), Math.ceil(10 * dot.velocity.y)), 
            dot.position.x = this.dist * i + Math.random() * this.dist / 2, dot.position.y = this.dist * j + Math.random() * this.dist / 2, 
            this.container.addChild(dot), dot.alpha = .5 * Math.random() + .3, dot.side = Math.random() < .5 ? 1 : -1, 
            this.vecDots.push(dot);
        }
    },
    getContent: function() {
        return this.container;
    },
    update: function() {
        for (var i = this.vecDots.length - 1; i >= 0; i--) this.vecDots[i].position.x += this.vecDots[i].velocity.x + this.accel, 
        this.vecDots[i].position.y += this.vecDots[i].velocity.y + this.gravity, this.vecDots[i].alpha += .01 * this.vecDots[i].side, 
        (this.vecDots[i].alpha <= 0 || this.vecDots[i].alpha >= .8) && (this.vecDots[i].side *= -1), 
        this.vecDots[i].position.y > windowHeight + this.dist && (this.vecDots[i].position.y = 0), 
        this.vecDots[i].position.x > windowWidth + this.dist ? this.vecDots[i].position.x = 0 : this.vecDots[i].position.x < 0 && (this.vecDots[i].position.x = windowWidth + this.dist);
    }
}), KillerBall = Entity.extend({
    init: function(vel, behaviour) {
        this._super(!0), this.updateable = !1, this.deading = !1, this.range = 80, this.width = 1, 
        this.height = 1, this.type = "killer", this.node = null, this.velocity.x = vel.x, 
        this.velocity.y = vel.y, this.timeLive = 1e3, this.power = 1, this.defaultVelocity = 1, 
        this.behaviour = behaviour.clone(), this.imgSource = "inimigo.png", this.particleSource = "partEnemy.png";
    },
    startScaleTween: function() {
        TweenLite.from(this.getContent().scale, .3, {
            x: 0,
            y: 0,
            ease: "easeOutBack"
        });
    },
    build: function() {
        this.sprite = new PIXI.Sprite.fromFrame(this.imgSource), this.sprite.anchor.x = .5, 
        this.sprite.anchor.y = .5, this.updateable = !0, this.collidable = !0, this.getContent().alpha = .5, 
        TweenLite.to(this.getContent(), .3, {
            alpha: 1
        }), this.collideArea = new PIXI.Rectangle(-50, -50, windowWidth + 100, windowHeight + 100), 
        this.particlesCounterMax = 5, this.particlesCounter = 5;
    },
    update: function() {
        this.range = this.sprite.height / 2.5;
        var tempRot = 0;
        tempRot = this.behaviour.tempPosition ? Math.atan2(this.behaviour.tempPosition.y, this.behaviour.tempPosition.x) : Math.atan2(this.velocity.y, this.velocity.x), 
        this.getContent().rotation = -tempRot, this._super(), this.behaviour.update(this), 
        this.updateableParticles();
    },
    updateableParticles: function() {
        if (this.particlesCounter--, this.particlesCounter <= 0) {
            this.particlesCounter = this.particlesCounterMax;
            var particle = new Particles({
                x: 4 * Math.random() - 2,
                y: 4 * Math.random() - 2
            }, 120, this.particleSource, .3 * Math.random() - .15);
            particle.maxScale = this.getContent().scale.x / 2 + Math.random() * this.getContent().scale.x / 2, 
            particle.maxInitScale = particle.maxScale, particle.growType = -1, particle.build(), 
            particle.gravity = 0, particle.alphadecress = .08, particle.scaledecress = -.04, 
            particle.setPosition(this.getPosition().x - (Math.random() + .1 * this.getContent().width) / 2, this.getPosition().y), 
            this.layer.addChild(particle);
        }
    },
    preKill: function() {
        if (!this.invencible) {
            for (var i = 5; i >= 0; i--) {
                var particle = new Particles({
                    x: 8 * Math.random() - 4,
                    y: 8 * Math.random() - 4
                }, 120, this.particleSource, .1 * Math.random());
                particle.maxScale = this.getContent().scale.x / 2, particle.maxInitScale = particle.maxScale, 
                particle.build(), particle.gravity = .3 * Math.random(), particle.alphadecress = .04, 
                particle.scaledecress = -.05, particle.setPosition(this.getPosition().x - (Math.random() + .1 * this.getContent().width) / 2, this.getPosition().y), 
                this.layer.addChild(particle);
            }
            this.collidable = !1, this.kill = !0;
        }
    }
}), DiagBehaviour = Class.extend({
    init: function(props) {
        this.props = props, this.left = APP.seed.getNextFloat() < .5, this.velX = this.props.velX ? this.props.velX : 5, 
        this.velX *= APP.accelGame, this.position = {
            x: windowWidth / 2,
            y: .22 * windowHeight + APP.seed.getNextFloat() * windowHeight * .35
        }, this.centerDist = .2 * APP.seed.getNextFloat() * windowWidth + .15 * windowWidth, 
        this.side = APP.seed.getNextFloat() < .5 ? 1 : -1;
        var rnd = APP.seed.getNextFloat();
        rnd < .25 * APP.accelGame ? (this.killerBehaviour = new SiderBehaviour({
            centerDist: windowWidth / 2.5
        }), this.killerBehaviour.position = {
            x: this.position.x,
            y: this.position.y + (.15 * windowHeight + .15 * windowHeight * APP.seed.getNextFloat())
        }) : rnd < .45 * APP.accelGame && (this.killerBehaviour = new RadiusBehaviour({}), 
        this.killerBehaviour.centerPos = this.position);
    },
    clone: function() {
        return new DiagBehaviour(this.props);
    },
    update: function(entity) {
        pointDistance(entity.getContent().position.x, 0, windowWidth / 2, 0) > this.centerDist && (this.velX *= -1), 
        entity.velocity.x = this.velX * this.side, entity.velocity.y = this.velX;
    },
    build: function() {},
    destroy: function() {},
    serialize: function() {}
}), RadiusBehaviour = Class.extend({
    init: function(props) {
        this.props = props, this.left = APP.seed.getNextFloat() < .5, this.radius = .2 * windowWidth * APP.seed.getNextFloat() + .22 * windowWidth, 
        this.position = {
            x: windowWidth / 2,
            y: .2 * windowHeight + APP.seed.getNextFloat() * windowHeight * .3
        }, this.centerPos = {
            x: windowWidth / 2,
            y: windowHeight / 2.2 - (windowHeight / 1.7 - 2 * this.radius) * APP.seed.getNextFloat()
        }, this.angle = APP.seed.getNextFloat(), this.angleSpd = .04 * APP.seed.getNextFloat() + .02, 
        this.angleSpd *= APP.accelGame, this.side = APP.seed.getNextFloat() < .5 ? 1 : -1;
        var rnd = APP.seed.getNextFloat();
        rnd < .25 * APP.accelGame ? (this.killerBehaviour = new SiderBehaviour({
            centerDist: windowWidth / 2.5
        }), this.killerBehaviour.position = {
            x: this.position.x,
            y: this.position.y + (.15 * windowHeight + .15 * windowHeight * APP.seed.getNextFloat())
        }) : rnd < .45 * APP.accelGame && (this.killerBehaviour = new StoppedBehaviour({}), 
        this.killerBehaviour.position = this.centerPos);
    },
    clone: function() {
        return new RadiusBehaviour(this.props);
    },
    update: function(entity) {
        this.tempPosition = {
            x: Math.sin(this.angle) * this.radius + this.centerPos.x,
            y: Math.cos(this.angle) * this.radius + this.centerPos.y
        }, entity.getContent().position.x = Math.sin(this.angle) * this.radius + this.centerPos.x, 
        entity.getContent().position.y = Math.cos(this.angle) * this.radius + this.centerPos.y, 
        this.angle += this.angleSpd * this.side;
    },
    build: function() {},
    destroy: function() {},
    serialize: function() {}
}), RadiusPingPongBehaviour = Class.extend({
    init: function(props) {
        this.props = props, this.left = APP.seed.getNextFloat() < .5, this.radius = .2 * windowWidth * APP.seed.getNextFloat() + .22 * windowWidth, 
        this.position = {
            x: windowWidth / 2,
            y: .2 * windowHeight + APP.seed.getNextFloat() * windowHeight * .3
        }, this.centerPos = {
            x: windowWidth / 2,
            y: windowHeight / 2 - (windowHeight / 2 - 2 * this.radius) * APP.seed.getNextFloat()
        }, this.angle = 3.14, this.angleSpd = .03 * APP.seed.getNextFloat() + .025, this.angleSpd *= APP.accelGame, 
        this.side = APP.seed.getNextFloat() < .5 ? 1 : -1, this.angleMin = 1.57, this.angleMax = 4.71, 
        this.invert = !1;
        var rnd = APP.seed.getNextFloat();
        rnd < .15 * APP.accelGame ? (this.killerBehaviour = new SiderBehaviour({
            centerDist: windowWidth / 2.5
        }), this.killerBehaviour.position = {
            x: this.position.x,
            y: this.position.y + (.15 * windowHeight + .15 * windowHeight * APP.seed.getNextFloat())
        }) : rnd < .3 * APP.accelGame && (this.killerBehaviour = new RadiusBehaviour({}), 
        this.killerBehaviour.centerPos = this.position);
    },
    clone: function() {
        return new RadiusPingPongBehaviour(this.props);
    },
    update: function(entity) {
        entity.getContent().position.x = Math.sin(this.angle) * this.radius + this.centerPos.x, 
        entity.getContent().position.y = Math.cos(this.angle) * this.radius + this.centerPos.y, 
        this.angle += this.angleSpd * this.side, this.invert || (this.angle < this.angleMin && this.side < 0 && (this.side *= -1), 
        this.angle > this.angleMax && this.side > 0 && (this.side *= -1));
    },
    build: function() {},
    destroy: function() {},
    serialize: function() {}
}), SiderBehaviour = Class.extend({
    init: function(props) {
        this.props = props, this.left = APP.seed.getNextFloat() < .5, this.velX = this.props.velX ? this.props.velX : 5, 
        this.velX *= APP.accelGame, this.position = {
            x: windowWidth / 2,
            y: .25 * windowHeight + APP.seed.getNextFloat() * windowHeight * .45
        }, this.centerDist = this.props.centerDist ? this.props.centerDist : .2 * APP.seed.getNextFloat() * windowWidth + .2 * windowWidth;
    },
    clone: function() {
        return new SiderBehaviour(this.props);
    },
    update: function(entity) {
        pointDistance(entity.getContent().position.x, 0, windowWidth / 2, 0) > this.centerDist && (this.velX *= -1), 
        entity.velocity.x = this.velX;
    },
    build: function() {},
    destroy: function() {},
    serialize: function() {}
}), StoppedBehaviour = Class.extend({
    init: function(props) {
        this.props = props, this.position = {
            x: windowWidth / 2,
            y: .15 * windowHeight + APP.seed.getNextFloat() * windowHeight * .25
        }, this.centerDist = .2 * APP.seed.getNextFloat() * windowWidth + .15 * windowWidth;
        var rnd = APP.seed.getNextFloat();
        rnd < .25 * APP.accelGame ? (this.killerBehaviour = new SiderBehaviour({
            centerDist: windowWidth / 2.5
        }), this.killerBehaviour.position = {
            x: this.position.x,
            y: this.position.y + (.15 * windowHeight + .15 * windowHeight * APP.seed.getNextFloat())
        }) : rnd < .45 * APP.accelGame && (this.killerBehaviour = new RadiusBehaviour({}), 
        this.killerBehaviour.centerPos = this.position);
    },
    clone: function() {
        return new StoppedBehaviour(this.props);
    },
    update: function(entity) {},
    build: function() {},
    destroy: function() {},
    serialize: function() {}
}), Bird = Entity.extend({
    init: function(birdModel, screen) {
        this._super(!0), this.updateable = !1, this.deading = !1, this.range = 80, this.width = 1, 
        this.height = 1, this.type = "bird", this.target = "enemy", this.fireType = "physical", 
        this.birdModel = birdModel, this.vel = birdModel.vel, this.velocity.x = -this.vel, 
        this.velocity.y = 0, this.screen = screen, this.demage = this.birdModel.demage, 
        this.hp = this.birdModel.hp, this.defaultVelocity = this.birdModel.vel, this.imgSource = this.birdModel.imgSource, 
        this.behaviour = this.birdModel.behaviour.clone(), this.acceleration = .1, this.id = 0;
    },
    hurt: function(demage) {
        if (this.hp -= demage, this.velocity.x = -Math.abs(.4 * this.vel), this.hp <= 0) {
            APP.updatePoints(this.birdModel.money);
            var mascadasLabel = new Particles({
                x: -.5,
                y: -(.2 * Math.random() + .3)
            }, 120, new PIXI.Text("+" + this.birdModel.money, {
                font: "40px Luckiest Guy",
                fill: "#79DB20",
                stroke: "#033E43",
                strokeThickness: 3
            }), 0);
            mascadasLabel.build(), mascadasLabel.setPosition(this.getPosition().x, this.getPosition().y - 50 * Math.random()), 
            mascadasLabel.alphadecress = .01, this.screen.addChild(mascadasLabel), this.preKill();
        }
        this.getContent().tint = 16711680;
    },
    build: function() {
        this.sprite = new PIXI.Sprite(), this.sprite.anchor.x = .5, this.sprite.anchor.y = .5, 
        this.updateable = !0, this.collidable = !0;
        var motionIdle = new SpritesheetAnimation();
        motionIdle.build("idle", this.imgSource, 5, !0, null), this.spritesheet = new Spritesheet(), 
        this.spritesheet.addAnimation(motionIdle), this.spritesheet.play("idle"), this.getContent().addChild(this.spritesheet.container), 
        this.range = this.spritesheet.texture.width;
    },
    update: function() {
        this._super(), this.behaviour.update(this), this.spritesheet.update(), Math.abs(this.velocity.x) < Math.abs(this.vel) ? this.velocity.x -= this.acceleration : this.velocity.x = -Math.abs(this.vel), 
        this.collideArea || 16711680 === this.getContent().tint && (this.getContent().tint = 16777215);
    },
    preKill: function() {
        for (var i = this.birdModel.particles.length - 1; i >= 0; i--) {
            var particle = new Particles({
                x: 4 * Math.random() - 2,
                y: -(2 * Math.random() + 1)
            }, 120, this.birdModel.particles[i], .1 * Math.random());
            particle.build(), particle.gravity = .1 * Math.random(), particle.alphadecres = .08, 
            particle.setPosition(this.getPosition().x - (Math.random() + .1 * this.getContent().width) / 2, this.getPosition().y), 
            this.layer.addChild(particle);
        }
        this.collidable = !1, this.kill = !0, APP.getGameModel().killedBirds.push(this.id);
    }
}), BirdBehaviourDefault = Class.extend({
    init: function(props) {
        this.props = props, this.position = {
            x: windowWidth,
            y: .1 * windowHeight + .8 * windowHeight * Math.random()
        };
    },
    clone: function() {
        return new BirdBehaviourDefault(this.props);
    },
    update: function(entity) {},
    build: function() {},
    destroy: function() {},
    serialize: function() {}
}), BirdBehaviourDiag = Class.extend({
    init: function(props) {
        this.props = props, this.up = Math.random() < .5 ? !0 : !1, this.position = {
            x: .7 * windowWidth + .3 * windowWidth * Math.random(),
            y: this.up ? 0 : windowHeight
        }, this.acc = 0;
    },
    clone: function() {
        return this.props.accX = .02 * Math.random() + .008, new BirdBehaviourDiag(this.props);
    },
    update: function(entity) {
        this.acc += this.props.accX, entity.acceleration = 1, this.up ? (entity.velocity.y = Math.abs(entity.vel) - this.acc, 
        entity.velocity.y < 0 && (entity.velocity.y = 0)) : (entity.velocity.y = entity.vel + this.acc, 
        entity.velocity.y > 0 && (entity.velocity.y = 0));
    },
    build: function() {},
    destroy: function() {},
    serialize: function() {}
}), BirdBehaviourGuided = Class.extend({
    init: function(props) {
        this.props = props, this.sin = 0, this.position = {
            x: windowWidth,
            y: .1 * windowHeight + .8 * windowHeight * Math.random()
        };
    },
    clone: function() {
        return new BirdBehaviourSinoid(this.props);
    },
    update: function(entity) {
        entity.velocity.y = Math.sin(this.sin) * entity.vel, this.sin += this.props.sinAcc;
    },
    build: function() {},
    destroy: function() {},
    serialize: function() {}
}), BirdBehaviourSinoid = Class.extend({
    init: function(props) {
        this.props = props, this.sin = Math.random(), this.position = {
            x: windowWidth + 40,
            y: .3 * windowHeight + .6 * windowHeight * Math.random()
        };
    },
    clone: function() {
        return new BirdBehaviourSinoid(this.props);
    },
    update: function(entity) {
        this.props.velY ? entity.velocity.y = Math.sin(this.sin) * this.props.velY : entity.velocity.y = Math.sin(this.sin) * entity.vel, 
        this.sin += this.props.sinAcc;
    },
    build: function() {},
    destroy: function() {},
    serialize: function() {}
}), BirdBehaviourSinoid2 = Class.extend({
    init: function(props) {
        this.props = props, this.sin = Math.random(), this.position = {
            x: windowWidth + 40,
            y: windowHeight - .15 * windowHeight - .2 * windowHeight * Math.random()
        };
    },
    clone: function() {
        return new BirdBehaviourSinoid2(this.props);
    },
    update: function(entity) {
        this.props.velY ? entity.velocity.y = Math.sin(this.sin) * this.props.velY : entity.velocity.y = Math.sin(this.sin) * entity.vel, 
        this.sin += this.props.sinAcc;
    },
    build: function() {},
    destroy: function() {},
    serialize: function() {}
}), Bullet = Entity.extend({
    init: function(vel, timeLive, power, particle, rotation) {
        this._super(!0), this.updateable = !1, this.deading = !1, this.range = 80, this.width = 1, 
        this.height = 1, this.type = "bullet", this.target = "enemy", this.fireType = "physical", 
        this.node = null, this.velocity.x = vel.x, this.velocity.y = vel.y, this.timeLive = timeLive, 
        this.power = power, this.defaultVelocity = 1, this.imgSource = "bullet.png", this.particleSource = particle ? particle : this.imgSource, 
        this.isRotation = rotation, this.isRotation && (this.accumRot = .1 * Math.random() - .05), 
        this.sin = 0;
    },
    startScaleTween: function() {
        TweenLite.from(this.getContent().scale, .3, {
            x: 0,
            y: 0,
            ease: "easeOutBack"
        });
    },
    build: function() {
        this.sprite = new PIXI.Sprite.fromFrame(this.imgSource), this.sprite.anchor.x = .5, 
        this.sprite.anchor.y = .5, this.updateable = !0, this.collidable = !0, this.getContent().alpha = .5, 
        TweenLite.to(this.getContent(), .3, {
            alpha: 1
        }), this.birdsCollided = [], this.particlesCounterMax = (Math.abs(this.velocity.x) + Math.abs(this.velocity.y)) / 3, 
        this.particlesCounter = 2 * this.particlesCounterMax, this.collideArea = new PIXI.Rectangle(-50, -50, windowWidth + 100, windowHeight + 100);
    },
    update: function() {
        if (this._super(), this.layer.collideChilds(this), this.updateableParticles(), (!this.targetEntity || this.targetEntity && this.targetEntity.kill) && this.timeLive--, 
        (this.timeLive <= 0 || this.getPosition() > windowWidth + 20) && (this.kill = !0), 
        this.range = this.sprite.height / 2, this.isRotation && (this.sprite.rotation += this.accumRot), 
        this.targetEntity && !this.targetEntity.kill) if (this.homingStart <= 0) {
            this.range = this.sprite.height;
            var angle = Math.atan2(this.targetEntity.getPosition().y - this.getPosition().y, this.targetEntity.getPosition().x - this.getPosition().x);
            this.getContent().rotation = angle, angle = 180 * angle / Math.PI, angle += 90, 
            angle = angle / 180 * Math.PI, this.velocity.x = Math.sin(angle) * this.defaultVelocity, 
            this.velocity.y = -Math.cos(angle) * this.defaultVelocity;
        } else this.homingStart--;
        this.sinoid && (this.velocity.y = 5 * Math.sin(this.sin) * this.velocity.x, this.sin += .2, 
        this.getContent().rotation = 0), this.collideArea.contains(this.getPosition().x, this.getPosition().y) || (this.kill = !0);
    },
    updateableParticles: function() {
        if (this.particlesCounter--, this.particlesCounter <= 0) {
            this.particlesCounter = this.particlesCounterMax;
            var particle = new Particles({
                x: 4 * Math.random() - 2,
                y: Math.random()
            }, 120, this.particleSource, .05 * Math.random());
            particle.maxScale = this.getContent().scale.x, particle.maxInitScale = .4, particle.build(), 
            particle.gravity = .1 * Math.random() + .2, particle.alphadecress = .05, particle.scaledecress = .03, 
            particle.setPosition(this.getPosition().x - (Math.random() + .1 * this.getContent().width) / 2, this.getPosition().y), 
            this.layer.addChild(particle);
        }
    },
    setHoming: function(entity, timetostart, angle) {
        this.homingStart = timetostart, this.targetEntity = entity, this.getContent().rotation = angle;
    },
    collide: function(arrayCollide) {
        if (this.collidable) for (var i = arrayCollide.length - 1; i >= 0; i--) if ("bird" === arrayCollide[i].type) {
            for (var j = this.birdsCollided.length - 1; j >= 0; j--) if (arrayCollide[i] === this.birdsCollided[j]) return;
            console.log("collide"), this.preKill(), arrayCollide[i].hurt(this.power), this.birdsCollided.push(arrayCollide[i]);
        }
    },
    preKill: function() {
        if (!this.invencible) {
            for (var i = 1; i >= 0; i--) {
                var particle = new Particles({
                    x: 4 * Math.random(),
                    y: -(2 * Math.random() + 1)
                }, 120, this.particleSource, .05 * Math.random());
                particle.build(), particle.gravity = .1 * Math.random() + .2, particle.alphadecres = .1, 
                particle.scaledecress = .02, particle.setPosition(this.getPosition().x - (Math.random() + .1 * this.getContent().width) / 2, this.getPosition().y), 
                this.layer.addChild(particle);
            }
            this.collidable = !1, this.kill = !0;
        }
    },
    pointDistance: function(x, y, x0, y0) {
        return Math.sqrt((x -= x0) * x + (y -= y0) * y);
    },
    touch: function(collection) {
        collection.object && "environment" === collection.object.type && collection.object.fireCollide(), 
        this.preKill();
    }
}), AkumaBehaviour = Class.extend({
    init: function(props) {
        this.props = props ? props : {};
    },
    clone: function() {
        return new AkumaBehaviour(this.props);
    },
    build: function(screen) {
        for (var i = screen.layer.childs.length - 1; i >= 0; i--) "bird" === screen.layer.childs[i].type && screen.layer.childs[i].hurt(9999);
        var white = new PIXI.Graphics();
        white.beginFill(16777215), white.drawRect(0, 0, windowWidth, windowHeight), screen.addChild(white), 
        TweenLite.to(white, .5, {
            alpha: 0,
            onCompleteParams: [ white ],
            onComplete: function(target) {
                target && target.parent && (target.parent.removeChild(target), target = null);
            }
        });
    },
    destroy: function() {},
    serialize: function() {}
}), GiantShootBehaviour = Class.extend({
    init: function(props) {
        this.props = props ? props : {};
    },
    clone: function() {
        return new GiantShootBehaviour(this.props);
    },
    build: function(screen) {
        var vel = this.props.vel ? this.props.vel : 2.5, timeLive = windowWidth / vel, bulletForce = (this.props.totalFires ? this.props.totalFires : 5, 
        this.props.angleOpen ? this.props.angleOpen : .08, this.props.bulletForce ? this.props.bulletForce : 5 * screen.playerModel.bulletForce), invencible = this.props.invencible ? this.props.invencible : !1, angle = 0, size = this.props.size ? this.props.size : .8, bullet = new Bullet({
            x: Math.cos(angle) * vel,
            y: Math.sin(angle) * vel
        }, timeLive, bulletForce, screen.playerModel.specSource, screen.playerModel.bulletParticleSource, screen.playerModel.bulletRotation);
        bullet.invencible = invencible, bullet.build(), bullet.setPosition(screen.red.getPosition().x * size, screen.red.getPosition().y - .8 * screen.red.getContent().height), 
        screen.layer.addChild(bullet), scaleConverter(bullet.getContent().height, windowHeight, .4, bullet);
    },
    destroy: function() {},
    serialize: function() {}
}), HomingBehaviour = Class.extend({
    init: function(props) {
        this.props = props ? props : {};
    },
    clone: function() {
        return new HomingBehaviour(this.props);
    },
    build: function(screen) {
        for (var birds = [], i = screen.layer.childs.length - 1; i >= 0; i--) if ("bird" === screen.layer.childs[i].type) {
            var target = new SimpleSprite("target.png");
            screen.layer.childs[i].getContent().addChild(target.getContent()), target.getContent().position.x = -target.getContent().width / 2, 
            target.getContent().position.y = -target.getContent().height / 2, birds.push(screen.layer.childs[i]);
        }
        var vel = this.props.vel ? this.props.vel : 7, timeLive = windowWidth / vel, totalFires = this.props.totalFires ? this.props.totalFires : 5, angleOpen = this.props.angleOpen ? this.props.angleOpen : 3, bulletForce = this.props.bulletForce ? this.props.bulletForce : screen.playerModel.bulletForce, invencible = this.props.invencible ? this.props.invencible : !1;
        for (i = 0; i < birds.length; i++) {
            var angle = screen.red.rotation + angleOpen * (i - totalFires / 2), bullet = new Bullet({
                x: Math.cos(angle) * vel,
                y: Math.sin(angle) * vel
            }, timeLive, bulletForce, screen.playerModel.bulletSource, screen.playerModel.bulletParticleSource, screen.playerModel.bulletRotation);
            bullet.invencible = invencible, bullet.defaultVelocity = vel, bullet.setHoming(birds[i], 10, angle), 
            bullet.build(), bullet.setPosition(.9 * screen.red.getPosition().x, screen.red.getPosition().y - .8 * screen.red.getContent().height), 
            screen.layer.addChild(bullet), scaleConverter(bullet.getContent().height, screen.red.getContent().height, .2, bullet);
        }
    },
    destroy: function() {},
    serialize: function() {}
}), MultipleBehaviour = Class.extend({
    init: function(props) {
        this.props = props ? props : {};
    },
    clone: function() {
        return new MultipleBehaviour(this.props);
    },
    build: function(screen) {
        for (var vel = this.props.vel ? this.props.vel : 2.5, timeLive = windowWidth / vel, totalFires = this.props.totalFires ? this.props.totalFires : 5, size = this.props.size ? this.props.size : .3, angleOpen = this.props.angleOpen ? this.props.angleOpen : .08, bulletForce = this.props.bulletForce ? this.props.bulletForce : screen.playerModel.bulletForce, invencible = this.props.invencible ? this.props.invencible : !1, sinoid = this.props.sinoid ? this.props.sinoid : !1, i = 0; totalFires >= i; i++) {
            var angle = screen.red.rotation + angleOpen * (i - totalFires / 2), bullet = new Bullet({
                x: Math.cos(angle) * vel,
                y: Math.sin(angle) * vel
            }, timeLive, bulletForce, screen.playerModel.bulletSource, screen.playerModel.bulletParticleSource, screen.playerModel.bulletRotation);
            bullet.invencible = invencible, bullet.build(), bullet.sinoid = sinoid, bullet.getContent().rotation = angle, 
            bullet.setPosition(.9 * screen.red.getPosition().x, screen.red.getPosition().y - .8 * screen.red.getContent().height), 
            screen.layer.addChild(bullet), scaleConverter(bullet.getContent().height, screen.red.getContent().height, size, bullet);
        }
    },
    destroy: function() {},
    serialize: function() {}
}), RainBehaviour = Class.extend({
    init: function(props) {
        this.props = props ? props : {};
    },
    clone: function() {
        return new RainBehaviour(this.props);
    },
    build: function(screen) {
        var vel = this.props.vel ? this.props.vel : 10, timeLive = windowWidth / vel, timeInterval = this.props.timeInterval ? this.props.timeInterval : 150;
        this.totalFires = this.props.totalFires ? this.props.totalFires : 25;
        var bulletForce = (void 0 !== this.props.angleOpen ? this.props.angleOpen : .9, 
        this.props.bulletForce ? this.props.bulletForce : screen.playerModel.bulletForce), invencible = this.props.invencible ? this.props.invencible : !1, size = this.props.size ? this.props.size : .3, self = this;
        this.interval = setInterval(function() {
            var angle = 45, bullet = new Bullet({
                x: Math.cos(angle) * vel,
                y: Math.sin(angle) * vel
            }, timeLive, bulletForce, screen.playerModel.bulletSource, screen.playerModel.bulletParticleSource, screen.playerModel.bulletRotation);
            bullet.invencible = invencible, bullet.build(), bullet.getContent().rotation = angle, 
            bullet.setPosition(.6 * windowWidth * Math.random() + .15 * windowWidth, -bullet.getContent().height), 
            screen.layer.addChild(bullet), scaleConverter(bullet.getContent().height, screen.red.getContent().height, size, bullet), 
            --self.totalFires <= 0 && clearInterval(self.interval);
        }, timeInterval);
    },
    destroy: function() {},
    serialize: function() {}
}), RandomBehaviour = Class.extend({
    init: function(props) {
        this.props = props ? props : {};
    },
    clone: function() {
        var id = Math.floor(9 * Math.random());
        return 0 === id ? new GiantShootBehaviour({
            vel: 2.5,
            invencible: !0,
            bulletForce: 60,
            size: .8
        }) : 1 === id ? new SequenceBehaviour({
            angleOpen: 0,
            totalFires: 35
        }) : 2 === id ? new MultipleBehaviour({
            vel: 3,
            totalFires: 8,
            bulletForce: 10,
            size: .15,
            angleOpen: .25
        }) : 3 === id ? new SequenceBehaviour() : 4 === id ? new MultipleBehaviour({
            vel: 3.5,
            invencible: !0,
            totalFires: 5,
            bulletForce: 5,
            size: .5
        }) : 5 === id ? new HomingBehaviour({
            invencible: !0,
            bulletForce: 99,
            vel: 4
        }) : 6 === id ? new AkumaBehaviour() : 7 === id ? new AkumaBehaviour() : 8 === id ? new RainBehaviour() : new SequenceBehaviour({
            angleOpen: 0,
            totalFires: 25,
            sinoid: !0,
            vel: 2
        });
    },
    destroy: function() {},
    serialize: function() {}
}), SequenceBehaviour = Class.extend({
    init: function(props) {
        this.props = props ? props : {};
    },
    clone: function() {
        return new SequenceBehaviour(this.props);
    },
    build: function(screen) {
        var vel = this.props.vel ? this.props.vel : 10, timeLive = windowWidth / vel, timeInterval = this.props.timeInterval ? this.props.timeInterval : 150;
        this.totalFires = this.props.totalFires ? this.props.totalFires : 20;
        var angleOpen = void 0 !== this.props.angleOpen ? this.props.angleOpen : .9, bulletForce = this.props.bulletForce ? this.props.bulletForce : screen.playerModel.bulletForce, invencible = this.props.invencible ? this.props.invencible : !1, size = this.props.size ? this.props.size : .3, self = this, sinoid = this.props.sinoid ? this.props.sinoid : !1;
        this.interval = setInterval(function() {
            var angle = screen.red.rotation;
            angle += 0 === angleOpen ? 0 : angleOpen * Math.random() - angleOpen / 2;
            var bullet = new Bullet({
                x: Math.cos(angle) * vel,
                y: Math.sin(angle) * vel
            }, timeLive, bulletForce, screen.playerModel.bulletSource, screen.playerModel.bulletParticleSource, screen.playerModel.bulletRotation);
            bullet.invencible = invencible, bullet.build(), bullet.getContent().rotation = angle, 
            bullet.sinoid = sinoid, bullet.setPosition(.9 * screen.red.getPosition().x, screen.red.getPosition().y - .8 * screen.red.getContent().height), 
            screen.layer.addChild(bullet), scaleConverter(bullet.getContent().height, screen.red.getContent().height, size, bullet), 
            --self.totalFires <= 0 && clearInterval(self.interval);
        }, timeInterval);
    },
    destroy: function() {},
    serialize: function() {}
}), AppModel = Class.extend({
    init: function() {
        console.log(APP);
        var coins = APP.cookieManager.getSafeCookie("coins"), high = APP.cookieManager.getSafeCookie("highScore"), plays = APP.cookieManager.getSafeCookie("plays");
        APP.totalCoins = coins ? coins : 0, APP.highScore = high ? high : 0, APP.plays = plays ? plays : 0, 
        APP.currentPoints = 0, this.playerModels = [], this.playerModels.push({
            value: 0,
            label: "KETCHUP",
            color: 15152942,
            id: this.playerModels.length,
            enabled: !0
        }), this.playerModels.push({
            value: 10,
            label: "WASABI",
            color: 6073388,
            id: this.playerModels.length,
            enabled: !1
        }), this.playerModels.push({
            value: 20,
            label: "MAYO",
            color: 15461547,
            id: this.playerModels.length,
            enabled: !1
        }), this.playerModels.push({
            value: 30,
            label: "MOUSTARD",
            color: 15790663,
            id: this.playerModels.length,
            enabled: !1
        }), this.playerModels.push({
            value: 40,
            label: "BARBIECUE",
            color: 11619621,
            id: this.playerModels.length,
            enabled: !1
        }), this.playerModels.push({
            value: 50,
            label: "PUTONIUM",
            color: 7927665,
            id: this.playerModels.length,
            enabled: !1
        }), this.towelModels = [], this.towelModels.push({
            value: 0,
            color: 65280,
            imgSrc: "dist/img/2.png",
            thumb: "fundot2.png",
            id: this.towelModels.length,
            enabled: !1
        }), this.towelModels.push({
            value: 5,
            color: 16729404,
            imgSrc: "dist/img/1.png",
            thumb: "fundot1.png",
            id: this.towelModels.length,
            enabled: !0
        }), this.towelModels.push({
            value: 10,
            color: 255,
            imgSrc: "dist/img/3.png",
            thumb: "fundot3.png",
            id: this.towelModels.length,
            enabled: !1
        }), this.towelModels.push({
            value: 15,
            color: 10487543,
            imgSrc: "dist/img/4.png",
            thumb: "fundot4.png",
            id: this.towelModels.length,
            enabled: !1
        }), this.towelModels.push({
            value: 20,
            color: 364288,
            imgSrc: "dist/img/5.png",
            thumb: "fundot5.png",
            id: this.towelModels.length,
            enabled: !1
        }), this.towelModels.push({
            value: 25,
            color: 9830655,
            imgSrc: "dist/img/6.png",
            thumb: "fundot6.png",
            id: this.towelModels.length,
            enabled: !1
        }), this.burguersModels = [], this.burguersModels.push({
            value: 0,
            color: 16729404,
            imgSrc: "burger.png",
            thumb: "burger.png",
            id: this.burguersModels.length,
            enabled: !0
        }), this.burguersModels.push({
            value: 5,
            color: 65280,
            imgSrc: "burger.png",
            thumb: "burger.png",
            id: this.burguersModels.length,
            enabled: !1
        }), this.burguersModels.push({
            value: 10,
            color: 255,
            imgSrc: "burger.png",
            thumb: "burger.png",
            id: this.burguersModels.length,
            enabled: !1
        }), this.burguersModels.push({
            value: 15,
            color: 10487543,
            imgSrc: "burger.png",
            thumb: "burger.png",
            id: this.burguersModels.length,
            enabled: !1
        }), this.burguersModels.push({
            value: 20,
            color: 364288,
            imgSrc: "burger.png",
            thumb: "burger.png",
            id: this.burguersModels.length,
            enabled: !1
        }), this.burguersModels.push({
            value: 25,
            color: 9830655,
            imgSrc: "burger.png",
            thumb: "burger.png",
            id: this.burguersModels.length,
            enabled: !1
        }), this.updateTowels(), this.updateBurguers();
        var enableds = APP.cookieManager.getSafeCookie("enableds"), j = 0;
        if (enableds) for (enableds = enableds.split(","), j = 0; j < this.playerModels.length - 1; j++) console.log(enableds[j]), 
        "1" === enableds[j] && (this.playerModels[j].enabled = !0); else {
            for (console.log("whata"), enableds = "1", j = 0; j < this.playerModels.length - 1; j++) enableds += ",0";
            APP.cookieManager.setSafeCookie("enableds", enableds);
        }
        this.currentPlayerModel = this.playerModels[0], this.currentTowelModel = this.towelModels[0], 
        this.currentBurguerlModel = this.burguersModels[0], this.totalPlayers = 0;
        for (var i = this.playerModels.length - 1; i >= 0; i--) this.playerModels[i].toAble <= this.totalPoints && (this.playerModels[i].able = !0, 
        this.totalPlayers++);
        this.currentHorde = 0;
    },
    updateBurguers: function() {
        var i = 0;
        for (i = this.burguersModels.length - 1; i >= 0; i--) this.burguersModels[i].value <= APP.highScore && (this.burguersModels[i].enabled = !0);
    },
    updateTowels: function() {
        var i = 0;
        for (i = this.towelModels.length - 1; i >= 0; i--) this.towelModels[i].value <= APP.plays && (this.towelModels[i].enabled = !0);
    },
    saveScore: function() {
        APP.cookieManager.setSafeCookie("coins", APP.totalCoins), APP.cookieManager.setSafeCookie("highScore", APP.highScore), 
        APP.cookieManager.setSafeCookie("plays", APP.plays);
        var i = 0;
        this.updateTowels(), this.updateBurguers();
        var enableds = "1";
        for (i = 1; i < this.playerModels.length; i++) enableds += this.playerModels[i].enabled ? ",1" : ",0";
        console.log(enableds), APP.cookieManager.setSafeCookie("enableds", enableds), console.log(APP.cookieManager.getSafeCookie("enableds"));
    },
    setModel: function(id) {
        this.currentID = id, this.currentPlayerModel = this.playerModels[id];
    },
    zerarTudo: function() {
        APP.totalCoins = 0, APP.highScore = 0, APP.plays = 0, APP.cookieManager.setSafeCookie("enableds", "0"), 
        APP.cookieManager.setSafeCookie("coins", APP.totalCoins), APP.cookieManager.setSafeCookie("highScore", APP.highScore), 
        APP.cookieManager.setSafeCookie("plays", APP.plays);
    },
    maxPoints: function() {
        this.currentHorde = 0, this.totalPoints = 999999, this.totalBirds = 8, APP.cookieManager.setCookie("totalPoints", this.totalPoints, 500), 
        APP.cookieManager.setCookie("totalBirds", this.totalBirds, 500);
        for (var i = this.playerModels.length - 1; i >= 0; i--) this.playerModels[i].toAble <= this.totalPoints ? this.playerModels[i].able = !0 : this.playerModels[i].able = !1;
    },
    getNewObstacle: function(screen) {
        var id = Math.floor(this.obstacleModels.length * Math.random()), obs = new Obstacle(this.obstacleModels[id], screen);
        return obs;
    },
    getNewEnemy: function(player, screen) {
        this.currentHorde++;
        var max = this.birdProbs.length;
        this.currentHorde < max && (max = this.currentHorde);
        for (var id = 99999; id > this.totalBirds - 1; ) id = this.birdProbs[Math.floor(max * Math.random())];
        this.birdModels[id].target = player;
        var bird = new Bird(this.birdModels[id], screen);
        return bird.id = id, console.log(bird.id), this.lastID = id, bird;
    },
    ableNewBird: function(birdModel) {
        if (birdModel && !(this.totalBirds >= this.birdModels.length)) {
            this.totalBirds = 0;
            for (var i = 0; i < this.birdModels.length; i++) if (this.totalBirds++, this.birdModels[i].label === birdModel.label) {
                console.log(this.birdModels[i].label, birdModel.label);
                break;
            }
            console.log(this.totalBirds), APP.cookieManager.setCookie("totalBirds", this.totalBirds, 500);
        }
    },
    add100Points: function() {
        this.totalPoints += 100, APP.cookieManager.setCookie("totalPoints", 100, 500), this.totalPlayers = 0;
        for (var i = this.playerModels.length - 1; i >= 0; i--) this.playerModels[i].toAble <= this.totalPoints && !this.playerModels[i].able && (this.playerModels[i].able = !0), 
        this.playerModels[i].able && this.totalPlayers++;
    },
    addPoints: function() {
        this.currentHorde = 0, this.totalPoints += this.currentPoints, this.highScore < this.currentPoints && (this.highScore = this.currentPoints, 
        APP.cookieManager.setCookie("highScore", this.highScore, 500), APP.dataManager.saveScore()), 
        APP.cookieManager.setCookie("totalPoints", this.totalPoints, 500), this.maxPoints < this.currentPoints && (this.maxPoints = this.currentPoints);
        var tempReturn = [];
        this.totalPlayers = 0;
        for (var i = this.playerModels.length - 1; i >= 0; i--) this.playerModels[i].toAble <= this.totalPoints && !this.playerModels[i].able && (this.playerModels[i].able = !0, 
        tempReturn.push(this.playerModels[i])), this.playerModels[i].able && this.totalPlayers++;
        return tempReturn;
    },
    build: function() {},
    destroy: function() {},
    serialize: function() {}
}), BirdModel = Class.extend({
    init: function(graphicsObject, statsObjec) {
        this.cover = graphicsObject.cover ? graphicsObject.cover : "belga.png", this.imgSource = graphicsObject.source ? graphicsObject.source : [ "belga.png" ], 
        this.particles = graphicsObject.particles ? graphicsObject.particles : [ "smoke.png" ], 
        this.egg = graphicsObject.egg ? graphicsObject.egg : [ "smoke.png" ], this.sizePercent = graphicsObject.sizePercent ? graphicsObject.sizePercent : .2, 
        this.label = graphicsObject.label ? graphicsObject.label : "", this.demage = statsObjec.demage, 
        this.vel = statsObjec.vel, this.hp = statsObjec.hp, this.target = statsObjec.target, 
        this.timeLive = 999, this.toNext = statsObjec.toNext ? statsObjec.toNext : 150, 
        this.behaviour = statsObjec.behaviour, this.money = statsObjec.money;
    },
    serialize: function() {}
}), DataManager = Class.extend({
    init: function() {
        this.highscore = APP.cookieManager.getCookie("highScore"), console.log("highscore", this.highscore.points);
    },
    saveScore: function(id) {
        var i = 0, tempBirds = [ [ "caralinhoDaTerra", 0 ], [ "caralhoBelga", 0 ], [ "lambecuFrances", 0 ], [ "papacuDeCabecaRoxa", 0 ], [ "galinhoPapoDeBago", 0 ], [ "nocututinha", 0 ], [ "calopsuda", 0 ], [ "picudaoAzulNigeriano", 0 ] ];
        for (i = APP.getGameModel().killedBirds.length - 1; i >= 0; i--) tempBirds[APP.getGameModel().killedBirds[i]][1]++;
        var sendObject = '{\n"character":"' + APP.getGameModel().playerModels[APP.getGameModel().currentID].label + '",\n"points":"' + APP.getGameModel().currentPoints + '",\n"birds":{\n';
        for (i = 0; i < tempBirds.length; i++) sendObject += i >= tempBirds.length - 1 ? '"' + tempBirds[i][0] + '":"' + tempBirds[i][1] + '"\n' : '"' + tempBirds[i][0] + '":"' + tempBirds[i][1] + '",\n';
        sendObject += "}\n}", console.log(sendObject);
        ({
            character: APP.getGameModel().playerModels[APP.getGameModel().currentID].label,
            points: APP.getGameModel().currentPoints
        });
        this.highscore = JSON.parse(sendObject), APP.cookieManager.setCookie("highScore", this.highscore, 500);
    }
}), PlayerModel = Class.extend({
    init: function(graphicsObject, statsObject) {
        this.range = 40, this.maxEnergy = 7e3, this.currentEnergy = 8e3, this.maxBulletEnergy = 100, 
        this.currentBulletEnergy = 100, this.recoverBulletEnergy = .5, this.chargeBullet = 2, 
        this.currentBulletForce = 100, this.recoverEnergy = .5, this.label = graphicsObject.label ? graphicsObject.label : "NOME", 
        this.labelSource = graphicsObject.labelSource ? graphicsObject.labelSource : "", 
        this.thumb = graphicsObject.thumb ? graphicsObject.thumb : "thumb_jeiso", this.thumbColor = this.thumb + "_color.png", 
        this.thumbGray = this.thumb + "_gray.png", this.color = graphicsObject.color ? graphicsObject.color : 8755, 
        this.imgSourceGame = graphicsObject.inGame ? graphicsObject.inGame : "piangersNGame.png", 
        this.imgSource = graphicsObject.outGame ? graphicsObject.outGame : this.imgSourceGame, 
        this.coverSource = graphicsObject.coverSource ? graphicsObject.coverSource : "dist/img/UI/jeisoGrande.png", 
        this.bulletSource = graphicsObject.bullet ? graphicsObject.bullet : "feterFire.png", 
        this.bulletParticleSource = graphicsObject.bulletParticle ? graphicsObject.bulletParticle : this.bulletSource, 
        this.smoke = graphicsObject.smoke ? graphicsObject.smoke : "smoke.png", this.specSource = graphicsObject.specSource ? graphicsObject.specSource : null, 
        this.icoSpecSource = graphicsObject.icoSpecSource ? graphicsObject.icoSpecSource : "especial_fetter.png", 
        this.bulletRotation = graphicsObject.bulletRotation ? graphicsObject.bulletRotation : !1, 
        this.energyCoast = statsObject.energyCoast ? statsObject.energyCoast : 1, this.energyCoast = 4 - this.energyCoast, 
        this.maxEnergy = statsObject.maxEnergy ? statsObject.maxEnergy : 7e3, this.bulletCoast = statsObject.bulletCoast ? statsObject.bulletCoast : .2, 
        this.velocity = statsObject.vel ? statsObject.vel : 2, this.bulletVel = statsObject.bulletVel ? statsObject.bulletVel : 8, 
        this.bulletForce = statsObject.bulletForce ? statsObject.bulletForce : 1, this.toAble = statsObject.toAble ? statsObject.toAble : 0, 
        this.toSpec = statsObject.toSpec ? statsObject.toSpec : 1e3, this.bulletBehaviour = statsObject.bulletBehaviour ? statsObject.bulletBehaviour : new MultipleBehaviour(), 
        this.able = !1;
    },
    reset: function(id) {
        this.currentEnergy = this.maxEnergy, this.currentBulletEnergy = this.maxBulletEnergy;
    },
    build: function() {},
    destroy: function() {},
    serialize: function() {}
}), ChoiceScreen = AbstractScreen.extend({
    init: function(label) {
        this._super(label), this.isLoaded = !1;
    },
    destroy: function() {
        this._super();
    },
    build: function() {
        this._super();
        var assetsToLoader = [];
        this.loader = new PIXI.AssetLoader(assetsToLoader), assetsToLoader.length > 0 ? this.initLoad() : this.onAssetsLoaded(), 
        this.updateable = !0;
    },
    update: function() {
        !this.updateable;
    },
    onProgress: function() {
        this._super();
    },
    onAssetsLoaded: function() {
        this.initApplication();
    },
    initApplication: function() {
        var self = this;
        this.scrollContainer1 = new PIXI.DisplayObjectContainer(), this.addChild(this.scrollContainer1), 
        this.scrollContainer2 = new PIXI.DisplayObjectContainer(), this.addChild(this.scrollContainer2), 
        this.scrollContainer3 = new PIXI.DisplayObjectContainer(), this.addChild(this.scrollContainer3);
        var marginTopBottom = (new PIXI.Graphics(), .3 * windowHeight);
        this.shopList = [], this.towelList = [], this.burgerList = [], this.saucesLabel = new PIXI.Text("SAUCES", {
            font: "50px Vagron",
            fill: "#FFFFFF"
        }), this.saucesLabel.position.x = windowWidth / 2 - this.saucesLabel.width / 2, 
        this.saucesLabel.position.y = 100, this.scrollContainer1.addChild(this.saucesLabel);
        var shopItem, shopItemTowel, shopItemBurger, line = -1, col = 0, i = 0, margin = 0, initY = this.saucesLabel.position.y + 1.5 * this.saucesLabel.height;
        for (i = 0; i < APP.appModel.playerModels.length; i++) shopItem = new ShopItem(this), 
        shopItem.build(APP.appModel.playerModels[i]), this.scrollContainer1.addChild(shopItem.getContent()), 
        i % 2 === 0 ? (col = 0, line++) : col++, 0 === margin && (margin = 5 + (windowWidth - (1.2 * shopItem.getContent().width + shopItem.getContent().width)) / 2), 
        shopItem.getContent().position.y = 1.2 * line * shopItem.getContent().height + initY, 
        shopItem.getContent().position.x = (shopItem.getContent().width + .2 * shopItem.getContent().height) * col + margin, 
        this.shopList.push(shopItem), shopItem.updateStats();
        for (console.log("INIT"), this.foodLabel = new PIXI.Text("FOOD", {
            font: "50px Vagron",
            fill: "#FFFFFF"
        }), this.foodLabel.position.x = windowWidth / 2 - this.foodLabel.width / 2, this.foodLabel.position.y = shopItem.getContent().position.y + 1.5 * shopItem.getContent().height, 
        this.foodLabel.position.y = 100, this.scrollContainer2.addChild(this.foodLabel), 
        line = -1, col = 0, initY = this.foodLabel.position.y + 1.5 * this.foodLabel.height, 
        i = 0; i < APP.appModel.burguersModels.length; i++) shopItemBurger = new ShopItemBurger(this), 
        shopItemBurger.build(APP.appModel.burguersModels[i]), this.scrollContainer2.addChild(shopItemBurger.getContent()), 
        i % 2 === 0 ? (col = 0, line++) : col++, scaleConverter(shopItemBurger.getContent().width, windowWidth, .4, shopItemBurger.getContent()), 
        shopItemBurger.getContent().position.y = 1.2 * line * shopItemBurger.getContent().height + initY, 
        shopItemBurger.getContent().position.x = (shopItemBurger.getContent().width + .2 * shopItemBurger.getContent().height) * col + margin, 
        this.burgerList.push(shopItemBurger), shopItemBurger.updateStats();
        for (this.tableLabel = new PIXI.Text("TABLE", {
            font: "50px Vagron",
            fill: "#FFFFFF"
        }), this.tableLabel.position.x = windowWidth / 2 - this.tableLabel.width / 2, this.tableLabel.position.y = shopItemBurger.getContent().position.y + 1.5 * shopItemBurger.getContent().height, 
        this.tableLabel.position.y = 100, this.scrollContainer3.addChild(this.tableLabel), 
        initY = this.tableLabel.position.y + 1.5 * this.tableLabel.height, line = -1, col = 0, 
        i = 0; i < APP.appModel.towelModels.length; i++) shopItemTowel = new ShopItemTowel(this), 
        shopItemTowel.build(APP.appModel.towelModels[i]), this.scrollContainer3.addChild(shopItemTowel.getContent()), 
        i % 2 === 0 ? (col = 0, line++) : col++, scaleConverter(shopItemTowel.getContent().width, windowWidth, .4, shopItemTowel.getContent()), 
        shopItemTowel.getContent().position.y = 1.2 * line * shopItemTowel.getContent().height + initY, 
        shopItemTowel.getContent().position.x = (shopItemTowel.getContent().width + .2 * shopItemTowel.getContent().height) * col + margin, 
        this.towelList.push(shopItemTowel), shopItemTowel.updateStats();
        this.back = new PIXI.Graphics(), this.back.beginFill(15514636), this.back.drawRect(0, 0, windowWidth, windowHeight), 
        this.back.height = shopItemTowel.getContent().position.y + shopItemTowel.getContent().height + marginTopBottom / 2, 
        this.addChild(this.back), this.back.parent.setChildIndex(this.back, 0), this.backTop = new PIXI.Graphics(), 
        this.backTop.beginFill(14370108), this.backTop.drawRect(0, 0, windowWidth, .1 * windowHeight), 
        this.container.addChild(this.backTop), this.textScreen = new PIXI.Text("SHOP", {
            font: "50px Vagron",
            fill: "#FFFFFF"
        }), scaleConverter(this.textScreen.width, windowWidth, .25, this.textScreen), this.textScreen.position.x = windowWidth / 2 - this.textScreen.width / 2, 
        this.textScreen.position.y = this.backTop.height / 2 - this.textScreen.height / 2, 
        this.container.addChild(this.textScreen), this.playButton = new DefaultButton("play1.png", "play1.png"), 
        this.playButton.build(), scaleConverter(this.playButton.getContent().height, this.textScreen.height, 1, this.playButton), 
        this.playButton.setPosition(windowWidth - this.playButton.getContent().width - .1 * windowWidth, this.backTop.height / 2 - this.playButton.getContent().height / 2), 
        this.addChild(this.playButton), this.playButton.clickCallback = function() {
            self.updateable = !1, self.toTween(function() {
                self.screenManager.change("Init"), APP.goDirect = !0;
            });
        }, this.coinsLabel = new PIXI.Text("x" + APP.totalCoins, {
            font: "50px Vagron",
            fill: "#FFFFFF"
        }), scaleConverter(this.coinsLabel.height, this.playButton.getContent().height, 1, this.coinsLabel), 
        this.coinsLabel.position.x = .1 * windowWidth, this.coinsLabel.position.y = this.backTop.height / 2 - this.coinsLabel.height / 2, 
        this.container.addChild(this.coinsLabel), this.currentPage = 0, this.currentPageLast = 1, 
        this.vecPages = [ this.scrollContainer1, this.scrollContainer2, this.scrollContainer3 ];
        for (var j = this.vecPages.length - 1; j >= 0; j--) this.vecPages[j].position.x = windowWidth;
        this.balls = [];
        var tempBall;
        this.containerBalls = new PIXI.DisplayObjectContainer(), this.addChild(this.containerBalls);
        for (var k = 0; k < this.vecPages.length; k++) tempBall = new PIXI.Graphics(), tempBall.beginFill(16777215), 
        tempBall.drawCircle(10, 0, 10), tempBall.position.x = 1.5 * tempBall.width * k, 
        this.balls.push(tempBall), this.containerBalls.addChild(tempBall), tempBall.tint = 16777215;
        scaleConverter(this.containerBalls.width, windowWidth, .12, this.containerBalls), 
        this.containerBalls.position.x = windowWidth / 2 - this.containerBalls.width / 2;
        var lalalaTop = this.scrollContainer1.position.y + shopItem.getContent().position.y + shopItem.getContent().height, lalalal = windowHeight - lalalaTop;
        this.containerBalls.position.y = lalalal / 2 + lalalaTop, this.updateShopList("right"), 
        this.hammer && (this.hammer.off("swiperight"), this.hammer.off("swipeleft"));
        var swipe = new Hammer.Swipe();
        this.hammer = new Hammer.Manager(renderer.view), this.hammer.add(swipe), this.hammer.on("swiperight", function(event) {
            self.currentPage <= 0 ? self.currentPage = self.vecPages.length - 1 : self.currentPage--, 
            self.updateShopList("right");
        }), this.hammer.on("swipeleft", function(event) {
            self.currentPage >= self.vecPages.length - 1 ? self.currentPage = 0 : self.currentPage++, 
            self.updateShopList("left");
        });
    },
    updateShopList: function(side) {
        if (!this.initSider) {
            this.initSider = !0;
            var self = this;
            "right" === side ? (console.log(this.vecPages[this.currentPage].x, " - 1", this.currentPage), 
            this.vecPages[this.currentPage].position.x = -this.vecPages[this.currentPage].width, 
            console.log(this.vecPages[this.currentPage].x, " - 2"), TweenLite.to(this.vecPages[this.currentPage], .5, {
                x: 0,
                onComplete: function() {
                    self.initSider = !1;
                }
            }), TweenLite.to(this.vecPages[this.currentPageLast], .5, {
                x: windowWidth
            })) : (this.vecPages[this.currentPage].position.x = windowWidth, TweenLite.to(this.vecPages[this.currentPageLast], .5, {
                x: 1.2 * -this.vecPages[this.currentPageLast].width
            }), TweenLite.to(this.vecPages[this.currentPage], .5, {
                x: 0,
                onComplete: function() {
                    self.initSider = !1;
                }
            })), this.balls[this.currentPage].tint = 14370108, this.balls[this.currentPageLast].tint = 16777215, 
            this.currentPageLast = this.currentPage;
        }
    },
    updateCoins: function() {
        this.coinsLabel.setText("x" + APP.totalCoins), this.coinsLabel.position.x = .1 * windowWidth, 
        this.coinsLabel.position.y = this.backTop.height / 2 - this.coinsLabel.height / 2;
    },
    applyScroll: function(container) {
        function verifyPos(posReturn) {
            return posReturn > 0 && (posReturn = 0), container.height > windowHeight ? Math.abs(posReturn) + windowHeight > container.height && (posReturn = -container.height + windowHeight) : posReturn + container.height > windowHeight && (posReturn = windowHeight - container.height), 
            posReturn;
        }
        container.interactive = !0, container.mousedown = container.touchstart = function(mouseData) {
            setTimeout(function() {
                APP.scrolling = !1;
            }, 100), container.mouseDown = !0, container.initGlobalY = mouseData.global.y - container.position.y;
        }, container.mousemove = container.touchmove = function(mouseData) {
            if (container.mouseDown) {
                container.lastVelY = mouseData.global.y - container.initGlobalY - container.position.y;
                var posDest = verifyPos(mouseData.global.y - container.initGlobalY);
                container.position.y = posDest, TweenLite.killTweensOf(container.position);
            }
        }, container.mouseup = container.touchend = function(mouseData) {
            container.mouseDown = !1;
            var posDest = verifyPos(container.position.y + 5 * container.lastVelY);
            console.log(container.initGlobalY, posDest, container.position.y), pointDistance(0, posDest, 0, container.position.y) < 31 || TweenLite.to(container.position, Math.abs(container.lastVelY) / 120, {
                y: posDest,
                onComplete: function() {
                    APP.scrolling = !1;
                }
            });
        };
    },
    toTween: function(callback) {
        TweenLite.to(this.textScreen, .1, {
            delay: .1,
            alpha: 0
        }), TweenLite.to(this.playButton.getContent(), .1, {
            delay: .1,
            y: -this.playButton.getContent().height,
            ease: "easeOutBack",
            onComplete: function() {
                callback && callback();
            }
        });
    },
    fromTween: function(callback) {
        console.log("from"), TweenLite.from(this.textScreen, .1, {
            delay: .1,
            alpha: 0
        }), TweenLite.from(this.playButton.getContent(), .1, {
            delay: .1,
            y: windowHeight,
            ease: "easeOutBack",
            onComplete: function() {
                callback && callback();
            }
        });
    },
    setAudioButtons: function() {
        var self = this;
        APP.mute = !0, Howler.mute(), this.audioOn = new DefaultButton("volumeButton_on.png", "volumeButton_on_over.png"), 
        this.audioOn.build(), scaleConverter(this.audioOn.width, windowWidth, .15, this.audioOn), 
        this.audioOn.setPosition(windowWidth - this.audioOn.getContent().width - 20, 20), 
        this.audioOff = new DefaultButton("volumeButton_off.png", "volumeButton_off_over.png"), 
        this.audioOff.build(), scaleConverter(this.audioOff.width, windowWidth, .15, this.audioOff), 
        this.audioOff.setPosition(windowWidth - this.audioOn.getContent().width - 20, 20), 
        this.addChild(APP.mute ? this.audioOff : this.audioOn), this.audioOn.clickCallback = function() {
            APP.mute = !0, Howler.mute(), self.audioOn.getContent().parent && self.audioOn.getContent().parent.removeChild(self.audioOn.getContent()), 
            self.audioOff.getContent() && self.addChild(self.audioOff);
        }, this.audioOff.clickCallback = function() {
            APP.mute = !1, Howler.unmute(), self.audioOff.getContent().parent && self.audioOff.getContent().parent.removeChild(self.audioOff.getContent()), 
            self.audioOn.getContent() && self.addChild(self.audioOn);
        };
    }
}), GameScreen = AbstractScreen.extend({
    init: function(label) {
        this._super(label), this.isLoaded = !1, this.fistTime = !1, APP.points = 0, APP.cookieManager.getSafeCookie("highscore") ? APP.highscore = APP.cookieManager.getSafeCookie("highscore") : (APP.cookieManager.setSafeCookie("highscore", 0), 
        APP.highscore = 0);
    },
    destroy: function() {
        this._super();
    },
    build: function() {
        this._super();
        var assetsToLoader = [];
        void 0 !== assetsToLoader && assetsToLoader.length > 0 && !this.isLoaded ? this.initLoad() : this.onAssetsLoaded(), 
        this.pinVel = {
            x: 0,
            y: 0
        }, console.log("buid");
    },
    onProgress: function() {
        this._super();
    },
    onAssetsLoaded: function() {
        this.initApplication();
    },
    initApplication: function() {
        var self = this;
        this.background ? this.addChild(this.background) : (this.background = new PIXI.Graphics(), 
        this.background.beginFill(APP.backColor), this.background.drawRect(0, 0, windowWidth, windowHeight), 
        this.addChild(this.background)), this.interactiveBackground ? this.addChild(this.interactiveBackground) : (this.interactiveBackground = new InteractiveBackground(this), 
        this.interactiveBackground.build(), this.addChild(this.interactiveBackground)), 
        this.hitTouch = new PIXI.Graphics(), this.hitTouch.interactive = !0, this.hitTouch.beginFill(0), 
        this.hitTouch.drawRect(0, 0, windowWidth, windowHeight), this.hitTouch.alpha = 0, 
        this.hitTouch.hitArea = new PIXI.Rectangle(0, 0, windowWidth, windowHeight), this.tapDown = !1, 
        this.hitTouch.touchend = this.hitTouch.mouseup = function(mouseData) {
            self.tapDown = !1, self.shoot(self.force * gameScale);
        }, this.hitTouch.touchstart = this.hitTouch.mousedown = function(touchData) {
            self.tapDown = !0;
        }, this.updateable = !0, this.pauseButton = new DefaultButton("UI_button_default_1.png", "UI_button_default_1.png", "UI_button_default_1.png"), 
        this.pauseButton.build(), scaleConverter(this.pauseButton.getContent().width, windowWidth, .1, this.pauseButton), 
        this.pauseButton.setPosition(20, 20), this.pauseButton.clickCallback = function() {
            self.pauseModal.show();
        }, this.backButton = new DefaultButton("UI_button_default_1.png", "UI_button_default_1.png"), 
        this.backButton.build(), this.backButton.addLabel(new PIXI.Text("BACK", {
            font: "50px Vagron",
            fill: "#FFFFFF"
        }), 40), scaleConverter(this.backButton.getContent().width, windowWidth, .4, this.backButton), 
        this.backButton.setPosition(windowWidth / 2 - this.backButton.getContent().width / 2, windowHeight - 2.5 * this.backButton.getContent().height), 
        this.backButton.clickCallback = function() {
            self.updateable = !1, self.toTween(function() {
                self.screenManager.change("Init");
            });
        }, APP.withAPI && GameAPI.GameBreak.request(function() {
            self.pauseModal.show();
        }, function() {
            self.pauseModal.hide();
        }), this.brilhoBase = new SimpleSprite("baseDegrade.png"), this.brilhoBase.getContent().alpha = .5, 
        scaleConverter(this.brilhoBase.getContent().width, windowWidth, 1, this.brilhoBase), 
        this.brilhoBase.getContent().position.x = windowWidth / 2 - this.brilhoBase.getContent().width / 2, 
        this.brilhoBase.getContent().position.y = windowHeight, this.layerManager = new LayerManager(), 
        this.layerManager.build("Main"), this.addChild(this.layerManager), this.layer = new Layer(), 
        this.layer.build("EntityLayer"), this.layerManager.addLayer(this.layer), this.coinsLabel = new PIXI.Text("0", {
            align: "center",
            font: "72px Vagron",
            fill: "#FFFFFF",
            wordWrap: !0,
            wordWrapWidth: 500
        }), this.coinsLabel.resolution = retina, this.coinsLabel.alpha = 0, this.addChild(this.coinsLabel), 
        this.crazyContent = new PIXI.DisplayObjectContainer(), this.addChild(this.crazyContent), 
        this.loaderBar = new LifeBarHUD(windowWidth, 20, 0, 16777215, 16777215), this.addChild(this.loaderBar.getContent()), 
        this.loaderBar.getContent().position.x = 0, this.loaderBar.getContent().position.y = 0, 
        this.loaderBar.updateBar(0, 100), this.loaderBar.getContent().alpha = 0, this.fistTime ? this.initLevel() : (this.changeColor(!0, !0), 
        this.openEndMenu(), this.fistTime = !0), this.startLevel = !1;
    },
    addCrazyMessage: function(message) {
        if (this.crazyLabel && this.crazyLabel.parent) {
            if (this.crazyLabel.text === message) return;
            this.crazyLabel.parent.removeChild(this.crazyLabel);
        }
        this.crazyLabel2 && this.crazyLabel2.parent && this.crazyLabel2.parent.removeChild(this.crazyLabel2);
        var rot = .01 * Math.random() + .04;
        rot = Math.random() < .5 ? -rot : rot;
        var scl = 1;
        this.crazyLabel = new PIXI.Text(message, {
            align: "center",
            font: "30px Vagron",
            fill: "#9d47e0",
            wordWrap: !0,
            wordWrapWidth: 500
        }), this.crazyLabel.resolution = retina, this.crazyLabel.rotation = rot, this.crazyLabel.position.y = windowHeight / 1.1 + this.crazyLabel.height / 2 / this.crazyLabel.resolution, 
        this.crazyLabel.position.x = windowWidth / 2, this.crazyLabel.anchor = {
            x: .5,
            y: .5
        }, this.crazyLabel2 = new PIXI.Text(message, {
            align: "center",
            font: "30px Vagron",
            fill: "#13c2b6",
            wordWrap: !0,
            wordWrapWidth: 500
        }), this.crazyLabel2.resolution = retina, this.crazyLabel2.rotation = -rot, this.crazyLabel2.position.y = windowHeight / 1.1 + this.crazyLabel2.height / 2 / this.crazyLabel2.resolution, 
        this.crazyLabel2.position.x = windowWidth / 2, this.crazyLabel2.anchor = {
            x: .5,
            y: .5
        }, this.crazyContent.addChild(this.crazyLabel), this.crazyContent.addChild(this.crazyLabel2), 
        this.crazyContent.alpha = 1, this.crazyContent.rotation = 0, TweenLite.from(this.crazyLabel, .4, {
            rotation: 0
        }), TweenLite.from(this.crazyLabel2, .4, {
            rotation: 0
        }), TweenLite.from(this.crazyLabel.scale, .2, {
            x: 2 * scl,
            y: 2 * scl
        }), TweenLite.from(this.crazyLabel2.scale, .2, {
            x: 2 * scl,
            y: 2 * scl
        });
    },
    miss: function() {
        this.player.breakJump = !0, this.player.velocity.y = 0;
        var wrongLabel = APP.vecError[Math.floor(APP.vecError.length * Math.random())], rot = .004 * Math.random(), tempLabel = new PIXI.Text(wrongLabel, {
            font: "35px Vagron",
            fill: "#ec8b78"
        }), errou = new Particles({
            x: 0,
            y: 0
        }, 120, tempLabel, rot);
        errou.maxScale = this.player.getContent().scale.x, errou.build(), errou.gravity = .1, 
        errou.alphadecress = .01, errou.scaledecress = .05, errou.setPosition(this.player.getPosition().x - tempLabel.width / 2, this.player.getPosition().y - 50), 
        this.layer.addChild(errou);
        var errou2 = new Particles({
            x: 0,
            y: 0
        }, 120, new PIXI.Text(wrongLabel, {
            font: "35px Vagron",
            fill: "#c01f2e"
        }), -rot);
        errou2.maxScale = this.player.getContent().scale.x, errou2.build(), errou2.gravity = .1, 
        errou2.alphadecress = .01, errou2.scaledecress = .05, errou2.setPosition(this.player.getPosition().x - tempLabel.width / 2 + 2, this.player.getPosition().y - 50 + 2), 
        this.layer.addChild(errou2), errou2.getContent().parent.setChildIndex(errou.getContent(), errou.getContent().parent.children.length - 1), 
        errou2.getContent().parent.setChildIndex(errou2.getContent(), errou2.getContent().parent.children.length - 1), 
        this.player.inError = !0, this.levelCounter -= .1 * this.levelCounterMax, this.levelCounter < 0 && (this.levelCounter = 0);
    },
    shoot: function(force) {
        this.player.inError || (this.startLevel = !0, this.player.jump(force), this.player.improveGravity(), 
        this.force = 0, TweenLite.to(this.loaderBar.getContent(), .2, {
            delay: .2,
            alpha: 1
        }), this.addCrazyMessage("HOLD"));
    },
    reset: function() {
        this.destroy(), this.build();
    },
    update: function() {
        this.updateable && (this.player ? (this.player.inError || (this.tapDown && this.force < 30 && (this.force += .9, 
        this.player.charge(), clearInterval(this.holdInterval)), this.startLevel && (this.levelCounter--, 
        this.levelCounter < 0 && (this.levelCounter = 0))), this.player.force = this.force, 
        this.player.velocity.y < 0 ? this.interactiveBackground.gravity = Math.abs(this.player.velocity.y) / 15 : this.interactiveBackground.gravity = 0, 
        this.levelCounter <= 0 && this.gameOver(), this.loaderBar.updateBar(this.levelCounter, this.levelCounterMax)) : this.interactiveBackground.gravity = 1, 
        this.crazyLogo && this.crazyLogo.update(), this._super());
    },
    gameOver: function() {
        if (this.endGame) return this.crazyContent.alpha = 0, this.coinsLabel.alpha = 0, 
        this.brilhoBase.getContent().alpha = 0, void (this.loaderBar.getContent().alpha = 0);
        this.hitTouch.parent.removeChild(this.hitTouch), this.player.preKill(), this.targetJump.preKill(), 
        this.earthquake(40), this.endGame = !0, this.crazyContent.alpha = 0, this.coinsLabel.alpha = 0, 
        this.brilhoBase.getContent().alpha = 0, this.loaderBar.getContent().alpha = 0, this.interactiveBackground.accel = -5;
        var self = this;
        setTimeout(function() {
            self.openEndMenu();
        }, 1e3);
    },
    openEndMenu: function() {
        this.endMenuContainer = new PIXI.DisplayObjectContainer(), this.container.addChild(this.endMenuContainer), 
        APP.points > APP.highscore && (APP.cookieManager.setSafeCookie("highscore", APP.points), 
        APP.highscore = APP.points);
        var scoreContainer = new PIXI.DisplayObjectContainer(), scoreBack = new PIXI.Graphics();
        scoreBack.beginFill(16777215), scoreBack.drawRoundedRect(0, 0, 160, 125, 5), scoreContainer.addChild(scoreBack);
        var currentScoreTitle = new PIXI.Text("SCORE", {
            align: "center",
            font: "18px Vagron",
            fill: APP.vecColorsS[APP.currentColorID],
            wordWrap: !0,
            wordWrapWidth: 100
        });
        scoreContainer.addChild(currentScoreTitle), currentScoreTitle.resolution = retina, 
        currentScoreTitle.position.x = scoreBack.width / 2 - currentScoreTitle.width / 2 / currentScoreTitle.resolution, 
        currentScoreTitle.position.y = 10;
        var currentScore = new PIXI.Text(APP.points, {
            align: "center",
            font: "30px Vagron",
            fill: APP.vecColorsS[APP.currentColorID],
            wordWrap: !0,
            wordWrapWidth: 500
        });
        scoreContainer.addChild(currentScore), currentScore.resolution = retina, currentScore.position.x = scoreBack.width / 2 - currentScore.width / 2 / currentScore.resolution, 
        currentScore.position.y = currentScoreTitle.position.y + currentScoreTitle.height / currentScoreTitle.resolution - 10;
        var highscoreTitle = new PIXI.Text("HIGHSCORE", {
            align: "center",
            font: "14px Vagron",
            fill: APP.vecColorsS[APP.currentColorID],
            wordWrap: !0,
            wordWrapWidth: 100
        });
        scoreContainer.addChild(highscoreTitle), highscoreTitle.resolution = retina, highscoreTitle.position.x = scoreBack.width / 2 - highscoreTitle.width / 2 / highscoreTitle.resolution, 
        highscoreTitle.position.y = currentScore.position.y + currentScore.height / currentScore.resolution;
        var highScoreLabel = new PIXI.Text(APP.highscore, {
            align: "center",
            font: "22px Vagron",
            fill: APP.vecColorsS[APP.currentColorID],
            wordWrap: !0,
            wordWrapWidth: 500
        });
        scoreContainer.addChild(highScoreLabel), highScoreLabel.resolution = retina, highScoreLabel.position.x = scoreBack.width / 2 - highScoreLabel.width / 2 / highScoreLabel.resolution, 
        highScoreLabel.position.y = highscoreTitle.position.y + highscoreTitle.height / highscoreTitle.resolution - 10, 
        scoreContainer.position.x = windowWidth / 2 - scoreBack.width / 2, scoreContainer.position.y = windowHeight / 2 - scoreBack.height / 2, 
        this.endMenuContainer.addChild(scoreContainer);
        var playAgainContainer = new PIXI.DisplayObjectContainer(), playAgainButton = new PIXI.Graphics();
        playAgainButton.beginFill(16777215), playAgainButton.drawRoundedRect(0, 0, 100, 60, 5);
        var playAgainLabel = new PIXI.Text("PLAY", {
            align: "center",
            font: "30px Vagron",
            fill: APP.vecColorsS[APP.currentColorID],
            wordWrap: !0,
            wordWrapWidth: 500
        });
        playAgainLabel.position.x = 15, playAgainLabel.position.y = 10, playAgainLabel.resolution = retina, 
        playAgainContainer.addChild(playAgainButton), playAgainContainer.addChild(playAgainLabel), 
        this.endMenuContainer.addChild(playAgainContainer), playAgainContainer.position.x = windowWidth / 2 - playAgainButton.width / 2, 
        playAgainContainer.position.y = .9 * windowHeight - playAgainContainer.height, playAgainContainer.interactive = !0;
        var self = this;
        playAgainContainer.touchstart = playAgainContainer.mousedown = function(mouseData) {
            TweenLite.to(self.endMenuContainer, 1, {
                x: windowWidth,
                y: -50,
                ease: "easeOutCubic",
                onComplete: function() {
                    self.reset();
                }
            }), self.interactiveBackground.accel = 5, TweenLite.to(self.interactiveBackground, 2, {
                accel: 0
            });
        }, this.crazyLogo = new CrazyLogo(this), this.crazyLogo.build(), this.endMenuContainer.addChild(this.crazyLogo.getContent()), 
        this.crazyLogo.getContent().position.x = windowWidth / 2 - this.crazyLogo.getContent().width / 2 + 12, 
        this.crazyLogo.getContent().position.y = .2 * windowHeight, TweenLite.from(this.crazyLogo.getContent(), 4.5, {
            x: 1.1 * windowWidth,
            y: this.crazyLogo.getContent().position.y - 50,
            ease: "easeOutElastic"
        }), TweenLite.from(this.endMenuContainer, 5, {
            x: 1.1 * windowWidth,
            y: this.endMenuContainer.position.y - 50,
            ease: "easeOutElastic"
        }), TweenLite.to(this.interactiveBackground, 2, {
            accel: 0
        });
    },
    addRegularLabel: function(label, font, initY) {
        var rot = .004 * Math.random(), tempLabel = new PIXI.Text(label, {
            font: font,
            fill: "#9d47e0"
        }), perfect = new Particles({
            x: 0,
            y: 0
        }, 120, tempLabel, rot);
        perfect.maxScale = this.player.getContent().scale.x, perfect.build(), perfect.gravity = -.2, 
        perfect.alphadecress = .01, perfect.scaledecress = .05, perfect.setPosition(this.player.getPosition().x - tempLabel.width / 2, initY ? initY : this.player.getPosition().y + 50), 
        this.layer.addChild(perfect);
        var perfect2 = new Particles({
            x: 0,
            y: 0
        }, 120, new PIXI.Text(label, {
            font: font,
            fill: "#13c2b6"
        }), -rot);
        perfect2.maxScale = this.player.getContent().scale.x, perfect2.build(), perfect2.gravity = -.2, 
        perfect2.alphadecress = .01, perfect2.scaledecress = .05, perfect2.setPosition(this.player.getPosition().x - tempLabel.width / 2 + 2, initY ? initY : this.player.getPosition().y + 50 + 2), 
        this.layer.addChild(perfect2);
    },
    getPerfect: function() {
        this.addRegularLabel(APP.vecPerfects[Math.floor(APP.vecPerfects.length * Math.random())], "50px Vagron"), 
        this.earthquake(40), this.levelCounter += .05 * this.levelCounterMax, this.levelCounter > this.levelCounterMax && (this.levelCounter = this.levelCounterMax);
    },
    getCoin: function(isPerfect) {
        this.levelCounter += .015 * this.levelCounterMax, this.levelCounter > this.levelCounterMax && (this.levelCounter = this.levelCounterMax), 
        this.targetJump.randomPos(.05 * windowHeight, .4 * windowHeight), this.updateCoins(), 
        this.targetJump.explode(), isPerfect || this.addRegularLabel(APP.vecGood[Math.floor(APP.vecGood.length * Math.random())], "30px Vagron"), 
        this.earthquake(20), this.changeColor();
    },
    changeColor: function(force, first) {
        var tempColor = 0, self = this;
        first || (console.log("randomHEre"), APP.currentColorID = Math.floor(APP.vecColors.length * Math.random()));
        var temptempColor = APP.vecColors[APP.currentColorID];
        console.log(temptempColor), force ? (self.background.clear(), self.background.beginFill(temptempColor), 
        self.background.drawRect(-80, -80, windowWidth + 160, windowHeight + 160)) : TweenLite.to(APP, .3, {
            backColor: temptempColor,
            onUpdate: function() {
                self.background.clear(), self.background.beginFill(APP.backColor), self.background.drawRect(-80, -80, windowWidth + 160, windowHeight + 160);
            }
        }), this.player && (tempColor = addBright(temptempColor, .65), this.player.setColor(tempColor), 
        this.loaderBar.setBackColor(tempColor));
    },
    earthquake: function(force) {
        var earth = new TimelineLite();
        earth.append(TweenLite.to(this.container, .2, {
            y: -Math.random() * force,
            x: Math.random() * force - force / 2
        })), earth.append(TweenLite.to(this.container, .2, {
            y: -Math.random() * force,
            x: Math.random() * force - force / 2
        })), earth.append(TweenLite.to(this.container, .2, {
            y: 0,
            x: 0
        }));
    },
    updateCoins: function() {
        if (this.coinsLabel.setText(APP.points), TweenLite.to(this.coinsLabel, .2, {
            alpha: .5
        }), this.coinsLabel.position.x = windowWidth / 2 - this.coinsLabel.width / 2 / this.coinsLabel.resolution, 
        this.coinsLabel.position.y = windowHeight / 2 - this.coinsLabel.height / 2 / this.coinsLabel.resolution, 
        this.background.parent && this.background.parent.setChildIndex(this.background, 0), 
        this.coinsLabel.parent.setChildIndex(this.coinsLabel, 1), !(this.coinsLabel.alpha < .5)) {
            var tempCoins = new PIXI.Text(APP.points, {
                align: "center",
                font: "72px Vagron",
                fill: "#FFFFFF",
                wordWrap: !0,
                wordWrapWidth: 500
            });
            tempCoins.anchor = {
                x: .5,
                y: .5
            }, tempCoins.resolution = retina;
            var particle = new Particles({
                x: 0,
                y: 0
            }, 120, tempCoins, 0);
            particle.maxScale = 5, particle.maxInitScale = 1, particle.build(), particle.alphadecress = .02, 
            particle.scaledecress = .02, particle.setPosition(this.coinsLabel.position.x + tempCoins.width / 2 / tempCoins.resolution, this.coinsLabel.position.y + tempCoins.height / 2 / tempCoins.resolution), 
            this.layer.addChild(particle);
        }
    },
    initLevel: function(whereInit) {
        APP.points = 0, this.player = new Ball({
            x: 0,
            y: 0
        }, this), this.player.build(), this.layer.addChild(this.player), this.player.getContent().position.x = windowWidth / 2, 
        this.player.getContent().position.y = windowHeight / 1.2;
        var base = windowHeight / 1.2;
        this.player.setFloor(base), this.brilhoBase.getContent().position.y = base + this.player.spriteBall.height / 2, 
        this.targetJump = new Coin({
            x: 0,
            y: 0
        }), this.targetJump.build(), this.layer.addChild(this.targetJump), this.targetJump.getContent().position.x = windowWidth / 2, 
        this.targetJump.getContent().position.y = .2 * windowHeight, this.updateCoins();
        var self = this;
        this.addChild(self.hitTouch), TweenLite.from(this.layer.getContent().position, 3.5, {
            y: 50,
            x: -windowWidth / 2,
            ease: "easeOutElastic",
            onComplete: function() {
                self.addCrazyMessage("HOLD AND RELEASE");
            }
        }), TweenLite.from(this.coinsLabel.position, 4, {
            y: this.coinsLabel.position.y + 50,
            x: this.coinsLabel.position.x - windowWidth / 2,
            ease: "easeOutElastic",
            onComplete: function() {}
        }), this.holdInterval = setInterval(function() {
            self.addRegularLabel("HOLD!", "50px Vagron", windowHeight / 2);
        }, 1e3), this.force = 0, this.levelCounter = 800, this.levelCounterMax = 800, this.changeColor(!0, !0), 
        this.endGame = !1, this.crazyLogo && (this.crazyLogo.updateable = !1);
    },
    transitionIn: function() {
        this.build();
    },
    transitionOut: function(nextScreen, container) {
        console.log("out");
        var self = this;
        this.frontShape ? (this.frontShape.parent.setChildIndex(this.frontShape, this.frontShape.parent.children.length - 1), 
        TweenLite.to(this.frontShape, .3, {
            alpha: 1,
            onComplete: function() {
                self.destroy(), container.removeChild(self.getContent()), nextScreen.transitionIn();
            }
        })) : (self.destroy(), container.removeChild(self.getContent()), nextScreen.transitionIn());
    }
}), InitScreen = AbstractScreen.extend({
    init: function(label) {
        this._super(label), this.isLoaded = !1, APP.seed = new Float(65535 * Math.random()), 
        APP.seed.applySeed();
    },
    destroy: function() {
        this._super();
    },
    build: function() {
        this._super();
        var assetsToLoader = [ "dist/img/atlas2.json" ];
        this.loader = new PIXI.AssetLoader(assetsToLoader), assetsToLoader.length > 0 ? this.initLoad() : this.onAssetsLoaded(), 
        this.updateable = !0;
    },
    onProgress: function() {
        this._super();
    },
    onAssetsLoaded: function() {
        this.initApplication();
    },
    initApplication: function() {
        var self = this;
        this.bg = new SimpleSprite(APP.appModel.currentTowelModel.imgSrc), this.container.addChild(this.bg.getContent()), 
        scaleConverter(this.bg.getContent().width, windowWidth, 1.2, this.bg), this.bg.getContent().position.x = windowWidth / 2 - this.bg.getContent().width / 2, 
        this.bg.getContent().position.y = windowHeight / 2 - this.bg.getContent().height / 2, 
        this.brilhoBase = new SimpleSprite("brilho_base.png"), this.container.addChild(this.brilhoBase.getContent()), 
        scaleConverter(this.brilhoBase.getContent().width, windowWidth, 1, this.brilhoBase), 
        this.brilhoBase.getContent().position.x = windowWidth / 2 - this.brilhoBase.getContent().width / 2, 
        this.brilhoBase.getContent().position.y = windowHeight / 2 - this.brilhoBase.getContent().height, 
        this.brilhoBase.getContent().alpha = 0, this.brilhoMeio = new SimpleSprite("brilho.png"), 
        this.container.addChild(this.brilhoMeio.getContent()), scaleConverter(this.brilhoMeio.getContent().width, windowWidth, 1, this.brilhoMeio), 
        this.brilhoMeio.getContent().position.x = windowWidth / 2, this.brilhoMeio.getContent().position.y = windowHeight / 2, 
        this.brilhoMeio.getContent().alpha = 0, this.brilhoMeio.getContent().anchor.x = .5, 
        this.brilhoMeio.getContent().anchor.y = .5, this.rotuloContainer = new PIXI.DisplayObjectContainer(), 
        this.container.addChild(this.rotuloContainer), this.rotuloImg = new SimpleSprite("TITLE_rotulo.png"), 
        this.rotuloContainer.addChild(this.rotuloImg.getContent()), this.logoGame = new SimpleSprite("TITLE.png"), 
        this.rotuloContainer.addChild(this.logoGame.getContent()), this.logoGame.getContent().position.x = 10, 
        this.logoGame.getContent().position.y = 80, this.rotuloContainer.position.x = windowWidth / 2 - this.rotuloContainer.width / 2, 
        this.rotuloContainer.position.y = windowHeight / 2 - this.rotuloContainer.height / 2, 
        this.playButton = new DefaultButton("botao_play.png", "botao_play.png"), this.playButton.build(), 
        this.rotuloContainer.addChild(this.playButton.getContent()), this.playButton.clickCallback = function() {
            testMobile() && possibleFullscreen() && fullscreen(), self.startGame();
        }, this.shopButton = new DefaultButton("botao_config.png", "botao_config.png"), 
        this.shopButton.build(), this.rotuloContainer.addChild(this.shopButton.getContent()), 
        this.shopButton.clickCallback = function() {
            testMobile() && possibleFullscreen() && fullscreen(), self.screenManager.change("Choice");
        }, this.rankingButton = new DefaultButton("botao_rankin.png", "botao_rankin.png"), 
        this.rankingButton.build(), this.rotuloContainer.addChild(this.rankingButton.getContent()), 
        this.rankingButton.clickCallback = function() {
            testMobile() && possibleFullscreen() && fullscreen(), self.screenManager.change("Choice");
        }, this.playButton.setPosition(this.rotuloContainer.width / 2 - this.playButton.getContent().width / 2, 420), 
        this.shopButton.setPosition(this.rotuloContainer.width / 2 + this.shopButton.getContent().width / 2 + 50, this.playButton.getContent().position.y + this.playButton.getContent().height + 10), 
        this.rankingButton.setPosition(this.rotuloContainer.width / 2 - 1.5 * this.rankingButton.getContent().width - 50, this.playButton.getContent().position.y + this.playButton.getContent().height + 10), 
        this.tuboContent = new SimpleSprite("conteudo.png"), this.addChild(this.tuboContent.getContent()), 
        this.tuboContent.getContent().anchor.x = .5, this.tuboContent.getContent().anchor.y = 1, 
        this.tuboContent.getContent().position.x = windowWidth / 2, this.tuboContent.getContent().position.y = windowHeight + this.tuboContent.getContent().height, 
        this.tubo = new SimpleSprite("tubo.png"), this.addChild(this.tubo.getContent()), 
        this.tubo.getContent().anchor.x = .5, this.tubo.getContent().anchor.y = 1, this.tubo.getContent().position.x = windowWidth / 2, 
        this.tubo.getContent().position.y = windowHeight + this.tubo.getContent().height, 
        this.tuboContent.getContent().tint = APP.appModel.currentPlayerModel.color, this.fromTween(), 
        this.layerManager = new LayerManager(), this.layerManager.build("Main"), this.addChild(this.layerManager), 
        this.layer = new Layer(), this.layer.build("EntityLayer"), this.layerManager.addLayer(this.layer), 
        this.hitTouch = new PIXI.Graphics(), this.hitTouch.interactive = !0, this.hitTouch.beginFill(0), 
        this.hitTouch.drawRect(0, 0, windowWidth, windowHeight), this.hitTouch.alpha = 0, 
        this.hitTouch.hitArea = new PIXI.Rectangle(0, 0, windowWidth, windowHeight), this.hitTouch.mouseup = function(mouseData) {
            self.moveBall();
        }, this.hitTouch.touchstart = function(touchData) {
            self.moveBall();
        }, this.behaviours = [], this.behaviours.push(new StoppedBehaviour({})), this.behaviours.push(new RadiusPingPongBehaviour({})), 
        this.behaviours.push(new RadiusBehaviour({})), this.behaviours.push(new SiderBehaviour({})), 
        this.behaviours.push(new DiagBehaviour({})), this.tapToPlay = new PIXI.Text("TAP TO PLAY", {
            align: "center",
            font: "30px Vagron",
            fill: "#FFF",
            wordWrap: !0,
            wordWrapWidth: 500
        }), scaleConverter(this.tapToPlay.height, windowHeight, .06, this.tapToPlay), this.addChild(this.tapToPlay), 
        this.tapToPlay.alpha = 0, this.tapToPlay.position.y = windowHeight / 2, this.tapToPlay.position.x = windowWidth / 2 - this.tapToPlay.width / 2, 
        this.pointsLabel = new PIXI.Text("0", {
            align: "center",
            font: "30px Vagron",
            fill: "#FFF",
            wordWrap: !0,
            wordWrapWidth: 500
        }), scaleConverter(this.pointsLabel.height, windowHeight, .06, this.pointsLabel), 
        this.addChild(this.pointsLabel), this.pointsLabel.position.y = -500, this.coinsLabel = new PIXI.Text("0", {
            align: "center",
            font: "30px Vagron",
            fill: "#f5c30c",
            wordWrap: !0,
            wordWrapWidth: 500
        }), scaleConverter(this.coinsLabel.height, windowHeight, .06, this.coinsLabel), 
        this.addChild(this.coinsLabel), this.coinsLabel.position.y = -500, this.endModal = new EndModal(this), 
        APP.goDirect && this.startGame(), APP.goDirect = !1;
    },
    updateLabel: function() {
        this.pointsLabel.setText(APP.currentPoints), this.pointsLabel.position.x = windowWidth - this.pointsLabel.width - .1 * windowWidth, 
        this.pointsLabel.position.y = .1 * windowWidth;
    },
    getCoin: function() {
        APP.totalCoins++, this.updateCoins();
    },
    updateCoins: function() {
        this.coinsLabel.setText(APP.totalCoins), this.coinsLabel.position.x = .1 * windowWidth, 
        this.coinsLabel.position.y = .1 * windowWidth;
    },
    getBall: function() {
        this.nextHorde(), APP.currentPoints++, this.updateLabel();
    },
    moveBall: function() {
        this.tubo.getContent().scale.y = .5, this.tubo.getContent().scale.x = 1.2, TweenLite.to(this.tubo.getContent().scale, .3, {
            y: 1,
            x: 1,
            ease: "easeOutBack"
        }), this.tuboContent.getContent().scale.y = .5, this.tuboContent.getContent().scale.x = 1.2, 
        TweenLite.to(this.tuboContent.getContent().scale, .3, {
            y: 1,
            x: 1,
            ease: "easeOutBack"
        }), TweenLite.to(this.tapToPlay, .5, {
            alpha: 0
        }), this.ball.velocity.y = -20;
    },
    nextHorde: function() {
        var self = this, posDest = windowHeight - this.ball.getContent().height - .1 * windowHeight;
        TweenLite.to(this.brilhoMeio.getContent(), .2, {
            alpha: 0
        });
        for (var i = this.layer.childs.length - 1; i >= 0; i--) "bullet" !== this.layer.childs[i].type && "particle" !== this.layer.childs[i].type && this.layer.childs[i].preKill();
        this.currentHorde++, APP.accelGame < 3 && (APP.accelGame += this.currentHorde / 500), 
        TweenLite.to(this.ball.getContent().position, .3, {
            y: posDest,
            ease: "easeOutBack",
            onComplete: function() {
                var tempId = 0;
                self.currentHorde > 1 && (tempId = Math.floor(APP.seed.getNextFloat() * self.behaviours.length));
                var behaviour = self.behaviours[tempId].clone(), tempEnemy = new EnemyBall({
                    x: 0,
                    y: 0
                }, behaviour);
                if (tempEnemy.build(), tempEnemy.getContent().position.x = behaviour.position.x, 
                tempEnemy.getContent().position.y = behaviour.position.y, scaleConverter(tempEnemy.getContent().height, windowHeight, .2, tempEnemy.getContent()), 
                TweenLite.to(self.brilhoMeio.getContent(), .3, {
                    alpha: .3
                }), self.layer.addChild(tempEnemy), self.currentEnemy = tempEnemy, !(self.currentHorde < 2) && behaviour.killerBehaviour) {
                    var tempEnemyKiller = null, hasEnemy = !1;
                    APP.seed.getNextFloat() < .5 ? (hasEnemy = !0, tempEnemyKiller = new KillerBall({
                        x: 0,
                        y: 0
                    }, behaviour.killerBehaviour)) : tempEnemyKiller = new Coin({
                        x: 0,
                        y: 0
                    }, behaviour.killerBehaviour), tempEnemyKiller.build(), tempEnemyKiller.getContent().position.x = behaviour.killerBehaviour.position.x, 
                    tempEnemyKiller.getContent().position.y = behaviour.killerBehaviour.position.y, 
                    scaleConverter(tempEnemyKiller.getContent().height, windowHeight, hasEnemy ? .1 : .2, tempEnemyKiller.getContent()), 
                    self.layer.addChild(tempEnemyKiller);
                }
            }
        });
    },
    startGame: function() {
        this.toTween(), TweenLite.to(this.tapToPlay, .5, {
            alpha: 1
        }), APP.currentPoints = 0, this.currentHorde = 0, APP.accelGame = 1, TweenLite.to(this.tubo.getContent().position, .5, {
            y: windowHeight
        }), TweenLite.to(this.tuboContent.getContent().position, .5, {
            y: windowHeight
        }), APP.seed.applySeed(), this.updateLabel(), this.updateCoins(), this.ball = new Ball({
            x: 0,
            y: 0
        }, this), this.ball.build(), scaleConverter(this.ball.spriteBall.width, windowWidth, .15, this.ball.spriteBall), 
        scaleConverter(this.ball.shadow.width, windowWidth, .15, this.ball.shadow), this.ball.getContent().position.x = windowWidth / 2, 
        this.ball.getContent().position.y = windowHeight - this.ball.getContent().height - .1 * windowHeight, 
        this.layer.addChild(this.ball), this.ball.spriteBall.tint = APP.appModel.currentPlayerModel.color, 
        this.tuboContent.getContent().tint = APP.appModel.currentPlayerModel.color, this.nextHorde(), 
        this.addChild(this.hitTouch);
    },
    gameOver: function() {
        this.removeChild(this.hitTouch), this.pointsLabel.position.y = -500, this.coinsLabel.position.y = -500, 
        TweenLite.to(this.tubo.getContent().position, .5, {
            y: windowHeight + this.tubo.getContent().height
        }), TweenLite.to(this.tuboContent.getContent().position, .5, {
            y: windowHeight + this.tuboContent.getContent().height
        });
        for (var i = this.layer.childs.length - 1; i >= 0; i--) this.layer.childs[i].preKill();
        APP.plays++, APP.appModel.saveScore(), this.endModal.show();
    },
    update: function() {
        this.updateable && (this.currentEnemy && this.ball ? (this.brilhoMeio.getContent().position.x = this.currentEnemy.getContent().position.x, 
        this.brilhoMeio.getContent().position.y = this.currentEnemy.getContent().position.y) : this.ball && this.ball.hideShadows(), 
        this._super());
    },
    toTween: function(callback) {
        this.audioOn && TweenLite.to(this.audioOn.getContent(), .5, {
            delay: .1,
            y: -this.audioOn.getContent().height,
            ease: "easeOutBack"
        }), this.audioOff && TweenLite.to(this.audioOff.getContent(), .5, {
            delay: .1,
            y: -this.audioOn.getContent().height,
            ease: "easeOutBack"
        });
        var self = this;
        TweenLite.to(this.rotuloContainer, .2, {
            y: -this.rotuloContainer.height,
            onComplete: function() {
                self.rotuloContainer.parent && self.rotuloContainer.parent.removeChild(self.rotuloContainer);
            }
        });
    },
    fromTween: function(callback) {
        this.audioOn && TweenLite.from(this.audioOn.getContent(), .5, {
            delay: .1,
            y: -this.audioOn.getContent().height,
            ease: "easeOutBack"
        }), this.audioOff && TweenLite.from(this.audioOff.getContent(), .5, {
            delay: .1,
            y: -this.audioOn.getContent().height,
            ease: "easeOutBack"
        }), TweenLite.from(this.rankingButton.getContent(), .2, {
            y: windowHeight,
            ease: "easeOutBack"
        }), TweenLite.from(this.shopButton.getContent(), .2, {
            y: windowHeight,
            ease: "easeOutBack"
        }), TweenLite.from(this.playButton.getContent(), .2, {
            y: windowHeight,
            ease: "easeOutBack",
            onComplete: function() {
                callback && callback();
            }
        });
    },
    setAudioButtons: function() {
        var self = this;
        APP.mute = !0, Howler.mute(), this.audioOn = new DefaultButton("volumeButton_on.png", "volumeButton_on_over.png"), 
        this.audioOn.build(), scaleConverter(this.audioOn.width, windowWidth, .15, this.audioOn), 
        this.audioOn.setPosition(windowWidth - this.audioOn.getContent().width - 20, 20), 
        this.audioOff = new DefaultButton("volumeButton_off.png", "volumeButton_off_over.png"), 
        this.audioOff.build(), scaleConverter(this.audioOff.width, windowWidth, .15, this.audioOff), 
        this.audioOff.setPosition(windowWidth - this.audioOn.getContent().width - 20, 20), 
        this.addChild(APP.mute ? this.audioOff : this.audioOn), this.audioOn.clickCallback = function() {
            APP.mute = !0, Howler.mute(), self.audioOn.getContent().parent && self.audioOn.getContent().parent.removeChild(self.audioOn.getContent()), 
            self.audioOff.getContent() && self.addChild(self.audioOff);
        }, this.audioOff.clickCallback = function() {
            APP.mute = !1, Howler.unmute(), self.audioOff.getContent().parent && self.audioOff.getContent().parent.removeChild(self.audioOff.getContent()), 
            self.audioOn.getContent() && self.addChild(self.audioOn);
        };
    }
}), LoadScreen = AbstractScreen.extend({
    init: function(label) {
        this._super(label), this.isLoaded = !1;
    },
    destroy: function() {
        this._super();
    },
    build: function() {
        this._super();
        var assetsToLoader = [ "dist/img/atlas1.json" ];
        assetsToLoader.length > 0 && !this.isLoaded ? (this.loader = new PIXI.AssetLoader(assetsToLoader), 
        this.initLoad()) : this.onAssetsLoaded();
    },
    initLoad: function() {
        var barHeight = 20;
        this.loaderContainer = new PIXI.DisplayObjectContainer(), this.addChild(this.loaderContainer), 
        this.loaderBar = new LifeBarHUD(.6 * windowWidth, barHeight, 0, 16777215, addBright(APP.vecColors[APP.currentColorID], .65)), 
        this.loaderContainer.addChild(this.loaderBar.getContent()), this.loaderBar.getContent().position.x = windowWidth / 2 - this.loaderBar.getContent().width / 2, 
        this.loaderBar.getContent().position.y = windowHeight - this.loaderBar.getContent().height - .1 * windowHeight, 
        this.loaderBar.updateBar(0, 100), this._super();
        var text = new PIXI.Text("PLAY", {
            font: "50px Vagron",
            fill: "#FFFFFF"
        });
        this.addChild(text), text.alpha = 0;
    },
    onProgress: function() {
        this._super(), this.loaderBar.updateBar(Math.floor(100 * this.loadPercent), 100);
    },
    onAssetsLoaded: function() {
        this.ready = !0;
        var self = this;
        TweenLite.to(this.loaderBar.getContent(), .5, {
            delay: .2,
            alpha: 0,
            onComplete: function() {
                self.initApplication();
            }
        });
    },
    initApplication: function() {
        this.isLoaded = !0;
        this.screenManager.change("Game");
    },
    transitionIn: function() {
        return this.isLoaded ? void this.build() : void this.build();
    },
    transitionOut: function(nextScreen, container) {
        var self = this;
        this.frontShape ? (this.frontShape.parent.setChildIndex(this.frontShape, this.frontShape.parent.children.length - 1), 
        TweenLite.to(this.frontShape, .3, {
            alpha: 1,
            onComplete: function() {
                self.destroy(), container.removeChild(self.getContent()), nextScreen.transitionIn();
            }
        })) : (self.destroy(), container.removeChild(self.getContent()), nextScreen.transitionIn());
    }
}), CreditsModal = Class.extend({
    init: function(screen) {
        this.screen = screen, this.container = new PIXI.DisplayObjectContainer();
        var self = this;
        this.container.buttonMode = !0, this.container.interactive = !0, this.container.mousedown = this.container.touchstart = function(data) {
            self.hide();
        };
        var credits = new SimpleSprite("dist/img/UI/creditos.jpg");
        this.container.addChild(credits.getContent()), scaleConverter(credits.getContent().height, windowHeight, 1, credits), 
        credits.getContent().position.x = windowWidth / 2 - credits.getContent().width / 2, 
        credits.getContent().position.y = windowHeight / 2 - credits.getContent().height / 2;
    },
    show: function(points) {
        this.screen.addChild(this), this.container.parent.setChildIndex(this.container, this.container.parent.children.length - 1);
        var self = this;
        this.screen.updateable = !1, this.container.alpha = 0, TweenLite.to(this.container, .5, {
            alpha: 1,
            onComplete: function() {
                self.container.buttonMode = !0, self.container.interactive = !0;
            }
        }), this.container.buttonMode = !1, this.container.interactive = !1;
    },
    hide: function(callback) {
        var self = this;
        this.container.buttonMode = !1, this.container.interactive = !1, TweenLite.to(this.container, .5, {
            alpha: 0,
            onComplete: function() {
                callback && (callback(), self.container.parent && self.container.parent.removeChild(self.container));
            }
        });
    },
    getContent: function() {
        return this.container;
    }
}), EndModal = Class.extend({
    init: function(screen) {
        this.screen = screen, this.container = new PIXI.DisplayObjectContainer(), this.boxContainer = new PIXI.DisplayObjectContainer(), 
        this.bg = new PIXI.Graphics(), this.bg.beginFill(14370108), this.bg.drawRect(0, 0, windowWidth, windowHeight), 
        this.bg.alpha = .8, this.container.addChild(this.boxContainer);
        var self = this;
        this.backBox = new PIXI.Graphics(), this.backBox.beginFill(14370108), this.backBox.drawRect(0, 0, windowWidth, windowHeight), 
        this.boxContainer.addChild(this.backBox), this.backBox.alpha = 0, this.gameOver = new PIXI.Text("GAME OVER", {
            font: "50px Vagron",
            fill: "#FFF"
        }), scaleConverter(this.gameOver.width, this.boxContainer.width, 1, this.gameOver), 
        this.gameOver.position.y = 0, this.boxContainer.addChild(this.gameOver), this.newHigh = new PIXI.Text("NEW HIGHSCORE", {
            font: "20px Vagron",
            fill: "#FFF"
        }), this.newHigh.position.y = this.gameOver.position.y + this.gameOver.height, this.newHigh.position.x = this.boxContainer.width / 2 - this.newHigh.width / 2, 
        this.boxContainer.addChild(this.newHigh), this.playedLabel = new PIXI.Text("GAMES PLAYED", {
            font: "20px Vagron",
            fill: "#FFF"
        }), this.playedLabel.position.y = this.newHigh.position.y + this.newHigh.height, 
        this.playedLabel.position.x = this.boxContainer.width / 2 - this.playedLabel.width / 2, 
        this.boxContainer.addChild(this.playedLabel), this.playedLabelValue = new PIXI.Text("0", {
            font: "30px Vagron",
            fill: "#FFF"
        }), this.playedLabelValue.position.y = this.playedLabel.position.y + this.playedLabel.height, 
        this.playedLabelValue.position.x = this.boxContainer.width / 2 - this.playedLabelValue.width / 2, 
        this.boxContainer.addChild(this.playedLabelValue), this.score = new PIXI.Text("SCORE", {
            font: "20px Vagron",
            fill: "#FFF"
        }), this.score.position.y = this.playedLabelValue.position.y + this.playedLabelValue.height, 
        this.score.position.x = this.boxContainer.width / 2 - this.score.width / 2, this.boxContainer.addChild(this.score), 
        this.scoreValue = new PIXI.Text("0", {
            font: "30px Vagron",
            fill: "#FFF"
        }), this.scoreValue.position.y = this.score.position.y + this.score.height, this.scoreValue.position.x = this.boxContainer.width / 2 - this.scoreValue.width / 2, 
        this.boxContainer.addChild(this.scoreValue), this.bestScore = new PIXI.Text("BEST SCORE", {
            font: "20px Vagron",
            fill: "#FFF"
        }), this.bestScore.position.y = this.scoreValue.position.y + this.scoreValue.height, 
        this.bestScore.position.x = this.boxContainer.width / 2 - this.bestScore.width / 2, 
        this.boxContainer.addChild(this.bestScore), this.bestScoreValue = new PIXI.Text("0", {
            font: "30px Vagron",
            fill: "#FFF"
        }), this.bestScoreValue.position.y = this.bestScore.position.y + this.bestScore.height, 
        this.bestScoreValue.position.x = this.boxContainer.width / 2 - this.bestScoreValue.width / 2, 
        this.boxContainer.addChild(this.bestScoreValue), this.replayButton = new DefaultButton("UI_button_default_1.png", "UI_button_default_1.png"), 
        this.replayButton.build(), this.replayButton.addLabel(new PIXI.Text("REPLAY", {
            font: "30px Vagron",
            fill: "#db453c"
        }), 25, 2), scaleConverter(this.replayButton.getContent().width, this.boxContainer.width, .5, this.replayButton), 
        this.replayButton.setPosition(this.boxContainer.width / 2 - this.replayButton.getContent().width / 2, this.bestScoreValue.position.y + this.bestScoreValue.height), 
        this.replayButton.clickCallback = function() {
            self.hide(function() {
                self.screen.updateable = !0, self.screen.startGame();
            });
        }, this.boxContainer.addChild(this.replayButton.getContent()), this.newSeed = new DefaultButton("UI_button_default_1.png", "UI_button_default_1.png"), 
        this.newSeed.build(), this.newSeed.addLabel(new PIXI.Text("NEW", {
            font: "30px Vagron",
            fill: "#db453c"
        }), 45, 2), scaleConverter(this.newSeed.getContent().width, this.boxContainer.width, .5, this.newSeed), 
        this.newSeed.setPosition(this.boxContainer.width / 2 - this.newSeed.getContent().width / 2, this.replayButton.getContent().position.y + this.replayButton.getContent().height + 20), 
        this.newSeed.clickCallback = function() {
            self.hide(function() {
                self.screen.updateable = !0, APP.seed.seed = 65535 * Math.random(), self.screen.startGame();
            });
        }, this.boxContainer.addChild(this.newSeed.getContent()), this.shopButton = new DefaultButton("UI_button_default_1.png", "UI_button_default_1.png"), 
        this.shopButton.build(), this.shopButton.addLabel(new PIXI.Text("SHOP", {
            font: "30px Vagron",
            fill: "#db453c"
        }), 45, 2), scaleConverter(this.shopButton.getContent().width, this.boxContainer.width, .5, this.shopButton), 
        this.shopButton.setPosition(this.boxContainer.width / 2 - this.shopButton.getContent().width / 2, this.newSeed.getContent().position.y + this.newSeed.getContent().height + 20), 
        this.shopButton.clickCallback = function() {
            self.screen.screenManager.change("Choice");
        }, this.boxContainer.addChild(this.shopButton.getContent()), this.shareButton = new DefaultButton("UI_button_default_1.png", "UI_button_default_1.png"), 
        this.shareButton.build(), this.shareButton.addLabel(new PIXI.Text("SHARE", {
            font: "30px Vagron",
            fill: "#db453c"
        }), 30, 2), scaleConverter(this.shareButton.getContent().width, this.boxContainer.width, .5, this.shareButton), 
        this.shareButton.setPosition(this.boxContainer.width / 2 - this.shareButton.getContent().width / 2, this.shopButton.getContent().position.y + this.shopButton.getContent().height + 20), 
        this.shareButton.clickCallback = function() {}, this.boxContainer.addChild(this.shareButton.getContent()), 
        this.rateButton = new DefaultButton("UI_button_default_1.png", "UI_button_default_1.png"), 
        this.rateButton.build(), this.rateButton.addLabel(new PIXI.Text("RATE", {
            font: "30px Vagron",
            fill: "#db453c"
        }), 45, 2), scaleConverter(this.rateButton.getContent().width, this.boxContainer.width, .5, this.rateButton), 
        this.rateButton.setPosition(this.boxContainer.width / 2 - this.rateButton.getContent().width / 2, this.shareButton.getContent().position.y + this.shareButton.getContent().height + 20), 
        this.rateButton.clickCallback = function() {}, this.boxContainer.addChild(this.rateButton.getContent()), 
        this.backBox.height = this.boxContainer.height, scaleConverter(this.boxContainer.height, windowHeight, .9, this.boxContainer);
    },
    show: function() {
        this.screen.addChild(this), this.screen.blockPause = !0, this.boxContainer.visible = !0, 
        this.container.parent.setChildIndex(this.container, this.container.parent.children.length - 1), 
        APP.highScore < APP.currentPoints ? (APP.highScore = APP.currentPoints, this.newHigh.alpha = 1) : this.newHigh.alpha = 0, 
        this.scoreValue.setText(APP.currentPoints), this.bestScoreValue.setText(APP.highScore), 
        this.playedLabelValue.setText(APP.plays), this.scoreValue.position.x = windowWidth / 2 - this.scoreValue.width / 2, 
        this.bestScoreValue.position.x = windowWidth / 2 - this.bestScoreValue.width / 2, 
        this.playedLabelValue.position.x = windowWidth / 2 - this.playedLabelValue.width / 2, 
        this.boxContainer.position.x = windowWidth / 2 - this.boxContainer.width / 2, this.boxContainer.position.y = windowHeight / 2 - this.boxContainer.height / 2, 
        this.bg.alpha = .8, this.boxContainer.alpha = 1, TweenLite.from(this.bg, .5, {
            alpha: 0
        }), TweenLite.from(this.boxContainer, .5, {
            y: -this.boxContainer.height
        }), console.log("show"), APP.appModel.saveScore();
    },
    hide: function(callback) {
        var self = this;
        this.screen.blockPause = !1, this.screen.updateable = !0, TweenLite.to(this.bg, .5, {
            delay: .1,
            alpha: 0,
            onComplete: function() {
                self.container.parent && self.container.parent.removeChild(self.container), callback && callback();
            }
        }), TweenLite.to(this.boxContainer.position, .5, {
            y: -this.boxContainer.height,
            ease: "easeInBack"
        }), TweenLite.to(this.boxContainer, .5, {
            alpha: 0
        }), TweenLite.to(this.bg, .5, {
            alpha: 0
        });
    },
    getContent: function() {
        return this.container;
    }
}), NewBirdModal = Class.extend({
    init: function(screen) {
        this.screen = screen, this.container = new PIXI.DisplayObjectContainer(), this.boxContainer = new PIXI.DisplayObjectContainer(), 
        this.bg = new PIXI.Graphics(), this.bg.beginFill(74275), this.bg.drawRect(0, 0, windowWidth, windowHeight), 
        this.bg.alpha = 0, this.container.addChild(this.bg), this.container.addChild(this.boxContainer);
        this.feito = new SimpleSprite("feitoo.png"), this.container.addChild(this.feito.getContent()), 
        scaleConverter(this.feito.getContent().width, windowWidth, .35, this.feito), this.feito.setPosition(windowWidth / 2 - this.feito.getContent().width / 2, -10), 
        this.boxContainer.alpha = 0, this.boxContainer.visible = !1, scaleConverter(this.boxContainer.height, windowHeight, .18, this.boxContainer), 
        this.boxContainer.position.x = windowWidth / 2 - this.boxContainer.width / 2, this.boxContainer.position.y = windowHeight;
    },
    show: function(bird) {
        if (bird || (bird = [ APP.getGameModel().birdModels[Math.floor(Math.random() * APP.getGameModel().birdModels.length)] ]), 
        bird && bird.length > 0) {
            var self = this;
            this.newCharContainer = new PIXI.DisplayObjectContainer();
            var pista = new SimpleSprite("pista.png"), holofote = new SimpleSprite("holofote.png"), novo = new SimpleSprite("nova_ave.png"), ovoquebrado = new SimpleSprite("ovoquebrado.png"), penas1 = new SimpleSprite("penasfundo1.png"), penas2 = new SimpleSprite("penasfundo2.png");
            this.playerImage = null, this.playerImage = new SimpleSprite(bird[0].cover);
            var degrade = new SimpleSprite("dist/img/UI/fundo_degrade.png");
            this.container.addChild(degrade.getContent()), degrade.getContent().width = windowWidth / 1.5;
            var sH = scaleConverter(degrade.getContent().height, windowHeight, 1);
            degrade.getContent().scale.y = sH, degrade.getContent().height = windowHeight, degrade.setPosition(windowWidth / 2 - degrade.getContent().width / 2, windowHeight / 2 - degrade.getContent().height / 2), 
            this.newCharContainer.addChild(pista.getContent()), pista.setPosition(0, holofote.getContent().height - 35), 
            this.newCharContainer.addChild(holofote.getContent()), this.newCharContainer.addChild(ovoquebrado.getContent()), 
            this.newCharContainer.addChild(penas1.getContent()), this.newCharContainer.addChild(penas2.getContent()), 
            this.container.addChild(this.playerImage.getContent()), this.newCharContainer.addChild(novo.getContent()), 
            holofote.setPosition(pista.getContent().width / 2 - holofote.getContent().width / 2, 0);
            var charLabel = new PIXI.Text(bird[0].label, {
                align: "center",
                fill: "#FFFFFF",
                stroke: "#033E43",
                strokeThickness: 5,
                font: "30px Luckiest Guy",
                wordWrap: !0,
                wordWrapWidth: 500
            });
            this.newCharContainer.addChild(charLabel), this.container.addChild(this.newCharContainer), 
            charLabel.position.x = pista.getContent().width / 2 - charLabel.width / 2, charLabel.position.y = pista.getContent().position.y + pista.getContent().height - charLabel.height - 20, 
            novo.setPosition(pista.getContent().width / 2 - novo.getContent().width / 2, charLabel.position.y - novo.getContent().height - 20), 
            scaleConverter(ovoquebrado.getContent().height, this.newCharContainer.height, .15, ovoquebrado), 
            scaleConverter(penas1.getContent().height, this.newCharContainer.height, .2, penas1), 
            scaleConverter(penas2.getContent().height, this.newCharContainer.height, .2, penas2), 
            penas1.setPosition(pista.getContent().width / 2 - 2 * penas1.getContent().width, holofote.getContent().height - penas1.getContent().height), 
            penas2.setPosition(pista.getContent().width / 2 + penas1.getContent().width, holofote.getContent().height - penas2.getContent().height), 
            ovoquebrado.setPosition(pista.getContent().width / 2 - ovoquebrado.getContent().width / 2, holofote.getContent().height - ovoquebrado.getContent().height), 
            scaleConverter(this.newCharContainer.height, windowHeight, 1, this.newCharContainer), 
            this.playerImage.setPosition(windowWidth / 2 - this.playerImage.getContent().width / 2, windowHeight / 2 - this.playerImage.getContent().height / 2 - 20), 
            this.newCharContainer.position.x = windowWidth / 2 - this.newCharContainer.width / 2, 
            this.feito.getContent().parent.setChildIndex(this.feito.getContent(), this.feito.getContent().parent.children.length - 1), 
            setTimeout(function() {
                self.container.buttonMode = !0, self.container.interactive = !0, self.container.mousedown = self.container.touchstart = function(data) {
                    self.hide(function() {
                        self.screen.updateable = !0;
                    });
                };
            }, 2e3);
        }
        this.screen.addChild(this), this.screen.updateable = !1, TweenLite.to(this.bg, .5, {
            alpha: .8
        }), this.container.parent.setChildIndex(this.container, this.container.parent.children.length - 1), 
        this.playerImage.getContent().parent.setChildIndex(this.playerImage.getContent(), this.playerImage.getContent().parent.children.length - 1);
    },
    hide: function(callback) {
        var self = this;
        TweenLite.to(this.bg, .5, {
            alpha: 0,
            onComplete: function() {
                callback && (callback(), self.container.parent && self.container.parent.removeChild(self.container));
            }
        }), TweenLite.to(this.boxContainer.position, 1, {
            y: -this.boxContainer.height,
            ease: "easeInBack"
        }), TweenLite.to(this.boxContainer, .5, {
            alpha: 0
        }), TweenLite.to(this.container, .5, {
            alpha: 0
        });
    },
    getContent: function() {
        return this.container;
    }
}), PauseModal = Class.extend({
    init: function(screen) {
        this.screen = screen, this.container = new PIXI.DisplayObjectContainer(), this.boxContainer = new PIXI.DisplayObjectContainer(), 
        this.bg = new PIXI.Graphics(), this.bg.beginFill(1383495), this.bg.drawRect(0, 0, windowWidth, windowHeight), 
        this.bg.alpha = .8, this.container.addChild(this.bg), this.container.addChild(this.boxContainer);
        var self = this;
        this.back = new SimpleSprite("UI_modal_back_1.png"), this.boxContainer.addChild(this.back.getContent());
        var thirdPart = this.back.getContent().width / 3;
        this.backButton = new DefaultButton("UI_button_play_1.png", "UI_button_play_1.png"), 
        this.backButton.build(), this.backButton.setPosition(1 * thirdPart - thirdPart / 2 - this.backButton.getContent().width / 2, this.back.getContent().height / 2 - this.backButton.getContent().height / 2), 
        this.backButton.clickCallback = function() {
            self.hide(function() {
                self.screen.screenManager.prevScreen();
            });
        }, this.back.getContent().addChild(this.backButton.getContent()), this.continueButton = new DefaultButton("UI_button_play_1_retina.png", "UI_button_play_1_over_retina.png"), 
        this.continueButton.build(), scaleConverter(this.continueButton.getContent().width, this.back.getContent().width, .3, this.continueButton), 
        this.continueButton.setPosition(2 * thirdPart - thirdPart / 2 - this.continueButton.getContent().width / 2, this.back.getContent().height / 2 - this.continueButton.getContent().height / 2), 
        this.continueButton.clickCallback = function() {
            self.hide(function() {
                self.screen.updateable = !0;
            });
        }, this.back.getContent().addChild(this.continueButton.getContent()), this.restartButton = new DefaultButton("UI_button_play_1.png", "UI_button_play_1.png"), 
        this.restartButton.build(), this.restartButton.setPosition(3 * thirdPart - thirdPart / 2 - this.restartButton.getContent().width / 2, this.back.getContent().height / 2 - this.restartButton.getContent().height / 2), 
        this.restartButton.clickCallback = function() {
            self.hide(function() {
                self.screen.updateable = !0, self.screen.reset();
            });
        }, this.back.getContent().addChild(this.restartButton.getContent()), scaleConverter(this.boxContainer.width, windowWidth, .8, this.boxContainer);
    },
    show: function() {
        this.screen.addChild(this), this.screen.blockPause = !0, this.boxContainer.visible = !0, 
        this.container.parent.setChildIndex(this.container, this.container.parent.children.length - 1), 
        this.screen.updateable = !1, this.boxContainer.position.x = windowWidth / 2 - this.boxContainer.width / 2, 
        this.boxContainer.position.y = windowHeight / 2 - this.boxContainer.height / 2, 
        this.bg.alpha = .8, this.boxContainer.alpha = 1, TweenLite.from(this.bg, .5, {
            alpha: 0
        }), TweenLite.from(this.boxContainer, .5, {
            y: -this.boxContainer.height
        });
    },
    hide: function(callback) {
        var self = this;
        this.screen.blockPause = !1, this.screen.updateable = !0, TweenLite.to(this.bg, .5, {
            delay: .1,
            alpha: 0,
            onComplete: function() {
                self.container.parent && self.container.parent.removeChild(self.container), callback && callback(), 
                self.kill = !0;
            }
        }), TweenLite.to(this.boxContainer.position, .5, {
            y: -this.boxContainer.height,
            ease: "easeInBack"
        }), TweenLite.to(this.boxContainer, .5, {
            alpha: 0
        });
    },
    getContent: function() {
        return this.container;
    }
}), RankinkgModal = Class.extend({
    init: function(screen) {
        this.screen = screen, this.container = new PIXI.DisplayObjectContainer();
        var self = this;
        this.container.buttonMode = !0, this.container.interactive = !0, this.container.mousedown = this.container.touchstart = function(data) {
            self.hide();
        };
        var credits = new SimpleSprite("dist/img/UI/creditos.jpg");
        this.container.addChild(credits.getContent()), scaleConverter(credits.getContent().height, windowHeight, 1, credits), 
        credits.getContent().position.x = windowWidth / 2 - credits.getContent().width / 2, 
        credits.getContent().position.y = windowHeight / 2 - credits.getContent().height / 2;
    },
    show: function(points) {
        this.screen.addChild(this), this.container.parent.setChildIndex(this.container, this.container.parent.children.length - 1);
        var self = this;
        this.screen.updateable = !1, this.container.alpha = 0, TweenLite.to(this.container, .5, {
            alpha: 1,
            onComplete: function() {
                self.container.buttonMode = !0, self.container.interactive = !0;
            }
        }), this.container.buttonMode = !1, this.container.interactive = !1;
    },
    hide: function(callback) {
        var self = this;
        this.container.buttonMode = !1, this.container.interactive = !1, TweenLite.to(this.container, .5, {
            alpha: 0,
            onComplete: function() {
                callback && (callback(), self.container.parent && self.container.parent.removeChild(self.container));
            }
        });
    },
    getContent: function() {
        return this.container;
    }
}), InputManager = Class.extend({
    init: function(parent) {
        var game = parent, self = this;
        this.vecPositions = [], document.body.addEventListener("mouseup", function(e) {
            game.player && (game.mouseDown = !1);
        }), document.body.addEventListener("mousedown", function(e) {
            game.player && APP.getMousePos().x < windowWidth && APP.getMousePos().y < windowHeight - 70 && (game.mouseDown = !0);
        }), document.body.addEventListener("keyup", function(e) {
            if (game.player) {
                if (87 === e.keyCode || 38 === e.keyCode && game.player.velocity.y < 0) self.removePosition("up"); else if (83 === e.keyCode || 40 === e.keyCode && game.player.velocity.y > 0) self.removePosition("down"); else if (65 === e.keyCode || 37 === e.keyCode && game.player.velocity.x < 0) self.removePosition("left"); else if (68 === e.keyCode || 39 === e.keyCode && game.player.velocity.x > 0) self.removePosition("right"); else if (32 === e.keyCode) game.player.hurt(5); else if (49 === e.keyCode || 50 === e.keyCode || 51 === e.keyCode || 52 === e.keyCode || 81 === e.keyCode || 69 === e.keyCode) {
                    var id = 1;
                    50 === e.keyCode ? id = 2 : 51 === e.keyCode ? id = 3 : 52 === e.keyCode && (id = 4), 
                    game.useShortcut(id - 1);
                }
                game.player.updatePlayerVel(self.vecPositions);
            }
        }), document.body.addEventListener("keydown", function(e) {
            game.player && (87 === e.keyCode || 38 === e.keyCode ? (self.removePosition("down"), 
            self.addPosition("up")) : 83 === e.keyCode || 40 === e.keyCode ? (self.removePosition("up"), 
            self.addPosition("down")) : 65 === e.keyCode || 37 === e.keyCode ? (self.removePosition("right"), 
            self.addPosition("left")) : (68 === e.keyCode || 39 === e.keyCode) && (self.removePosition("left"), 
            self.addPosition("right")), game.player.updatePlayerVel(self.vecPositions));
        });
    },
    removePosition: function(position) {
        for (var i = this.vecPositions.length - 1; i >= 0; i--) this.vecPositions[i] === position && this.vecPositions.splice(i, 1);
    },
    addPosition: function(position) {
        for (var exists = !1, i = this.vecPositions.length - 1; i >= 0; i--) this.vecPositions[i] === position && (exists = !0);
        exists || this.vecPositions.push(position);
    }
}), CookieManager = Class.extend({
    init: function() {
        function getLocalStorage() {
            try {
                if (window.localStorage) return window.localStorage;
            } catch (e) {
                return void 0;
            }
        }
        this.db = getLocalStorage();
    },
    setCookie: function(cname, cvalue, exdays) {
        var d = new Date(), days = exdays ? exdays : 5e4;
        d.setTime(d.getTime() + 24 * days * 60 * 60 * 1e3);
        "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + days;
    },
    getCookie: function(name) {
        return (name = new RegExp("(?:^|;\\s*)" + ("" + name).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") + "=([^;]*)").exec(document.cookie)) && name[1];
    },
    setSafeCookie: function(key, value) {
        return this.db && this.db.setItem(key, value), window.intel ? void window.intel.security.secureStorage.write(function() {
            console.log("success");
        }, function(errorObj) {
            console.log("fail: code = " + errorObj.code + ", message = " + errorObj.message);
        }, {
            id: key,
            data: value
        }) : this.setCookie(key, value);
    },
    getSafeCookie: function(key, callback) {
        return this.db && this.db.getItem(key), window.intel ? void window.intel.security.secureStorage.read(function(instanceID) {
            window.intel.security.secureData.getData(function(data) {
                callback(data);
            }, function(errorObj) {
                console.log("fail: code = " + errorObj.code + ", message = " + errorObj.message), 
                callback(null);
            }, instanceID);
        }, function(errorObj) {
            console.log("fail: code = " + errorObj.code + ", message = " + errorObj.message), 
            callback(null);
        }, {
            id: key
        }) : this.getCookie(key);
    }
}), Environment = Class.extend({
    init: function(maxWidth, maxHeight) {
        this.velocity = {
            x: 0,
            y: 0
        }, this.texture = "", this.sprite = "", this.container = new PIXI.DisplayObjectContainer(), 
        this.updateable = !0, this.arraySprt = [], this.maxWidth = maxWidth, this.maxHeight = maxHeight, 
        this.texWidth = 0, this.spacing = 0, this.totTiles = 0, this.currentSprId = 0;
    },
    build: function(imgs, spacing) {
        this.arraySprt = imgs, spacing && (this.spacing = spacing);
        for (var i = Math.floor(this.arraySprt.length * Math.random()); i < this.arraySprt.length && !(this.container.width > this.maxWidth); i++) this.currentSprId = i, 
        this.addEnv();
    },
    addEnv: function() {
        this.sprite = new PIXI.Sprite(PIXI.Texture.fromFrame(this.arraySprt[this.currentSprId])), 
        this.sprite.cacheAsBitmap = !0;
        var last = this.container.children[this.container.children.length - 1];
        last && (this.sprite.position.x = last.position.x + last.width - 2), this.sprite.position.y = this.maxHeight - this.sprite.height, 
        this.container.addChild(this.sprite);
    },
    update: function() {
        if (this.container.children) {
            for (var i = this.container.children.length - 1; i >= 0; i--) this.container.children[i].position.x + this.container.children[i].width < 0 && this.container.removeChild(this.container.children[i]), 
            this.container.children[i].position.x += this.velocity.x;
            var last = this.container.children[this.container.children.length - 1];
            last.position.x + last.width - 20 < this.maxWidth && (this.currentSprId++, this.currentSprId >= this.arraySprt.length && (this.currentSprId = 0), 
            this.addEnv());
        }
    },
    getContent: function() {
        return this.container;
    }
}), Paralax = Class.extend({
    init: function(maxWidth) {
        this.velocity = {
            x: 0,
            y: 0
        }, this.texture = "", this.sprite = "", this.container = new PIXI.DisplayObjectContainer(), 
        this.updateable = !0, this.arraySprt = [], this.maxWidth = maxWidth, this.texWidth = 0, 
        this.spacing = 0, this.totTiles = 0;
    },
    build: function(img, spacing) {
        spacing && (this.spacing = spacing), this.texture = PIXI.Texture.fromFrame(img), 
        this.texWidth = this.texture.width, this.totTiles = Math.ceil(this.maxWidth / this.texWidth) + 1;
        for (var i = 0; i < this.totTiles; i++) this.sprite = new PIXI.Sprite(this.texture), 
        this.sprite.position.x = (this.texWidth + this.spacing) * i, this.container.addChild(this.sprite);
        console.log("this");
    },
    update: function() {
        Math.abs(this.container.position.x + this.velocity.x) >= this.texWidth + this.totTiles * this.spacing ? this.container.position.x = 0 : this.container.position.x += this.velocity.x, 
        this.container.position.y += this.velocity.y;
    },
    getContent: function() {
        return this.container;
    }
}), Particles = Entity.extend({
    init: function(vel, timeLive, source, rotation) {
        this._super(!0), this.updateable = !1, this.colidable = !1, this.deading = !1, this.range = 40, 
        this.width = 1, this.height = 1, this.type = "particle", this.target = "enemy", 
        this.fireType = "physical", this.node = null, this.velocity.x = vel.x, this.velocity.y = vel.y, 
        this.timeLive = timeLive, this.power = 1, this.defaultVelocity = 1, this.imgSource = source, 
        this.alphadecress = .03, this.scaledecress = .03, this.gravity = 0, rotation && (this.rotation = rotation), 
        this.maxScale = 1, this.growType = 1, this.maxInitScale = 1, this.initScale = 1;
    },
    build: function() {
        this.updateable = !0, this.imgSource instanceof PIXI.Text || this.imgSource instanceof PIXI.Graphics ? this.sprite = this.imgSource : (this.sprite = new PIXI.Sprite.fromFrame(this.imgSource), 
        this.sprite.anchor.x = .5, this.sprite.anchor.y = .5), this.sprite.alpha = 1, this.sprite.scale.x = this.initScale, 
        this.sprite.scale.y = this.initScale, -1 === this.growType && (this.sprite.scale.x = this.maxScale, 
        this.sprite.scale.y = this.maxScale), this.getContent().rotation = this.rotation;
    },
    update: function() {
        this._super(), 0 !== this.gravity && (this.velocity.y += this.gravity), this.timeLive--, 
        this.timeLive <= 0 && this.preKill(), this.range = this.width, this.rotation && (this.getContent().rotation += this.rotation), 
        this.sprite.alpha > 0 && (this.sprite.alpha -= this.alphadecress, this.sprite.alpha <= 0 && this.preKill()), 
        this.sprite.scale.x < 0 && this.preKill(), this.sprite.scale.x > this.maxScale || (this.sprite.scale.x += this.scaledecress, 
        this.sprite.scale.y += this.scaledecress);
    },
    preKill: function() {
        this.sprite.alpha = 0, this.updateable = !0, this.kill = !0;
    }
}), res = {
    x: 375,
    y: 667
}, resizeProportional = !0, windowWidth = res.x, windowHeight = res.y, realWindowWidth = res.x, realWindowHeight = res.y, gameScale = 1, screenOrientation = "portait", windowWidthVar = window.innerHeight, windowHeightVar = window.innerWidth, gameView = document.getElementById("game");

testMobile() || (document.body.className = ""), console.log(gameView), window.addEventListener("orientationchange", function() {
    window.scrollTo(0, 0);
}, !1);

var ratio = 1, init = !1, renderer, APP, retina = window.devicePixelRatio >= 2 ? 2 : 1, initialize = function() {
    PIXI.BaseTexture.SCALE_MODE = PIXI.scaleModes.NEAREST, requestAnimFrame(update);
}, isfull = !1;

!function() {
    var App = {
        init: function() {
            void 0 !== window.intel ? document.addEventListener("deviceready", function() {
                alert("device ready"), initialize();
            }) : initialize();
        }
    };
    App.init();
}();