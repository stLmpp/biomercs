import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Host,
  HostListener,
  Input,
  OnInit,
  Optional,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ListParentControl } from './list-config';
import { FocusableOption } from '@angular/cdk/a11y';

@Component({
  selector: 'bio-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'list-item', tabindex: '0' },
})
export class ListItemComponent implements OnInit, FocusableOption {
  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public elementRef: ElementRef,
    @Optional() @Host() public listParentControl?: ListParentControl
  ) {}

  @ViewChild('control') controlInput?: ElementRef<HTMLInputElement>;

  @Input() value: any;
  @Input() disabled = false;

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
}
