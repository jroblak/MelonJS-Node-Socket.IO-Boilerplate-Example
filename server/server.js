var app       = require('express')(),
server         = require('http').createServer(app),
io                  = require('socket.io').listen(server),
Player           = require("./Player").Player;
var util         = require("util");
var port         = 8080;

var players;

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
    io.sockets.on("connection", onSocketConnection);
};

function onSocketConnection(client) {
    client.on("disconnect", onClientDisconnect);
    client.on("new player", onNewPlayer);
    client.on("move player", onMovePlayer);
    client.on("ping", pong);
};

function pong() {
    this.emit("pong");
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
    util.log("New player has connected: "+(players.length+1));
    // Make new server data for Player
    var newPlayer = new Player(data.x, data.y, data.vX, data.vY);
    newPlayer.id = this.id;
    newPlayer.easyid = players.length + 1;

    if(playerByID(this.id)) {
        return;
    }

    // Let the existing players know there is a new player
    this.broadcast.emit("new player", {id: newPlayer.id, name:newPlayer.easyid, x: newPlayer.getX(), y: newPlayer.getY(), vX: newPlayer.getvX(), vY: newPlayer.getvY()});

    // Loop through existing players and send to current player
    var i, existingPlayer;
    util.log("Current players: ");
    util.log(newPlayer.easyid);
    for(i = 0; i < players.length; i++) {
        existingPlayer = players[i];
        util.log(existingPlayer.easyid);
        this.emit("new player", {id: existingPlayer.id, name:existingPlayer.easyid, x: existingPlayer.getX(), y: existingPlayer.getY(), vX: existingPlayer.getvX(), vY: existingPlayer.getvY()});
    };

    // Add new player to array
    players.push(newPlayer);

    util.log("There are now "+players.length+" clients connected.")
};

function onMovePlayer(data) {
    var movePlayer = playerByID(this.id);

    if(!movePlayer) {
        util.log("MOVE ERROR: Player not found: "+this.easyid);
        return;
    }

    movePlayer.setX(data.x);
    movePlayer.setY(data.y);
    movePlayer.setvX(data.vX);
    movePlayer.setvY(data.vY);

    this.broadcast.emit("move player", {id: movePlayer.id, x:movePlayer.getX(), y:movePlayer.getY(), vX: movePlayer.getvX(), vY: movePlayer.getvY()});
};

io.configure(function() {
    io.set("transports", ["websocket"]);
    // At 3 for debugging
    io.set("log level", 3)
});

server.listen(port);

init();

