const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const cors = require('cors');

// Create express app & use cors
const app = express();
app.use(cors());

// Create http server
const server = http.createServer(app);

// Create instance of socket.io server
const io = new Server(server, {
	cors: {
		origin: '*',
	},
});

let choices = { p1Choice: null, p2Choice: null };
let rooms = [];
let players = {}
let leaderboard = [];

io.on('connection', socket => {
	socket.on('create-room', ({username, room}) => {
		const roomItem = { id: username, name: room, score: 0 };
		io.emit('available-rooms', rooms.filter(roomItem => roomItem.id !== username));
    rooms.push(roomItem);
		players[socket.id] = { username: username, score: 0 };
		updateLeaderboard();
  });
	socket.on('get-available-rooms', (username) => {
		io.emit('available-rooms', rooms.filter(roomItem => roomItem.id !== username));
	})

	// Listen join-room event
	socket.on('join-room', ({room, username}) => {
		// Connect the socket to the specified room
		socket.join(room);
		players[socket.id] = { username: username, score: 0 };
		updateLeaderboard()
		// Emit connected event to the client
		io.to(room).emit('connected');

		// Get users at a particular room
		let roomSockets = io.sockets.adapter.rooms.get(room);
		let users = roomSockets ? [...roomSockets.keys()] : [];

		// If users add to 3, emit error message & remove out the 3rd person
		users.length === 3 &&
			io.to(socket.id).emit('full', `Sorry! two players are already in this room. game is on`) &&
			socket.leave(room);

		roomSockets = io.sockets.adapter.rooms.get(room);
		users = roomSockets ? [...roomSockets.keys()] : [];

		// Emit updated users to the client
		io.to(room).emit('updated-users', users);

		// Listen game-play event & emit the status to the opponent excluding the sender
		socket.on('game-play', () => {
			socket.broadcast.to(room).emit('status', 'Opponent picked! Your turn.');
		});

		// Listen restart event & emit the restart-message to the opponent excluding the sender
		socket.on('restart', () => {
			socket.broadcast.to(room).emit('restart-message', 'Opponent wants to play again');
		});

		// Listen disconnect event & emit the disconnected event to the opponent excluding the sender
		socket.on('disconnect', () => {
			delete players[socket.id];
			roomSockets = io.sockets.adapter.rooms.get(room);
			users = roomSockets ? [...roomSockets.keys()] : [];
      if (
        users.length === 0 ||
        (users.length == 1 &&
          username == rooms.find(({ name }) => room == name))
      ) {
        rooms.splice(
          rooms.findIndex((roomItem) => roomItem.id === username),
          1
        );
			}
			updateLeaderboard();
			socket.broadcast.to(room).emit('disconnected', 'Opponent left the game');
		});

		// Listen p1Choice event & choose the winner if p2Choice has picked his choice
		socket.on('p1Choice', data => {
			const { choice, room } = data;
			choices['p1Choice'] = choice;

			io.to(room).emit('p1Choice', { choice });
			console.log(choices);
			choices.p2Choice !== null && declareWinner(room);
		});

		// Listen p2Choice event & choose the winner if p1Choice has picked his choice
		socket.on('p2Choice', data => {
			const { choice, room } = data;
			choices['p2Choice'] = choice;

			io.to(room).emit('p2Choice', { choice });

			console.log(choices);
			choices.p1Choice !== null && declareWinner(room);
		});
	
		// When a player's score changes
		socket.on('update-score', () => {
			if (players[socket.id]) {
				players[socket.id].score++;
				updateLeaderboard();
			}
		});
	});
});

// Function to send the leaderboard to all clients
function updateLeaderboard() {
	leaderboard = Object.values(players)
	.sort((a, b) => b.score - a.score) // Sort players by score
	.map(player => ({ username: player.username, score: player.score })); // Extract username and score
	
	io.emit('leaderboard', leaderboard);
}
/**
 * Declare winner among two players
 * @param {string} room - Room containing two sockets(players)
 * @return void
 */

const declareWinner = room => {
	const player1 = choices['p1Choice'];
	const player2 = choices['p2Choice'];
	let winner = '';

	if (player1 === 'scissors') {
		if (player2 === 'scissors') winner = 'draw';
		else if (player2 === 'paper' || player2 === 'lizard') winner = 'player1';
		else winner = 'player2';
	} else if (player1 === 'paper') {
		if (player2 === 'paper') winner = 'draw';
		else if (player2 === 'rock' || player2 === 'spock') winner = 'player1';
		else winner = 'player2';
	} else if (player1 === 'rock') {
		if (player2 === 'rock') winner = 'draw';
		else if (player2 === 'lizard' || player2 === 'scissors') winner = 'player1';
		else winner = 'player2';
	} else if (player1 === 'lizard') {
		if (player2 === 'lizard') winner = 'draw';
		else if (player2 === 'spock' || player2 === 'paper') winner = 'player1';
		else winner = 'player2';
	} else if (player1 === 'spock') {
		if (player2 === 'spock') winner = 'draw';
		else if (player2 === 'scissors' || player2 === 'rock') winner = 'player1';
		else winner = 'player2';
	} else winner = 'draw';

	// Emit the result to the client
	io.to(room).emit('result', { winner: winner });

	// Reset choices object
	choices = { p1Choice: null, p2Choice: null };
};

server.listen(4000, () => {
	console.log(`Server running on Port 4000`);
});
