import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit, ViewChild, inject, input, output } from '@angular/core';
import { debounceTime, filter, finalize, Observable, pluck, switchMap, takeUntil } from 'rxjs';
import { CharacterWithCharacterCostumes } from '@model/character';
import { CharacterCostume } from '@model/character-costume';
import { PlayerService } from '../../../player/player.service';
import { Player } from '@model/player';
import { AutocompleteDirective } from '@shared/components/autocomplete/autocomplete.directive';
import { generateScorePlayerControlGroup, ScorePlayerAddForm } from '../score-add';
import { AuthQuery } from '../../../auth/auth.query';
import { BooleanInput } from 'st-utils';
import { SimpleChangesCustom } from '@util/util';
import { trackById } from '@util/track-by';
import { PlayerModalService } from '../../../player/player-modal.service';
import { Control, StControlCommonModule, StControlModule, StControlValueModule } from '@stlmpp/control';
import { Destroyable } from '@shared/components/common/destroyable-component';
import { PlatformInputType } from '@model/platform-input-type';
import { CardComponent } from '../../../shared/components/card/card.component';
import { CardTitleDirective } from '../../../shared/components/card/card-title.directive';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { TooltipDirective } from '../../../shared/components/tooltip/tooltip.directive';
import { LabelDirective } from '../../../shared/components/form/label.directive';
import { CardContentDirective } from '../../../shared/components/card/card-content.directive';
import { FormFieldComponent } from '../../../shared/components/form/form-field.component';
import { InputDirective } from '../../../shared/components/form/input.directive';
import { AutocompleteDirective as AutocompleteDirective_1 } from '../../../shared/components/autocomplete/autocomplete.directive';
import { AutocompleteComponent } from '../../../shared/components/autocomplete/autocomplete.component';
import { AutocompleteOptionDirective } from '../../../shared/components/autocomplete/autocomplete-option.directive';
import { FormFieldErrorsDirective } from '../../../shared/components/form/errors.directive';
import { FormFieldErrorComponent } from '../../../shared/components/form/error.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { SuffixDirective } from '../../../shared/components/common/suffix.directive';
import { FormFieldHintDirective } from '../../../shared/components/form/hint.directive';
import { SelectComponent } from '../../../shared/components/select/select.component';
import { OptionComponent } from '../../../shared/components/select/option.component';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { OptgroupComponent } from '../../../shared/components/select/optgroup.component';
import { UrlPreviewComponent } from '../../../shared/url-preview/url-preview.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'bio-score-add-player',
  templateUrl: './score-add-player.component.html',
  styleUrls: ['./score-add-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CardComponent,
    StControlCommonModule,
    StControlModule,
    CardTitleDirective,
    IconComponent,
    TooltipDirective,
    LabelDirective,
    StControlValueModule,
    CardContentDirective,
    FormFieldComponent,
    InputDirective,
    AutocompleteDirective_1,
    AutocompleteComponent,
    AutocompleteOptionDirective,
    FormFieldErrorsDirective,
    FormFieldErrorComponent,
    ButtonComponent,
    SuffixDirective,
    FormFieldHintDirective,
    SelectComponent,
    OptionComponent,
    SpinnerComponent,
    OptgroupComponent,
    UrlPreviewComponent,
    AsyncPipe,
  ],
})
export class ScoreAddPlayerComponent extends Destroyable implements OnInit, OnChanges {
  private playerService = inject(PlayerService);
  private authQuery = inject(AuthQuery);
  private playerModalService = inject(PlayerModalService);
  private changeDetectorRef = inject(ChangeDetectorRef);


  readonly idPlayersSelected = input<number[]>([]);
  readonly playerNumber = input.required<number>();
  readonly disabled = input(false);
  readonly first = input(false);
  readonly charactersLoading = input<BooleanInput>(false);
  readonly platformInputTypeLoading = input<BooleanInput>(false);
  readonly characters = input<CharacterWithCharacterCostumes[]>([]);
  readonly platformInputTypes = input<PlatformInputType[]>([]);

