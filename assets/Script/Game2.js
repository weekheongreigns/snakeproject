
var netControl = require('NetControl')
var player = require('Player')

cc.Class({
    extends: cc.Component,

    properties: {
			snake : {
				default : null,
				type : cc.Node,
			},
			snake2 : { // remote opponent
				default : null,
				type : cc.Node,
			},
			fruit : {
				default : null,
				type : cc.Prefab,
			},
			score1 : {
				default: null,
				type: cc.Label
			},
			score2 : {
				default: null,
				type: cc.Label
			},
			gameOverContainer : {
				default: null,
				type: cc.Node
			},
			gameOverLabel : {
				default: null,
				type: cc.Label
			},
    },


		_onMessage : function ( obj ) {
			if ( netControl.isJsonStr ( obj.data ) ) {
				var data = JSON.parse ( obj.data  );
				if ( data.pos ) {
					this.snake2.getComponent('Snake').updatePos(data);
				}

				if ( data.newscore ) {
					this.tscore = data.newscore
					this.score2.string = data.newscore
				}

				if ( data.status && data.status == -1 ) {
					this.gameOver()
				}
			}
		},

		getNewFruitPosition : function ( ) {
			if (!this.currentFruit) {
				var max = this.node.width/2;
				var min = -200;
					this.currentFruitX = Math.random() * (max - min + 1) + min;
					this.currentFruitY = (Math.random() - 0.5) * 2 * this.node.height/2;
			}

			return cc.v2(this.currentFruitX , this.currentFruitY);
		},

		spawnNewFruit : function ( ) {
			var newFruit = null;
			newFruit = cc.instantiate(this.fruit);
			this.node.addChild(newFruit);
			newFruit.setPosition(this.getNewFruitPosition());
			newFruit.getComponent('Fruit').init(this);
			this.currentFruit = newFruit;
		},

		gameOver : function ( ) {
			this.snake.active = false;
			this.snake2.active = false;

			if ( this.score < this.tscore ) {
				this.gameOverLabel.string = "You lose!";
			}
			else { this.gameOverLabel.string = "You win!"; }
			this.gameOverContainer.x = 0;
		},

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
			netControl._sock.onmessage = this._onMessage.bind(this);

			if ( player.id == 0 ) {
				this.snake.setPosition(25, 25)
				this.snake.getComponent('Snake').init ( player.directions[0], 0, this ) ;
				this.snake2.setPosition(0, 0)
				this.snake2.getComponent('Snake').init ( player.directions[1], 1, this ) ;
			} else {
				this.snake.setPosition(0, 0)
				this.snake.getComponent('Snake').init ( player.directions[1], 0, this ) ;
				this.snake2.setPosition(25, 25)
				this.snake2.getComponent('Snake').init ( player.directions[0], 1, this ) ;
			}

			this.currentFruit = null;
			this.spawnNewFruit ( ) ;

			this.score = 0
			this.tscore = 0

			this.score1.string = this.score
			this.score2.string = this.tscore

			this.gameOverContainer.x = 3000;
		},

    start () {

    },

    // update (dt) {},
});
