import { Directive, Injectable, inject, input } from '@angular/core';
import { Control, ControlValidator } from '@stlmpp/control';
import { map, Observable, switchMap, timer } from 'rxjs';
import { PlayerService } from '../../player/player.service';

@Injectable({ providedIn: 'root' })
export class PersonaNameExistsValidator extends ControlValidator<string, boolean> {
  private playerService = inject(PlayerService);

  readonly name = 'personaNameExists';
  override readonly async = true;

  validate({ value }: Control<string>): Observable<boolean | null> | boolean | null {
    if (!value) {
      return null;
    }
    return timer(500).pipe(
      switchMap(() => this.playerService.personaNameExists(value)),
      map(exists => exists || null)
    );
  }
}

@Directive({
  selector: '[model][personaNameExists]',
  providers: [{ provide: ControlValidator, useExisting: PersonaNameExistsValidatorDirective, multi: true }],
})
export class PersonaNameExistsValidatorDirective extends ControlValidator<string, boolean> {
  private personaNameExistsValidator = inject(PersonaNameExistsValidator);

  readonly personaNameExistsIgnore = input<string>();

  override async = true;
  name = 'personaNameExists';

  validate(control: Control<string>): Observable<boolean | null> | boolean | null {
    if (control.value === this.personaNameExistsIgnore()) {
      return null;
    }
    return this.personaNameExistsValidator.validate(control);
  }
}