  @Input()
  set player(player: ScorePlayerAddForm) {
    this.form.setValue(player);
  }

  readonly playerChange = output<ScorePlayerAddForm>();
  readonly hostChange = output<void>();

  @ViewChild('bioAutocomplete') readonly bioAutocomplete!: AutocompleteDirective;

  readonly isAdmin$ = this.authQuery.isAdmin$;

  readonly form = generateScorePlayerControlGroup();
  readonly idPlayerControl: Control<number | null> = this.form.get('idPlayer');
  readonly evidenceControl = this.form.get('evidence');
  readonly idPlayerPersonaNameControl = this.form.get('idPlayerPersonaName');
  readonly personaNameControl = this.form.get('personaName');
  readonly idPlayerPersonaName$ = this.idPlayerPersonaNameControl.value$;
  readonly evidence$ = this.evidenceControl.value$.pipe(debounceTime(400));
  readonly players$: Observable<Player[]> = this.personaNameControl.value$.pipe(
    debounceTime(500),
    filter(personaName => !!personaName && !!this.bioAutocomplete?.hasFocus),
    switchMap(personaName => {
      this.playersLoading = true;
      this.changeDetectorRef.markForCheck();
      return this.playerService.searchPaginated(personaName, 1, 8, this.idPlayersSelected()).pipe(
        finalize(() => {
          this.playersLoading = false;
          this.changeDetectorRef.markForCheck();
        })
      );
    }),
    pluck('items')
  );

  playersLoading = false;
  playerSearchModalLoading = false;

  readonly trackById = trackById;

  async openPlayerSearchModal(): Promise<void> {
    this.playerSearchModalLoading = true;
    const idPlayer = this.idPlayerControl.value;
    const modalRef = await this.playerModalService.openPlayerSearchModal({
      idPlayer,
      idPlayersSelected: this.idPlayersSelected(),
    });
    modalRef.onClose$.subscribe(player => {
      if (player && player.id !== idPlayer) {
        this.form.patchValue({
          idPlayer: player.id,
          personaName: player.personaName,
        });
      }
    });
    this.playerSearchModalLoading = false;
    this.changeDetectorRef.markForCheck();
  }

  onHostChange(): void {
    // TODO: The 'emit' function requires a mandatory void argument
    this.hostChange.emit();
  }

  onPersonaNameBlur(): void {
    this.idPlayerControl.markAsTouched();
    const idPlayerPersonaName = this.idPlayerPersonaNameControl.value;
    const personaName = this.personaNameControl.value;
    if (!personaName) {
      this.onRemovePlayerSelected();
    } else if (idPlayerPersonaName !== personaName) {
      this.personaNameControl.setValue(idPlayerPersonaName ?? '');
    }
  }

  onPersonaNameAutocompleteSelect(player: Player): void {
    this.form.patchValue({ idPlayerPersonaName: player.personaName, idPlayer: player.id });
  }

  onRemovePlayerSelected($event?: MouseEvent): void {
    $event?.stopPropagation();
    this.form.patchValue({ idPlayer: null, idPlayerPersonaName: null, personaName: '' });
  }

  ngOnInit(): void {
    this.form.valueChanges$.pipe(takeUntil(this.destroy$)).subscribe(player => {
      this.playerChange.emit(player);
    });
  }

  ngOnChanges(changes: SimpleChangesCustom): void {
    const characterCostumes: CharacterCostume[] = (
      (changes.characters?.currentValue ?? []) as CharacterWithCharacterCostumes[]
    ).reduce((acc, character) => [...acc, ...character.characterCostumes], [] as CharacterCostume[]);
    const idCharacterCostumeControl = this.form.get('idCharacterCostume');
    if (characterCostumes?.length === 1 && !idCharacterCostumeControl.value) {
      this.form.get('idCharacterCostume').setValue(characterCostumes[0].id);
    }
  }
}
