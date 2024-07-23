"use client";
// pages/index.js
import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io();

export default function Home() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.on("message", (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        return () => {
            socket.off("message");
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
