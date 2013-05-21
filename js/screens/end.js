game.EndScreen = me.ScreenObject.extend({
    "init" : function () {
        this.parent(true);

        this.font = new me.Font("Verdana", 14, "#fff", "center");
        this.font.textBaseline = "middle";
    },

    "onResetEvent" : function () {
        me.audio.playTrack("grocery", 0.75);
    },

    "onDestroyEvent" : function () {
    },

    "update" : function () {
        return true;
    },

    "draw" : function (context) {
        this.font.draw(context, "THE END", c.WIDTH / 2, c.HEIGHT / 2);

        this.parent(context);
    }
});
