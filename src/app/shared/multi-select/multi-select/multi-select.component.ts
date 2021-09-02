import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'bio-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'multi-select' },
})
export class MultiSelectComponent<T extends { id: number }, K extends keyof T> {
  @Input() items: T[] = [];
  @Input() selected: T[] = [];
  @Input() label!: keyof T;
  @Input() disabledKey?: keyof T;
  @Input() loadingItems = false;
  @Input() loadingSelected = false;
  @Input() itemsSearchHint?: string;

  @Output() readonly search = new EventEmitter<string>();
  @Output() readonly allSelected = new EventEmitter<T[]>();
  @Output() readonly allRemoved = new EventEmitter<T[]>();
  @Output() readonly selectItem = new EventEmitter<T>();
  @Output() readonly removeItem = new EventEmitter<T>();
}
