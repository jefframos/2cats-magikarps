/*jshint undef:false */
var RadiusPingPongBehaviour = Class.extend({
	init:function(props){
		this.props = props;
		this.left = APP.seed.getNextFloat() < 0.5;
		this.radius = windowWidth * 0.2 * APP.seed.getNextFloat() + windowWidth * 0.22;
		// this.position = {x: windowWidth * 0.15 + (windowWidth * 0.7 * APP.seed.getNextFloat()), y:windowHeight * 0.2 + APP.seed.getNextFloat() * windowHeight * 0.3};
		this.position = {x: windowWidth / 2, y:windowHeight * 0.2 + APP.seed.getNextFloat() * windowHeight * 0.3};
		this.centerPos = {x: windowWidth / 2, y:windowHeight / 2 - ((windowHeight / 2) - this.radius * 2 ) * APP.seed.getNextFloat()};
		this.angle = 3.14;
		this.angleSpd = APP.seed.getNextFloat() * 0.03 + 0.025;
		this.angleSpd *= APP.accelGame;
		this.side = APP.seed.getNextFloat() < 0.5 ? 1 : -1;
		this.angleMin = 90 * 3.14 / 180;
		this.angleMax = 270 * 3.14 / 180;
		this.invert = false;


		var rnd = APP.seed.getNextFloat();
		if(rnd < 0.15 * APP.accelGame){
			this.killerBehaviour = new SiderBehaviour({centerDist:windowWidth/2.5});
			this.killerBehaviour.position = {x: this.position.x, y:this.position.y + (windowHeight * 0.15 + (windowHeight * 0.15) * APP.seed.getNextFloat())};
		}else if(rnd < 0.3 * APP.accelGame){
			this.killerBehaviour = new RadiusBehaviour({});
			this.killerBehaviour.centerPos = this.position;
		}
		// var temp = this.angleMax;
		// if(APP.seed.getNextFloat() < 0.5){
		// 	// this.angleMax = this.angleMin;
		// 	// this.angleMin = temp;
		// 	this.invert = true;
		// 	this.side *= -1;
		// }

		// console.log(this.angleMin, this.angleMax);
	},
	clone:function(){
		return new RadiusPingPongBehaviour(this.props);
	},
	update:function(entity){
		entity.getContent().position.x = Math.sin(this.angle) * this.radius + this.centerPos.x;
		entity.getContent().position.y = Math.cos(this.angle) * this.radius + this.centerPos.y;
		this.angle += (this.angleSpd * this.side);

		if(!this.invert){
			if(this.angle < this.angleMin && this.side < 0){
				this.side *= -1;
			}

			if(this.angle > this.angleMax && this.side > 0){
				this.side *= -1;
			}
		}
		// else{
		// 	if(this.angle > this.angleMin && this.side < 0){
		// 		this.side *= -1;
		// 	}

		// 	if(this.angle < this.angleMax && this.side > 0){
		// 		this.side *= -1;
		// 	}
		// }
	},
	build:function(){

	},
	destroy:function(){

	},
	serialize:function(){
		
	}
});