import { Socket } from 'socket.io-client';
import { finalize, Observable, Subject, take } from 'rxjs';

export class SocketIOConnection {
  constructor(private connection: Socket, public readonly auth = true) {}

  private readonly _events = new Map<string, Subject<any>>();

  private _createEvent<T>(event: string): Observable<T> {
    if (this._events.has(event)) {
      return this._events.get(event)!;
    }
    const subject = new Subject<T>();
    this._events.set(event, subject);
    const handler = (data: T): void => {
      subject.next(data);
    };
    this.connection.on(event, handler);
    return subject.pipe(
      finalize(() => {
        this._events.delete(event);
        this.connection.off(event, handler);
      })
    );
  }

  fromEvent<T>(event: string): Observable<T> {
    return this._createEvent(event);
  }

  fromEventOnce<T>(event: string): Observable<T> {
    const observable = this._createEvent<T>(event);
    return observable.pipe(take(1));
  }

  disconnectEvent(event: string): void {
    this._events.get(event)?.complete();
  }

  reconnectWhenTokenChanges(hasToken: boolean): this {
    if (!this.auth) {
      return this;
    }
    if (this.connection.connected) {
      this.connection.disconnect();
    }
    if (hasToken && this.connection.disconnected) {
      this.connection.connect();
    }
    return this;
  }

  emit(event: string, ...args: any[]): this {
    this.connection.emit(event, ...args);
    return this;
  }

  disconnect(): this {
    this.connection.disconnect();
    return this;
  }
}
