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
import { BooleanInput, isNil } from 'st-utils';
import { Select } from '@shared/components/select/select';
import { FormFieldChild } from '@shared/components/form/form-field-child';
import { ControlState } from '@stlmpp/control/lib/control/control';
import { NgClass, AsyncPipe } from '@angular/common';
import { SpinnerComponent } from '../spinner/spinner.component';
import { HasValidatorsPipe } from '@shared/validators/has-validators.pipe';

let uniqueId = 0;

@Component({
  selector: 'bio-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'form-field' },
  animations: [Animations.slide.in(), Animations.fade.in()],
  imports: [LabelDirective, NgClass, SpinnerComponent, AsyncPipe, HasValidatorsPipe],
})
export class FormFieldComponent implements AfterContentInit, OnChanges, OnDestroy {
  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  private readonly _destroy$ = new Subject<void>();

  @ContentChild(LabelDirective) readonly labelDirective?: LabelDirective;
  @ContentChild(InputDirective) readonly inputDirective?: InputDirective;
  @ContentChild(ControlDirective) readonly controlDirective?: ControlDirective;
  @ContentChild(ModelDirective) readonly modelDirective?: ModelDirective;
  @ContentChildren(FormFieldErrorComponent, { descendants: true })
  readonly errorComponents!: QueryList<FormFieldErrorComponent>;
  @ContentChild(PrefixDirective) readonly prefixDirective?: PrefixDirective;
  @ContentChild(SuffixDirective) readonly suffixDirective?: SuffixDirective;
  @ContentChild(Select) readonly select?: Select;
  @ContentChildren(FormFieldChild, { descendants: true }) readonly formFieldChildren!: QueryList<FormFieldChild>;

  @Input() label?: string;
  @Input() id: string | number = uniqueId++;

  @Input() loading?: BooleanInput;
  @Input() disabled?: BooleanInput;
  @Input() forceRequired = false;

  get control(): Control | undefined {
    return this.controlDirective?.control ?? this.modelDirective?.control;
  }

  controlState?: ControlState;

  ngAfterContentInit(): void {
    if (this.labelDirective) {
      this.labelDirective.for = this.id;
    }
    if (this.inputDirective) {
      const inputDirective = this.inputDirective;
      inputDirective.id = this.id;
      if (this.control) {
        this.control.stateChanged$.pipe(takeUntil(this._destroy$), auditTime(50)).subscribe(state => {
          this.controlState = state;
          this.changeDetectorRef.markForCheck();
        });
      }
    }
    if (this.control) {
      if (!isNil(this.disabled)) {
        this.control.disable(!!this.disabled);
      }
    }
    this.formFieldChildren.changes.pipe(takeUntil(this._destroy$), auditTime(50)).subscribe(() => {
      this.changeDetectorRef.markForCheck();
    });
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
