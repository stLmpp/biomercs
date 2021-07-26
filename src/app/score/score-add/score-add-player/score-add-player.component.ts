import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ControlBuilder } from '@stlmpp/control';
import { debounceTime, filter, finalize, Observable, pluck, switchMap, takeUntil } from 'rxjs';
import { CharacterWithCharacterCostumes } from '@model/character';
import { CharacterCostume } from '@model/character-costume';
import { PlayerService } from '../../../player/player.service';
import { Player } from '@model/player';
import { AutocompleteDirective } from '@shared/components/autocomplete/autocomplete.directive';
import { generateScorePlayerControlGroup, ScorePlayerAddForm } from '../score-add';
import { LocalState } from '@stlmpp/store';
import { AuthQuery } from '../../../auth/auth.query';
import { BooleanInput } from '@angular/cdk/coercion';
import { SimpleChangesCustom } from '@util/util';
import { trackById } from '@util/track-by';

interface ScoreAddPlayerComponentState {
  playersLoading: boolean;
  playerSearchModalLoading: boolean;
}

@Component({
  selector: 'bio-score-add-player',
  templateUrl: './score-add-player.component.html',
  styleUrls: ['./score-add-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreAddPlayerComponent extends LocalState<ScoreAddPlayerComponentState> implements OnInit, OnChanges {
  constructor(
    private controlBuilder: ControlBuilder,
    private playerService: PlayerService,
    private authQuery: AuthQuery
  ) {
    super({ playersLoading: false, playerSearchModalLoading: false });
  }

  @Input() playerNumber!: number;
  @Input() disabled = false;
  @Input() first = false;
  @Input() charactersLoading: BooleanInput = false;
  @Input() characters: CharacterWithCharacterCostumes[] | null = [];

  @Input()
  set player(player: ScorePlayerAddForm) {
    this.form.setValue(player);
  }

  @Output() readonly playerChange = new EventEmitter<ScorePlayerAddForm>();
  @Output() readonly hostChange = new EventEmitter<void>();

  @ViewChild('bioAutocomplete') readonly bioAutocomplete!: AutocompleteDirective;

  readonly isAdmin$ = this.authQuery.isAdmin$;

  readonly form = generateScorePlayerControlGroup(this.controlBuilder);
  readonly idPlayerControl = this.form.get('idPlayer');
  readonly evidenceControl = this.form.get('evidence');
  readonly idPlayer$ = this.idPlayerControl.value$;
  readonly evidence$ = this.evidenceControl.value$.pipe(debounceTime(400));
  readonly players$: Observable<Player[]> = this.form.get('personaName').value$.pipe(
    debounceTime(500),
    filter(personaName => !!personaName && !!this.bioAutocomplete?.hasFocus),
    switchMap(personaName => {
      this.updateState({ playersLoading: true });
      return this.playerService.search(personaName, 1, 8).pipe(
        finalize(() => {
          this.updateState({ playersLoading: false });
        })
      );
    }),
    pluck('items')
  );

  readonly playersLoading$ = this.selectState('playersLoading');
  readonly playerSearchModalLoading$ = this.selectState('playerSearchModalLoading');

  readonly trackById = trackById;

  async openPlayerSearchModal(): Promise<void> {
    this.updateState({ playerSearchModalLoading: true });
    const idPlayer = this.idPlayerControl.value;
    const modalRef = await this.playerService.openPlayerSearchModal({ idPlayer });
    modalRef.onClose$.subscribe(player => {
      if (player && player.id !== idPlayer) {
        this.form.patchValue({
          idPlayer: player.id,
          personaName: player.personaName,
        });
      }
    });
    this.updateState({ playerSearchModalLoading: false });
  }

  onHostChange($event: Event): void {
    $event.stopPropagation();
    this.hostChange.emit();
  }

  ngOnInit(): void {
    this.form.valueChanges$.pipe(takeUntil(this.destroy$)).subscribe(player => {
      this.playerChange.emit(player);
    });
  }

  override ngOnChanges(changes: SimpleChangesCustom): void {
    super.ngOnChanges(changes);
    const characterCostumes: CharacterCostume[] = (
      (changes.characters?.currentValue ?? []) as CharacterWithCharacterCostumes[]
    ).reduce((acc, character) => [...acc, ...character.characterCostumes], [] as CharacterCostume[]);
    const idCharacterCostumeControl = this.form.get('idCharacterCostume');
    if (characterCostumes?.length === 1 && !idCharacterCostumeControl.value) {
      this.form.get('idCharacterCostume').setValue(characterCostumes[0].id);
    }
  }
}
