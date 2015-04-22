/*jshint undef:false */
var RadiusBehaviour = Class.extend({
	init:function(props){
		this.props = props;
		this.left = APP.seed.getNextFloat() < 0.5;
		this.radius = windowWidth * 0.2 * APP.seed.getNextFloat() + windowWidth * 0.22;
		// this.position = {x: windowWidth * 0.15 + (windowWidth * 0.7 * APP.seed.getNextFloat()), y:windowHeight * 0.2 + APP.seed.getNextFloat() * windowHeight * 0.3};
		this.position = {x: windowWidth / 2, y:windowHeight * 0.2 + APP.seed.getNextFloat() * windowHeight * 0.3};
		this.centerPos = {x: windowWidth / 2, y:windowHeight / 2.2 - ((windowHeight / 1.7) - this.radius * 2 ) * APP.seed.getNextFloat()};
		this.angle = APP.seed.getNextFloat();
		this.angleSpd = APP.seed.getNextFloat() * 0.04 + 0.02;
		this.angleSpd *= APP.accelGame;
		this.side = APP.seed.getNextFloat() < 0.5 ? 1 : -1;

		var rnd = APP.seed.getNextFloat();
		if(rnd < 0.25 * APP.accelGame){
			this.killerBehaviour = new SiderBehaviour({centerDist:windowWidth/2.5});
			this.killerBehaviour.position = {x: this.position.x, y:this.position.y + (windowHeight * 0.15 + (windowHeight * 0.15) * APP.seed.getNextFloat())};
		}else if(rnd < 0.45 * APP.accelGame){
			this.killerBehaviour = new StoppedBehaviour({});
			this.killerBehaviour.position = this.centerPos;
		}
	},
	clone:function(){
		return new RadiusBehaviour(this.props);
	},
	update:function(entity){
		this.tempPosition = {x:Math.sin(this.angle) * this.radius + this.centerPos.x, y:Math.cos(this.angle) * this.radius + this.centerPos.y};
		entity.getContent().position.x = Math.sin(this.angle) * this.radius + this.centerPos.x;
		entity.getContent().position.y = Math.cos(this.angle) * this.radius + this.centerPos.y;
		this.angle += (this.angleSpd * this.side);
	},
	build:function(){

	},
	destroy:function(){

	},
	serialize:function(){
		
	}
});