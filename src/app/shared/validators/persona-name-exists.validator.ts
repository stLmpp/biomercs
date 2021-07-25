import { Directive, Injectable, Input } from '@angular/core';
import { Control, ControlValidator } from '@stlmpp/control';
import { map, Observable, switchMapTo, timer } from 'rxjs';
import { PlayerService } from '../../player/player.service';

@Injectable({ providedIn: 'root' })
export class PersonaNameExistsValidator extends ControlValidator<string, boolean> {
  constructor(private playerService: PlayerService) {
    super();
  }

  name = 'personaNameExists';
  override async = true;

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

@Directive({
  selector: '[model][personaNameExists]',
  providers: [{ provide: ControlValidator, useExisting: PersonaNameExistsValidatorDirective, multi: true }],
})
export class PersonaNameExistsValidatorDirective extends ControlValidator<string, boolean> {
  constructor(private personaNameExistsValidator: PersonaNameExistsValidator) {
    super();
  }

  @Input() personaNameExistsIgnore?: string;

  override async = true;
  name = 'personaNameExists';

  validate(control: Control<string>): Observable<boolean | null> | boolean | null {
    if (control.value === this.personaNameExistsIgnore) {
      return null;
    }
    return this.personaNameExistsValidator.validate(control);
  }
}
