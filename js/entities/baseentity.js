game.Entity = me.ObjectEntity.extend({
    init: function (x, y, settings) {
        this.parent(x, y, settings);
    },

    update : function () {
        if (this.moving) {

            switch (this.direction) {
                case "left":
                    if (!this.renderable.isCurrentAnimation("left"))
                        this.renderable.setCurrentAnimation("left");
                    this.moving = false;
                    this.vel.x -= this.accel.x * me.timer.tick;
                    break;

                case "right":
                   if (!this.renderable.isCurrentAnimation("right"))
                        this.renderable.setCurrentAnimation("right");
                    this.moving = false;
                    this.vel.x += this.accel.x * me.timer.tick;
                    break;
            }

        }

        this.updateMovement();

        if (this.vel.x || this.vel.y) {
            this.parent();
            return true;
        }

        if (!this.renderable.isCurrentAnimation("stand-" + this.direction)) {
            this.renderable.setCurrentAnimation("stand-" + this.direction);
            return true;
        }

        return false;
    }
});
