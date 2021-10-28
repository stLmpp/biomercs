import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PlayerStore } from './player.store';
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
    private playerStore: PlayerStore,
    @Inject(WINDOW) private window: Window,
    private steamService: SteamService,
    private dialogService: DialogService
  ) {}

  readonly endPoint = 'player';

  getById(idPlayer: number): Observable<Player> {
    return this.http.get<Player>(`${this.endPoint}/${idPlayer}`).pipe(
      tap(player => {
        this.playerStore.upsert(idPlayer, player);
      })
    );
  }

  getIdByPersonaName(personaName: string): Observable<number> {
    return this.http.get<number>(`${this.endPoint}/persona-name/${personaName}/id`);
  }

  getIdByIdUser(idUser: number): Observable<number> {
    return this.http.get<number>(`${this.endPoint}/user/${idUser}/id`);
  }

  getAuth(): Observable<Player> {
    return this.http.get<Player>(`${this.endPoint}/auth`).pipe(
      tap(player => {
        this.playerStore.upsert(player.id, player);
      })
    );
  }

  update(idPlayer: number, dto: PlayerUpdate): Observable<Player> {
    return this.http.patch<Player>(`${this.endPoint}/${idPlayer}`, dto).pipe(
      tap(player => {
        this.playerStore.upsert(idPlayer, player);
      })
    );
  }

  search(
    personaName: string,
    page: number,
    limit: number,
    idPlayersSelected: number[] = []
  ): Observable<Pagination<Player>> {
    const params = new HttpParams({ personaName, page, limit, idPlayersSelected });
    return this.http.get<Pagination<Player>>(`${this.endPoint}/search`, { params }).pipe(
      tap(({ items }) => {
        this.playerStore.upsert(items);
      })
    );
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
            } else if (steamProfile) {
              this.playerStore.updateEntity(idPlayer, { steamProfile, idSteamProfile: steamProfile.id });
            }
          })
        );
      })
    );
  }

  updatePersonaName(idPlayer: number, personaName: string): Observable<Date> {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    return this.http
      .put(`${this.endPoint}/${idPlayer}/personaName`, { personaName }, { responseType: 'text', headers })
      .pipe(
        map(lastUpdatedPersonaNameDate => new Date(lastUpdatedPersonaNameDate)),
        tap(lastUpdatedPersonaNameDate => {
          this.playerStore.updateEntity(idPlayer, { personaName, lastUpdatedPersonaNameDate });
        })
      );
  }
}
