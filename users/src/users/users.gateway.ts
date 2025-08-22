import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class UsersGateway implements OnGatewayInit {
  @WebSocketServer()
  private readonly server: Server;

  afterInit() {
    console.log(`WebSocket Gateway initialized on ${this.server?.path()}`);
  }

  notifyUsersCreated(count: number) {
    if (!this.server) {
      console.warn('WebSocket server is not initialized');
      return;
    }

    this.server.emit('users_created', {
      count,
      message: `Created ${count} users`,
      timestamp: new Date().toISOString(),
    });
  }
}
