var netControl = require('NetControl')

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

		init : function (game) {
			this.game = game;
		},

		onPicked: function() {
			this.game.currentFruit = null;
			this.game.spawnNewFruit();
      var pos = this.node.getPosition();
      // this.game.gainScore(pos);
      // this.game.despawnStar(this.node);
			this.game.snake.getComponent('Snake').growSnake();
			this.game.score += 1

			this.game.score1.string = this.game.score

			var toSend = {
				"newscore" : this.game.score,
			};
			netControl._sock.send ( JSON.stringify(toSend) );

			this.node.destroy ( ) ;
    },

		getPlayerDistance : function ( ) {
      var playerPos = cc.v2(this.game.snake.x, this.game.snake.y);
      var dist = this.node.position.sub(playerPos).mag();
      return dist;
		},

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
			this.pickRadius = 30;
		},

    start () {

    },

    update (dt) {

			// detect if fruit is touching snake1 or snake2
			if (this.getPlayerDistance() < this.pickRadius) {
					// 调用收集行为
					this.onPicked();
					return;
			}

		},
});
