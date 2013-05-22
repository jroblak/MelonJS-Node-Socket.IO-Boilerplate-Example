// Simple loading screen
game.loadScreen = me.ScreenObject.extend({
    init : function () {
        this.parent(true);

        this.redraw = false;
        this.handler = null;
        this.loadPercent = 0;
    },

    onResetEvent : function () {
        this.handler = me.event.subscribe(
            me.event.LOADER_PROGRESS, this.onProgressUpdate.bind(this)
        );
    },

    onDestroyEvent : function () {
        me.event.unsubscribe(this.handler);
    },

    onProgressUpdate: function (progress) {
        this.loadPercent = progress;
        this.redraw = true;
    },

    update : function () {
        if (this.redraw) {
            this.redraw = false;
            return true;
        }

        return false;
    },

    draw : function (context) {
        me.video.clearSurface(context, "#000");

        // font / text logo
        context.fillStyle="darkred";
        context.font = '24px Sans-Serif';
        context.textBaseline = 'Top';
        context.fillText('oblak', 25, 315);
        context.font = 'Bold 32px Sans-Serif';
        context.textBaseline = 'Top';
        context.fillText('games', 85, 315);

        // progress bar
        var gradient=context.createLinearGradient(0, 0, 196, 0);
        gradient.addColorStop(0, "black");
        gradient.addColorStop(1, "darkred");
        var progress = Math.floor(this.loadPercent * global.WIDTH);
        context.fillStyle = gradient;
        context.fillRect(25, 325, progress - 4, 4);
    }
});
