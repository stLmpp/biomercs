import { Injectable } from '@angular/core';
import { Control, ControlValidator } from '@stlmpp/control';
import { AuthService } from '../../auth/auth.service';
import { map, Observable, switchMapTo, timer } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EmailExistsValidator extends ControlValidator<string, boolean> {
  constructor(private authService: AuthService) {
    super();
  }

  readonly name = 'emailExists';
  override readonly async = true;

  validate({ value }: Control<string>): Observable<boolean | null> | null {
    if (!value) {
      return null;
    }
    return timer(500).pipe(switchMapTo(this.authService.emailExists(value).pipe(map(exists => exists || null))));
  }
}
