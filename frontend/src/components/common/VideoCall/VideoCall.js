// src/components/common/VideoCall/VideoCall.js
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import useVideoCall from '../../../hooks/useVideoCall';
import api from '../../../services/api/config';
import './VideoCall.css';

const VideoCall = ({ userType }) => {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [roomData, setRoomData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const containerRef = useRef(null);

    // Fetch or create room
    useEffect(() => {
        const initializeRoom = async () => {
            try {
                // Try to get existing room
                const roomResponse = await api.get(`/video/room/${appointmentId}`);
                setRoomData(roomResponse.room);
                setLoading(false);
            } catch (error) {
                // Room doesn't exist, creat it
                try {
                    const createResponse = await api.post('/video/create-room', { appointmentId });
                    setRoomData(createResponse.room);
                    setLoading(false);
                } catch (createError) {
                    console.error('Error creating room:', createError);
                    alert(createError.message || 'Failed to join video consultation');
                    navigate(`/${userType}/appointments`);
                }
            }
        };

        initializeRoom();
    }, [appointmentId, userType, navigate]);

    const handleCallEnded = async () => {
        try {
            await api.post('/video/end-room', { appointmentId });
        } catch (error) {
            console.error('Error ending room:', error);
        }
        navigate(`/${userType}/appointments`);
    };

    const {
        localStream,
        remoteStream,
        isMuted,
        isVideoOff,
        isConnecting,
        error,
        toggleMute,
        toggleVideo,
        endCall
    } = useVideoCall(
        roomData?.roomId,
        user?.id,
        handleCallEnded
    );

    // Attach local stream to video element
    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    // Attach remote stream to video element
    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    if (loading) {
        return (
            <div className="video-call-container">
                <div className="video-call-loading">
                    <div className="spinner"></div>
                    <p>Preparing video consultation...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="video-call-container">
                <div className="video-call-error">
                    <h2>Connection Error</h2>
                    <p>{error}</p>
                    <button onClick={() => navigate(`/${userType}/appointments`)}>
                        Back to Appointments
                    </button>
                </div>
            </div>
        );
    }

    const appointmentInfo = roomData?.appointment;
    const otherParty = userType === 'patient' ? appointmentInfo?.doctor : appointmentInfo?.patient;

    return (
        <div className="video-call-container" ref={containerRef}>
            <div className="video-call-header">
                <div className="call-info">
                    <h3>Video Consultation with {otherParty?.name}</h3>
                    <span className={`status ${isConnecting ? 'connecting' : 'connected'}`}>
                        {isConnecting ? 'Connecting...' : 'Connected'}
                    </span>
                </div>
            </div>

            <div className="video-streams">
                {/* Remote Video (Main) */}
                <div className="remote-video-container">
                    {remoteStream ? (
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            className="remote-video"
                        />
                    ) : (
                        <div className="waiting-message">
                            <div className="avatar">{otherParty?.name?.charAt(0)}</div>
                            <p>Waiting for {otherParty?.name} to join...</p>
                        </div>
                    )}
                </div>

                {/* Local Video (Picture-in-Picture) */}
                <div className="local-video-container">
                    <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="local-video"
                    />
                    {isVideoOff && (
                        <div className="video-off-overlay">
                            <div className="avatar">{user?.name?.charAt(0)}</div>
                        </div>
                    )}
                </div>
            </div>

            <div className="video-call-controls">
                <button
                    className={`control-btn ${isMuted ? 'active' : ''}`}
                    onClick={toggleMute}
                    title={isMuted ? 'Unmute' : 'Mute'}
                >
                    {isMuted ? '🔇' : '🎤'}
                </button>

                <button
                    className={`control-btn ${isVideoOff ? 'active' : ''}`}
                    onClick={toggleVideo}
                    title={isVideoOff ? 'Turn Video On' : 'Turn Video Off'}
                >
                    {isVideoOff ? '📹❌' : '📹'}
                </button>

                <button
                    className="control-btn"
                    onClick={toggleFullscreen}
                    title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                >
                    {isFullscreen ? '🔽' : '⛶'}
                </button>

                <button
                    className="control-btn end-call-btn"
                    onClick={endCall}
                    title="End Call"
                >
                    📞
                </button>
            </div>
        </div>
    );
};

export default VideoCall;
