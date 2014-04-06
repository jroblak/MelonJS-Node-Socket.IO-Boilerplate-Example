game.roomScreen = me.ScreenObject.extend({
    init: function() {
        this.parent(true);
    },

    // Called every time we come to this screen
    onResetEvent: function() {
        // Set up our basic fonts / buttons
        this.font = new me.Font("Verdana", 12, "#fff", "center");
        this.readybutton = new game.Button(120, 480, "readybutton");

        // ..and add them to the screen
        me.game.add(this.readybutton, 4);
        me.game.add(new me.ColorLayer("background", "#333333", 1));

        // Set up additional socket handlers
        global.network.socket.on("new player", this.onNewPlayer);
        global.network.socket.on("remove player", this.onRemovePlayer);
        global.network.socket.on("statuschange", this.onStatusChange);
        global.network.socket.on("pong", this.updateLatency);
        global.network.socket.on("startgame", this.startGame);

        global.network.socket.emit("create player", {
            name: global.state.playername,
            room: global.network.room
        });

        me.game.sort();
    },

    onNewPlayer: function(data) {
        // When a new player connects, add them to array, and display their name
        if(data.name != global.state.playername) {
            var newPlayer = new game.Player(0, 0, {
                spritewidth: 50,
                spriteheight: 30
            });
            newPlayer.id = data.id;
            newPlayer.name = data.name;
            newPlayer.status = "No";

            global.state.remotePlayers.push(newPlayer);
        }
    },

    startGame: function() {
        me.state.change(me.state.PLAY);
    },

    onRemovePlayer: function(data) {
        // When a player disconnects, we find them in our remote players array
        var removePlayer = global.functions.playerById(data.id);

        if(!removePlayer) {
            console.log("Player not found "+data.id);
            return;
        };

        global.state.remotePlayers.splice(global.state.remotePlayers.indexOf(removePlayer), 1);
    },

    onStatusChange: function(data) {
        // When a player disconnects, we find them in our remote players array
        if(data.name != global.state.playername) {
            var player = global.functions.playerById(data.id);

            if(!player) {
                console.log("Player not found "+data.id);
                return;
            };

            player.status = data.status;
        }
    },

    update: function() {
        // if all ready, show the play button (eventually) - for now just change to play screen
        if(global.state.status === "READY") {
             for(var i = 0; i < global.state.remotePlayers.length; i++) {
                if(global.state.remotePlayers[i].status != "READY") {
                    break;
                }
                if(i === global.state.remotePlayers.length - 1) {
                    me.game.add(new game.Button(600, 480, "playbutton"), 4);
                    me.game.sort();
                }
             }
         }

         return true;
    },

    draw: function(context) {

        this.font.draw(
            context,
            global.network.room,
            global.WIDTH / 1.95,
            global.HEIGHT / 10
        );
        this.font.draw(
            context,
            "Player",
            global.WIDTH / 2.2,
            global.HEIGHT / 2.15
        );
        this.font.draw(
            context,
            "Ready?",
            global.WIDTH / 1.8,
            global.HEIGHT / 2.15
        );

        this.font.draw(
            context,
            global.state.playername,
            global.WIDTH / 2.2,
            global.HEIGHT / 2
        );

        this.font.draw(
            context,
            global.state.status,
            global.WIDTH / 1.8,
            global.HEIGHT / 2
        );

        if(global.state.remotePlayers.length > 0 ) {
            for(var i = 0; i < global.state.remotePlayers.length; i++) {
                var player = global.state.remotePlayers[i];
                // display remote player info
                this.font.draw(
                    context,
                    player.name,
                    global.WIDTH / 2.2,
                    (global.HEIGHT /  2) + ((i+1)*20)
                );
                this.font.draw(
                    context,
                    player.status,
                    global.WIDTH / 1.8,
                    (global.HEIGHT / 2) + ((i+1)*20)
                );
            };
        }
        this.parent(context);
    }
});
