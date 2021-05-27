import { Injectable } from '@angular/core';
import { Control, ControlValidator } from '@stlmpp/control';

@Injectable({ providedIn: 'root' })
export class WhiteSpaceValidator extends ControlValidator<string, boolean> {
  name = 'whiteSpace';
  validate({ value }: Control<string>): boolean | null {
    if (!value) {
      return null;
    }
    return !value.trim() || null;
  }
}
