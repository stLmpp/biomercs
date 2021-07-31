import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Control, ControlGroup } from '@stlmpp/control';
import { PlayerAdd } from '@model/player';
import { finalize, map, tap } from 'rxjs';
import { PlayerService } from '../../player/player.service';
import { PersonaNameExistsValidator } from '@shared/validators/persona-name-exists.validator';
import { SteamIdExistsValidator } from '@shared/validators/steam-id-exists.validator';
import { RegionQuery } from '../../region/region.query';
import { LocalState } from '@stlmpp/store';
import { DialogService } from '@shared/components/modal/dialog/dialog.service';
import { Router } from '@angular/router';

interface AdminCreatePlayerComponentState {
  loading: boolean;
}

@Component({
  selector: 'bio-admin-create-player',
  templateUrl: './admin-create-player.component.html',
  styleUrls: ['./admin-create-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCreatePlayerComponent extends LocalState<AdminCreatePlayerComponentState> {
  constructor(
    private playerService: PlayerService,
    private personaNameExistsValidator: PersonaNameExistsValidator,
    private steamIdExistsValidator: SteamIdExistsValidator,
    private regionQuery: RegionQuery,
    private dialogService: DialogService,
    private router: Router
  ) {
    super({ loading: false });
  }

  readonly form = new ControlGroup<PlayerAdd>({
    aboutMe: new Control<string | undefined>(''),
    idRegion: new Control<number | undefined>(undefined),
    idUser: new Control<number | undefined>(undefined),
    idSteamProfile: new Control<number | undefined>(undefined),
    title: new Control<string | undefined>(undefined),
    personaName: new Control('', [this.personaNameExistsValidator]),
    steamid: new Control('', [this.steamIdExistsValidator]),
  });
  readonly loading$ = this.selectState('loading');
  readonly regions$ = this.regionQuery.all$;
  readonly trackByRegion = this.regionQuery.trackBy;

  readonly isInvalid$ = this.form.value$.pipe(map(dto => dto.personaName.length < 3 && !dto.steamid?.length));

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
    const dto = this.form.value;
    if (!dto.steamid?.length && dto.personaName.length < 3) {
      return;
    }
    this.updateState({ loading: true });
    this.form.disable();
    this.playerService
      .create(dto)
      .pipe(
        finalize(() => {
          this.updateState({ loading: false });
          this.form.enable();
        }),
        tap(async () => {
          await this.dialogService.success({
            title: 'Player created with success',
            content: 'Now you can submit scores with this player',
            buttons: [
              {
                title: 'Close',
                action: modalRef => {
                  this.router.navigate(['/']).then();
                  modalRef.close();
                },
              },
              {
                title: 'Create another',
                action: modalRef => {
                  this.form.patchValue({
                    personaName: '',
                    steamid: '',
                    title: '',
                    aboutMe: '',
                    idRegion: undefined,
                  });
                  this.form.markAsTouched(false);
                  modalRef.close();
                },
                backdropAction: true,
              },
            ],
          });
        })
      )
      .subscribe();
  }

  onCardActionsMouseenter(): void {
    this.form.markAsTouched();
  }
}
