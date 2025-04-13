import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { config } from '../../config';

const VideoAvatar = ({ isSpeaking, spokenText }) => {
    const videoRef = useRef(null);
    const wsRef = useRef(null);

    useEffect(() => {
        const initializeStream = async () => {
            try {
                // Create a new streaming session
                const response = await fetch('https://api.d-id.com/talks/streams', {
                    method: 'POST',
                    headers: {
                        'Authorization': config.DID_API_KEY,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        source_url: 'https://raw.githubusercontent.com/did-developer-community/image-library/main/nurse1.jpg'
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Stream creation error:', errorData);
                    throw new Error(`Failed to create stream: ${response.status}`);
                }

                const { id: streamId } = await response.json();
                console.log('Stream created:', streamId);

                // Connect to the WebSocket
                wsRef.current = new WebSocket(`wss://api.d-id.com/talks/streams/${streamId}`);

                wsRef.current.onopen = () => {
                    console.log('WebSocket connected');
                    // Send initial message
                    wsRef.current.send(JSON.stringify({
                        type: 'text',
                        text: 'Hello! I am your virtual nurse. How can I help you today?',
                        provider: {
                            type: 'microsoft',
                            voice_id: 'en-US-JennyNeural'
                        }
                    }));
                };

                wsRef.current.onmessage = async (event) => {
                    const data = JSON.parse(event.data);
                    console.log('WebSocket message:', data);

                    if (data.type === 'video') {
                        try {
                            // Convert the base64 video data to a Blob
                            const videoData = atob(data.video);
                            const videoArray = new Uint8Array(videoData.length);
                            for (let i = 0; i < videoData.length; i++) {
                                videoArray[i] = videoData.charCodeAt(i);
                            }
                            const videoBlob = new Blob([videoArray], { type: 'video/mp4' });
                            const videoUrl = URL.createObjectURL(videoBlob);

                            if (videoRef.current) {
                                videoRef.current.src = videoUrl;
                                await videoRef.current.play();
                            }
                        } catch (error) {
                            console.error('Error playing video:', error);
                        }
                    } else if (data.type === 'error') {
                        console.error('D-ID Stream error:', data);
                    }
                };

                wsRef.current.onerror = (error) => {
                    console.error('WebSocket error:', error);
                };

                wsRef.current.onclose = () => {
                    console.log('WebSocket connection closed');
                };
            } catch (error) {
                console.error('Error initializing stream:', error);
            }
        };

        initializeStream();

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    useEffect(() => {
        if (isSpeaking && spokenText && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
                type: 'text',
                text: spokenText,
                provider: {
                    type: 'microsoft',
                    voice_id: 'en-US-JennyNeural'
                }
            }));
        }
    }, [isSpeaking, spokenText]);

    return (
        <VideoAvatarStyled>
            <div className="video-container">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    controls={false}
                    muted={false}
                    className="avatar-video"
                    onError={(e) => console.error('Video error:', e)}
                />
                {isSpeaking && (
                    <div className="speech-indicator">
                        <div className="wave" />
                        <div className="wave" />
                        <div className="wave" />
                    </div>
                )}
            </div>
        </VideoAvatarStyled>
    );
};

const VideoAvatarStyled = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    
    .video-container {
        position: relative;
        width: 100%;
        max-width: 640px;
        aspect-ratio: 16/9;
        background: #f3e8ff;
        border-radius: 12px;
        overflow: hidden;
    }
    
    .avatar-video {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .speech-indicator {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 4px;
        z-index: 10;
        
        .wave {
            width: 4px;
            height: 20px;
            background: #9333ea;
            border-radius: 2px;
            animation: wave 1s ease-in-out infinite;
            
            &:nth-child(2) {
                animation-delay: 0.2s;
            }
            
            &:nth-child(3) {
                animation-delay: 0.4s;
            }
        }
    }

    @keyframes wave {
        0%, 100% {
            height: 20px;
        }
        50% {
            height: 40px;
        }
    }
`;

export default VideoAvatar; 