import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Rule, RuleTypeEnum, RuleUpsert } from '@model/rule';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import {
  Control,
  ControlArray,
  ControlBuilder,
  ControlGroup,
  Validators,
  StControlModule,
  StControlCommonModule,
  StControlValueModule,
} from '@stlmpp/control';
import { CdkDragDrop } from '@angular/cdk/drag-drop/drag-events';
import { RuleService } from '../../rules/rule.service';
import { finalize, tap } from 'rxjs';
import { SnackBarService } from '@shared/components/snack-bar/snack-bar.service';
import { UnsavedData, UnsavedDataType } from '@shared/guards/unsaved-data.guard';
import { trackByControl } from '@util/track-by';
import { CardComponent } from '../../shared/components/card/card.component';
import { CardTitleDirective } from '../../shared/components/card/card-title.directive';
import { CardContentDirective } from '../../shared/components/card/card-content.directive';
import { CdkDropList, CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { FormFieldComponent } from '../../shared/components/form/form-field.component';
import { SelectComponent } from '../../shared/components/select/select.component';
import { OptionComponent } from '../../shared/components/select/option.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { InputDirective } from '../../shared/components/form/input.directive';
import { TextareaDirective } from '../../shared/components/form/textarea.directive';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { FormFieldErrorsDirective } from '../../shared/components/form/errors.directive';
import { FormFieldErrorComponent } from '../../shared/components/form/error.component';
import { LoadingComponent } from '../../shared/components/spinner/loading/loading.component';
import { CardActionsDirective } from '../../shared/components/card/card-actions.directive';
import { AsyncPipe } from '@angular/common';

export type RuleUpsertForm = Omit<RuleUpsert, 'deleted'>;

interface RulesForm {
  rules: RuleUpsertForm[];
  deleted: RuleUpsert[];
  type: RuleTypeEnum;
}

@Component({
  selector: 'bio-admin-rules',
  templateUrl: './admin-rules.component.html',
  styleUrls: ['./admin-rules.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    StControlModule,
    StControlCommonModule,
    CardComponent,
    CardTitleDirective,
    CardContentDirective,
    CdkDropList,
    FormFieldComponent,
    SelectComponent,
    OptionComponent,
    ButtonComponent,
    CdkDrag,
    IconComponent,
    CdkDragHandle,
    InputDirective,
    TextareaDirective,
    StControlValueModule,
    CdkTextareaAutosize,
    FormFieldErrorsDirective,
    FormFieldErrorComponent,
    LoadingComponent,
    CardActionsDirective,
    AsyncPipe,
  ],
})
export class AdminRulesComponent implements UnsavedData {
  private activatedRoute = inject(ActivatedRoute);
  private ruleService = inject(RuleService);
  private controlBuilder = inject(ControlBuilder);
  private snackBarService = inject(SnackBarService);
  private changeDetectorRef = inject(ChangeDetectorRef);


  private _rules: Rule[] = this.activatedRoute.snapshot.data[RouteDataEnum.rules] ?? [];
  saving = false;
  loadingType = false;

  form = this._createForm(RuleTypeEnum.Main);

  readonly ruleTypeEnum = RuleTypeEnum;

  get rulesControl(): ControlArray<RuleUpsertForm> {
    return this.form.get('rules');
  }

  get deletedControl(): ControlArray<RuleUpsert> {
    return this.form.get('deleted');
  }

  get typeControl(): Control<RuleTypeEnum> {
    return this.form.get('type');
  }

  readonly trackByControl = trackByControl;

  private _createForm(type: RuleTypeEnum): ControlGroup<RulesForm> {
    return this.controlBuilder.group<RulesForm>({
      rules: this.controlBuilder.array<RuleUpsertForm>(
        this._rules.filter(rule => rule.type === type).map(rule => this._createControlGroup(rule))
      ),
      deleted: this.controlBuilder.array<RuleUpsert>([]),
      type: this.controlBuilder.control(type),
    });
  }

  private _createControlGroup({ description, ...rule }: RuleUpsertForm): ControlGroup<RuleUpsertForm> {
    return this.controlBuilder.group<RuleUpsertForm>({
      description: [description, { validators: [Validators.required, Validators.whiteSpace] }],
      ...rule,
    });
  }

  private _reorder(): void {
    const rulesControl = this.rulesControl;
    const length = rulesControl.length;
    for (let index = 0; index < length; index++) {
      const control = rulesControl.get(index);
      if (control) {
        const newOrder = index + 1;
        const orderControl = control.get('order');
        if (orderControl && orderControl.value !== newOrder) {
          orderControl.setValue(newOrder).markAsTouched().markAsDirty();
        }
      }
    }
  }

  addRule(): void {
    const rulesControl = this.rulesControl;
    const lastOrder = rulesControl.get(rulesControl.length - 1)?.get('order').value ?? 0;
    const newGroup = this._createControlGroup({ order: lastOrder + 1, description: '', type: this.typeControl.value });
    this.rulesControl.push(newGroup);
    newGroup.get('id')?.markAsTouched();
  }

  deleteRule(index: number): void {
    const control = this.rulesControl.get(index);
    if (!control) {
      return;
    }
    const ruleValue = control.value;
    if (ruleValue.id) {
      this.deletedControl.push(this.controlBuilder.group<RuleUpsert>({ ...ruleValue, deleted: true }));
      this.rulesControl.removeAt(index);
    } else {
      this.rulesControl.removeAt(index);
    }
    this._reorder();
  }

  changeOrder($event: CdkDragDrop<any, any>): void {
    const rulesControl = this.rulesControl;
    const controlMoved = rulesControl.get($event.previousIndex);
    if (!controlMoved) {
      return;
    }
    rulesControl.move($event.previousIndex, $event.currentIndex);
    this._reorder();
  }

  save(): void {
    if (this.form.invalid) {
      return;
    }
    this.saving = true;
    const { deleted, rules } = this.form.disable().value;
    const dtos: RuleUpsert[] = [...deleted, ...rules.map(dto => ({ ...dto, deleted: false }))];
    this.ruleService
      .upsert(dtos)
      .pipe(
        tap(_rules => {
          this._rules = _rules;
          this.form = this._createForm(this.typeControl.value);
          this.snackBarService.open('Rules saved successfully!');
        }),
        finalize(() => {
          this.saving = false;
          this.changeDetectorRef.markForCheck();
          this.form.enable();
        })
      )
      .subscribe();
  }

  onMouseenterActions(): void {
    this.form.markAsTouched();
  }

  hasUnsavedData(): UnsavedDataType {
    return (
      (this.form.dirty || !!this.deletedControl.length) && {
        title: 'There are unsaved rules',
        content: 'Leave page? <br />If you press "Yes", the updated rules will be lost',
      }
    );
  }

  onRuleTypeChange(type: RuleTypeEnum): void {
    this.loadingType = true;
    setTimeout(() => {
      this.form = this._createForm(type);
      this.loadingType = false;
      this.changeDetectorRef.markForCheck();
    }, 500);
  }
}
