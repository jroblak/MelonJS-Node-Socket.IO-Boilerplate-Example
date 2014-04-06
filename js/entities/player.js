game.Player = game.Entity.extend({
    init: function (x, y, settings) {
        this.parent(x, y, settings);
        this.setVelocity(4.0, 16.0);
        this.setFriction(0.5, 0.5);
        this.step = 0;
        this.id;
        this.moving = false;
        this.direction = 'right';
        this.font = new me.Font("Verdana", 10, "#000", "center");

        if(this.name === global.state.playername) {
            me.game.viewport.follow(this, me.game.viewport.AXIS.BOTH);
        }

        var names = [];

        /* Cool idea to steal
        var dirs = [ "left", "right", "up", "down" ];
        for (var j = 0; j < dirs.length; j++) {
            for (var i = 1; i <= 7; i++) {
                names.push("player-" + dirs[j] + "-" + i + ".png");
            }
            names.push("player-stand-"+dirs[j]+".png")
        }
        */

        names.push("spider-1.png");
        names.push("spider-2.png");
        names.push("spider-3.png");

        this.renderable = game.texture.createAnimationFromName(names);
        this.renderable.animationspeed = ~~(me.sys.fps / 30);

        this.renderable.addAnimation("stand-left", [0]);
        this.renderable.addAnimation("left", [
            0, 1, 2
        ]);

        this.renderable.addAnimation("stand-right", [0]);
        this.renderable.addAnimation("right", [
            0, 1, 2
        ]);

        this.renderable.setCurrentAnimation("stand-right");
    },

    update : function () {
        var self = this;
        this.step++;

        if(this.name === global.state.playername) {
            if(me.input.isKeyPressed("left")) {
                this.moving = true;
                this.direction = "left";
            } else if(me.input.isKeyPressed("right")) {
                this.moving = true;
                this.direction = "right";
            }

            if(me.input.isKeyPressed("jump") && !this.jumping && !this.falling) {
                this.jumping = true;
                this.vel.y = -this.accel.y * me.timer.tick;
            }

            if(me.input.isKeyPressed("attack")) {
                if(this.facing === "right") {
                    // shoot right
                } else {
                    // shoot left
                }
            }

        }

        me.game.collide(this, true);
        var result = this.parent();

        // check for collision with attack

        // Add step checking and interpolation instead of this
        if(this.name === global.state.playername && result) {
            global.network.socket.emit("move player", {x: this.pos.x, y: this.pos.y, vX: this.vel.x, vY: this.vel.y});
        }

        if(this.step > 99) {
            this.step = 0;
        }

        return result;
    },

    draw: function(context) {
            var self= this;
            this.font.draw(
                context,
                self.name,
                self.pos.x + 25,
                self.pos.y - 15
            );

            this.parent(context);
    }
});
