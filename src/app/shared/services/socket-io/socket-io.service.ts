import { Injectable } from '@angular/core';
import { Manager, Socket } from 'socket.io-client';
import { finalize, Observable, Subject, take } from 'rxjs';
import { environment } from '@environment/environment';

export class SocketIOConnection {
  constructor(private connection: Socket) {}

  private readonly _events = new Map<string, Subject<any>>();

  private _createEventSubject<T>(event: string): Subject<T> {
    if (this._events.has(event)) {
      return this._events.get(event)!;
    }
    const subject = new Subject<T>();
    this.connection.on(event, (data: T) => {
      subject.next(data);
    });
    this._events.set(event, subject);
    return subject;
  }

  fromEvent<T>(event: string): Observable<T> {
    return this._createEventSubject(event);
  }

  fromEventOnce<T>(event: string): Observable<T> {
    const subject = this._createEventSubject<T>(event);
    return subject.asObservable().pipe(
      take(1),
      finalize(() => {
        this._events.delete(event);
      })
    );
  }

  connect(): this {
    this.connection.connect();
    return this;
  }

  disconnect(): this {
    this.connection.disconnect();
    for (const [, event] of this._events) {
      event.complete();
    }
    this._events.clear();
    return this;
  }
}

@Injectable({ providedIn: 'root' })
export class SocketIOService {
  private readonly _manager = new Manager(environment.socketIOHost, {
    path: environment.socketIOPath,
    transports: ['websocket', 'polling'],
  });

  createConnection(namespace: string): SocketIOConnection {
    if (!namespace.startsWith('/')) {
      namespace = `/${namespace}`;
    }
    const connection = this._manager.socket(namespace);
    return new SocketIOConnection(connection).connect();
  }
}
