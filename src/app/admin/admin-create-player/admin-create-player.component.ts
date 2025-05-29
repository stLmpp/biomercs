import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Control, ControlGroup, Validators } from '@stlmpp/control';
import { PlayerAdd } from '@model/player';
import { finalize, map, pluck, tap } from 'rxjs';
import { PlayerService } from '../../player/player.service';
import { PersonaNameExistsValidator } from '@shared/validators/persona-name-exists.validator';
import { SteamIdExistsValidator } from '@shared/validators/steam-id-exists.validator';
import { DialogService } from '@shared/components/modal/dialog/dialog.service';
import { ActivatedRoute, Router } from '@angular/router';
import { trackById } from '@util/track-by';
import { Region } from '@model/region';
import { RouteDataEnum } from '@model/enum/route-data.enum';

@Component({
    selector: 'bio-admin-create-player',
    templateUrl: './admin-create-player.component.html',
    styleUrls: ['./admin-create-player.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class AdminCreatePlayerComponent {
  constructor(
    private playerService: PlayerService,
    private personaNameExistsValidator: PersonaNameExistsValidator,
    private steamIdExistsValidator: SteamIdExistsValidator,
    private dialogService: DialogService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute
  ) {}

  loading = false;

  readonly form = new ControlGroup<PlayerAdd>({
    aboutMe: new Control<string | undefined>('', [Validators.maxLength(2000)]),
    idRegion: new Control<number | undefined>(undefined),
    idUser: new Control<number | undefined>(undefined),
    idSteamProfile: new Control<number | undefined>(undefined),
    title: new Control<string | undefined>('', [Validators.maxLength(250)]),
    personaName: new Control('', [this.personaNameExistsValidator, Validators.maxLength(100)]),
    steamid: new Control('', [this.steamIdExistsValidator]),
  });
  readonly regions: Region[] = this.activatedRoute.snapshot.data[RouteDataEnum.regions];
  readonly trackByRegion = trackById;

  readonly isInvalid$ = this.form.value$.pipe(map(dto => dto.personaName.length < 3 && !dto.steamid?.length));
  readonly personaNameLength$ = this.form.get('personaName').value$.pipe(pluck('length'));
  readonly aboutMeLength$ = this.form.get('aboutMe')!.value$.pipe(pluck('length'));
  readonly titleLength$ = this.form.get('title')!.value$.pipe(pluck('length'));

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
    const dto = this.form.value;
    if (!dto.steamid?.length && dto.personaName.length < 3) {
      return;
    }
    this.loading = true;
    this.form.disable();
    this.playerService
      .create(dto)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.changeDetectorRef.markForCheck();
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
