import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  Input,
  OnChanges,
  OnDestroy,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import { LabelDirective } from './label.directive';
import { InputDirective } from './input.directive';
import { SimpleChangesCustom } from '@util/util';
import { Animations } from '../../animations/animations';
import { auditTime, Subject, takeUntil } from 'rxjs';
import { FormFieldErrorComponent } from './error.component';
import { PrefixDirective } from '../common/prefix.directive';
import { SuffixDirective } from '../common/suffix.directive';
import { Control, ControlDirective, ModelDirective } from '@stlmpp/control';
import { SelectComponent } from '../select/select.component';
import { BooleanInput } from '@angular/cdk/coercion';
import { isNil } from 'st-utils';

let uniqueId = 0;

@Component({
  selector: 'form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'form-field' },
  animations: [Animations.slide.in(), Animations.fade.in()],
})
export class FormFieldComponent implements AfterContentInit, OnChanges, OnDestroy {
  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  private _destroy$ = new Subject<void>();

  @ContentChild(LabelDirective) labelDirective?: LabelDirective;
  @ContentChild(InputDirective) inputDirective?: InputDirective;
  @ContentChild(ControlDirective) controlDirective?: ControlDirective;
  @ContentChild(ModelDirective) modelDirective?: ModelDirective;
  @ContentChildren(FormFieldErrorComponent, { descendants: true }) errorComponents!: QueryList<FormFieldErrorComponent>;
  @ContentChild(PrefixDirective) prefixDirective?: PrefixDirective;
  @ContentChild(SuffixDirective) suffixDirective?: SuffixDirective;
  @ContentChild(SelectComponent) selectComponent?: SelectComponent;

  @Input() label?: string;
  @Input() id: string | number = uniqueId++;

  @Input() loading?: BooleanInput;
  @Input() disabled?: BooleanInput;
  @Input() forceRequired = false;

  get control(): Control | undefined {
    return this.controlDirective?.control ?? this.modelDirective?.control;
  }

  ngAfterContentInit(): void {
    if (this.labelDirective) {
      this.labelDirective.for = this.id;
    }
    if (this.inputDirective) {
      this.inputDirective.id = this.id;
      if (this.inputDirective.control) {
        this.inputDirective.control.stateChanged$.pipe(takeUntil(this._destroy$), auditTime(50)).subscribe(() => {
          if (this.labelDirective) {
            this.labelDirective.danger = !!this.inputDirective?.dangerClass;
          }
          this.changeDetectorRef.markForCheck();
        });
      }
    }
    if (this.control) {
      if (!isNil(this.disabled)) {
        this.control.disable(!!this.disabled);
      }
    }
  }

  ngOnChanges(changes: SimpleChangesCustom<FormFieldComponent>): void {
    if (changes.disabled && this.control) {
      this.control.disable(!!changes.disabled.currentValue);
    }
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
