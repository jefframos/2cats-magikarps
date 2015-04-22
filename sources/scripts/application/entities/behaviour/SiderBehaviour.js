/*jshint undef:false */
var SiderBehaviour = Class.extend({
	init:function(props){
		this.props = props;
		this.left = APP.seed.getNextFloat() < 0.5;
		this.velX = this.props.velX?this.props.velX:5;
		this.velX *= APP.accelGame;
		// this.position = {x: windowWidth * 0.15 + (windowWidth * 0.7 * APP.seed.getNextFloat()), y:windowHeight * 0.2 + APP.seed.getNextFloat() * windowHeight * 0.3};
		this.position = {x: windowWidth / 2, y:windowHeight * 0.25 + APP.seed.getNextFloat() * windowHeight * 0.45};
		this.centerDist =  this.props.centerDist ? this.props.centerDist : APP.seed.getNextFloat() * (windowWidth * 0.2) + windowWidth * 0.2;
	},
	clone:function(){
		return new SiderBehaviour(this.props);
	},
	update:function(entity){
		if(pointDistance(entity.getContent().position.x,0, windowWidth / 2, 0) > this.centerDist){

			this.velX *= -1;
		}

		entity.velocity.x = this.velX;
	},
	build:function(){

	},
	destroy:function(){

	},
	serialize:function(){
		
	}
	// pointDistance: function(x, y, x0, y0){
 //        return Math.sqrt((x -= x0) * x + (y -= y0) * y);
 //    },
});