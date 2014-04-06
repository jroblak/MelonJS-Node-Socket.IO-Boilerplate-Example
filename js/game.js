/*
    TODO - Refactor globals into more logical chunks
*/
var global = {
    WIDTH: 1136,
    HEIGHT: 640,
    DEBUG: true,
    network: {
        socket: undefined,
        host: "localhost",
        port: 8080,
        totlatency: 0,
        latency: 0,
        emitTime: 0,
        emits: 0,
        room: ""
    },
    state: {
        playername: "",
        localPlayer: undefined,
        remotePlayers: [],
        rooms: [],
        status: "No"
    },
    functions: {
        playerById: function(id) {
            var i;

            for (i = 0; i < global.state.remotePlayers.length; i++) {
                if (global.state.remotePlayers[i].id === id)
                    return global.state.remotePlayers[i];
            };

            return false;
        }
    }
}

var game = {
    onload: function() {
        if (!me.video.init("screen", global.WIDTH, global.HEIGHT, global.DOUBLE)) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        me.sys.preRender = true;
        me.sys.useNativeAnimFrame = true;
        me.sys.stopOnAudioError = false;

        me.debug.renderCollisionMap = global.DEBUG;
        me.debug.renderHitBox = global.DEBUG;
        me.debug.renderVelocity = global.DEBUG;
        me.sys.pauseOnBlur = !global.DEBUG;

        me.loader.onload = this.loaded.bind(this);
        this.loadResources();

        // Start loading / load screen
        me.state.set(me.state.LOADING, new game.loadScreen());
        me.state.change(me.state.LOADING);
    },

    // Awesome resource loading function stolen from Jason Oster
    loadResources: function () {
        var resources = [];

        // Graphics.
        this.resources["img"].forEach(function forEach(value) {
            resources.push({
                name: value,
                type: "image",
                src : "assets/img/" + value + ".png"
            })
        });

        // Atlases.
        this.resources["tps"].forEach(function forEach(value) {
            resources.push({
                name  : value,
                type  : "tps",
                src   : "assets/img/" + value + ".json"
            })
        });

        // Maps.
        this.resources["map"].forEach(function forEach(value) {
            resources.push({
                 name  : value,
                 type  : "tmx",
                 src   : "assets/maps/" + value + ".json"
            })
        });

        // Load the resources.
        me.loader.preload(resources);
    },

    loaded : function () {
        // Game states
        me.state.LOBBY = me.state.USER + 0;
        me.state.ROOM = me.state.USER + 1;

        me.state.set(me.state.MENU, new game.startScreen());
        me.state.set(me.state.ROOM, new game.roomScreen());
        me.state.set(me.state.LOBBY, new game.lobbyScreen());
        me.state.set(me.state.PLAY, new game.playScreen());

        me.input.bindKey(me.input.KEY.ENTER, "action");

        // Load texture.
        game.texture = new me.TextureAtlas(
            me.loader.getAtlas("texture"),
            me.loader.getImage("texture")
        );

        me.game.sort(game.sort);

        // Start the game.
        me.state.change(me.state.MENU);
    },
};
