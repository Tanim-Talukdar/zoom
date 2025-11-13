import { useState, useRef, useEffect } from "react";
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
  const [stream, setStream] = useState(null);
  const peers = useRef({}); // Store all user peer connections

  const videoRef = useRef(null);
  const socketRef = useRef();
  const roomId = window.location.href;
  const serverUrl = "http://localhost:8000/";
  const navigate = useNavigate();

  var connections = {};

  const peerConfigConnections = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  // ✅ Take permission & show preview
  useEffect(() => {
const getMedia = async () => {
  try {
    const userStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setStream(userStream);
    if (videoRef.current) {
      videoRef.current.srcObject = userStream;
    }
  } catch (err) {
    console.error("Media error:", err);

    // Allow joining even without media
    if (err.name === "NotAllowedError") {
      alert("You denied camera/microphone access. Joining without video/audio.");
    } else if (err.name === "NotFoundError") {
      alert("No camera or microphone found. Joining without video/audio.");
    } else {
      alert("Could not access media devices. Joining without video/audio.");
    }

    // Continue joining logic (without stream)
    setStream(null); // or handle no-media join
  }
};
    getMedia();
  }, []);

  const connect = () => {
    if (!username) return alert("Enter name first");
    const socket = io(serverUrl);
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to server, socket id:", socket.id);
      setConnected(true);

      socketRef.current.emit("join-call", roomId);

      socketRef.current.on("user-joined", async (newUserId, clients) => {
        setUsers(clients);
        if (stream) {
          const peer = new RTCPeerConnection(peerConfigConnections);

          // Send your video/audio tracks
          stream.getTracks().forEach((track) => peer.addTrack(track, stream));

          // When you get remote video
          peer.ontrack = (event) => {
            const remoteVideo = document.createElement("video");
            remoteVideo.srcObject = event.streams[0];
            remoteVideo.autoplay = true;
            remoteVideo.playsInline = true;
            remoteVideo.style.width = "200px";
            document.body.appendChild(remoteVideo);
          };

          // ICE candidate sending
          peer.onicecandidate = (event) => {
            if (event.candidate) {
              socketRef.current.emit("ice-candidate", {
                target: newUserId,
                candidate: event.candidate,
              });
            }
          };

          // Create an offer and send it
          const offer = await peer.createOffer();
          await peer.setLocalDescription(offer);

          socketRef.current.emit("offer", {
            target: newUserId,
            caller: socketRef.current.id,
            sdp: peer.localDescription,
          });

          peers.current[newUserId] = peer;
        }
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
      navigate("/");
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      {!connected ? (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Enter into Lobby
          </Typography>

          {/* ✅ Local video preview before connect */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: "100%",
              borderRadius: "10px",
              backgroundColor: "#000",
              marginBottom: "1rem",
            }}
          ></video>

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
