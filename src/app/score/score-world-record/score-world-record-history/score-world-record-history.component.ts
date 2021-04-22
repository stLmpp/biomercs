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
import { trackByScoreVW } from '@model/score';
import { AuthDateFormatPipe } from '../../../auth/shared/auth-date-format.pipe';
import { getScoreDefaultColDefs } from '../../score-shared/util';

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

  colDefs = getScoreDefaultColDefs(this.authDateFormatPipe);

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
