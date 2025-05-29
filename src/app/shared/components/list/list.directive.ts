import { AfterContentInit, ContentChildren, Directive, HostListener, OnDestroy, QueryList } from '@angular/core';
import { ControlValue } from '@stlmpp/control';
import { ListItemComponent } from './list-item.component';
import { Subject } from 'rxjs';
import { ListParentControl } from './list-config';
import { FocusKeyManager } from '@angular/cdk/a11y';

@Directive({
  selector: 'bio-list,[bioList]',
  host: { class: 'bio-list' },
})
export class ListDirective {}

@Directive({
  selector: 'bio-list[selectable],[bioList][selectable]',
  host: { class: 'control' },
})
export class ListSelectable {}

@Directive({
  selector:
    'bio-list[model],[bioList][model],bio-list[control],[bioList][control],bio-list[controlName][bioList][controlName]',
  providers: [
    { provide: ControlValue, useExisting: ListControlValue, multi: true },
    { provide: ListParentControl, useExisting: ListControlValue },
  ],
  host: { class: 'control' },
})
export class ListControlValue extends ListParentControl implements OnDestroy, AfterContentInit {
  private readonly _destroy$ = new Subject<void>();

  @ContentChildren(ListItemComponent, { descendants: true }) readonly listItemComponents!: QueryList<ListItemComponent>;

  focusManager?: FocusKeyManager<ListItemComponent>;

  @HostListener('keydown', ['$event'])
  onKeydown($event: KeyboardEvent): void {
    this.focusManager?.onKeydown($event);
  }

  onChange(value: any): void {
    this.onChange$.next(value);
  }

  onTouched(): void {
    this.onTouched$.next();
  }

  setValue(value: any): void {
    this.value = value;
    if (this.listItemComponents?.length) {
      for (const item of this.listItemComponents) {
        item.setValue(this.value);
      }
    }
  }

  ngAfterContentInit(): void {
    this.focusManager = new FocusKeyManager<ListItemComponent>(this.listItemComponents).withVerticalOrientation();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
