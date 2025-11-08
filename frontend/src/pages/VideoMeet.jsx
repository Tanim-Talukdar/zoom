import { useState, useRef } from "react";
import { io } from "socket.io-client";
import TextField from "@mui/material/TextField";
import { Button, Box, Typography, Paper, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function VideoMeet() {
  const [username, setUsername] = useState("");
  const [connected, setConnected] = useState(false);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const socketRef = useRef();
  const roomId = window.location.href;
  const serverUrl = "https://zoom-58ot.onrender.com/";
  const navigate = useNavigate()

  const connect = () => {
    if (!username) return alert("Enter name first");
    const socket = io(serverUrl);
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to server, socket id:", socket.id);
      setConnected(true);

      socketRef.current.emit("join-call", roomId);

      socketRef.current.on("user-joined", (newUserId, clients) => {
        setUsers(clients);
      });

      socketRef.current.on("chat-message", (message, sender, socketId) => {
        const newMsg = { sender: sender, text: message, socketId: socketId };
        setMessages((prevMessages) => [...prevMessages, newMsg]);
      });
    });
  };

  const sendMessage = () => {
    if (!message) return;
    socketRef.current.emit("chat-message", message, username);
    setMessage("");
  };

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      navigate("/")
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      {!connected ? (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Enter into Lobby
          </Typography>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button fullWidth variant="contained" onClick={connect}>
            Connect
          </Button>
        </Paper>
      ) : (
        <Box>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6">Connected as: {username}</Typography>
              <Button variant="outlined" color="error" onClick={disconnect}>
                Leave
              </Button>
            </Stack>

            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
              Connected Users:
            </Typography>
            <Box
              sx={{
                maxHeight: 150,
                overflowY: "auto",
                border: "1px solid lightgray",
                borderRadius: 1,
                p: 1,
                backgroundColor: "#f5f5f5",
              }}
            >
              {users.map((userId, index) => (
                <Typography key={index} sx={{ mb: 0.5 }}>
                  {userId}
                </Typography>
              ))}
            </Box>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Chat
            </Typography>
            <Box
              sx={{
                maxHeight: 200,
                overflowY: "auto",
                border: "1px solid lightgray",
                borderRadius: 1,
                p: 1,
                mb: 1,
                backgroundColor: "#f9f9f9",
              }}
            >
              {messages.map((msg, index) => (
                <Box key={index} sx={{ mb: 1 }}>
                  <Typography variant="subtitle2">{msg.sender}:</Typography>
                  <Typography variant="body2">{msg.text}</Typography>
                </Box>
              ))}
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Enter Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button variant="contained" onClick={sendMessage}>
                Send
              </Button>
            </Box>
          </Paper>
        </Box>
      )}
    </Box>
  );
}
