
var netControl = require('NetControl')
var player = require('Player')

cc.Class({
    extends: cc.Component,

    properties: {
			buttonStart : {
				default : null,
				type : cc.Node
			},
			buttonRegister : {
				default : null,
				type : cc.Node
			},
			buttonLogin : {
				default : null,
				type : cc.Node
			},
			editEmail : {
				default : null,
				type : cc.EditBox
			},
			editPassword : {
				default : null,
				type : cc.EditBox
			},
			message : {
				default: null,
				type: cc.Label
			},
    },

		register : function ( ) {
			var self = this;
			var request = cc.loader.getXMLHttpRequest ( ) ;
			var url = "http://159.138.145.170:8080/user";
			// var url = "http://localhost:8080/user";
			var params = {
				"email" : this.editEmail.string,
				"password" : this.editPassword.string,
			}
			request.open("POST", url, true);
			request.setRequestHeader ( "Content-type", "application/json" )
			request.send(JSON.stringify(params))
			request.onload = function() {

				if ( netControl.isJsonStr ( request.responseText ) ) {
					var data = JSON.parse ( request.responseText  );
					if ( data.status && data.status == 1) {
						self.message.string = "Register Successfully."
					}
					if ( data.error ) {
						self.message.string = data.error
					}
					self.editEmail.string = ""
					self.editPassword.string = ""
				}

      }
		},

		login : function ( ) {
			var self = this;
			var request = cc.loader.getXMLHttpRequest ( ) ;
			var url = "http://159.138.145.170:8080/login";
			// var url = "http://localhost:8080/login";
			var params = {
				"email" : this.editEmail.string,
				"password" : this.editPassword.string,
			}
			request.open("POST", url, true);
			request.setRequestHeader ( "Content-type", "application/json" )
			request.send(JSON.stringify(params))
			request.onload = function() {

				if ( netControl.isJsonStr ( request.responseText ) ) {
					var data = JSON.parse ( request.responseText  );
					if ( data.status && data.status == 1) {
						self.message.string = "Login Successfully."
						self.buttonStart.active = true
					}
					if ( data.error ) {
						self.message.string = data.error
					}
					self.editEmail.string = ""
					self.editPassword.string = ""
				}

      }
		},

		startGame : function () {
			// cc.director.loadScene("Game");
			netControl.connect ();
			netControl._sock.onmessage = this._onMessage.bind(this);
			this.message.string = "Waiting for other players."
		},

		_onMessage : function ( obj ) {

			if ( netControl.isJsonStr ( obj.data ) ) {
				var data = JSON.parse ( obj.data  );
				console.log ( data ) ;
				if ( data.status == 1 ) {
					cc.director.loadScene("Game");
					player.id = data.id
				}
			}
		},
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
