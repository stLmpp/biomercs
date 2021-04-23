import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Directive,
  forwardRef,
  HostListener,
  Input,
  OnDestroy,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValue } from '@stlmpp/control';
import { ListItemComponent } from './list-item.component';
import { Subject } from 'rxjs';
import { ListParentControl } from './list-config';
import { FocusKeyManager } from '@angular/cdk/a11y';

@Component({
  selector: 'bio-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'list' },
})
export class ListComponent {}

@Directive({ selector: 'bio-list[selectable]', host: { class: 'control' } })
export class ListSelectable {}

@Directive({
  selector: 'bio-list[model],bio-list[control],bio-list[controlName]',
  providers: [
    { provide: ControlValue, useExisting: forwardRef(() => ListControlValue), multi: true },
    { provide: ListParentControl, useExisting: forwardRef(() => ListControlValue) },
  ],
  host: { class: 'control' },
})
export class ListControlValue extends ListParentControl implements OnDestroy, AfterContentInit {
  private _destroy$ = new Subject();

  @ContentChildren(ListItemComponent, { descendants: true }) listItemComponents!: QueryList<ListItemComponent>;

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
