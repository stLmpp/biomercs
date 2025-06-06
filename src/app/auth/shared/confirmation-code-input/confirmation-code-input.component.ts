import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  EventEmitter,
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
import { filter, Subject, takeUntil } from 'rxjs';
import { SimpleChangesCustom } from '@util/util';
import { isNil } from 'st-utils';
import { trackByControl } from '@util/track-by';

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
  providers: [{ provide: ControlValue, useExisting: ConfirmationCodeInputComponent }],
})
export class ConfirmationCodeInputComponent
  extends ControlValue
  implements AfterViewInit, OnInit, OnDestroy, OnChanges
{
  constructor(private controlBuilder: ControlBuilder) {
    super();
  }

  private readonly _destroy$ = new Subject<void>();

  @ViewChildren(ConfirmationCodeInputDirective) readonly inputList!: QueryList<ConfirmationCodeInputDirective>;
  @Output() readonly focusoutLastItem = new EventEmitter<void>();

  @Input() length = 6;
  @Input() label?: string;
  @Input() codeError: string | null = null;

  focusManager!: FocusKeyManager<ConfirmationCodeInputDirective>;

  form = this.controlBuilder.group<{ array: string[] }>({
    array: this.controlBuilder.array<string>(
      Array.from({ length: this.length }).map(() =>
        this.controlBuilder.control(['', [Validators.required, Validators.maxLength(1)]])
      )
    ),
  });

  readonly trackByControl = trackByControl;

  get arrayControl(): ControlArray<string> {
    return this.form.get('array');
  }

  get isTouched(): boolean {
    return this.arrayControl.controls.every(control => control.touched);
  }

  private _init(): void {
    this._destroy$.next();
    for (let i = 0, len = this.arrayControl.length; i < len; i++) {
      const input = this.arrayControl.get(i);
      if (input) {
        input.valueChanges$
          .pipe(
            takeUntil(this._destroy$),
            filter(value => !!value)
          )
          .subscribe(value => {
            if (!/^[0-9]$/.test(value)) {
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
      this.arrayControl.patchValue(newValue);
    }
  }

  override setDisabled(disabled: boolean): void {
    this.form.disable(disabled);
  }

  onPaste($event: ClipboardEvent): void {
    const clipboardData = $event.clipboardData;
    const pastedText = clipboardData?.getData('text');
    if (pastedText?.length === 6) {
      $event.preventDefault();
      this.arrayControl.setValue(pastedText.split(''));
    }
  }

  onKeyupBackspace($event: Event, $index: number): void {
    const value = this.arrayControl.get($index)?.value;
    if (isNil(value) || value === '') {
      $event.preventDefault();
      this.focusManager.setPreviousItemActive();
    }
  }

  ngOnInit(): void {
    this._init();
    this.arrayControl.value$.pipe(takeUntil(this._destroy$)).subscribe(values => {
      this.onChange$.next(+values.filter(value => value).join(''));
    });
  }

  ngAfterViewInit(): void {
    this.focusManager = new FocusKeyManager(this.inputList).withHorizontalOrientation('ltr');
    this.focusManager.setFirstItemActive();
  }

  ngOnChanges(changes: SimpleChangesCustom<ConfirmationCodeInputComponent>): void {
    if (changes.length && !changes.length.isFirstChange()) {
      const arrayValues = this.arrayControl.value;
      this.form = this.controlBuilder.group<{ array: string[] }>({
        array: this.controlBuilder.array<string>(
          Array.from({ length: this.length }).map((_, index) =>
            this.controlBuilder.control([arrayValues[index], [Validators.required, Validators.maxLength(1)]])
          )
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
