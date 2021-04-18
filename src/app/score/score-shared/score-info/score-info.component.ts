import { ChangeDetectionStrategy, Component, Input, Optional } from '@angular/core';
import { ScoreVW } from '@model/score';
import { trackByScorePlayerVW } from '@model/score-player';
import { BooleanInput } from 'st-utils';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Params, Router } from '@angular/router';
import { ScoreWorldRecordTypeEnum } from '@model/enum/score-world-record-type';
import { ModalRef } from '@shared/components/modal/modal-ref';
import { RouteParamEnum } from '@model/enum/route-param.enum';

@Component({
  selector: 'bio-score-info',
  templateUrl: './score-info.component.html',
  styleUrls: ['./score-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreInfoComponent {
  constructor(private router: Router, @Optional() private modalRef?: ModalRef) {}

  private _showWorldRecord = false;
  private _showApprovalDate = false;

  @Input() score!: ScoreVW;

  @Input()
  get showWorldRecord(): boolean {
    return this._showWorldRecord;
  }
  set showWorldRecord(showWorldRecord: boolean) {
    this._showWorldRecord = coerceBooleanProperty(showWorldRecord);
  }

  @Input()
  get showApprovalDate(): boolean {
    return this._showApprovalDate;
  }

  set showApprovalDate(showApprovalDate: boolean) {
    this._showApprovalDate = coerceBooleanProperty(showApprovalDate);
  }

  scoreWorldRecordTypeEnum = ScoreWorldRecordTypeEnum;

  trackByScorePlayer = trackByScorePlayerVW;

  async navigateToHistory(type: ScoreWorldRecordTypeEnum, idCharacterCostume?: number): Promise<void> {
    const { idPlatform, idGame, idMiniGame, idMode, idStage } = this.score;
    this.modalRef?.close();
    const queryParams: Params = {
      [RouteParamEnum.type]: type,
      [RouteParamEnum.idPlatform]: idPlatform,
      [RouteParamEnum.idGame]: idGame,
      [RouteParamEnum.idMiniGame]: idMiniGame,
      [RouteParamEnum.idMode]: idMode,
      [RouteParamEnum.idStage]: idStage,
    };
    if (idCharacterCostume) {
      queryParams[RouteParamEnum.idCharacterCostume] = idCharacterCostume;
    }
    await this.router.navigate(['score', 'world-record', 'history'], {
      queryParamsHandling: 'merge',
      queryParams,
    });
  }

  static ngAcceptInputType_showWorldRecord: BooleanInput;
  static ngAcceptInputType_showApprovalDate: BooleanInput;
}
