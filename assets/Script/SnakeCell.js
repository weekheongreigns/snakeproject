
var netControl = require('NetControl')

cc.Class({
    extends: cc.Component,

    properties: {
    },

		init : function (snake, pos) {
			this.snake = snake // game accessed from this.snake.game
			this.pos = pos
		},

		getPlayerDistance : function ( ) {
			var playerPos = cc.v2(this.snake.game.snake.x, this.snake.game.snake.y);
      var dist = this.node.position.sub(playerPos).mag();
      return dist;
		},

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
			// determine the snake with id 1 only if this.snake.id is 0 // snake2 is always the enemy
			this.radius = 25;
		},

    start () {

    },

    update (dt) {
			// if this.snake.id is 0 compare with snake1 body and head
			if (this.getPlayerDistance() < this.radius && this.snake.node.active) {
					this.snake.game.score -= 5

					this.snake.game.score1.string = this.snake.game.score

					var toSend = {
						"newscore" : this.snake.game.score,
						"status" : -1,
					};
					netControl._sock.send ( JSON.stringify(toSend) );

					this.snake.game.gameOver();
					return;
			}
		},
});
