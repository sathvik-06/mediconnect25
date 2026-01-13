import { useEffect, useRef, useState } from 'react';
import { socketService } from '../services/websocket/socketService';

export const useWebSocket = (events = {}) => {
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);
    const listenersRef = useRef({});

    useEffect(() => {
        // Connect to WebSocket
        socketService.connect();

        // Setup connection status listeners
        socketService.on('connect', () => {
            setIsConnected(true);
            setError(null);
        });

        socketService.on('disconnect', () => {
            setIsConnected(false);
        });

        socketService.on('error', (err) => {
            setError(err.message);
        });

        // Setup custom event listeners
        Object.entries(events).forEach(([event, handler]) => {
            socketService.on(event, handler);
            listenersRef.current[event] = handler;
        });

        return () => {
            // Cleanup listeners
            Object.keys(listenersRef.current).forEach(event => {
                socketService.off(event, listenersRef.current[event]);
            });

            socketService.off('connect');
            socketService.off('disconnect');
            socketService.off('error');
        };
    }, []);

    const emit = (event, data) => {
        socketService.emit(event, data);
    };

    const on = (event, handler) => {
        socketService.on(event, handler);
        listenersRef.current[event] = handler;
    };

    const off = (event) => {
        if (listenersRef.current[event]) {
            socketService.off(event, listenersRef.current[event]);
            delete listenersRef.current[event];
        }
    };

    return {
        isConnected,
        error,
        emit,
        on,
        off,
    };
};

export default useWebSocket;
