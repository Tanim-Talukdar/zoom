import React, { useRef, useEffect, useState } from 'react';
import { io } from 'socket.io-client'; 
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';


const connections = {};

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
}

export default function VideoMeet() {
    const socketRef = useRef();
    const localVideoRef = useRef();

    const [askUserName, setAskUserName] = useState(true);
    const [videoAvailable, setVideoAvailable] = useState();
    const [audioAvailable, setAudioAvailable] = useState();
    const [screenAvailable, setScreenAvailable] = useState();
    const [userName, setUsername] = useState();
    const [video, setVideo] = useState();
    const [audio, setAudio] = useState();


    const server = "http://localhost:8000";

const getPermission = async () => {
    try {
            const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoPermission) {
                setVideoAvailable(true);
                console.log('Video permission granted');
            } else {
                setVideoAvailable(false);
                console.log('Video permission denied');
            }

            const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
            if (audioPermission) {
                setAudioAvailable(true);
                console.log('Audio permission granted');
            } else {
                setAudioAvailable(false);
                console.log('Audio permission denied');
            }

            if (navigator.mediaDevices.getDisplayMedia) {
                setScreenAvailable(true);
            } else {
                setScreenAvailable(false);
            }

            if (videoAvailable || audioAvailable) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable });
                if (userMediaStream) {
                    window.localStream = userMediaStream;
                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = userMediaStream;
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
};

    const connectToSocketId = () => {
        socketRef.current = io(server, { secure: false });
        const socket = socketRef.current;
        socket.on("connect", () => {
            console.log("Connected to socket:", socketRef.current.id);
        });
        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }
    
    const getMedia = () => {
        setAudio(true);
        setVideo(true);
        connectToSocketId();
    }
    

    const connect = () => {
        setAskUserName(false);
        getMedia();
    }
return (
    <div className="container">
        {askUserName ? (
            <>
                <div>
                    <h2 className="text-3xl font-semibold text-gray-800">Enter into Lobby</h2>
                    <br />
                    <TextField
                        id="outlined-basic"
                        label="Outlined"
                        variant="outlined"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <Button variant="contained" onClick={connect}>Connect</Button>
                </div>
                <div>
                    <video ref={localVideoRef}></video>
                </div>
            </>
        ) : (
            <></>
        )}
    </div>
);
}
