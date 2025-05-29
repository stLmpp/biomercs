import { Injectable, inject } from '@angular/core';
import { Control, ControlValidator } from '@stlmpp/control';
import { AuthService } from '../../auth/auth.service';
import { map, Observable, switchMap, timer } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsernameExistsValidator extends ControlValidator<string, boolean> {
  private authService = inject(AuthService);


  readonly name = 'usernameExists';
  override readonly async = true;

  validate({ value }: Control<string>): Observable<boolean | null> | null {
    if (!value) {
      return null;
    }
    return timer(500).pipe(
      switchMap(() => this.authService.usernameExists(value)),
      map(exists => exists || null)
    );
  }
}
