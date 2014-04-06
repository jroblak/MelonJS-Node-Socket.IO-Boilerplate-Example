// Set up machinery
var app      = require('express')(),
server         = require('http').createServer(app),
io                  = require('socket.io').listen(server),
Player         = require("./Player").Player,
util           = require("util");
var port      = 8080;

var players, rooms;

function init() {
    players = [];
    rooms = [];
    setEventHandlers();
}

// Helper function to get a player's reference by their GUID
function playerByID(id) {
    var i;
    for (i = 0; i < players.length; i++) {
        if(players[i].id === id)
            return players[i];
    };

    return false;
};

//  Main handler that fires on client connection
var setEventHandlers = function() {
    io.sockets.on("connection", onSocketConnection);
};

// Set up main handlers for each client that connects
function onSocketConnection(client) {
    client.on("disconnect", onClientDisconnect);
    client.on("create player", onCreatePlayer);
    client.on("move player", onMovePlayer);
    client.on("ping", pong);
    client.on("statuschange", onStatusChange);
    client.on("getrooms", sendRooms);
    client.on("tryJoinCreate", onJoinCreateRoom)
    client.on("startgame", onStartGame)
};

function onStartGame() {
    util.log("broadcasting to room: STARTGAME");
    io.sockets.in(playerByID(this.id).room).emit("startgame");
};

// Emits the room list to the client that requested it
function sendRooms(client) {
    this.emit("sendrooms", {roomlist: rooms});
};

// Function that handles room joining
function joinRoom(client, room) {
    // If the room input is not blank, and it exists in the roomlist array, join it,
    // otherwise throw error
    if(room != "" && rooms.indexOf(room) > -1) {
        client.join(room);
        return room;
    } else {
        return "fail";
    }
};

// Function that handles room creation
function createRoom(client) {
    // Generate random room name, push it to the room list, and enter room
    var newroom = Math.random().toString().substring(4).slice(0,3);
    rooms.push(newroom)
    client.join(newroom);
    return newroom;
};

// Simple function for client-side latency calculation
function pong() {
    this.emit("pong");
};

// Function to handle client disconnection. Removes the player from the player list array
/*
    TODO - Fix error in room removal
*/
function onClientDisconnect() {
    util.log("Player has disconnected: "+this.id);
    var removePlayer = playerByID(this.id);

    if(!removePlayer) {
        util.log("DISCONNECT ERROR: Player not found: "+this.id);
        return;
    }

    // If the room is empty, remove the room and tell the players,
    // if not, just tell the players the player has left
    util.log(io.sockets.clients(removePlayer.room));
     if(io.sockets.clients(removePlayer.room) === []) {
        this.broadcast.emit("rroom", {room: removePlayer.room});
        rooms.splice(rooms.indexOf(removePlayer.room), 1);
    } else {
        io.sockets.in(removePlayer.room).emit("remove player", {id: this.id});
    }

    players.splice(players.indexOf(removePlayer), 1);
};

function onJoinCreateRoom(data) {
    // Attempt to join or create a room
    if(data.type === "join") {
        this.room = joinRoom(this, data.room);
        // If we fail to join a rom, emit an error message to the client
        if(this.room === "fail") {
            this.emit("noroom");
            return;
        }
        this.emit("joincreateconfirm", {room: this.room});
        // If we create a room, broadcast it to all clients so they can join
    } else {
        this.room = createRoom(this);
        this.emit("joincreateconfirm", {room: this.room});
        this.broadcast.emit("croom", {room: this.room});
        util.log(this.room);
    }
};

// Function called whenever a new player is "created" on the client
function onCreatePlayer(data) {
    // Set up server side data for player
    var newPlayer = new Player(this.id, data.name, data.room);

    if(playerByID(this.id)) {
        return;
    }

    // Let the existing players in room know there is a new player
    // TODO -- Add room number to this / Player class
    io.sockets.in(newPlayer.room).emit("new player", {
                                                                id: newPlayer.id,
                                                                name:newPlayer.name
                                                            });

    // Loop through existing players and send to current player
    var i, existingPlayer;
    util.log("Current players: ");
    util.log(newPlayer.name);
    for(i = 0; i < players.length; i++) {
        existingPlayer = players[i];
        if(existingPlayer.room === newPlayer.room) {
            util.log(existingPlayer.name);
            // TODO -- Add room number to this / Player class on client
            this.emit("new player", {
                                id: existingPlayer.id,
                                name:existingPlayer.name
                            });
            }
        }

    // Add new player to array
    players.push(newPlayer);

    util.log("There are now "+players.length+" clients connected.")
};

// Function called whenever one of our clients moves
function onMovePlayer(data) {
    var movePlayer = playerByID(this.id);

    if(!movePlayer) {
        util.log("MOVE ERROR: Player not found: "+this.id);
        return;
    }

    movePlayer.setX(data.x);
    movePlayer.setY(data.y);
    movePlayer.setvX(data.vX);
    movePlayer.setvY(data.vY);

    io.sockets.in(movePlayer.room).emit("move player", {
                                                                    id: movePlayer.id,
                                                                    x:movePlayer.getX(),
                                                                    y:movePlayer.getY(),
                                                                    vX: movePlayer.getvX(),
                                                                    vY: movePlayer.getvY()
                                                                });
};

// Fired every time a client hits the "READY" button in a game room
function onStatusChange(data) {
    var player = playerByID(this.id);

    if(!player) {
        util.log("STATUS ERROR: Player not found "+this.id)
    }
    util.log(player.name);
    io.sockets.in(player.room).emit("statuschange", {id: this.id, status: "READY", name: player.name});
};

// Socket configuration
io.configure(function() {
    io.set("transports", ["websocket"]);
    io.set("log level", 2)
});

// Start our server
server.listen(port);

init();

