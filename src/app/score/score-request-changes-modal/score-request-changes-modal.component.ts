import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Score } from '@model/score';
import { MODAL_DATA } from '@shared/components/modal/modal.config';
import {
  ControlBuilder,
  Validators,
  StControlModule,
  StControlCommonModule,
  StControlValueModule,
} from '@stlmpp/control';
import { ModalRef } from '@shared/components/modal/modal-ref';
import { ScoreApprovalPagination } from '@model/score-approval';
import { finalize, Subject, switchMap, tap, throttleTime } from 'rxjs';
import { Key, KeyCode } from '@model/enum/key';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { InputDirective } from '@shared/components/form/input.directive';
import { ScoreApprovalComponentState } from '../score-approval/score-approval.component';
import { trackByControl } from '@util/track-by';
import { ScoreService } from '../score.service';
import { ModalTitleDirective } from '../../shared/components/modal/modal-title.directive';
import { ModalContentDirective } from '../../shared/components/modal/modal-content.directive';
import { ScoreInfoComponent } from '../score-info/score-info.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { TooltipDirective } from '../../shared/components/tooltip/tooltip.directive';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { FormFieldComponent } from '../../shared/components/form/form-field.component';
import { InputDirective as InputDirective_1 } from '../../shared/components/form/input.directive';
import { TextareaDirective } from '../../shared/components/form/textarea.directive';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { ModalActionsDirective } from '../../shared/components/modal/modal-actions.directive';

export interface ScoreRequestChangesModalData {
  score: Score;
  scoreApprovalComponentState: ScoreApprovalComponentState;
}

interface ScoreRequestChangesModalForm {
  changes: string[];
}

export interface TextAreaEvent {
  index: number;
  event: KeyboardEvent;
}

@Component({
  selector: 'bio-score-request-changes-modal',
  templateUrl: './score-request-changes-modal.component.html',
  styleUrls: ['./score-request-changes-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    StControlModule,
    StControlCommonModule,
    ModalTitleDirective,
    ModalContentDirective,
    ScoreInfoComponent,
    ButtonComponent,
    TooltipDirective,
    IconComponent,
    FormFieldComponent,
    InputDirective_1,
    TextareaDirective,
    CdkTextareaAutosize,
    StControlValueModule,
    ModalActionsDirective,
  ],
})
export class ScoreRequestChangesModalComponent implements OnInit, AfterViewInit {
  constructor(
    @Inject(MODAL_DATA) { score, scoreApprovalComponentState }: ScoreRequestChangesModalData,
    private controlBuilder: ControlBuilder,
    public modalRef: ModalRef<ScoreRequestChangesModalComponent, ScoreRequestChangesModalForm, ScoreApprovalPagination>,
    private scoreService: ScoreService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.score = score;
    this.scoreApprovalComponentState = scoreApprovalComponentState;
  }

  private readonly _keydownTextArea$ = new Subject<TextAreaEvent>();
  private _focusKeyManager!: FocusKeyManager<InputDirective>;

  @ViewChildren('change') readonly changesRef!: QueryList<InputDirective>;

  saving = false;

  score: Score;
  scoreApprovalComponentState: ScoreApprovalComponentState;

  readonly form = this.controlBuilder.group<ScoreRequestChangesModalForm>({
    changes: this.controlBuilder.array<string>([['', [Validators.required]]]),
  });
  readonly trackByControl = trackByControl;
  readonly changesControl = this.form.get('changes');

  addChange(focus = false): void {
    this.changesControl.push(this.controlBuilder.control<string>('', [Validators.required]));
    if (focus) {
      const index = this.changesControl.length - 1;
      setTimeout(() => {
        this._focusKeyManager.setActiveItem(index);
      });
    }
  }

  removeChange(index: number): void {
    this.changesControl.removeAt(index);
    if (index > 0) {
      this._focusKeyManager.setActiveItem(index - 1);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
    const changes = this.changesControl.value;
    this.form.disable();
    this.modalRef.disableClose = true;
    this.saving = true;
    this.scoreService
      .requestChanges(this.score.id, changes)
      .pipe(
        switchMap(() => {
          const { idMiniGame, idPlatform, idGame, idMode, itemsPerPage, page, orderBy, orderByDirection, idStage } =
            this.scoreApprovalComponentState;
          return this.scoreService.findApproval(
            idPlatform!,
            page,
            idGame,
            idMiniGame,
            idMode,
            idStage,
            itemsPerPage,
            orderBy,
            orderByDirection
          );
        }),
        tap(data => {
          this.modalRef.close(data);
        }),
        finalize(() => {
          this.saving = false;
          this.modalRef.disableClose = false;
          this.form.enable();
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe();
  }

  onTextAreaKeydown(index: number, event: KeyboardEvent): void {
    const { ctrlKey, key, code } = event;
    if (
      ctrlKey &&
      (code === KeyCode.D || [Key.Plus, Key.Minus, Key.ArrowDown, Key.ArrowUp, Key.Delete].includes(key as Key))
    ) {
      event.preventDefault();
      this._keydownTextArea$.next({ event, index });
    }
    this._focusKeyManager.onKeydown(event);
  }

  ngOnInit(): void {
    this._keydownTextArea$.pipe(throttleTime(100)).subscribe(({ event, index }) => {
      if (event.code === KeyCode.D || [Key.Minus, Key.Delete, Key.ArrowUp].includes(event.key as Key)) {
        this.removeChange(index);
      } else {
        this.addChange(true);
      }
    });
  }

  ngAfterViewInit(): void {
    this._focusKeyManager = new FocusKeyManager<InputDirective>(this.changesRef)
      .withVerticalOrientation(true)
      .withWrap();
    this._focusKeyManager.setFirstItemActive();
  }
}
