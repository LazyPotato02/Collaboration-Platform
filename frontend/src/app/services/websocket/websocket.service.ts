import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class WebSocketService {
    private socket!: WebSocket;

    connect(projectId: number | undefined, onMessage: (data: any) => void): void {
        this.socket = new WebSocket(`ws://localhost:8001/?project=${projectId}`);

        this.socket.onopen = () => {
            console.log('✅ WebSocket connected');
        };

        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            onMessage(message);
        };

        this.socket.onclose = () => {
            console.log('❌ WebSocket disconnected');
        };

        this.socket.onerror = (err) => {
            console.error('WebSocket error:', err);
        };
    }

    disconnect(): void {
        if (this.socket) {
            this.socket.close();
        }
    }
}
