import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
} from '@angular/core';
import { trackById } from '@util/track-by';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { SimpleChangesCustom } from '@util/util';

@Component({
  selector: 'bio-multi-select-items',
  templateUrl: './multi-select-items.component.html',
  styleUrls: ['./multi-select-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiSelectItemsComponent<T extends { id: number }> implements OnChanges {
  private readonly _term$ = new Subject<string>();

  @ViewChild('searchRef') readonly searchElementRef?: ElementRef<HTMLInputElement>;

  @Input() items: T[] = [];
  @Input() label!: keyof T;
  @Input() disabledKey?: keyof T;
  @Input() useInternalSearch = false;
  @Input() icon!: string;
  @Input() loading = false;
  @Input() searchHint?: string;

  @Output() readonly search = new EventEmitter<string>();
  @Output() readonly selectItem = new EventEmitter<T>();

  readonly trackById = trackById;

  readonly term$ = this._term$.pipe(distinctUntilChanged(), debounceTime(500));

  onInput($event: Event): void {
    const input = $event.target as HTMLInputElement;
    this.search.emit(input.value);
    this._term$.next(input.value);
  }

  ngOnChanges(changes: SimpleChangesCustom<MultiSelectItemsComponent<T>>): void {
    const loadingChange = changes.loading;
    if (loadingChange && !loadingChange.isFirstChange() && !loadingChange.currentValue) {
      setTimeout(() => {
        this.searchElementRef?.nativeElement.focus();
      });
    }
  }
}
