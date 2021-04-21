import { ChangeDetectionStrategy, Component, TemplateRef, ViewChild } from '@angular/core';
import { ScoreService } from '../../score.service';
import { ScoreWorldRecordHistoryDto } from '@model/score-world-record';
import { LocalState } from '@stlmpp/store';
import { AllNullable } from '@util/all-nullable';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteParamEnum } from '@model/enum/route-param.enum';
import { getScoreWorldRecordTypes, ScoreWorldRecordTypeEnum } from '@model/enum/score-world-record-type';
import { debounceTime, filter, finalize, shareReplay, switchMap } from 'rxjs/operators';
import { OperatorFunction } from 'rxjs';
import { ParamsConfig, ParamsForm } from '@shared/params/params.component';
import { trackByIdDescription } from '@model/id-description';
import { ScoreVW, trackByScoreVW } from '@model/score';
import { ColDef } from '@shared/components/table/col-def';
import { formatNumber } from '@angular/common';
import { AuthDateFormatPipe } from '../../../auth/shared/auth-date-format.pipe';

export interface ScoreWorldRecordHistoryState extends AllNullable<ScoreWorldRecordHistoryDto> {
  loading: boolean;
}

function validateParams(params: AllNullable<ScoreWorldRecordHistoryDto>): params is ScoreWorldRecordHistoryDto {
  return (
    !!params.idPlatform &&
    !!params.idGame &&
    !!params.idMiniGame &&
    !!params.idMode &&
    !!params.idStage &&
    !!params.type
  );
}

function validateParamsOperator(): OperatorFunction<
  AllNullable<ScoreWorldRecordHistoryDto>,
  ScoreWorldRecordHistoryDto
> {
  return filter(validateParams);
}

@Component({
  selector: 'bio-score-world-record-history',
  templateUrl: './score-world-record-history.component.html',
  styleUrls: ['./score-world-record-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreWorldRecordHistoryComponent extends LocalState<ScoreWorldRecordHistoryState> {
  constructor(
    private scoreService: ScoreService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authDateFormatPipe: AuthDateFormatPipe
  ) {
    super({
      loading: false,
      idPlatform: null,
      idGame: null,
      idMiniGame: null,
      idMode: null,
      idStage: null,
      idCharacterCostume: null,
      type: (activatedRoute.snapshot.queryParamMap.get(RouteParamEnum.type) as ScoreWorldRecordTypeEnum) ?? null,
      fromDate: activatedRoute.snapshot.queryParamMap.has(RouteParamEnum.fromDate)
        ? new Date(activatedRoute.snapshot.queryParamMap.get(RouteParamEnum.fromDate)!)
        : null,
      toDate: activatedRoute.snapshot.queryParamMap.has(RouteParamEnum.toDate)
        ? new Date(activatedRoute.snapshot.queryParamMap.get(RouteParamEnum.toDate)!)
        : null,
    });
  }

  @ViewChild('templateRef', { read: TemplateRef }) templateRef!: TemplateRef<any>;

  paramsConfig: Partial<ParamsConfig> = {
    idCharacterCostume: { clearable: true },
  };

  loading$ = this.selectState('loading');
  scores$ = this.selectState([
    'idPlatform',
    'idGame',
    'idMiniGame',
    'idMode',
    'idStage',
    'idCharacterCostume',
    'type',
    'fromDate',
    'toDate',
  ]).pipe(
    debounceTime(100),
    validateParamsOperator(),
    switchMap(params => {
      this.updateState({ loading: true });
      return this.scoreService.findWorldRecordHistory(params).pipe(
        finalize(() => {
          this.updateState({ loading: false });
        })
      );
    }),
    shareReplay()
  );

  type$ = this.selectState('type');
  types = getScoreWorldRecordTypes();

  colDefs: ColDef<ScoreVW>[] = [
    { property: 'platformShortName', title: 'Platform', tooltip: 'platformName', width: '80px' },
    { property: 'gameShortName', title: 'Game', tooltip: 'gameName', width: '80px' },
    { property: 'miniGameName', title: 'Mini game', width: '250px' },
    { property: 'modeName', title: 'Mode', width: '80px' },
    { property: 'stageShortName', title: 'Stage', tooltip: 'stageName', width: '80px' },
    {
      property: 'score',
      title: 'Score',
      width: '150px',
      style: { justifyContent: 'flex-end', paddingRight: '1.25rem' },
      formatter: value => formatNumber(value, 'pt-BR', '1.0-0'),
    } as ColDef<ScoreVW, 'score'>,
    {
      property: 'creationDate',
      title: 'Creation date',
      width: '125px',
      formatter: value => this.authDateFormatPipe.transform(value),
    } as ColDef<ScoreVW, 'creationDate'>,
    {
      property: 'lastUpdatedDate',
      title: 'Last updated date',
      width: '140px',
      formatter: value => this.authDateFormatPipe.transform(value),
    } as ColDef<ScoreVW, 'lastUpdatedDate'>,
    {
      property: 'scorePlayers',
      title: 'Player(s)',
      formatter: scorePlayers => scorePlayers.map(scorePlayer => scorePlayer.playerPersonaName).join(' | '),
    } as ColDef<ScoreVW, 'scorePlayers'>,
  ];

  trackByIdDescription = trackByIdDescription;
  trackByScore = trackByScoreVW;

  paramsChange($event: ParamsForm): void {
    this.updateState($event);
  }

  async typeChange($event: ScoreWorldRecordTypeEnum): Promise<void> {
    this.updateState({ type: $event });
    await this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParamsHandling: 'merge',
      queryParams: { [RouteParamEnum.type]: $event },
    });
  }
}
