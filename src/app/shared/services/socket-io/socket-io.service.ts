import { Injectable } from '@angular/core';
import { Manager } from 'socket.io-client';
import { environment } from '@environment/environment';
import { SocketIOConnection } from '@shared/services/socket-io/socket-io.connection';
import { AuthQuery } from '../../../auth/auth.query';
import { asyncScheduler, observeOn } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SocketIOService {
  constructor(private authQuery: AuthQuery) {
    this.authQuery.token$.pipe(observeOn(asyncScheduler)).subscribe(token => {
      this._manager.opts.extraHeaders!.authorization = token ? `Bearer ${token}` : '';
      this._manager.opts.query!.token = token ?? '';
      for (const connection of this._connections) {
        connection.reconnectWhenTokenChanges(!!token);
      }
    });
  }

  private readonly _connections: SocketIOConnection[] = [];

  private readonly _manager = new Manager(environment.socketIOHost, {
    path: environment.socketIOPath,
    transports: ['websocket', 'polling'],
    extraHeaders: { authorization: this.authQuery.getToken() },
    query: { token: this.authQuery.getToken() },
  });

  createConnection(namespace: string, auth = true): SocketIOConnection {
    if (!namespace.startsWith('/')) {
      namespace = `/${namespace}`;
    }
    const connection = this._manager.socket(namespace);
    const socketIOConnection = new SocketIOConnection(connection, auth);
    const hasToken = !!this._manager.opts.extraHeaders?.authorization;
    if (hasToken) {
      socketIOConnection.reconnectWhenTokenChanges(hasToken);
    }
    this._connections.push(socketIOConnection);
    return socketIOConnection;
  }
}
