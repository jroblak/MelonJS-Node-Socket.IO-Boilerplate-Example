game.startScreen = me.ScreenObject.extend({
    init : function () {
        this.parent(true);
        this.font = new me.Font("Verdana", 12, "#fff", "center");
    },

    /* TO DOS:
            - Cool background effect(s)
            - New logo
            - Audio
     */

    onResetEvent : function () {
        var logo = new me.ImageLayer("logo", 0, 0, "logo", 2, 1);

        me.game.add(logo, 2);
        me.game.sort(game.sort);

        me.game.viewport.fadeOut("#000", 250);
    },

    onDestroyEvent : function () {
    },

    update: function () {
        if (me.input.isKeyPressed("action")) {
            me.game.viewport.fadeIn("#000", 500, function () {
                me.state.change(me.state.PLAY);
            });
        }

        return true;
    },

    draw: function (context) {
            var msg = (me.sys.isMobile ? "touch" : "enter") + " to start";

            this.font.draw(
                context,
                msg,
                global.WIDTH / 2,
                global.HEIGHT - 120
            );


            this.parent(context);
    }
});
