import { Injectable } from '@angular/core';
import { Control, ControlValidator } from '@stlmpp/control';
import { Observable, timer } from 'rxjs';
import { map, switchMapTo } from 'rxjs/operators';
import { SteamService } from '@shared/services/steam/steam.service';

@Injectable({ providedIn: 'root' })
export class SteamIdExistsValidator extends ControlValidator<string | undefined, boolean> {
  constructor(private steamService: SteamService) {
    super();
  }

  name = 'steamIdExists';
  async = true;
  validate({ value }: Control<string> | Control<string | undefined>): Observable<boolean | null> | boolean | null {
    if (!value) {
      return null;
    }
    return timer(500).pipe(
      switchMapTo(this.steamService.steamIdExists(value)),
      map(exists => exists || null)
    );
  }
}
