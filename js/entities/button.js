/*
    TODO - Smaller, better buttons
*/
game.Button = me.GUI_Object.extend({
    init: function(x, y, type) {
        settings = {
            name: type,
            image: type,
            spritewidth: 380,
            spriteheight: 100
        };
        this.type = type
        this.playing = false;

        this.parent(x,y,settings);
    },

    onClick: function() {
        if(this.type === "joinbutton") {
            // Get input and make sure its a number
            var inp = $("#roominput :input").val().toString();
            if(!isNaN(parseFloat(inp) && isFinite(inp))) {
                global.network.room = inp;

                if(global.state.rooms.indexOf(inp) >= 0) {
                        var data = {
                            type: "join",
                            room: global.network.room
                        }
                        global.network.socket.emit("tryJoinCreate", data);
                } else {
                    // TODO - NO ROOM ERROR
                    console.log("[-] there isn't a room with that number");
                }
            } else {
               return;
                //  TODO - VALIDATION ERROR
                console.log("[-] invalid room input");
            }
        } else if (this.type === "createbutton") {
                var data = {
                    type: "create",
                    room:  ""
                }

                global.network.socket.emit("tryJoinCreate", data);
                me.game.remove(self);

        } else if (this.type === "readybutton") {
            if(global.state.status != "READY") {
                global.state.status = "READY";
                global.network.socket.emit("statuschange", {status: global.state.status});
            }
        } else if(this.type === "playbutton") {
            if(!this.playing) {
                global.network.socket.emit("startgame");
                this.playing = true;
            }
        }else {
            // throw error
        }

        return false;
    }
});