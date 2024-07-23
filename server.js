// server.js
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const socketIo = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    });

    const io = socketIo(server);

    io.on("connection", (socket) => {
        console.log("New client connected");

        socket.on("message", (data) => {
            console.log("Message received: ", data);
            io.emit("message", data); // Broadcast the message to all clients
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });
    });

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, (err) => {
        if (err) throw err;
        console.log(`Server running on http://localhost:${PORT}`);
    });
});
