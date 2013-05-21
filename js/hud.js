// mobile game pad: https://groups.google.com/forum/?fromgroups#!topic/melonjs/q1AEpldKq3g
game.Info = me.HUD_Item.extend({
    init : function (name, x, y, val, bg, fg) {
        this.parent(x, y, val);

        this.bg = bg;
        this.fg = fg;

        // Cache image for item name
        var font = new me.Font("Verdana", 18, "#fff", "left");
        font.bold();
        var ctx = me.video.createCanvasSurface(100, 20);
        this.label = ctx.canvas;
        this.label.width = font.measureText(ctx, name + ":").width;
        this.label.height = 20;

        ctx.shadowBlur = 3;
        ctx.shadowColor = "#000";
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        font.draw(ctx, name + ":", 0, 0);
    },

    draw : function (context) {
        var x = this.pos.x;
        var y = this.pos.y;

        context.save();

        // Draw border
        context.strokeStyle = context.fillStyle = "#004058";
        context.lineJoin = "round";
        context.lineWidth = 3;
        context.strokeRect(x + 0.5, y + 0.5, this.defaultvalue, 20);
        context.fillRect(x + 2, y + 2, this.defaultvalue, 17);

        // Setup clipping region for meter segments
        context.beginPath();
        for (var i = 0; i < this.defaultvalue; i += 16) {
            context.rect(x + 2 + i, y + 2, 13, 17);
        }
        context.clip();

        // Draw background color
        context.fillStyle = this.bg;
        context.fillRect(x + 2, y + 2, this.defaultvalue, 17);

        // Draw foreground color
        context.fillStyle = this.fg;
        context.fillRect(x + 2, y + 2, ~~this.value, 17);

        // Destroy clipping region
        context.restore();

        // Draw label
        context.drawImage(this.label, x, y - 24);
    }
});