import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
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
import { Control } from '@stlmpp/control';
import { Destroyable } from '@shared/components/common/destroyable-component';
import { PlatformInputType } from '@model/platform-input-type';

@Component({
  selector: 'bio-score-add-player',
  templateUrl: './score-add-player.component.html',
  styleUrls: ['./score-add-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreAddPlayerComponent extends Destroyable implements OnInit, OnChanges {
  constructor(
    private playerService: PlayerService,
    private authQuery: AuthQuery,
    private playerModalService: PlayerModalService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super();
  }

  @Input() idPlayersSelected: number[] = [];
  @Input() playerNumber!: number;
  @Input() disabled = false;
  @Input() first = false;
  @Input() charactersLoading: BooleanInput = false;
  @Input() platformInputTypeLoading: BooleanInput = false;
  @Input() characters: CharacterWithCharacterCostumes[] = [];
  @Input() platformInputTypes: PlatformInputType[] = [];

  @Input()
  set player(player: ScorePlayerAddForm) {
    this.form.setValue(player);
  }

  @Output() readonly playerChange = new EventEmitter<ScorePlayerAddForm>();
  @Output() readonly hostChange = new EventEmitter<void>();

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
      return this.playerService.searchPaginated(personaName, 1, 8, this.idPlayersSelected).pipe(
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
      idPlayersSelected: this.idPlayersSelected,
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
