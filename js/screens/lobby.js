game.lobbyScreen = me.ScreenObject.extend({
    init: function() {
        socket = io.connect(global.network.host, {port: global.network.port, transports: ["websocket"]});

        // and set up our networking callbacks
        socket.on("connect", this.onSocketConnected);
        socket.on("new player", this.onNewPlayer);
        socket.on("move player", this.onMovePlayer);
        socket.on("remove player", this.onRemovePlayer);
        socket.on("error", this.handleError);
        socket.on("pong", this.updateLatency);

        // Helper function to return one of our remote players
        playerById = function(id) {
            var i;

            for (i = 0; i < global.state.remotePlayers.length; i++) {
                if (global.state.remotePlayers[i].id == id)
                    return global.state.remotePlayers[i];
            };

            return false;
        };
    },

    onLobbyEnter: function() {
        me.game.viewport.fadeOut("#000", 500);
    },

    // For error debugging
    handleError: function(error){
        console.log(error);
    },

    onSocketConnected: function() {
        console.log("Connected to socket server");
        // When we connect, tell the server we have a new player (us)
        socket.emit("new player", {x: global.state.localPlayer.pos.x, y: global.state.localPlayer.pos.y, vX:global.state.localPlayer.vel.x, vY: global.state.localPlayer.vel.y})

        // Set up ping / pongs for latency
        setInterval(function () {
            global.network.emitTime = +new Date;
            global.network.emits++;
            socket.emit('ping');
        }, 500);
    },

    updateLatency: function() {
        // Simply updates the average latency
        global.network.totlatency += +new Date - global.network.emitTime
        global.network.latency = Math.round(global.network.totlatency/global.network.emits);
        me.game.HUD.setItemValue("latency", global.network.latency);
    },

    onNewPlayer: function(data) {
        // When a new player connects, we create their object and add them to the screen.
        var newPlayer = new game.Player(data.x, data.y, {
            spritewidth: 50,
            spriteheight: 30,
            name: "o"
        });
        newPlayer.id = data.id;
        newPlayer.name = data.name;

        global.state.remotePlayers.push(newPlayer);

        me.game.add(newPlayer, 3);
        me.game.sort(game.sort);

        // Update the HUD with the new number of players
        me.game.HUD.setItemValue("connected", (global.state.remotePlayers.length+1));
    },

    onRemovePlayer: function(data) {
        // When a player disconnects, we find them in our remote players array
        var removePlayer = playerById(data.id);

        if(!removePlayer) {
            console.log("Player not found "+data.id);
            return;
        };

        // and remove them from the ScreenObject
        me.game.remove(removePlayer);
        me.game.sort();
        global.state.remotePlayers.splice(global.state.remotePlayers.indexOf(removePlayer), 1);

        // and update the HUD
        me.game.HUD.setItemValue("connected", (global.state.remotePlayers.length+1));
    }
});
