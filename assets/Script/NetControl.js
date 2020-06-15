// var BASE_URL = "ws://localhost:8080/ws"
var BASE_URL = "ws://159.138.145.170:8080/ws"

var NetControl = {

	_sock : {},
	connect : function ( ) {
		if ( this._sock.readyState !== 1 ) {
			this._sock= new WebSocket ( BASE_URL )
			console.log ( "attempting websocket connection" ) ;

      this._sock.onopen = this._onOpen.bind(this);
      this._sock.onclose = this._onClose.bind(this);
      this._sock.onmessage = this._onMessage.bind(this);
		}
	},

  _onOpen:function(){
		console.log ("Successfully Connected");

		this.send("Hi from the client!");
  },
  _onClose:function(err){
    console.log ( "Socket Closed Connection : " , event )
  },
  _onMessage:function(obj){
    console.log(obj);
  },

	isJsonStr : function (item) {
	    item = typeof item !== "string"
	        ? JSON.stringify(item)
	        : item;

	    try {
	        item = JSON.parse(item);
	    } catch (e) {
	        return false;
	    }

	    if (typeof item === "object" && item !== null) {
	        return true;
	    }

	    return false;
	},

	send : function ( msg ) {
		this._sock.send(msg);
	},

};

module.exports = NetControl
