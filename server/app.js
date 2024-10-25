const express = require('express');
const app = express();
const http = require('http');
const path = require('path');

const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle socket connection
io.on('connection', function (socket) {
    socket.on("send-location" , function (data) {
        io.emit("receive-location", {id: socket.id , ...data })
    })
    console.log("User connected");

    // You can handle events here (e.g., messages, location updates, etc.)
});

// Serve the main index page
app.get('/', function (req, res) {
    res.render('index');
});

// Start the server on port 4000
server.listen(4000, () => {
    console.log('Server running on port 4000');
});
