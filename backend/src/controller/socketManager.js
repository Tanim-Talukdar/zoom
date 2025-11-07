import { Server } from "socket.io";

const connections = {};
const messages = {};
const timeOnline = {};

export const connectToSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["*"],
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        socket.on("join-call", (roomId) => {
            if (!connections[roomId]) {
                connections[roomId] = [];
            }

            connections[roomId].push(socket.id);
            timeOnline[socket.id] = new Date();

            // Notify existing users
            connections[roomId].forEach(clientId => {
                io.to(clientId).emit("user-joined", socket.id, connections[roomId]);
            });

            // Send chat history to new user
            if (messages[roomId]) {
                messages[roomId].forEach(msg => {
                    io.to(socket.id).emit("chat-message", msg.data, msg.sender, msg["socket-id-sender"]);
                });
            }
        });

        socket.on("signal", (toId, message) => {
            io.to(toId).emit("signal", socket.id, message);
        });

        socket.on("chat-message", (data, sender) => {
            const roomId = Object.keys(connections).find(
                room => connections[room].includes(socket.id)
            );

            if (roomId) {
                if (!messages[roomId]) messages[roomId] = [];

                messages[roomId].push({
                    sender,
                    data,
                    "socket-id-sender": socket.id
                });

                console.log("Message to", roomId, "from", sender, ":", data);

                connections[roomId].forEach(clientId => {
                    io.to(clientId).emit("chat-message", data, sender, socket.id);
                });
            }
        });

        socket.on("disconnect", () => {
            const duration = Math.abs(new Date() - timeOnline[socket.id]);

            const roomId = Object.keys(connections).find(
                room => connections[room].includes(socket.id)
            );

            if (roomId) {
                connections[roomId] = connections[roomId].filter(id => id !== socket.id);

                // Notify others
                connections[roomId].forEach(clientId => {
                    io.to(clientId).emit("user-left", socket.id);
                });

                // Clean up empty rooms
                if (connections[roomId].length === 0) {
                    delete connections[roomId];
                    delete messages[roomId];
                }
            }

            delete timeOnline[socket.id];
        });
    });

    return io;
};
