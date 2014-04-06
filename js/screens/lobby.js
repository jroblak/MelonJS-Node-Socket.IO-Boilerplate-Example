/*
    TODO - Add onDeleteRoom to purge roomlist
    TODO - Welcome message / effects
    TODO - Display player character
    TODO - Add player customization abilities -- reimplement composition engine, add screen it, etc
    TODO - Make customization unlockable / user accounts
    TODO - Server list (requires adding passwords and naming rooms)
*/

game.lobbyScreen = me.ScreenObject.extend({
    init: function() {
        // This is so we can draw
        this.parent(true);
    },

    onResetEvent: function() {
        $('.roomnum').css('visibility', 'visible');

        // Connect to server and set global reference to the socket that's connected
        global.network.socket  = io.connect(global.network.host, {port: global.network.port, transports: ["websocket"]});

        // Set up buttons and fonts
        this.font = new me.Font("Verdana", 12, "#fff", "center");
        this.joinbutton = new game.Button(600, 480, "joinbuttonde");
        this.createbutton = new game.Button(120, 480, "createbuttonde");

        // Set up initial, basic socket handlers
        global.network.socket.on("connect", this.onSocketConnected(this.joinbutton, this.createbutton));
        global.network.socket.on("croom", this.onNewRoom);
        global.network.socket.on("rroom", this.onDelRoom);
        global.network.socket.on("sendrooms", this.onGetRooms);
        global.network.socket.on("noroom", this.handleError);
        global.network.socket.on("error", this.handleError);
        global.network.socket.on("joincreateconfirm", this.joinRoom);

        // Add our renderable features to the screen
        me.game.add(new me.ColorLayer("background", "#333333", 1));
        me.game.add(this.joinbutton, 4);
        me.game.add(this.createbutton, 4);
        me.game.sort();
    },

    // Error handler; is called when the server fires off an error message
    handleError: function(error){
        console.log(error);
    },

    // Updates the  initial room list with the server's room list
    onGetRooms: function(data) {
        global.state.rooms = data.roomlist;
    },

    // When someone creates a new room, add it to our list
    // This is called when anyone (including this client) creates a new room
    onNewRoom: function(data) {
        global.state.rooms.push(data.room);
    },

    onDelRoom: function(data) {
        global.state.rooms.splice(global.state.rooms.indexOf(data.room), 1);
    },

    joinRoom: function(data) {
        global.network.room = data.room;
        me.state.change(me.state.ROOM);
    },

    // When we connect...
    onSocketConnected: function(joinbutton, createbutton) {

        // Activate our buttons so that we can join or create new game rooms
        // On click: takes us to a game "Room"
        joinbutton.type = "joinbutton";
        joinbutton.image = me.loader.getImage("joinbutton");
        createbutton.type = "createbutton";
        createbutton.image = me.loader.getImage("createbutton");

        // Get the roomlist from the server
        global.network.socket.emit("getrooms");
    },

    // Hide the input box when we leave this screen
    onDestroyEvent : function () {
        $('.roomnum').hide();
    },

    // Draw our basic message
    draw: function (context) {
            var msg =  "Enter Room Number:";
            this.font.draw(
                context,
                msg,
                global.WIDTH / 1.6,
                global.HEIGHT / 1.42
            );

            this.parent(context);
    }
});
