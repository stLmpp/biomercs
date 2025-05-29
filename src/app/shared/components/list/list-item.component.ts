import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostBinding, HostListener, Input, OnInit, ViewChild, ViewEncapsulation, inject, input } from '@angular/core';
import { ListParentControl } from './list-config';
import { FocusableOption } from '@angular/cdk/a11y';
import { BooleanInput, coerceBooleanProperty } from 'st-utils';

@Component({
  selector: 'bio-list-item,a[bioListItem]',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'list-item', tabindex: '0' },
})
export class ListItemComponent implements OnInit, FocusableOption {
  changeDetectorRef = inject(ChangeDetectorRef);
  elementRef = inject(ElementRef);
  listParentControl? = inject(ListParentControl, { optional: true, host: true });


  private _disabled = false;

  @ViewChild('control') readonly controlInput?: ElementRef<HTMLInputElement>;

  readonly value = input<any>();

  @Input()
  @HostBinding('class.disabled')
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(disabled: boolean) {
    this._disabled = coerceBooleanProperty(disabled);
  }

  model: any;
  name = '';

  @HostListener('click')
  @HostListener('keydown.enter')
  onClick(): void {
    this.controlInput?.nativeElement.click();
    this.listParentControl?.focusManager?.setActiveItem(this);
  }

  onChange(value: any): void {
    this.listParentControl?.onChange(value);
  }

  onTouched(): void {
    this.listParentControl?.onTouched();
  }

  setValue(value: any): void {
    this.model = value;
    this.changeDetectorRef.markForCheck();
  }

  focus(): void {
    this.elementRef.nativeElement.focus?.();
  }

  ngOnInit(): void {
    if (this.listParentControl) {
      this.name = this.listParentControl.id;
      this.model = this.listParentControl.value;
    }
  }

  static ngAcceptInputType_disabled: BooleanInput;
}
