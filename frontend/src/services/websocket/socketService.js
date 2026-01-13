import { io } from 'socket.io-client';
import { WS_BASE_URL } from '../../utils/constants';

// WebSocket Service
class SocketService {
    constructor() {
        this.socket = null;
        this.isConnected = false;
        this.listeners = new Map();
    }

    connect() {
        if (this.socket?.connected) {
            return this.socket;
        }

        const token = localStorage.getItem('token');

        this.socket = io(WS_BASE_URL, {
            auth: {
                token,
            },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
        });

        this.setupDefaultListeners();

        return this.socket;
    }

    setupDefaultListeners() {
        this.socket.on('connect', () => {
            this.isConnected = true;
            this.emit('authenticate', { token: localStorage.getItem('token') });
        });

        this.socket.on('disconnect', (reason) => {
            this.isConnected = false;
        });

        this.socket.on('connect_error', (error) => {
            console.error('WebSocket connection error:', error);
            this.isConnected = false;
        });

        this.socket.on('error', (error) => {
            console.error('WebSocket error:', error);
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
        }
    }

    on(event, callback) {
        if (!this.socket) {
            console.warn('Socket not connected. Call connect() first.');
            return;
        }

        // Store listener reference
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);

        this.socket.on(event, callback);
    }

    off(event, callback) {
        if (!this.socket) return;

        if (callback) {
            this.socket.off(event, callback);

            // Remove from listeners map
            if (this.listeners.has(event)) {
                const callbacks = this.listeners.get(event);
                const index = callbacks.indexOf(callback);
                if (index > -1) {
                    callbacks.splice(index, 1);
                }
            }
        } else {
            // Remove all listeners for this event
            this.socket.off(event);
            this.listeners.delete(event);
        }
    }

    emit(event, data) {
        if (!this.socket) {
            console.warn('Socket not connected. Call connect() first.');
            return;
        }

        this.socket.emit(event, data);
    }

    // Join a room
    joinRoom(room) {
        this.emit('join_room', { room });
    }

    // Leave a room
    leaveRoom(room) {
        this.emit('leave_room', { room });
    }

    // Get connection status
    getConnectionStatus() {
        return {
            connected: this.isConnected,
            socket: this.socket,
        };
    }
}

export const socketService = new SocketService();
export default socketService;
