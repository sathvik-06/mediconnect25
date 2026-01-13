import { socketService } from './socketService';

// Realtime Updates Service
class RealtimeUpdatesService {
    constructor() {
        this.updateHandlers = new Map();
    }

    // Initialize realtime updates
    initialize(userId, userRole) {
        if (!socketService.socket) {
            socketService.connect();
        }

        // Join user-specific room
        socketService.joinRoom(`user:${userId}`);

        // Join role-specific room
        if (userRole) {
            socketService.joinRoom(`role:${userRole}`);
        }

        this.setupListeners();
    }

    setupListeners() {
        // Appointment updates
        socketService.on('appointment:created', (data) => {
            this.handleUpdate('appointment:created', data);
        });

        socketService.on('appointment:updated', (data) => {
            this.handleUpdate('appointment:updated', data);
        });

        socketService.on('appointment:cancelled', (data) => {
            this.handleUpdate('appointment:cancelled', data);
        });

        // Order updates
        socketService.on('order:created', (data) => {
            this.handleUpdate('order:created', data);
        });

        socketService.on('order:updated', (data) => {
            this.handleUpdate('order:updated', data);
        });

        socketService.on('order:status_changed', (data) => {
            this.handleUpdate('order:status_changed', data);
        });

        // Prescription updates
        socketService.on('prescription:uploaded', (data) => {
            this.handleUpdate('prescription:uploaded', data);
        });

        socketService.on('prescription:validated', (data) => {
            this.handleUpdate('prescription:validated', data);
        });

        // Payment updates
        socketService.on('payment:completed', (data) => {
            this.handleUpdate('payment:completed', data);
        });

        socketService.on('payment:failed', (data) => {
            this.handleUpdate('payment:failed', data);
        });

        // Notification updates
        socketService.on('notification', (data) => {
            this.handleUpdate('notification', data);
        });

        // Reminder updates
        socketService.on('reminder', (data) => {
            this.handleUpdate('reminder', data);
        });
    }

    handleUpdate(event, data) {
        const handlers = this.updateHandlers.get(event);
        if (handlers) {
            handlers.forEach(handler => handler(data));
        }
    }

    // Subscribe to specific update type
    subscribe(event, handler) {
        if (!this.updateHandlers.has(event)) {
            this.updateHandlers.set(event, []);
        }
        this.updateHandlers.get(event).push(handler);

        // Return unsubscribe function
        return () => this.unsubscribe(event, handler);
    }

    // Unsubscribe from update type
    unsubscribe(event, handler) {
        if (this.updateHandlers.has(event)) {
            const handlers = this.updateHandlers.get(event);
            const index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        }
    }

    // Emit custom event
    emit(event, data) {
        socketService.emit(event, data);
    }

    // Cleanup
    cleanup(userId, userRole) {
        // Leave rooms
        socketService.leaveRoom(`user:${userId}`);
        if (userRole) {
            socketService.leaveRoom(`role:${userRole}`);
        }

        // Clear handlers
        this.updateHandlers.clear();
    }
}

export const realtimeUpdates = new RealtimeUpdatesService();
export default realtimeUpdates;
