import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject, viewChild } from '@angular/core';
import { concat, distinctUntilChanged, finalize, map, share, switchMap, takeUntil, tap } from 'rxjs';
import { PlayerService } from '../player.service';
import { Animations } from '@shared/animations/animations';
import { AuthQuery } from '../../auth/auth.query';
import { RegionService } from '../../region/region.service';
import { DynamicLoaderService } from '../../core/dynamic-loader.service';
import { Player, PlayerUpdate } from '@model/player';
import { arrayUtil, isObjectEmpty } from 'st-utils';
import { RouteParamEnum } from '@model/enum/route-param.enum';
import {
  ScoreGroupedByStatus,
  ScoreScoreGroupedByStatusScoreVW,
  trackByScoreGroupedByStatus,
} from '@model/score-grouped-by-status';
import { ActivatedRoute } from '@angular/router';
import { Score } from '@model/score';
import { getScoreDefaultColDefs } from '../../score/util';
import { AuthDateFormatPipe } from '../../auth/shared/auth-date-format.pipe';
import { ColDef } from '@shared/components/table/col-def';
import { ScoreOpenInfoCellComponent } from '../../score/score-approval/score-open-info-cell/score-open-info-cell.component';
import { subDays } from 'date-fns';
import { filterNil } from '@util/operators/filter';
import { mdiSteam } from '@mdi/js';
import { RegionModalService } from '../../region/region-modal.service';
import { ScoreModalService } from '../../score/score-modal.service';
import { mapToParam } from '@util/operators/map-to-param';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import {
  ModelDirective,
  StControlValueModule,
  StControlCommonModule,
  StControlModelModule,
  StControlModule,
} from '@stlmpp/control';
import { playerProfileValidatePersonaName, PlayerProfileInvalidPipe } from './player-profile-invalid.pipe';
import { Destroyable } from '@shared/components/common/destroyable-component';
import { InputTypeService } from '@shared/services/input-type/input-type.service';
import { trackById } from '@util/track-by';
import { NgLetModule } from '@stlmpp/utils';
import { CardComponent } from '../../shared/components/card/card.component';
import { CardTitleDirective } from '../../shared/components/card/card-title.directive';
import { NgTemplateOutlet, AsyncPipe } from '@angular/common';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { TooltipDirective } from '../../shared/components/tooltip/tooltip.directive';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { PlayerAvatarComponent } from '../player-avatar/player-avatar.component';
import { FlagComponent } from '../../shared/components/icon/flag/flag.component';
import { IconMdiComponent } from '../../shared/components/icon/icon-mdi.component';
import { CardSubtitleDirective } from '../../shared/components/card/card-subtitle.directive';
import { CardContentDirective } from '../../shared/components/card/card-content.directive';
import { FormFieldComponent } from '../../shared/components/form/form-field.component';
import { InputDirective } from '../../shared/components/form/input.directive';
import { PersonaNameExistsValidatorDirective } from '../../shared/validators/persona-name-exists.validator';
import { FormFieldHintDirective } from '../../shared/components/form/hint.directive';
import { FormFieldErrorsDirective } from '../../shared/components/form/errors.directive';
import { FormFieldErrorComponent } from '../../shared/components/form/error.component';
import { SelectComponent } from '../../shared/components/select/select.component';
import { OptionComponent } from '../../shared/components/select/option.component';
import { TextareaDirective } from '../../shared/components/form/textarea.directive';
import { CardActionsDirective } from '../../shared/components/card/card-actions.directive';
import { ScoreListResponsiveComponent } from '../../score/score-list/score-list-responsive/score-list-responsive.component';
import { DateDifferencePipe } from '../../shared/date/date-difference.pipe';
import { PlayerCanUpdatePersonaNamePipe } from './player-can-update-persona-name.pipe';

