import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { Socket } from 'socket.io-client';

interface SocketEntity {
  socket: typeof Socket;
  events: Map<string, Subject<any>>;
}

@Injectable({ providedIn: 'root' })
export class SocketIOService {
  private _events = new Map<string, Subject<any>>();

  private _sockets = new Map<string, SocketEntity>();

  private _checkIfExists(namespace: string): SocketEntity {
    let socket = this._sockets.get(namespace);
    if (!socket) {
      socket = this._sockets
        .set(namespace, { socket: io('http://localhost:3000/auth'), events: new Map() })
        .get(namespace)!;
    }
    return socket;
  }

  disconnect(namespace: string): void {
    const socket = this._checkIfExists(namespace);
    socket.socket.disconnect();
    for (const [, $event] of this._events) {
      $event.complete();
    }
  }

  fromEvent<T>(namespace: string, eventName: string): Observable<T> {
    const { socket, events } = this._checkIfExists(namespace);
    if (events.has(eventName)) {
      return events.get(eventName)!.asObservable();
    }
    const event$ = new Subject<T>();
    socket.on(eventName, (data: T) => {
      event$.next(data);
    });
    events.set(eventName, event$);
    return event$.asObservable().pipe(shareReplay());
  }

  fromEventOnce<T>(namespace: string, eventName: string): Observable<T> {
    const { socket, events } = this._checkIfExists(namespace);
    if (events.has(eventName)) {
      return events.get(eventName)!.asObservable();
    }
    const event$ = new Subject<T>();
    socket.on(eventName, (data: T) => {
      event$.next(data);
      event$.complete();
    });
    events.set(eventName, event$);
    return event$.asObservable();
  }
}
