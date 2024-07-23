"use client";
// pages/index.js
import { useEffect, useState } from "react";
import io from "socket.io-client";

let socket;

export default function Home() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Fetch para inicializar la conexión de socket
        fetch("/api/socket").then(() => {
            if (!socket) {
                socket = io();

                socket.on("message", (data) => {
                    setMessages((prevMessages) => [...prevMessages, data]);
                });
            }
        });

        // Limpiar los listeners y desconectar el socket cuando el componente se desmonte
        return () => {
            if (socket) {
                socket.off("message"); // Limpiar el listener
                socket.disconnect();
                socket = null;
            }
        };
    }, []);

    const sendMessage = () => {
        if (message) {
            socket.emit("message", message);
            setMessage("");
        }
    };

    return (
        <div>
            <h1>Chat</h1>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}
