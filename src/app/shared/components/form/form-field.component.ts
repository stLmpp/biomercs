import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnChanges,
  OnDestroy,
  ViewEncapsulation,
  inject,
  input,
  contentChild,
  contentChildren,
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
  private changeDetectorRef = inject(ChangeDetectorRef);

  private readonly _destroy$ = new Subject<void>();

  readonly labelDirective = contentChild(LabelDirective);
  readonly inputDirective = contentChild(InputDirective);
  readonly controlDirective = contentChild(ControlDirective);
  readonly modelDirective = contentChild(ModelDirective);
  readonly errorComponents = contentChildren(FormFieldErrorComponent, { descendants: true });
  readonly prefixDirective = contentChild(PrefixDirective);
  readonly suffixDirective = contentChild(SuffixDirective);
  readonly select = contentChild(Select);
  readonly formFieldChildren = contentChildren(FormFieldChild, { descendants: true });

  readonly label = input<string>();
  readonly id = input<string | number>(uniqueId++);

  readonly loading = input<BooleanInput>();
  readonly disabled = input<BooleanInput>();
  readonly forceRequired = input(false);

  get control(): Control | undefined {
    return this.controlDirective()?.control ?? this.modelDirective()?.control;
  }

  controlState?: ControlState;

  ngAfterContentInit(): void {
    const labelDirective = this.labelDirective();
    if (labelDirective) {
      labelDirective.for = this.id();
    }
    const inputDirectiveValue = this.inputDirective();
    if (inputDirectiveValue) {
      const inputDirective = inputDirectiveValue;
      inputDirective.id = this.id();
      if (this.control) {
        this.control.stateChanged$.pipe(takeUntil(this._destroy$), auditTime(50)).subscribe(state => {
          this.controlState = state;
          this.changeDetectorRef.markForCheck();
        });
      }
    }
    if (this.control) {
      const disabled = this.disabled();
      if (!isNil(disabled)) {
        this.control.disable(!!disabled);
      }
    }
    this.formFieldChildren()
      .changes.pipe(takeUntil(this._destroy$), auditTime(50))
      .subscribe(() => {
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
