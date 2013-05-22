// Simple HUD item to output text
game.Info = me.HUD_Item.extend({
    init : function (x, y, name) {
        this.parent(x, y);
        this.name = name;
        this.value = 0;
        this.font = new me.Font("Verdana", 12, "#fff", "left");
        this.font.bold();
    },

    draw : function (context,x , y) {
        this.font.draw(context, this.name+":", this.pos.x + x, this.pos.y + y)
        this.font.draw(context, this.value, this.pos.x +(x+this.name.length*8), this.pos.y+y)
    }
});