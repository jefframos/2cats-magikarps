/*jshint undef:false */
var StoppedBehaviour = Class.extend({
	init:function(props){
		this.props = props;
		this.position = {x: windowWidth / 2, y:windowHeight * 0.15 + APP.seed.getNextFloat() * windowHeight * 0.25};
		this.centerDist =  APP.seed.getNextFloat() * (windowWidth * 0.2) + windowWidth * 0.15;
		var rnd = APP.seed.getNextFloat();
		if(rnd < 0.25 * APP.accelGame){
			this.killerBehaviour = new SiderBehaviour({centerDist:windowWidth/2.5});
			this.killerBehaviour.position = {x: this.position.x, y:this.position.y + (windowHeight * 0.15 + (windowHeight * 0.15) * APP.seed.getNextFloat())};
		}else if(rnd < 0.45 * APP.accelGame){
			this.killerBehaviour = new RadiusBehaviour({});
			this.killerBehaviour.centerPos = this.position;
		}
	},
	clone:function(){
		return new StoppedBehaviour(this.props);
	},
	update:function(entity){
		
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