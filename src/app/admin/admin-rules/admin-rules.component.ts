import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Rule, RuleUpsert } from '@model/rule';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { ControlArray, ControlBuilder, ControlGroup, Validators } from '@stlmpp/control';
import { LocalState } from '@stlmpp/store';
import { trackByFactory } from '@stlmpp/utils';
import { CdkDragDrop } from '@angular/cdk/drag-drop/drag-events';
import { RuleService } from '../../rules/rule.service';
import { finalize, tap } from 'rxjs/operators';
import { RuleQuery } from '../../rules/rule.query';
import { SnackBarService } from '@shared/components/snack-bar/snack-bar.service';
import { UnsavedData, UnsavedDataType } from '@shared/guards/unsaved-data.guard';

type RuleUpsertForm = Omit<RuleUpsert, 'deleted'>;

interface RulesForm {
  rules: RuleUpsertForm[];
  deleted: RuleUpsert[];
}

interface AdminRulesComponentState {
  saving: boolean;
}

@Component({
  selector: 'bio-admin-rules',
  templateUrl: './admin-rules.component.html',
  styleUrls: ['./admin-rules.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminRulesComponent extends LocalState<AdminRulesComponentState> implements UnsavedData {
  constructor(
    private activatedRoute: ActivatedRoute,
    private ruleService: RuleService,
    private ruleQuery: RuleQuery,
    private controlBuilder: ControlBuilder,
    private snackBarService: SnackBarService
  ) {
    super({ saving: false });
  }

  private _rules: Rule[] = this.activatedRoute.snapshot.data[RouteDataEnum.rules] ?? [];
  saving$ = this.selectState('saving');

  form = this._createForm();

  get rulesControl(): ControlArray<RuleUpsertForm> {
    return this.form.get('rules');
  }

  get deletedControl(): ControlArray<RuleUpsert> {
    return this.form.get('deleted');
  }

  trackByControlGroup = trackByFactory<ControlGroup<RuleUpsertForm>>('uniqueId');

  @HostListener('window:unload')
  private _createForm(): ControlGroup<RulesForm> {
    return this.controlBuilder.group<RulesForm>({
      rules: this.controlBuilder.array<RuleUpsertForm>(this._rules.map(rule => this._createControlGroup(rule))),
      deleted: this.controlBuilder.array<RuleUpsert>([]),
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
    const newGroup = this._createControlGroup({ order: lastOrder + 1, description: '' });
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
    this.updateState({ saving: true });
    const { deleted, rules } = this.form.disable().value;
    const dtos: RuleUpsert[] = [...deleted, ...rules.map(dto => ({ ...dto, deleted: false }))];
    this.ruleService
      .upsert(dtos)
      .pipe(
        tap(() => {
          this._rules = [...this.ruleQuery.getAll()];
          this.form = this._createForm();
          this.snackBarService.open('Rules saved successfully!');
        }),
        finalize(() => {
          this.updateState({ saving: false });
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
}
