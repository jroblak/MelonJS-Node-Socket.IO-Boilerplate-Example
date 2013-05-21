game.startScreen = me.ScreenObject.extend({
    init : function () {
        this.parent(true);
        this.step = 0;
    },

    /* TO DOS:
            - Cool effect(s)
            - New logo
            - Audio
     */

    onResetEvent : function () {

        this.font = new me.Font("Verdana", 16, "#000", "center");
        var logo = new me.ImageLayer("logo", 0, 0, "logo", 2, 1);

        me.game.add(logo, 2);
        me.game.sort(game.sort);

        me.game.viewport.fadeOut("#000", 250);

        // Bind keys for touch screen

        var vp = me.game.viewport;
        me.input.registerMouseEvent("mousedown", vp, function () {
            me.input.triggerKeyEvent(me.input.KEY.ENTER, true);
        }, true);
        me.input.registerMouseEvent("mouseup", vp, function () {
            me.input.triggerKeyEvent(me.input.KEY.ENTER, false);
        }, true);
    },

    onDestroyEvent : function () {
        if (me.sys.isMobile) {
            me.input.triggerKeyEvent(me.input.KEY.ENTER, false);
            var vp = me.game.viewport;
            me.input.releaseMouseEvent("mousedown", vp);
            me.input.releaseMouseEvent("mouseup", vp);
        }
    },

    update: function () {
        if (me.input.isKeyPressed("action")) {
            me.game.viewport.fadeIn("#000", 500, function () {
                me.state.change(me.state.PLAY);
            });
        }

        this.step++;

        return true;
    },

    draw: function (context) {
        if (((this.step / 20) & 3) !== 0) {
            var msg = (me.sys.isMobile ? "touch" : "enter") + " to Start";

            context.shadowBlur = 3;
            context.shadowColor = "#000";
            context.shadowOffsetX = 2;
            context.shadowOffsetY = 2;

            this.font.draw(
                context,
                msg,
                global.WIDTH / 2,
                global.HEIGHT - 120
            );

            context.shadowColor = "rgba(0,0,0,0)";
        }

        this.parent(context);
    }
});
