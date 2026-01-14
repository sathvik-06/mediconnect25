// src/hooks/useVideoCall.js
// TEMPORARILY DISABLED - simple-peer causing fetch polyfill errors
// Will be re-enabled with peerjs implementation

import { useEffect, useRef, useState } from 'react';
// import Peer from 'simple-peer';
import { io } from 'socket.io-client';

const ICE_SERVERS = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
    ]
};

const useVideoCall = (roomId, userId, onCallEnded) => {
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false); // Changed to false
    const [error, setError] = useState('Video calls temporarily unavailable');

    const socketRef = useRef(null);
    const peerRef = useRef(null);
    const localStreamRef = useRef(null);

    // Temporarily disabled - will be re-implemented with peerjs
    /*
    useEffect(() => {
        if (!roomId || !userId) return;

        // Initialize socket connection
        const socket = io('http://localhost:5000');
        socketRef.current = socket;

        // Get user media (camera and microphone)
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                setLocalStream(stream);
                localStreamRef.current = stream;

                // Join the video room
                socket.emit('join-video-room', { roomId, userId });
            })
            .catch(err => {
                console.error('Error accessing media devices:', err);
                setError('Could not access camera/microphone. Please check permissions.');
                setIsConnecting(false);
            });

        // Handle when another user joins
        socket.on('user-joined', ({ userId: joinedUserId, socketId }) => {
            console.log('User joined:', joinedUserId);
            if (localStreamRef.current) {
                // Initiator creates peer connection and sends offer
                createPeer(socketId, true);
            }
        });

        // Handle receiving offer
        socket.on('offer', ({ offer, socketId }) => {
            console.log('Received offer');
            if (localStreamRef.current && !peerRef.current) {
                createPeer(socketId, false, offer);
            }
        });

        // Handle receiving answer
        socket.on('answer', ({ answer }) => {
            console.log('Received answer');
            if (peerRef.current) {
                peerRef.current.signal(answer);
            }
        });

        // Handle ICE candidates
        socket.on('ice-candidate', ({ candidate }) => {
            if (peerRef.current) {
                peerRef.current.signal(candidate);
            }
        });

        // Handle user left
        socket.on('user-left', () => {
            console.log('User left');
            cleanupPeer();
        });

        // Handle call ended
        socket.on('call-ended', () => {
            console.log('Call ended');
            cleanup();
            if (onCallEnded) onCallEnded();
        });

        return () => {
            cleanup();
        };
    }, [roomId, userId]);

    const createPeer = (socketId, initiator, offer = null) => {
        const peer = new Peer({
            initiator,
            trickle: true,
            stream: localStreamRef.current,
            config: ICE_SERVERS
        });

        peer.on('signal', signal => {
            if (initiator) {
                socketRef.current.emit('offer', { roomId, offer: signal, userId });
            } else {
                socketRef.current.emit('answer', { roomId, answer: signal, userId });
            }
        });

        peer.on('stream', stream => {
            console.log('Received remote stream');
            setRemoteStream(stream);
            setIsConnecting(false);
        });

        peer.on('error', err => {
            console.error('Peer error:', err);
            setError('Connection error. Please try again.');
            setIsConnecting(false);
        });

        peer.on('close', () => {
            console.log('Peer connection closed');
            cleanupPeer();
        });

        if (offer) {
            peer.signal(offer);
        }

        peerRef.current = peer;
    };
    */

    const toggleMute = () => {
        console.warn('Video calls temporarily disabled');
    };

    const toggleVideo = () => {
        console.warn('Video calls temporarily disabled');
    };

    const endCall = () => {
        console.warn('Video calls temporarily disabled');
        if (onCallEnded) onCallEnded();
    };

    const cleanupPeer = () => {
        // Disabled
    };

    const cleanup = () => {
        // Disabled
    };

    return {
        localStream,
        remoteStream,
        isMuted,
        isVideoOff,
        isConnecting,
        error,
        toggleMute,
        toggleVideo,
        endCall
    };
};

export default useVideoCall;
