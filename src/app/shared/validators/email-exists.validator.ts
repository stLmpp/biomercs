import { Injectable } from '@angular/core';
import { Control, ControlValidator } from '@stlmpp/control';
import { AuthService } from '../../auth/auth.service';
import { Observable, timer } from 'rxjs';
import { map, switchMapTo } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class EmailExistsValidator extends ControlValidator<string, boolean> {
  constructor(private authService: AuthService) {
    super();
  }

  name = 'emailExists';
  override async = true;

  validate({ value }: Control<string>): Observable<boolean | null> | null {
    if (!value) {
      return null;
    }
    return timer(500).pipe(switchMapTo(this.authService.emailExists(value).pipe(map(exists => exists || null))));
  }
}
