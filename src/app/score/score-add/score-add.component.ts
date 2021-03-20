import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ControlBuilder, ControlGroup, Validators } from '@stlmpp/control';
import { ScoreAdd } from '@model/score';
import { ActivatedRoute } from '@angular/router';
import { RouteParamEnum } from '@model/enum/route-param.enum';
import { ScorePlayerAdd } from '@model/score-player';
import { AuthQuery } from '../../auth/auth.query';
import { ParamsConfig } from '@shared/params/params.component';
import { CurrencyMaskConfig, CurrencyMaskInputMode } from 'ngx-currency';
import { CURRENCY_MASK_CONFIG } from '@shared/currency-mask/currency-mask-config.token';
import { MaskEnum, MaskEnumPatterns } from '@shared/mask/mask.enum';
import { combineLatest } from 'rxjs';
import { debounceTime, finalize, map, switchMap, tap } from 'rxjs/operators';
import { CharacterCostume } from '@model/character-costume';
import { StateComponent } from '@shared/components/common/state-component';
import { filterNil } from '@shared/operators/filter';
import { CharacterService } from '@shared/services/character/character.service';
import { trackByFactory } from '@stlmpp/utils';
import { Character } from '@model/character';
import { ModeQuery } from '@shared/services/mode/mode.query';
import { Nullable } from '@shared/type/nullable';

export interface ScorePlayerAddForm extends ScorePlayerAdd {
  personaName: string;
}

export interface ScoreAddForm
  extends Omit<ScoreAdd, 'idGame' | 'idMiniGame' | 'idStage' | 'idMode' | 'idPlatform' | 'scorePlayers'> {
  idGame: number | null;
  idMiniGame: number | null;
  idMode: number | null;
  idPlatform: number | null;
  idStage: number | null;
  scorePlayers: ScorePlayerAddForm[];
}

export interface ScoreAddState {
  characterLoading: boolean;
}

@Component({
  selector: 'bio-score-add',
  templateUrl: './score-add.component.html',
  styleUrls: ['./score-add.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: CURRENCY_MASK_CONFIG,
      useValue: {
        align: 'left',
        allowNegative: false,
        nullable: false,
        allowZero: true,
        inputMode: CurrencyMaskInputMode.NATURAL,
        precision: 0,
      } as Partial<CurrencyMaskConfig>,
    },
  ],
})
export class ScoreAddComponent extends StateComponent<ScoreAddState> {
  constructor(
    private controlBuilder: ControlBuilder,
    private activatedRoute: ActivatedRoute,
    private authQuery: AuthQuery,
    private characterService: CharacterService,
    private modeQuery: ModeQuery
  ) {
    super({ characterLoading: false });
  }

  maskEnum = MaskEnum;
  maskTimePattern = MaskEnumPatterns[MaskEnum.time]!;

  paramsConfig: Partial<ParamsConfig> = {
    idCharacterCostume: { show: false },
  };

  form = this.controlBuilder.group<ScoreAddForm>({
    score: [0, [Validators.required, Validators.min(0)]],
    idGame: [this._getParamOrNull(RouteParamEnum.idGame), [Validators.required, Validators.min(1)]],
    idMiniGame: [this._getParamOrNull(RouteParamEnum.idMiniGame), [Validators.required, Validators.min(1)]],
    idMode: [this._getParamOrNull(RouteParamEnum.idMode), [Validators.required, Validators.min(1)]],
    idPlatform: [this._getParamOrNull(RouteParamEnum.idPlatform), [Validators.required, Validators.min(1)]],
    idStage: [this._getParamOrNull(RouteParamEnum.idStage), [Validators.required, Validators.min(1)]],
    scorePlayers: this.controlBuilder.array<ScorePlayerAddForm>([
      {
        bulletKills: [0, [Validators.required, Validators.min(0)]],
        description: ['', [Validators.required, Validators.minLength(1)]],
        host: [true],
        // No need to worry here, since it's only possible to access this route with auth and the resolver of the player
        idPlayer: [this.authQuery.getUser()!.player!.id, [Validators.required, Validators.min(1)]],
        personaName: [this.authQuery.getUser()!.player!.personaName],
        evidence: ['', [Validators.required, Validators.url]],
        idCharacterCostume: [-1, [Validators.required, Validators.min(1)]],
      },
    ]),
    maxCombo: [0, [Validators.required, Validators.min(0), Validators.max(400)]],
    time: [`00'00"00`, [Validators.required]],
  });

