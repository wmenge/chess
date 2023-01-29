# Chess game

A simple browser based chess game that allows a local chess game. Most of the chess rules are implemented:
* Basic piece movements
* Basic castling (should be improved)
* Check / Checkmate / Stalemate (todo)
* En passant capturing (todo)

Planned features:
* Implement all rules
* Allow for consistent hinting of strategic choices
* Multiplayer games w/ some server component

## How to run

You will need a local webserver as the code will fetch json files from its own directories. This is not possible without a webserver as you will run into a ```"Not allowed to load local resources error"``` on modern browsers.

First, clone the repo. It's all plain vanilla javascript. 

### using Python:

If you have python installed, navigate to the /src/public directory and run:

```
$ python -m http.server 8000
```

Then you can access the game at http://0.0.0.0:8000

### using node.js

Navigate to the root of the repo and install the dependencies:

```
$ npm install
```

Run the server:
```
$ node src/static-server-app.js 
```

You can access the game at http://127.0.0.1:3000