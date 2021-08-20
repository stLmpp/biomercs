import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SocketIOService } from '@shared/services/socket-io/socket-io.service';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { HttpParams } from '@util/http-params';
import { AuthQuery } from '../auth/auth.query';
import { Notification } from '@model/notification';
import { Pagination } from '@model/pagination';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private http: HttpClient, private socketIOService: SocketIOService, private authQuery: AuthQuery) {}

  private readonly _socketConnection = this.socketIOService.createConnection('notification');
  private readonly _unseenCount$ = new BehaviorSubject(0);
  readonly endPoint = 'notification';
  readonly unseenCount$ = this._unseenCount$.asObservable();

  get(page: number, limit: number): Observable<Pagination<Notification>> {
    const params = new HttpParams({ page, limit });
    return this.http.get<Pagination<Notification>>(this.endPoint, { params });
  }

  unreadCount(): Observable<number> {
    return this.http.get<number>(`${this.endPoint}/unread-count`);
  }

  unseenCount(): Observable<number> {
    return this.http.get<number>(`${this.endPoint}/unseen-count`).pipe(
      tap(unreadCount => {
        this._unseenCount$.next(unreadCount);
      })
    );
  }

  read(idNotification: number): Observable<number> {
    return this.http.put<number>(`${this.endPoint}/${idNotification}/read`, undefined).pipe(
      tap(unreadCount => {
        this._unseenCount$.next(unreadCount);
      })
    );
  }

  unread(idNotification: number): Observable<void> {
    return this.http.put<void>(`${this.endPoint}/${idNotification}/unread`, undefined);
  }

  readAll(): Observable<number> {
    return this.http.put<number>(`${this.endPoint}/read-all`, undefined).pipe(
      tap(unreadCount => {
        this._unseenCount$.next(unreadCount);
      })
    );
  }

  seenAll(): Observable<void> {
    return this.http.put<void>(`${this.endPoint}/seen-all`, undefined).pipe(
      tap(() => {
        this._unseenCount$.next(0);
      })
    );
  }

  listen(): Observable<Notification[]> {
    return this.authQuery.idUser$.pipe(
      switchMap(idUser =>
        this._socketConnection.fromEvent<Notification[]>(`${idUser}`).pipe(
          tap(notifications => {
            const notificationsUnseen = notifications.filter(notification => !notification.seen);
            if (notificationsUnseen.length) {
              this._unseenCount$.next(this._unseenCount$.value + notificationsUnseen.length);
            }
          })
        )
      )
    );
  }
}
