import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { PARAMS_FORM_NULL, ParamsConfig, ParamsForm } from '@shared/params/params.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ScoreService } from '../../score.service';
import { filter, finalize, Observable, pluck, skip, switchMap, takeUntil } from 'rxjs';
import { RouteParamEnum } from '@model/enum/route-param.enum';
import { PaginationMetaVW } from '@model/pagination';
import { ScoreVW } from '@model/score';
import { OrderByDirection } from 'st-utils';
import { ScoreApprovalActionEnum } from '@model/enum/score-approval-action.enum';
import { ScoreApprovalVW } from '@model/score-approval';
import { LocalState } from '@stlmpp/store';
import { getScoreDefaultColDefs } from '../util';
import { AuthDateFormatPipe } from '../../../auth/shared/auth-date-format.pipe';
import { ColDef } from '@shared/components/table/col-def';
import { ScoreApprovalActionsCellComponent } from './score-approval-actions-cell/score-approval-actions-cell.component';
import { TableCellNotifyChange, TableOrder } from '@shared/components/table/type';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { ModalService } from '@shared/components/modal/modal.service';
import type {
  ScoreApprovalActionsModalComponent,
  ScoreApprovalActionsModalData,
} from './score-approval-actions-modal/score-approval-actions-modal.component';
import { filterNil } from '@shared/operators/filter';
import { Validators } from '@stlmpp/control';

export interface ScoreApprovalComponentState extends ParamsForm {
  page: number;
  itemsPerPage: number;
  tableLoading: boolean;
  orderBy?: string | null;
  orderByDirection: OrderByDirection;
  data?: ScoreApprovalVW;
  loadingApprovalModal: boolean;
  loadingRequestChangesModal: boolean;
  playerMode: boolean;
}

@Component({
  selector: 'bio-score-approval',
  templateUrl: './score-approval.component.html',
  styleUrls: ['./score-approval.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreApprovalComponent extends LocalState<ScoreApprovalComponentState> implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private scoreService: ScoreService,
    private router: Router,
    private authDateFormatPipe: AuthDateFormatPipe,
    private modalService: ModalService
  ) {
    super(
      {
        itemsPerPage: PaginationComponent.getItemsPerPageFromRoute(activatedRoute),
        page: +(activatedRoute.snapshot.queryParamMap.get(RouteParamEnum.page) ?? 1),
        ...PARAMS_FORM_NULL,
        tableLoading: false,
        loadingApprovalModal: false,
        loadingRequestChangesModal: false,
        playerMode: false,
        orderByDirection:
          (activatedRoute.snapshot.queryParamMap.get(RouteParamEnum.orderByDirection) as
            | OrderByDirection
            | undefined
            | null) ?? 'asc',
        orderBy: activatedRoute.snapshot.queryParamMap.get(RouteParamEnum.orderBy) ?? 'creationDate',
      },
      { inputs: ['playerMode'] }
    );
  }

  private _data$ = this.selectState('data').pipe(filterNil());

  @Input() playerMode = false;

  scoreApprovalActionEnum = ScoreApprovalActionEnum;

  tableLoading$ = this.selectState('tableLoading');
  scores$: Observable<ScoreVW[]> = this._data$.pipe(pluck('scores'));
  meta$: Observable<PaginationMetaVW> = this._data$.pipe(pluck('meta'));
  order$ = this.selectState(['orderBy', 'orderByDirection']);

  itemsPerPageOptions = [5, 10, 25, 50, 100];

  params$ = this.selectState(['idPlatform', 'idGame', 'idMiniGame', 'idMode', 'idStage']).pipe(skip(1));
  metadata$ = this.selectState();

  paramsConfig: Partial<ParamsConfig> = {
    idCharacterCostume: { show: false },
    idPlatform: { clearable: false, validators: [Validators.required] },
  };

  colDefs: ColDef<ScoreVW>[] = [
    { property: 'idScore', component: ScoreApprovalActionsCellComponent, width: '100px' } as ColDef<ScoreVW>,
    ...getScoreDefaultColDefs(this.authDateFormatPipe),
  ].map(colDef => {
    let orderByKey: string | undefined;
    switch (colDef.property) {
      case 'gameShortName':
        orderByKey = 'game';
        break;
      case 'miniGameName':
        orderByKey = 'miniGame';
        break;
      case 'modeName':
        orderByKey = 'mode';
        break;
      case 'stageShortName':
        orderByKey = 'stage';
        break;
    }
    return { ...colDef, orderByKey };
  });

  updateParams($event: ParamsForm): void {
    this.updateState($event);
  }

  changeCurrentPage(page: number): void {
    this.updateState({ page });
  }

  changeItemsPerPage(itemsPerPage: number): void {
    this.updateState({ itemsPerPage });
  }

  changeOrder(order: TableOrder<ScoreVW>): void {
    this.updateState(order);
    this.router
      .navigate([], {
        relativeTo: this.activatedRoute,
        queryParamsHandling: 'merge',
        queryParams: {
          [RouteParamEnum.orderBy]: order.orderBy,
          [RouteParamEnum.orderByDirection]: order.orderByDirection,
        },
      })
      .then();
  }

  onNotifyChange({ data }: TableCellNotifyChange<ScoreApprovalVW, ScoreVW>): void {
    this.updateState({ data });
  }

  async openModalSelectApprovalType(score: ScoreVW): Promise<void> {
    const modalRef = await this.modalService.openLazy<
      ScoreApprovalActionsModalComponent,
      ScoreApprovalActionsModalData,
      ScoreApprovalVW
    >(
      () =>
        import('./score-approval-actions-modal/score-approval-actions-modal.component').then(
          m => m.ScoreApprovalActionsModalComponent
        ),
      {
        data: { scoreApprovalComponentState: this.getState(), score },
      }
    );
    modalRef.onClose$.subscribe(data => {
      if (data) {
        this.updateState({ data });
      }
    });
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
