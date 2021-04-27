import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Control, ControlBuilder } from '@stlmpp/control';
import { debounceTime, filter, finalize, switchMap, takeUntil } from 'rxjs/operators';
import { Character } from '@model/character';
import { trackByFactory } from '@stlmpp/utils';
import { CharacterCostume } from '@model/character-costume';
import { PlayerService } from '../../../player/player.service';
import { Player } from '@model/player';
import { AutocompleteDirective } from '@shared/components/autocomplete/autocomplete.directive';
import { generateScorePlayerControlGroup, ScorePlayerAddForm } from '../score-add';
import { LocalState } from '@stlmpp/store';
import { AuthQuery } from '../../../auth/auth.query';

@Component({
  selector: 'bio-score-add-player',
  templateUrl: './score-add-player.component.html',
  styleUrls: ['./score-add-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreAddPlayerComponent extends LocalState<{ playersLoading: boolean }> implements OnInit {
  constructor(
    private controlBuilder: ControlBuilder,
    private playerService: PlayerService,
    private authQuery: AuthQuery
  ) {
    super({ playersLoading: false });
  }

  @Input() playerNumber!: number;
  @Input() disabled = false;
  @Input() first = false;
  @Input() charactersLoading: boolean | null = false;
  @Input() characters: Character[] | null = [];

  @Input()
  set player(player: ScorePlayerAddForm) {
    this.form.setValue(player);
  }

  @Output() readonly playerChange = new EventEmitter<ScorePlayerAddForm>();
  @Output() readonly hostChange = new EventEmitter<void>();

  @ViewChild('bioAutocomplete') bioAutocomplete!: AutocompleteDirective;

  isAdmin$ = this.authQuery.isAdmin$;

  get idPlayerControl(): Control<number | null> {
    return this.form.get('idPlayer');
  }

  get evidenceControl(): Control<string> {
    return this.form.get('evidence');
  }

  form = generateScorePlayerControlGroup(this.controlBuilder);

  idPlayer$ = this.idPlayerControl.value$;
  evidence$ = this.evidenceControl.value$.pipe(debounceTime(400));
  players$ = this.form.get('personaName').value$.pipe(
    debounceTime(500),
    filter(personaName => !!personaName && this.bioAutocomplete?.hasFocus),
    switchMap(personaName => {
      this.updateState({ playersLoading: true });
      return this.playerService.search(personaName).pipe(
        finalize(() => {
          this.updateState({ playersLoading: false });
        })
      );
    })
  );

  playersLoading$ = this.selectState('playersLoading');

  trackByCharacter = trackByFactory<Character>('id');
  trackByCharacterCostume = trackByFactory<CharacterCostume>('id');
  trackByPlayer = trackByFactory<Player>('id');

  ngOnInit(): void {
    this.form.valueChanges$.pipe(takeUntil(this.destroy$)).subscribe(player => {
      this.playerChange.emit(player);
    });
  }
}
