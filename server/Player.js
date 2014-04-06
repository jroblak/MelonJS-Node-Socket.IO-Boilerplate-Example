var Player = function(id, name, room) {
    var x = 0,
        y = 0,
        id = id,
        vX = 0,
        vY = 0,
        name = name,
        room = room;

    var getX = function() {
        return x;
    };

    var getY = function() {
        return y;
    };

    var setX = function(newX) {
        x = newX;
    };

    var setY = function(newY) {
        y = newY;
    };

    var getvX = function() {
        return vX;
    };

    var getvY = function() {
        return vY;
    };

    var setvX = function(newvX) {
        vX = newvX;
    };

    var setvY = function(newvY) {
        vY = newvY;
    };

    return {
        getX: getX,
        getY: getY,
        setX: setX,
        setY: setY,
        getvX: getvX,
        getvY: getvY,
        setvX: setvX,
        setvY: setvY,
        id: id,
        name: name,
        room:room
    }
};

exports.Player = Player;