  idPlatformNotNil$ = this.form.get('idPlatform').value$.pipe(filterNil());
  idGameNotNil$ = this.form.get('idGame').value$.pipe(filterNil());
  idMiniGameNotNil$ = this.form.get('idMiniGame').value$.pipe(filterNil());
  idModeNotNil$ = this.form.get('idMode').value$.pipe(filterNil());
  characterLoading$ = this.selectState('characterLoading');

  hasIdMode$ = this.form.get('idMode').value$.pipe(map(idMode => !!idMode));

  trackByCharacter = trackByFactory<Character>('id');
  trackByCharacterCostume = trackByFactory<CharacterCostume>('id');

  characters$ = combineLatest([
    this.idPlatformNotNil$,
    this.idGameNotNil$,
    this.idMiniGameNotNil$,
    this.idModeNotNil$,
  ]).pipe(
    debounceTime(0),
    switchMap(([idPlatform, idGame, idMiniGame, idMode]) => {
      this.updateState('characterLoading', true);
      return this.characterService.findByIdPlatformGameMiniGameMode(idPlatform, idGame, idMiniGame, idMode).pipe(
        finalize(() => {
          this.updateState('characterLoading', false);
        }),
        tap(characters => {
          const characterCostumes = characters.reduce(
            (acc, character) => [...acc, ...character.characterCostumes],
            [] as CharacterCostume[]
          );
          for (const player of this.form.get('scorePlayers')) {
            const control = player.get('idCharacterCostume');
            const idCharacterCostume = control.value;
            if (idCharacterCostume) {
              const selected = characterCostumes.find(characterCostume => characterCostume.id === idCharacterCostume);
              if (selected) {
                control.setValue(selected.id);
              } else {
                control.setValue(-1);
              }
            }
          }
        })
      );
    })
  );

  private _generateScorePlayerControlGroup(): ControlGroup<ScorePlayerAddForm> {
    return this.controlBuilder.group<ScorePlayerAddForm>({
      bulletKills: [0, [Validators.required, Validators.min(0)]],
      description: ['', [Validators.required, Validators.minLength(1)]],
      host: [false],
      idPlayer: [-1, [Validators.required, Validators.min(1)]],
      personaName: [''],
      evidence: ['', [Validators.required, Validators.url]],
      idCharacterCostume: [-1, [Validators.required, Validators.min(1)]],
    });
  }

  private _getParamOrNull(param: string): number | null {
    return this.activatedRoute.snapshot.queryParamMap.has(param)
      ? +this.activatedRoute.snapshot.queryParamMap.get(param)!
      : null;
  }

  onModeChange(idMode: Nullable<number>): void {
    setTimeout(() => {
      if (idMode) {
        const mode = this.modeQuery.getEntity(idMode);
        if (mode) {
          const playersControl = this.form.get('scorePlayers');
          if (mode.playerQuantity > playersControl.length) {
            const diff = mode.playerQuantity - playersControl.length;
            for (let i = 0; i < diff; i++) {
              playersControl.push(this._generateScorePlayerControlGroup());
            }
          } else if (mode.playerQuantity < playersControl.length) {
            const len = playersControl.length;
            for (let i = mode.playerQuantity; i < len; i++) {
              playersControl.removeAt(i);
            }
          }
        }
      }
    });
  }

  hostChange($index: number): void {
    const scorePlayersControl = this.form.get('scorePlayers');
    for (let i = 0; i < scorePlayersControl.length; i++) {
      if ($index !== i) {
        scorePlayersControl.get(i)?.get('host')?.setValue(false);
      }
    }
  }
}
