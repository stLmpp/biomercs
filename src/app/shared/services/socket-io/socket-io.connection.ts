import { Socket } from 'socket.io-client';
import { finalize, Observable, Subject, take } from 'rxjs';

export class SocketIOConnection {
  constructor(private connection: Socket, public readonly auth = true) {}

  private readonly _events = new Map<string, Subject<any>>();

  private _createEventSubject<T>(event: string): Subject<T> {
    if (this._events.has(event)) {
      return this._events.get(event)!;
    }
    const subject = new Subject<T>();
    this._events.set(event, subject);
    this.connection.on(event, (data: T) => {
      subject.next(data);
    });
    return subject;
  }

  fromEvent<T>(event: string): Observable<T> {
    return this._createEventSubject(event);
  }

  fromEventOnce<T>(event: string): Observable<T> {
    const subject = this._createEventSubject<T>(event);
    return subject.pipe(
      take(1),
      finalize(() => {
        this._events.delete(event);
      })
    );
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
}
