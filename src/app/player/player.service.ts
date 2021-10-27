import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { WINDOW } from '../core/window.service';
import { SteamService } from '@shared/services/steam/steam.service';
import { DialogService } from '@shared/components/modal/dialog/dialog.service';
import { map, Observable, switchMap, tap } from 'rxjs';
import { Player, PlayerAdd, PlayerUpdate } from '@model/player';
import { Pagination } from '@model/pagination';
import { HttpParams } from '@util/http-params';
import { SteamPlayerLinkedSocketViewModel } from '@model/steam-profile';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  constructor(
    private http: HttpClient,
    @Inject(WINDOW) private window: Window,
    private steamService: SteamService,
    private dialogService: DialogService
  ) {}

  readonly endPoint = 'player';

  getById(idPlayer: number): Observable<Player> {
    return this.http.get<Player>(`${this.endPoint}/${idPlayer}`);
  }

  getIdByPersonaName(personaName: string): Observable<number> {
    return this.http.get<number>(`${this.endPoint}/persona-name/${personaName}/id`);
  }

  getIdByIdUser(idUser: number): Observable<number> {
    return this.http.get<number>(`${this.endPoint}/user/${idUser}/id`);
  }

  getAuth(): Observable<Player> {
    return this.http.get<Player>(`${this.endPoint}/auth`);
  }

  update(idPlayer: number, dto: PlayerUpdate): Observable<Player> {
    return this.http.patch<Player>(`${this.endPoint}/${idPlayer}`, dto);
  }

  searchPaginated(
    personaName: string,
    page: number,
    limit: number,
    idPlayersSelected: number[] = []
  ): Observable<Pagination<Player>> {
    const params = new HttpParams({ personaName, page, limit, idPlayersSelected });
    return this.http.get<Pagination<Player>>(`${this.endPoint}/search-paginated`, { params });
  }

  search(personaName: string, idPlayersSelected: number[] = []): Observable<Player[]> {
    const params = new HttpParams({ personaName, idPlayersSelected });
    return this.http.get<Player[]>(`${this.endPoint}/search`, { params });
  }

  personaNameExists(personaName: string): Observable<boolean> {
    const params = new HttpParams({ personaName }, true);
    return this.http.get<boolean>(`${this.endPoint}/exists`, { params });
  }

  create(dto: PlayerAdd): Observable<Player> {
    return this.http.post<Player>(this.endPoint, dto);
  }

  linkSteam(idPlayer: number): Observable<SteamPlayerLinkedSocketViewModel> {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    return this.http.put(`${this.endPoint}/${idPlayer}/link-steam`, undefined, { responseType: 'text', headers }).pipe(
      switchMap(url => {
        const windowSteam = this.window.open(url, 'Login Steam', 'width=500,height=500');
        return this.steamService.playerLinkedSocket(idPlayer).pipe(
          tap(async ({ error, steamProfile }) => {
            windowSteam?.close();
            if (error) {
              await this.dialogService.info({ title: 'Error', content: error, buttons: ['Close'] });
            }
          })
        );
      })
    );
  }

  updatePersonaName(idPlayer: number, personaName: string): Observable<Date> {
    return this.http
      .put(`${this.endPoint}/${idPlayer}/persona-name`, { personaName }, { responseType: 'text' })
      .pipe(map(lastUpdatedPersonaNameDate => new Date(lastUpdatedPersonaNameDate)));
  }

  avatar(idPlayer: number, file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.put(`${this.endPoint}/${idPlayer}/avatar`, formData, { responseType: 'text' });
  }

  removeAvatar(idPlayer: number): Observable<void> {
    return this.http.put<void>(`${this.endPoint}/${idPlayer}/remove-avatar`, undefined);
  }
}
