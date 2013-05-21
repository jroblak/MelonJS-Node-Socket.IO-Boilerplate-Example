var io           = require('socket.io'),
Player           = require("./Player").Player;
var util         = require("util");
var port         = 8000;

var socket, players;

function init() {
    players = [];
    setEventHandlers();
}

function playerByID(id) {
    var i;
    for (i = 0; i < players.length; i++) {
        if(players[i].id === id)
            return players[i];
    };

    return false;
};

var setEventHandlers = function() {
    socket.sockets.on("connection", onSocketConnection);
};

function onSocketConnection(client) {
    util.log("New player has connected: "+client.id);
    client.on("disconnect", onClientDisconnect);
    client.on("new player", onNewPlayer);
    client.on("move player", onMovePlayer);
};

function onClientDisconnect() {
    util.log("Player has disconnected: "+this.id);
    var removePlayer = playerByID(this.id);

    if(!removePlayer) {
        util.log("DISCONNECT ERROR: Player not found: "+this.id);
        return;
    }

    players.splice(players.indexOf(removePlayer), 1);
    this.broadcast.emit("remove player", {id: this.id});
};

function onNewPlayer(data) {
    // Make new server data for Player
    var newPlayer = new Player(data.x, data.y);
    newPlayer.id = this.id;

    // Let the existing players know there is a new player
    this.broadcast.emit("new player", {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()});

    // Loop through existing players and send to current player
    var i, existingPlayer;
    util.log("Current players: ");
    util.log(newPlayer.id);
    for(i = 0; i < players.length; i++) {
        existingPlayer = players[i];
        util.log(existingPlayer.id);
        this.emit("new player", {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY()});
    };

    // Add new player to array
    players.push(newPlayer);
};

function onMovePlayer(data) {
    var movePlayer = playerByID(this.id);

    if(!movePlayer) {
        util.log("MOVE ERROR: Player not found: "+this.id);
        return;
    }

    movePlayer.setX(data.x);
    movePlayer.setY(data.y);

    this.broadcast.emit("move player", {id: movePlayer.id, x:movePlayer.getX(), y:movePlayer.getY()});
};


socket = io.listen(port);

socket.configure(function() {
    socket.set("transports", ["websocket"]);
    socket.set("log level", 2)
});

init();

