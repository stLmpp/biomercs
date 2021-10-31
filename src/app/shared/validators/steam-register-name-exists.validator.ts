import { Injectable } from '@angular/core';
import { Control, ControlValidator } from '@stlmpp/control';
import { map, Observable, switchMap, timer } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class SteamRegisterNameExistsValidator extends ControlValidator<string | null | undefined, boolean> {
  constructor(private authService: AuthService) {
    super();
  }

  readonly name = 'steamRegisterNameExists';
  override readonly async = true;

  validate({ value }: Control<string | null | undefined>): Observable<boolean | null> | boolean | null {
    if (!value) {
      return null;
    }
    return timer(500).pipe(
      switchMap(() => this.authService.steamRegisterNameExists(value)),
      map(exists => exists || null)
    );
  }
}
