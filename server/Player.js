var Player = function(startX, startY, velX, velY) {
    var x = startX,
        y = startY,
        id,
        vX = velX,
        vY = velY,
        easyid;

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
        easyid: easyid
    }
};

exports.Player = Player;