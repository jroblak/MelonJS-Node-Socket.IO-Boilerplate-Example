game.Virgil = game.Entity.extend({
    init: function (x, y, settings) {
        this.parent(x, y, settings);

       // this.renderable = game.texture.createAnimationFromName(["virgil.png"]);
       // this.renderable.addAnimation("stand", [0]);

       // this.renderable.setCurrentAnimation("stand");
    },

    update : function () {
        var self = this;
        /*
        me.game.collide(this, true);

        var res = this.collide();

        if(res && (res.obj.name === "player"))
        {
            // DISABLE MOVEMENT
            // HUD TEXT POPUP
        }
        */
    }
});
