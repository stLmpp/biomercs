import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpParams } from '@util/http-params';
import { SocketIOService } from '@shared/services/socket-io/socket-io.service';
import { SteamGatewayEvents, SteamPlayerLinkedSocketViewModel } from '@model/steam-profile';

@Injectable({ providedIn: 'root' })
export class SteamService {
  constructor(private http: HttpClient, private socketIOService: SocketIOService) {}

  private readonly _socketConnection = this.socketIOService.createConnection('steam');

  readonly endPoint = 'steam';

  steamIdExists(steamid: string): Observable<boolean> {
    const params = new HttpParams({ steamid }, true);
    return this.http.get<boolean>(`${this.endPoint}/exists`, { params });
  }

  playerLinkedSocket(idPlayer: number): Observable<SteamPlayerLinkedSocketViewModel> {
    return this._socketConnection.fromEventOnce<SteamPlayerLinkedSocketViewModel>(
      SteamGatewayEvents.playerLinked + idPlayer
    );
  }
}
