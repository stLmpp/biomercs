import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { trackById } from '@util/track-by';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'bio-multi-select-items',
  templateUrl: './multi-select-items.component.html',
  styleUrls: ['./multi-select-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiSelectItemsComponent<T extends { id: number }> {
  private readonly _term$ = new Subject<string>();

  @Input() items: T[] = [];
  @Input() label!: keyof T;
  @Input() useInternalSearch = false;
  @Input() icon!: string;
  @Input() loading = false;

  @Output() readonly search = new EventEmitter<string>();
  @Output() readonly selectItem = new EventEmitter<T>();

  readonly trackById = trackById;

  readonly term$ = this._term$.pipe(distinctUntilChanged(), debounceTime(500));

  onInput($event: Event): void {
    const input = $event.target as HTMLInputElement;
    this.search.emit(input.value);
    this._term$.next(input.value);
  }
}
