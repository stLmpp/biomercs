import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PARAMS_FORM_NULL, ParamsConfig, ParamsForm } from '../../../shared/params/params.component';
import { StateComponent } from '../../../shared/components/common/state-component';
import { ActivatedRoute } from '@angular/router';
import { ScoreService } from '../../score.service';
import { debounceTime, filter, finalize, pluck, shareReplay, switchMap } from 'rxjs/operators';
import { trackByFactory } from '@stlmpp/utils';
import { Observable } from 'rxjs';
import { RouteParamEnum } from '@model/enum/route-param.enum';
import { PaginationMetaVW } from '@model/pagination';
import { ScoreVW } from '@model/score';

interface ScoreApprovalComponentState extends ParamsForm {
  page: number;
  itemsPerPage: number;
  tableLoading: boolean;
}

@Component({
  selector: 'bio-score-approval',
  templateUrl: './score-approval.component.html',
  styleUrls: ['./score-approval.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreApprovalComponent extends StateComponent<ScoreApprovalComponentState> {
  constructor(private activatedRoute: ActivatedRoute, private scoreService: ScoreService) {
    super({ itemsPerPage: 10, page: 1, ...PARAMS_FORM_NULL, tableLoading: false });
    this.updateState({
      itemsPerPage: this._getItemsPerPageFromRoute(),
      page: +(this._getParamOrNull(RouteParamEnum.page) ?? 1),
      idPlatform: this._getParamOrNull(RouteParamEnum.idPlatform),
      idGame: this._getParamOrNull(RouteParamEnum.idGame),
      idMiniGame: this._getParamOrNull(RouteParamEnum.idMiniGame),
      idMode: this._getParamOrNull(RouteParamEnum.idMode),
      idStage: this._getParamOrNull(RouteParamEnum.idStage),
      idCharacterCostume: this._getParamOrNull(RouteParamEnum.idCharacterCostume),
    });
  }

  private _data$ = this.selectStateMulti(['idPlatform', 'page', 'idGame', 'idMiniGame', 'idMode', 'itemsPerPage']).pipe(
    debounceTime(50),
    filter(params => !!params.idPlatform && !!params.page && !!params.itemsPerPage),
    switchMap(({ idMiniGame, idPlatform, idGame, idMode, itemsPerPage, page }) => {
      this.updateState('tableLoading', true);
      return this.scoreService.findApprovalAdmin(idPlatform!, page, idGame, idMiniGame, idMode, itemsPerPage).pipe(
        finalize(() => {
          this.updateState('tableLoading', false);
        })
      );
    }),
    shareReplay()
  );

  tableLoading$ = this.selectState('tableLoading');
  scores$: Observable<ScoreVW[]> = this._data$.pipe(pluck('scores'));
  meta$: Observable<PaginationMetaVW> = this._data$.pipe(pluck('meta'));

  itemsPerPageOptions = [5, 10, 25, 50, 100];

  params$ = this.selectStateMulti(['idPlatform', 'idGame', 'idMiniGame', 'idMode']);

  paramsConfig: Partial<ParamsConfig> = {
    idCharacterCostume: { show: false },
    idStage: { show: false },
    idPlatform: { clearable: false },
  };

  trackByScore = trackByFactory<ScoreVW>('idScore');

  private _getParamOrNull(param: RouteParamEnum): number | null {
    return this.activatedRoute.snapshot.queryParamMap.has(param)
      ? +this.activatedRoute.snapshot.queryParamMap.get(param)!
      : null;
  }

  private _getItemsPerPageFromRoute(): number {
    const itemsPerPage = +(this.activatedRoute.snapshot.queryParamMap.get(RouteParamEnum.itemsPerPage) ?? 10);
    return this.itemsPerPageOptions.includes(itemsPerPage) ? itemsPerPage : 10;
  }

  updateParams($event: ParamsForm): void {
    this.updateState($event);
  }

  changeCurrentPage(page: number): void {
    this.updateState({ page });
  }

  changeItemsPerPage(itemsPerPage: number): void {
    this.updateState({ itemsPerPage });
  }
}
