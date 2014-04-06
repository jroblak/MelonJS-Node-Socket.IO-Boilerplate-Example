game.playScreen = me.ScreenObject.extend({
    onResetEvent : function () {
        // Set up loader callback
        me.game.onLevelLoaded = this.onLevelLoaded.bind(this);

        // Load the HUD
        me.game.addHUD(0, 0, global.WIDTH, 20, "rgba(0, 0, 0, 0.5)");
        me.game.HUD.addItem("latency", new game.Info(10, 5, "latency"));
        me.game.HUD.addItem("connected", new game.Info(100, 5, "connected players"));

        // Load our level
        me.levelDirector.loadLevel("main");
    },

    onLevelLoaded : function (name) {
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.LEFT, "left");
        me.input.bindKey(me.input.KEY.SPACE, "jump");
        me.input.bindKey(me.input.KEY.Z, "attack");
        me.input.bindKey(me.input.KEY.X, "web");

        this.createPlayers();

        global.network.socket.on("move player", this.onMovePlayer);
        global.network.socket.on("remove player", this.onRemovePlayer);
        global.network.socket.on("pong", this.updateLatency);

        setInterval(function () {
            global.network.emitTime = +new Date;
            global.network.emits++;
            global.network.socket.emit('ping');
        }, 500);
    },

    onDestroyEvent: function () {
        // Unbind keys
        me.input.unbindKey(me.input.KEY.LEFT);
        me.input.unbindKey(me.input.KEY.RIGHT);
        me.input.unbindKey(me.input.KEY.SPACE);
        me.input.unbindKey(me.input.KEY.Z);
        me.input.unbindKey(me.input.KEY.X);
    },

    updateLatency: function() {
        // Simply updates the average latency
        global.network.totlatency += +new Date - global.network.emitTime
        global.network.latency = Math.round(global.network.totlatency/global.network.emits);
        me.game.HUD.setItemValue("latency", global.network.latency);
    },

    createPlayers: function(data) {
        // get spawn points (from server?)

        // Add player
        global.state.localPlayer = new game.Player(40, 190, {
            spritewidth: 50,
            spriteheight: 30,
            name:  global.state.playername
        });

        me.game.add(global.state.localPlayer, 4);

        var tempGlobalPlayers = []
        // loop through array and add everyone
        for(var i = 0; i < global.state.remotePlayers.length; i++) {
            tempGlobalPlayers.push(global.state.remotePlayers.pop());
        }

        for(var j = 0; j < tempGlobalPlayers.length; i++) {
            var tempPlayer = tempGlobalPlayers.pop();
            var newPlayer = new game.Player(45, 190, {
                spriteheight: 30,
                spritewidth :  50
            });
            newPlayer.name = tempPlayer.name;
            newPlayer.id = tempPlayer.id;

            me.game.add(newPlayer, 4);
            global.state.remotePlayers.push(newPlayer);
        }

        // Update the HUD with the number of players
        me.game.HUD.setItemValue("connected", (global.state.remotePlayers.length+1));
        me.game.sort();
    },

    onRemovePlayer: function(data) {
        // When a player disconnects, we find them in our remote players array
        var removePlayer = global.functions.playerById(data.id);

        if(!removePlayer) {
            console.log("Player not found "+data.id);
            return;
        };

        // and remove them from the screen
        me.game.remove(removePlayer);
        me.game.sort();
        global.state.remotePlayers.splice(global.state.remotePlayers.indexOf(removePlayer), 1);

        // and update the HUD
        me.game.HUD.setItemValue("connected", (global.state.remotePlayers.length+1));
    },

    onMovePlayer: function(data) {
        // When a player moves, we get that players object
        var movePlayer = global.functions.playerById(data.id);

        if(movePlayer.name != global.state.playername) {
            // if it isn't us, or we can't find it (bad!)
            if(!movePlayer) {
                return;
            }

            // update the players position locally
            movePlayer.pos.x = data.x;
            movePlayer.pos.y = data.y;
            movePlayer.vel.x = data.vX;
            movePlayer.vel.y = data.vY;
        }
    }
});
