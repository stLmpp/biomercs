import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ControlArray, ControlBuilder, ControlValue, Validators } from '@stlmpp/control';
import { FocusableOption, FocusKeyManager } from '@angular/cdk/a11y';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { SimpleChangesCustom } from '@util/util';

@Directive({ selector: 'input[confirmationCodeInput]' })
export class ConfirmationCodeInputDirective implements FocusableOption {
  constructor(private elementRef: ElementRef<HTMLInputElement>) {}

  focus(): void {
    this.elementRef.nativeElement.focus();
    this.elementRef.nativeElement.select();
  }
}

@Component({
  selector: 'bio-confirmation-code-input',
  templateUrl: './confirmation-code-input.component.html',
  styleUrls: ['./confirmation-code-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: ControlValue, useExisting: forwardRef(() => ConfirmationCodeInputComponent) }],
})
export class ConfirmationCodeInputComponent
  extends ControlValue
  implements AfterViewInit, OnInit, OnDestroy, OnChanges {
  constructor(private controlBuilder: ControlBuilder) {
    super();
  }

  private _destroy$ = new Subject();

  @ViewChildren(ConfirmationCodeInputDirective) inputList!: QueryList<ConfirmationCodeInputDirective>;
  @Output() focusoutLastItem = new EventEmitter<void>();

  @Input() length = 6;
  @Input() label?: string;
  @Input() codeError: string | null = null;

  focusManager!: FocusKeyManager<ConfirmationCodeInputDirective>;

  form = this.controlBuilder.group<{ array: string[] }>({
    array: this.controlBuilder.array<string>(
      Array.from({ length: this.length }).map(() => ['', [Validators.required, Validators.maxLength(1)]])
    ),
  });

  get array(): ControlArray<string> {
    return this.form.get('array');
  }

  get isTouched(): boolean {
    return this.array.controls.every(control => control.touched);
  }

  private _init(): void {
    this._destroy$.next();
    for (let i = 0, len = this.array.length; i < len; i++) {
      const input = this.array.get(i);
      if (input) {
        input.valueChanges$
          .pipe(
            takeUntil(this._destroy$),
            filter(value => !!value)
          )
          .subscribe(value => {
            if (!/^[0-9]$/.test(value!)) {
              input.setValue('', { emitChange: false });
            } else if (i === len - 1) {
              this.focusoutLastItem.emit();
            } else {
              this.focusManager.setNextItemActive();
            }
          });
      }
    }
  }

  setValue(value: number | string | null | undefined): void {
    if (value) {
      const newValue = value.toString().split('');
      this.array.patchValue(newValue);
    }
  }

  setDisabled(disabled: boolean): void {
    this.form.disable(disabled);
  }

  onPaste($event: ClipboardEvent): void {
    const clipboardData = $event.clipboardData;
    const pastedText = clipboardData?.getData('text');
    if (pastedText?.length === 6) {
      this.array.setValue(pastedText.split(''));
    }
  }

  ngOnInit(): void {
    this._init();
    this.array.value$.pipe(takeUntil(this._destroy$)).subscribe(values => {
      this.onChange$.next(+values.filter(value => value).join(''));
    });
  }

  ngAfterViewInit(): void {
    this.focusManager = new FocusKeyManager(this.inputList).withHorizontalOrientation('ltr');
    this.focusManager.setFirstItemActive();
  }

  ngOnChanges(changes: SimpleChangesCustom<ConfirmationCodeInputComponent>): void {
    if (changes.length && !changes.length.isFirstChange()) {
      const arrayValues = this.array.value;
      this.form = this.controlBuilder.group<{ array: string[] }>({
        array: this.controlBuilder.array<string>(
          Array.from({ length: this.length }).map((_, index) => [
            arrayValues[index],
            [Validators.required, Validators.maxLength(1)],
          ])
        ),
      });
      this._init();
    }
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
