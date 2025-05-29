import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import {
  Control,
  ControlGroup,
  Validators,
  StControlModule,
  StControlCommonModule,
  StControlValueModule,
} from '@stlmpp/control';
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
import { PageTitleComponent } from '../../shared/title/page-title.component';
import { NgLetModule } from '@stlmpp/utils';
import { CardComponent } from '../../shared/components/card/card.component';
import { CardTitleDirective } from '../../shared/components/card/card-title.directive';
import { CardContentDirective } from '../../shared/components/card/card-content.directive';
import { FormFieldComponent } from '../../shared/components/form/form-field.component';
import { InputDirective } from '../../shared/components/form/input.directive';
import { FormFieldErrorsDirective } from '../../shared/components/form/errors.directive';
import { FormFieldErrorComponent } from '../../shared/components/form/error.component';
import { FormFieldHintDirective } from '../../shared/components/form/hint.directive';
import { SelectComponent } from '../../shared/components/select/select.component';
import { OptionComponent } from '../../shared/components/select/option.component';
import { FlagComponent } from '../../shared/components/icon/flag/flag.component';
import { CardActionsDirective } from '../../shared/components/card/card-actions.directive';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'bio-admin-create-player',
  templateUrl: './admin-create-player.component.html',
  styleUrls: ['./admin-create-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageTitleComponent,
    StControlModule,
    StControlCommonModule,
    NgLetModule,
    CardComponent,
    CardTitleDirective,
    CardContentDirective,
    FormFieldComponent,
    InputDirective,
    StControlValueModule,
    FormFieldErrorsDirective,
    FormFieldErrorComponent,
    FormFieldHintDirective,
    SelectComponent,
    OptionComponent,
    FlagComponent,
    CardActionsDirective,
    ButtonComponent,
    AsyncPipe,
  ],
})
export class AdminCreatePlayerComponent {
  private playerService = inject(PlayerService);
  private personaNameExistsValidator = inject(PersonaNameExistsValidator);
  private steamIdExistsValidator = inject(SteamIdExistsValidator);
  private dialogService = inject(DialogService);
  private router = inject(Router);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private activatedRoute = inject(ActivatedRoute);

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
