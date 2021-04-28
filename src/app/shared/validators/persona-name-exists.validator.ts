import { Injectable } from '@angular/core';
import { Control, ControlValidator } from '@stlmpp/control';
import { Observable, timer } from 'rxjs';
import { PlayerService } from '../../player/player.service';
import { map, switchMapTo } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PersonaNameExistsValidator extends ControlValidator<string, boolean> {
  constructor(private playerService: PlayerService) {
    super();
  }

  name = 'personaNameExists';
  async = true;

  validate({ value }: Control<string>): Observable<boolean | null> | boolean | null {
    if (!value) {
      return null;
    }
    return timer(500).pipe(
      switchMapTo(this.playerService.personaNameExists(value)),
      map(exists => exists || null)
    );
  }
}
