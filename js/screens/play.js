game.playScreen = me.ScreenObject.extend({
    onResetEvent : function () {
        me.game.onLevelLoaded = this.onLevelLoaded.bind(this);

        me.levelDirector.loadLevel("main");

        playerById = function(id) {
            var i;

            for (i = 0; i < global.state.remotePlayers.length; i++) {
                if (global.state.remotePlayers[i].id == id)
                    return global.state.remotePlayers[i];
            };

            return false;
        };
    },

    onLevelLoaded : function (name) {
        me.game.viewport.fadeOut("#000", 500);

        global.state.localPlayer = new game.Player(40, 190, {
            spritewidth: 50,
            spriteheight: 30,
            name: "player"
        });
        global.state.localPlayer.id = "player";

        me.game.add(global.state.localPlayer, 4);
        me.game.sort();

        // http://westward.aws.af.cm
        socket = io.connect("http://localhost", {port: 8000, transports: ["websocket"]});

        socket.on("connect", this.onSocketConnected);
        socket.on("new player", this.onNewPlayer);
        socket.on("move player", this.onMovePlayer);
        socket.on("remove player", this.onRemovePlayer);
    },

    onDestroyEvent: function () {
        // Unbind keys
        me.input.unbindKey(me.input.KEY.LEFT);
        me.input.unbindKey(me.input.KEY.RIGHT);
        me.input.unbindKey(me.input.KEY.UP);
        me.input.unbindKey(me.input.KEY.DOWN);
    },

    onSocketConnected: function() {
        console.log("Connected to socket server");
        socket.emit("new player", {x: global.state.localPlayer.pos.x, y: global.state.localPlayer.pos.y})
    },

    onNewPlayer: function(data) {
        var newPlayer = new game.Player(data.x, data.y, {
            spritewidth: 50,
            spriteheight: 30,
            name: "other"
        });
        newPlayer.id = data.id;

        global.state.remotePlayers.push(newPlayer);

        me.game.add(newPlayer, 3);
        me.game.sort(game.sort);
    },

    onRemovePlayer: function(data) {
        var removePlayer = playerById(data.id);

        if(!removePlayer) {
            console.log("Player not found "+data.id);
            return;
        };

        me.game.remove(removePlayer);
        global.state.remotePlayers.splice(global.state.remotePlayers.indexOf(removePlayer), 1);
    },

    onMovePlayer: function(data) {
        var movePlayer = playerById(data.id);

        if(!movePlayer || movePlayer.name === 'player') {
            return;
        }

        movePlayer.pos.x = data.x;
        movePlayer.pos.y = data.y;
    }
});
