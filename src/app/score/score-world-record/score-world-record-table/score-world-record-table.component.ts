import { ChangeDetectionStrategy, Component, TrackByFunction } from '@angular/core';
import { ScoreService } from '../../score.service';
import { ControlBuilder } from '@stlmpp/control';
import { ParamsConfig, ParamsForm } from '@shared/params/params.component';
import { LocalState } from '@stlmpp/store';
import { trackByFactory } from '@stlmpp/utils';
import { Stage } from '@model/stage';
import { ScoreTableWorldRecord, ScoreVW } from '@model/score';
import { filter, finalize, shareReplay, switchMap } from 'rxjs/operators';

export interface ScoreWorldRecordTableForm {
  idPlatform: number | null;
  idGame: number | null;
  idMiniGame: number | null;
  idMode: number | null;
}

export interface ScoreWorldRecordTableState {
  tableLoading: boolean;
  loadingInfoModal: boolean;
}

@Component({
  selector: 'bio-score-world-record-table',
  templateUrl: './score-world-record-table.component.html',
  styleUrls: ['./score-world-record-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreWorldRecordTableComponent extends LocalState<ScoreWorldRecordTableState> {
  constructor(private scoreService: ScoreService, private controlBuilder: ControlBuilder) {
    super({ tableLoading: false, loadingInfoModal: false });
  }

  tableLoading$ = this.selectState('tableLoading');
  loadingInfoModal$ = this.selectState('loadingInfoModal');

  form = this.controlBuilder.group<ScoreWorldRecordTableForm>({
    idPlatform: null,
    idMode: null,
    idMiniGame: null,
    idGame: null,
  });

  paramsConfig: Partial<ParamsConfig> = {
    idStage: { show: false },
    idCharacterCostume: { show: false },
  };

  scoreTopTable$ = this.form.value$.pipe(
    filter(params => !!params.idPlatform && !!params.idGame && !!params.idMiniGame && !!params.idMode),
    switchMap(params => {
      this.updateState({ tableLoading: true });
      return this.scoreService
        .findWorldRecordTable(params.idPlatform!, params.idGame!, params.idMiniGame!, params.idMode!)
        .pipe(
          finalize(() => {
            this.updateState({ tableLoading: false });
          })
        );
    }),
    shareReplay()
  );

  trackByStage = trackByFactory<Stage>('id');
  trackByScoreTable = trackByFactory<ScoreTableWorldRecord>('idCharacterCustome');
  trackByScore: TrackByFunction<ScoreVW | undefined> = (index, item) => (item ? item.idScore : index);

  paramsChange($event: ParamsForm): void {
    this.form.patchValue($event);
  }

  async openScoreInfo(score: ScoreVW): Promise<void> {
    this.updateState({ loadingInfoModal: true });
    await this.scoreService.openModalScoreInfo({ score, showWorldRecord: true, showApprovalDate: true });
    this.updateState({ loadingInfoModal: false });
  }
}
