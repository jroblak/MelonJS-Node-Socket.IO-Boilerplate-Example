game.Attack = me.SpriteObject.extend({
    init: function(x, y, type) {
        settings = {
            name: type,
            image: type,
            spritewidth: 380,
            spriteheight: 100
        };

        this.parent(x,y,settings);
    },

    update: function() {
        // move attack
    }
});
