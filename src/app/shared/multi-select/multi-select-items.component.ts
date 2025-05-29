import { ChangeDetectionStrategy, Component, Input, OnDestroy, input, output } from '@angular/core';
import { debounce, Subject, Subscription, timer } from 'rxjs';
import { BooleanInput, coerceBooleanProperty, coerceNumberProperty, NumberInput } from 'st-utils';
import { FormFieldComponent } from '../components/form/form-field.component';
import { InputDirective } from '../components/form/input.directive';
import { IconComponent } from '../components/icon/icon.component';
import { SuffixDirective } from '../components/common/suffix.directive';
import { FormFieldHintDirective } from '../components/form/hint.directive';

@Component({
  selector: 'bio-list[bioMultiSelectItems][items],bio-list[bioMultiSelectItems][selected]',
  templateUrl: './multi-select-items.component.html',
  styleUrls: ['./multi-select-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormFieldComponent, InputDirective, IconComponent, SuffixDirective, FormFieldHintDirective],
})
export class MultiSelectItemsComponent implements OnDestroy {
  private readonly _search$ = new Subject<string>();
  private _searchSubscription: Subscription | null = null;
  private _debounceTime?: number;

  private _loadingSearchInput = false;
  private _searchInputDisabled = false;

  @Input()
  get loadingSearchInput(): boolean {
    return this._loadingSearchInput;
  }
  set loadingSearchInput(loadingSearchInput: boolean) {
    this._loadingSearchInput = coerceBooleanProperty(loadingSearchInput);
  }

  @Input()
  get searchInputDisabled(): boolean {
    return this._searchInputDisabled;
  }
  set searchInputDisabled(searchInputDisabled: boolean) {
    this._searchInputDisabled = coerceBooleanProperty(searchInputDisabled);
  }
  readonly hint = input<string>();

  @Input()
  set debounceTime(debounceTime: number) {
    this._debounceTime = coerceNumberProperty(debounceTime);
    this._startDebounce();
  }

  readonly search = input('');
  readonly searchChange = output<string>();

  private _startDebounce(): void {
    if (!this._debounceTime || this._debounceTime <= 0) {
      this._searchSubscription?.unsubscribe();
      this._searchSubscription = null;
      return;
    }
    if (this._searchSubscription) {
      return;
    }
    this._searchSubscription = this._search$.pipe(debounce(() => timer(this._debounceTime!))).subscribe(term => {
      this.searchChange.emit(term);
    });
  }

  onInput($event: Event): void {
    const target = $event.target as HTMLInputElement;
    if (this._debounceTime) {
      this._search$.next(target.value);
    } else {
      this.searchChange.emit(target.value);
    }
  }

  ngOnDestroy(): void {
    this._searchSubscription?.unsubscribe();
  }

  static ngAcceptInputType_debounceTime: NumberInput;
  static ngAcceptInputType_loadingSearchInput: BooleanInput;
  static ngAcceptInputType_searchInputDisabled: BooleanInput;
}