@Component({
  selector: 'bio-player-profile',
  templateUrl: './player-profile.component.html',
  styleUrls: ['./player-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [Animations.fade.in()],
  imports: [
    NgLetModule,
    CardComponent,
    CardTitleDirective,
    NgTemplateOutlet,
    StControlValueModule,
    StControlCommonModule,
    StControlModelModule,
    ButtonComponent,
    TooltipDirective,
    IconComponent,
    PlayerAvatarComponent,
    FlagComponent,
    IconMdiComponent,
    CardSubtitleDirective,
    CardContentDirective,
    FormFieldComponent,
    InputDirective,
    PersonaNameExistsValidatorDirective,
    FormFieldHintDirective,
    FormFieldErrorsDirective,
    StControlModule,
    FormFieldErrorComponent,
    SelectComponent,
    OptionComponent,
    TextareaDirective,
    CardActionsDirective,
    ScoreListResponsiveComponent,
    DateDifferencePipe,
    AsyncPipe,
    PlayerCanUpdatePersonaNamePipe,
    PlayerProfileInvalidPipe,
  ],
})
export class PlayerProfileComponent extends Destroyable implements OnInit {
  private playerService = inject(PlayerService);
  private authQuery = inject(AuthQuery);
  private regionService = inject(RegionService);
  private dynamicLoaderService = inject(DynamicLoaderService);
  private activatedRoute = inject(ActivatedRoute);
  private authDateFormatPipe = inject(AuthDateFormatPipe);
  private regionModalService = inject(RegionModalService);
  private scoreModalService = inject(ScoreModalService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private inputTypeService = inject(InputTypeService);

  private readonly _idPlayer$ = this.activatedRoute.paramMap.pipe(
    mapToParam(RouteParamEnum.idPlayer),
    filterNil(),
    map(Number),
    distinctUntilChanged()
  );

  readonly personaNameModelRef = viewChild<ModelDirective<string | null | undefined>>('personaNameModel');

  readonly isSameAsLogged$ = this._idPlayer$.pipe(switchMap(idPlayer => this.authQuery.selectIsSameAsLogged(idPlayer)));

  saving = false;
  player: Player = this.activatedRoute.snapshot.data[RouteDataEnum.player];
  scoreGroupedByStatus: ScoreGroupedByStatus[] = [];
  loadingRegion = false;
  loadingLinkSteam = false;
  editMode = false;
  update: PlayerUpdate = {};
  newPersonaName: string | null = null;
  avatarLoading = false;
  avatarFile: FileList | null | undefined;
  inputTypeLoading = true;
  inputTypes$ = this.inputTypeService.get().pipe(
    finalize(() => {
      this.inputTypeLoading = false;
    }),
    share()
  );

  readonly colDefs: ColDef<ScoreScoreGroupedByStatusScoreVW>[] = [
    { property: 'id', component: ScoreOpenInfoCellComponent, width: '40px' },
    ...getScoreDefaultColDefs<ScoreScoreGroupedByStatusScoreVW>(this.authDateFormatPipe),
  ];

  readonly todayMinusSevenDate = subDays(new Date(), 7);
  readonly mdiSteam = mdiSteam;
  readonly trackByScoreGroupByStatus = trackByScoreGroupedByStatus;
  readonly trackById = trackById;

  get idPlayer(): number {
    // idPlayer is required to access this component
    return +this.activatedRoute.snapshot.paramMap.get(RouteParamEnum.idPlayer)!;
  }

  private _updateScore(
    idScoreStatus: number,
    idScore: number,
    partial: Partial<ScoreScoreGroupedByStatusScoreVW>
  ): void {
    this.scoreGroupedByStatus = arrayUtil(this.scoreGroupedByStatus, 'idScoreStatus')
      .update(idScoreStatus, status => ({
        ...status,
        scores: arrayUtil(status.scores, 'id').update(idScore, partial).toArray(),
      }))
      .toArray();
    this.changeDetectorRef.markForCheck();
  }

  updatePlayer<K extends keyof PlayerUpdate>(key: K, value: PlayerUpdate[K]): void {
    this.update = { ...this.update, [key]: value };
  }

  async openModalSelectRegion(): Promise<void> {
    if (!this.authQuery.getIsSameAsLogged(this.player)) {
      return;
    }
    const idRegionPlayer = this.player.region?.id ?? -1;
    this.loadingRegion = true;
    await this.regionModalService.showSelectModal(idRegionPlayer, idRegion =>
      this.playerService.update(this.idPlayer, { idRegion }).pipe(
        tap(player => {
          this.player = { ...this.player, ...player };
          this.changeDetectorRef.markForCheck();
        })
      )
    );
    this.loadingRegion = false;
    this.changeDetectorRef.markForCheck();
  }

  preloadRegions(): void {
    if (this.authQuery.getIsSameAsLogged(this.idPlayer)) {
      this.dynamicLoaderService.preloadRequest(this.regionService.get());
    }
  }

  async openScoreInfo(score: Score): Promise<void> {
    this._updateScore(score.idScoreStatus, score.id, { disabled: true });
    await this.scoreModalService.openModalScoreInfo({ score });
    this._updateScore(score.idScoreStatus, score.id, { disabled: false });
  }

  linkSteam(idPlayer: number): void {
    this.loadingLinkSteam = true;
    this.playerService
      .linkSteam(idPlayer)
      .pipe(
        finalize(() => {
          this.loadingLinkSteam = false;
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe(response => {
        if (response.steamProfile) {
          this.player = {
            ...this.player,
            steamProfile: response.steamProfile,
            idSteamProfile: response.steamProfile.id,
          };
        }
      });
  }

  setEditMode(editMode: boolean): void {
    if (!editMode) {
      this.newPersonaName = null;
      this.update = {};
    }
    this.editMode = editMode;
    this.changeDetectorRef.markForCheck();
  }

  save(): void {
    const player = this.player;
    const requests = [];
    if (playerProfileValidatePersonaName(player, this.newPersonaName)) {
      const personaName = this.newPersonaName;
      requests.push(
        this.playerService.updatePersonaName(player.id, personaName).pipe(
          tap(lastUpdatedPersonaNameDate => {
            this.player = { ...this.player, personaName, lastUpdatedPersonaNameDate };
          })
        )
      );
    }
    if (!isObjectEmpty(this.update)) {
      const update = this.update;
      requests.push(
        this.playerService.update(player.id, update).pipe(
          tap(_player => {
            this.player = { ...this.player, ..._player };
          })
        )
      );
    }
    if (!requests.length) {
      this.editMode = false;
      this.update = {};
      this.newPersonaName = null;
      return;
    }
    this.saving = true;
    concat(...requests)
      .pipe(
        finalize(() => {
          this.saving = false;
          this.editMode = false;
          this.update = {};
          this.newPersonaName = null;
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe();
  }

  updatePersonaName($event: string | null): void {
    if (this.player.personaName === $event) {
      $event = null;
    }
    this.newPersonaName = $event;
  }

  onRemoveAvatar(): void {
    this.avatarLoading = true;
    this.playerService
      .removeAvatar(this.player.id)
      .pipe(
        finalize(() => {
          this.avatarLoading = false;
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe(() => {
        this.player = { ...this.player, avatar: null };
      });
  }

  onChangeAvatar($event: FileList | null | undefined): void {
    const file = $event?.item(0);
    if (!file) {
      return;
    }
    this.avatarLoading = true;
    this.playerService
      .avatar(this.player.id, file)
      .pipe(
        finalize(() => {
          this.avatarLoading = false;
          this.avatarFile = null;
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe(avatar => {
        this.player = { ...this.player, avatar };
      });
  }

  ngOnInit(): void {
    this.activatedRoute.data.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.scoreGroupedByStatus = data[RouteDataEnum.scoreGroupedByStatus];
      this.player = data[RouteDataEnum.player];
      this.editMode = false;
      this.update = {};
      this.newPersonaName = null;
      this.changeDetectorRef.markForCheck();
    });
  }
}
