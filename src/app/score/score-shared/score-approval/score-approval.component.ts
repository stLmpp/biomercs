import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { PARAMS_FORM_NULL, ParamsConfig, ParamsForm } from '@shared/params/params.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ScoreService } from '../../score.service';
import { debounceTime, filter, finalize, pluck, switchMap, takeUntil } from 'rxjs/operators';
import { trackByFactory } from '@stlmpp/utils';
import { Observable } from 'rxjs';
import { RouteParamEnum } from '@model/enum/route-param.enum';
import { PaginationMetaVW } from '@model/pagination';
import { ScoreVW } from '@model/score';
import { OrderByDirection } from 'st-utils';
import { ScoreApprovalActionEnum } from '@model/enum/score-approval-action.enum';
import { ScoreApprovalVW } from '@model/score-approval';
import { LocalState } from '@stlmpp/store';

export interface ScoreApprovalComponentState extends ParamsForm {
  page: number;
  itemsPerPage: number;
  tableLoading: boolean;
  orderBy?: string | null;
  orderByDirection?: OrderByDirection | null;
  data?: ScoreApprovalVW;
  loadingApprovalModal: boolean;
  loadingRequestChangesModal: boolean;
}

@Component({
  selector: 'bio-score-approval',
  templateUrl: './score-approval.component.html',
  styleUrls: ['./score-approval.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreApprovalComponent extends LocalState<ScoreApprovalComponentState> implements OnInit {
  constructor(private activatedRoute: ActivatedRoute, private scoreService: ScoreService, private router: Router) {
    super({
      itemsPerPage: 10,
      page: 1,
      ...PARAMS_FORM_NULL,
      tableLoading: false,
      loadingApprovalModal: false,
      loadingRequestChangesModal: false,
    });
    this.updateState({
      itemsPerPage: this._getItemsPerPageFromRoute(),
      page: +(this._getParamOrNull(RouteParamEnum.page) ?? 1),
      idPlatform: this._getParamOrNull(RouteParamEnum.idPlatform),
      idGame: this._getParamOrNull(RouteParamEnum.idGame),
      idMiniGame: this._getParamOrNull(RouteParamEnum.idMiniGame),
      idMode: this._getParamOrNull(RouteParamEnum.idMode),
      idStage: this._getParamOrNull(RouteParamEnum.idStage),
      idCharacterCostume: this._getParamOrNull(RouteParamEnum.idCharacterCostume),
      orderBy: this.activatedRoute.snapshot.queryParamMap.get(RouteParamEnum.orderBy) ?? 'creationDate',
      orderByDirection:
        (this.activatedRoute.snapshot.queryParamMap.get(RouteParamEnum.orderByDirection) as
          | OrderByDirection
          | undefined
          | null) ?? 'asc',
    });
  }

  private _data$ = this.selectState('data');

  @Input() playerMode = false;

  scoreApprovalActionEnum = ScoreApprovalActionEnum;

  tableLoading$ = this.selectState('tableLoading');
  loadingApprovalModal$ = this.selectState('loadingApprovalModal');
  loadingRequestChangesModal$ = this.selectState('loadingRequestChangesModal');
  scores$: Observable<ScoreVW[]> = this._data$.pipe(pluck('scores'));
  meta$: Observable<PaginationMetaVW> = this._data$.pipe(pluck('meta'));
  order$ = this.selectState(['orderBy', 'orderByDirection']);

  itemsPerPageOptions = [5, 10, 25, 50, 100];

  params$ = this.selectState(['idPlatform', 'idGame', 'idMiniGame', 'idMode', 'idStage']);

  paramsConfig: Partial<ParamsConfig> = {
    idCharacterCostume: { show: false },
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

  private _updateOrderDirection(): void {
    const orderByDirection = this.getState('orderByDirection') === 'asc' ? 'desc' : 'asc';
    this.updateState('orderByDirection', this.getState('orderByDirection') === 'asc' ? 'desc' : 'asc');
    this.router
      .navigate([], {
        relativeTo: this.activatedRoute,
        queryParamsHandling: 'merge',
        queryParams: { [RouteParamEnum.orderByDirection]: orderByDirection },
      })
      .then();
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

  changeOrder(orderBy: string): void {
    if (this.getState('orderBy') === orderBy) {
      this._updateOrderDirection();
    } else {
      this.updateState({ orderBy });
      this.router
        .navigate([], {
          relativeTo: this.activatedRoute,
          queryParamsHandling: 'merge',
          queryParams: { [RouteParamEnum.orderBy]: orderBy },
        })
        .then();
    }
  }

  async openModalApproval(action: ScoreApprovalActionEnum, score: ScoreVW): Promise<void> {
    this.updateState({ loadingApprovalModal: true });
    const modalRef = await this.scoreService.openModalScoreApproval({
      score,
      action,
      scoreApprovalComponentState: this.getState(),
      playerMode: this.playerMode,
    });
    modalRef.onClose$.subscribe(data => {
      if (data) {
        this.updateState({ data });
      }
    });
    this.updateState({ loadingApprovalModal: false });
  }

  async openModalRequestChanges(score: ScoreVW): Promise<void> {
    if (this.playerMode) {
      return;
    }
    this.updateState({ loadingRequestChangesModal: true });
    const modalRef = await this.scoreService.openModalRequestChangesScore({
      score,
      scoreApprovalComponentState: this.getState(),
    });
    modalRef.onClose$.subscribe(data => {
      if (data) {
        this.updateState({ data });
      }
    });
    this.updateState({ loadingRequestChangesModal: false });
  }

  ngOnInit(): void {
    this.selectState([
      'idPlatform',
      'page',
      'idGame',
      'idMiniGame',
      'idMode',
      'itemsPerPage',
      'orderBy',
      'orderByDirection',
      'idStage',
    ])
      .pipe(
        debounceTime(50),
        filter(params => !!params.idPlatform && !!params.page && !!params.itemsPerPage),
        switchMap(
          ({ idMiniGame, idPlatform, idGame, idMode, itemsPerPage, page, orderBy, orderByDirection, idStage }) => {
            this.updateState('tableLoading', true);
            return this.scoreService
              .findApproval(
                this.playerMode,
                idPlatform!,
                page,
                idGame,
                idMiniGame,
                idMode,
                idStage,
                itemsPerPage,
                orderBy,
                orderByDirection
              )
              .pipe(
                finalize(() => {
                  this.updateState('tableLoading', false);
                })
              );
          }
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(data => {
        this.updateState({ data });
      });
  }
}
