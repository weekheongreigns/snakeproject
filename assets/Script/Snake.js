
var netControl = require('NetControl')
var player = require('Player')

cc.Class({
    extends: cc.Component,

    properties: {
        bodyLength : 0,
				snakeCell : {
					default : null,
					type : cc.Prefab
				},
				label : {
					default: null,
					type: cc.Label
				}
    },

		getCenterPos: function (i) {
      var centerPos = cc.v2(this.node.x, this.node.y - (i + 1) * this.node.height) ;
			switch (this.currentDirection) {
				case player.directions[1]: // down
					centerPos = cc.v2(this.node.x, this.node.y + (i + 1) * this.node.height) ;
					break;
				case player.directions[2]: // left
					centerPos = cc.v2(this.node.x + (i + 1) * this.node.width, this.node.y) ;
					break;
				case player.directions[3]: // right
					centerPos = cc.v2(this.node.x - (i + 1) * this.node.width, this.node.y) ;
					break;
				default:
			}
      return centerPos;
    },

		init : function ( dir, id, game ) {
			this.currentDirection = dir;
			this.id = id
			this.label.string = id;
			this.game = game
			if ( id == 0 ) { cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this); }
		},

		drawSnake : function () {
			for (var i = 0; i < this.bodyLength; i ++) {
				var newCell = null;
				newCell = cc.instantiate(this.snakeCell);
				this.node.parent.addChild(newCell);
				newCell.setPosition(this.getCenterPos(i));
				newCell.getComponent('SnakeCell').init(this, i);
				this.snakebody.push(newCell)
			}
		},

		growSnake : function ( ) {
			var newCell = null;
			newCell = cc.instantiate(this.snakeCell);
			this.node.parent.addChild(newCell);
			newCell.setPosition(this.snakebody[this.snakebody.length - 1].x, this.snakebody[this.snakebody.length - 1].y);
			newCell.getComponent('SnakeCell').init(this, this.snakebody.length);
			this.snakebody.push(newCell)
		},

		moveHead : function ( ) {
			switch (this.currentDirection) {
				case player.directions[0]: // up
					this.node.y += this.node.height
					break;
				case player.directions[1]: // down
					this.node.y -= this.node.height
					break;
				case player.directions[2]: // left
					this.node.x -= this.node.width
					break;
				case player.directions[3]: // right
					this.node.x += this.node.width
					break;
				default:
			}
		},

		moveSnake : function ( ) {

			for (var i = this.snakebody.length -1; i >= 0; i --) {
				if ( i == 0 ) {
					this.snakebody[i].setPosition(this.getCenterPos(-1));
				} else {
					this.snakebody[i].setPosition(this.snakebody[i - 1].x, this.snakebody[i - 1].y)
				}
			}

			this.moveHead();

			if ( this.node.x > this.node.parent.width/2) {
					this.node.x = this.node.parent.width/2;
			} else if (this.node.x < -200) {
					this.node.x = -200;
			} else if (this.node.y > this.node.parent.height/2) {
					this.node.y = this.node.parent.height/2;
			} else if (this.node.y < -this.node.parent.height/2) {
					this.node.y = -this.node.parent.height/2;
			}

			var snakebody2 = [];

			for ( var i = 0; i < this.snakebody.length; i ++ ) {
				var xy = { "x" : this.snakebody[i].x, "y" : this.snakebody[i].y };
				snakebody2.push ( xy );
			}

			var toSend = {
				"pos" : {
					"x" : this.node.x,
					"y" : this.node.y
				},
				"snakebody" : snakebody2
			};

			netControl._sock.send ( JSON.stringify(toSend) );
		},

		upButton : function ( ) {
			if (this.currentDirection == player.directions[2] || this.currentDirection == player.directions[3]) {
				this.currentDirection = player.directions[0];
				this.moveSnake();
			}
		},

		downButton : function ( ) {
			if (this.currentDirection == player.directions[2] || this.currentDirection == player.directions[3]) {
				this.currentDirection = player.directions[1];
				this.moveSnake();
			}
		},

		leftButton : function ( ) {
			if (this.currentDirection == player.directions[0] || this.currentDirection == player.directions[1]) {
				this.currentDirection = player.directions[2];
				this.moveSnake();
			}
		},

		rightButton : function ( ) {
			if (this.currentDirection == player.directions[0] || this.currentDirection == player.directions[1]) {
				this.currentDirection = player.directions[3];
				this.moveSnake();
			}
		},

		onKeyDown (event) {
        switch(event.keyCode) {
						case cc.macro.KEY.up:
								this.upButton();
								break;
						case cc.macro.KEY.down:
								this.downButton();
								break;
            case cc.macro.KEY.left:
								this.leftButton();
                break;
            case cc.macro.KEY.right:
								this.rightButton();
                break;
        }
    },

		updatePos : function ( data ) {
			console.log ( data ) ;
			this.node.setPosition(data.pos.x, data.pos.y)
			for (var i = this.snakebody.length; i < data.snakebody.length; i ++) {
				this.growSnake()
			}
			for (var i = 0; i < data.snakebody.length; i ++) {
				this.snakebody[i].setPosition(data.snakebody[i].x, data.snakebody[i].y)
			}
		},

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

			this.snakebody = []

			this.drawSnake();

			this.timer = 0;
			this.currentTimer = 0;

			var snake = this;
			this.timerInterval = setInterval(function() {
				snake.timer ++;
			}, 500);
		},

		onDestroy ( ) {
			if ( this.id == 0 ) {
				cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
			}
			clearInterval(this.timerInterval)
		},

    // start () {
		//
    // },

    update (dt) {
			if ( this.currentTimer < this.timer && this.id == 0 ) {
				this.currentTimer = this.timer;
				this.moveSnake();
			}
		},
});
