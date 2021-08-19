import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SocketIOService } from '@shared/services/socket-io/socket-io.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@util/http-params';
import { NotificationGatewayEvents } from '@model/enum/notification-gateway-events';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private http: HttpClient, private socketIOService: SocketIOService) {}

  private readonly _socketConnection = this.socketIOService.createConnection('notification');

  readonly endPoint = 'notification';

  get(page: number, limit: number): Observable<Notification[]> {
    const params = new HttpParams({ page, limit });
    return this.http.get<Notification[]>(this.endPoint, { params });
  }

  read(idNotification: number): Observable<void> {
    return this.http.put<void>(`${this.endPoint}/${idNotification}/read`, undefined);
  }

  readAll(): Observable<void> {
    return this.http.put<void>(`${this.endPoint}/read-all`, undefined);
  }

  listen(): Observable<Notification> {
    return this._socketConnection.fromEvent(NotificationGatewayEvents.main);
  }
}
