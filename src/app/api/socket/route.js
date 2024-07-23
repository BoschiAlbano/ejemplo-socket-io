import { NextResponse } from "next/server";
import { Server } from "socket.io";

export async function GET(req, res) {
    try {
        if (res.socket.server.io) {
            console.log("Socket is already running");
        } else {
            console.log("Socket is initializing");
            const io = new Server(res.socket.server);
            res.socket.server.io = io;

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
        }
        res.end();
    } catch (error) {
        return NextResponse.json(
            { mensaje: "Error, en el servidor" },
            { status: 400 }
        );
    }
}
