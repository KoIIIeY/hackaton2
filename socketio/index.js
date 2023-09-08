import http from 'http';
import express from 'express';
import {Server} from 'socket.io';

import path from "path"
const __dirname = path.resolve();

const port = process.env.PORT || 3000;
const app = express();
const listen = http.Server(app);

const io = new Server(listen, {

});


const jsonParser = express.json();



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/plugin.js', (req, res) => {
    res.sendFile(__dirname + '/plugin/dist/sa-wd-voice-command.umd.js');
});

io.on('connection', (socket) => {

    socket.on('chat message', msg => {
        socket.emit('chat message', msg);
    });

});

app.post('/emit', jsonParser, (req, res) => {
    console.log('req body:', req.body);

    // io.emit('chat message', req.body.value?.delta?.content);
    io.in(req.body.user_id).emit('gpt', req.body);
    io.in(req.body.user_id).emit('chat message', req.body.value?.delta?.content);

    res.json(req.body);

});

listen.listen(port, '0.0.0.0', () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});
