Multiplayer melonJS with *node and socket.io*
===========

A simple online multiplayer game powered by melonJS, node.js, and socket.io - feel free to use / build on / steal / etc

Includes a basic menu screen, game creation, pre-game lobby where players can join and indicate they're ready, basic game networking code, and some helpful things like a latency / player count HUD in game and server logging for major events.

To run locally, you must have a local server to server the game itself (i.e. MAMP, WAMP, etc), and then start the server by running the command 'node server.js' in /server

Also included is a start script in the /server folder, which will run the server in the background indefinitely for deployment (while also logging, etc).

The requirementss:
- NodeJS
- NPM
- Socket.io
- Express
- Optional: Forever (for the start / stop script)

..should all be included in the server folder. If not, install node/npm via http://nodejs.org/, install the
dependencies in the /server folder via npm install [name].
