// Globals
var global = {
    WIDTH: 1136,
    HEIGHT: 640,
    DOUBLE: true,
    DEBUG: true,
    network: {
        host: "http://ec2-54-234-85-69.compute-1.amazonaws.com",
        port: 80,
        totlatency: 0,
        latency: 0,
        emitTime: 0,
        emits: 0
    },
    state: {
        localPlayer: undefined,
        remotePlayers: []
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
        me.state.set(me.state.MENU, new game.startScreen());
        game.playscreen = new game.playScreen();
        me.state.set(me.state.PLAY, game.playscreen);

        me.input.bindKey(me.input.KEY.ENTER, "action");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.LEFT, "left");
        me.input.bindKey(me.input.KEY.SPACE, "jump");

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
