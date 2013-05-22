game.Entity = me.ObjectEntity.extend({
    init: function (x, y, settings) {
        this.parent(x, y, settings);
    },

    update : function () {
        if (this.moving) {

            // Look into replacing this with dispatch tables
            // http://designpepper.com/blog/drips/using-dispatch-tables-to-avoid-conditionals-in-javascript
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

        if(this.jumping) {
            this.accel.y -= this.gravity * me.timer.tick;
            this.vel.y -= this.accel.y * me.timer.tick;
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
