import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Host,
  HostBinding,
  HostListener,
  Input,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import { Select } from '@shared/components/select/select';
import { Option } from '@shared/components/select/option';

@Component({
  selector: 'bio-optgroup',
  templateUrl: './optgroup.component.html',
  styleUrls: ['./optgroup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'bio-optgroup' },
})
export class OptgroupComponent {
  constructor(@Host() private select: Select, public changeDetectorRef: ChangeDetectorRef) {
    this.multiple = select.multiple;
  }

  @Input() label!: string;

  @ContentChildren(Option, { descendants: true }) options?: QueryList<Option>;

  @HostBinding('class.multiple') multiple: boolean;

  get optionsWithoutDisabled(): Option[] {
    return (this.options ?? []).filter(option => !option.disabled);
  }

  get isSelected(): boolean {
    return this.optionsWithoutDisabled.every(option => option.isSelected);
  }

  get isIndeterminate(): boolean {
    const options = this.optionsWithoutDisabled;
    const lengthFilter = options.filter(option => option.isSelected).length;
    const length = options.length ?? 0;
    return lengthFilter > 0 && lengthFilter < length;
  }

  get isDisabled(): boolean {
    for (const option of this.options ?? []) {
      if (!option.disabled) {
        return false;
      }
    }
    return true;
  }

  private _select($event: boolean): void {
    const options = this.optionsWithoutDisabled.filter(option => option.isSelected !== $event);
    if (!options.length) {
      return;
    }
    const values: any[] = [];
    for (const option of options) {
      values.push(option.value);
      option.isSelected = $event;
      option.changeDetectorRef.markForCheck();
    }
    this.select.setControlValues?.(values);
  }

  @HostListener('click')
  onClick(): void {
    const options = this.optionsWithoutDisabled;
    if (!this.multiple || !options.length) {
      return;
    }
    this._select(!options.every(option => option.isSelected));
  }

  onCheckedChange($event: boolean): void {
    if (!this.multiple || !this.optionsWithoutDisabled.length) {
      return;
    }
    this._select($event);
  }
}
