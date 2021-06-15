import { AfterViewInit, Directive, HostListener, QueryList, ViewChildren } from '@angular/core';
import { Key } from '@model/enum/key';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { ButtonComponent } from '@shared/components/button/button.component';

@Directive()
export abstract class CalendarKeyboardNavigation implements AfterViewInit {
  @ViewChildren(ButtonComponent) buttons!: QueryList<ButtonComponent>;

  focusKeyManager!: FocusKeyManager<ButtonComponent>;

  @HostListener('keydown', ['$event'])
  onKeydown($event: KeyboardEvent): void {
    switch ($event.key) {
      case Key.ArrowRight:
        if (!$event.ctrlKey) {
          this.handleArrowRight($event);
        }
        break;
      case Key.ArrowLeft:
        if (!$event.ctrlKey) {
          this.handleArrowLeft($event);
        }
        break;
      case Key.ArrowDown:
        $event.stopPropagation();
        this.handleArrowDown($event);
        break;
      case Key.ArrowUp:
        this.handleArrowUp($event);
        break;
      case Key.Enter: {
        this.handleEnter($event);
        break;
      }
      case Key.Home: {
        this.handleHome($event);
        break;
      }
      case Key.End: {
        this.handleEnd($event);
        break;
      }
      case Key.PageDown: {
        this.handlePageDown($event);
        break;
      }
      case Key.PageUp: {
        this.handlePageUp($event);
        break;
      }
    }
  }

  handleEnd($event: KeyboardEvent): void {
    this.focusKeyManager.setLastItemActive();
  }

  handleHome($event: KeyboardEvent): void {
    this.focusKeyManager.setFirstItemActive();
  }

  ngAfterViewInit(): void {
    this.focusKeyManager = new FocusKeyManager<ButtonComponent>(this.buttons);
    this.focusKeyManager.setFirstItemActive();
  }

  abstract handleArrowRight($event: KeyboardEvent): void;
  abstract handleArrowLeft($event: KeyboardEvent): void;
  abstract handleArrowDown($event: KeyboardEvent): void;
  abstract handleArrowUp($event: KeyboardEvent): void;
  abstract handlePageDown($event: KeyboardEvent): void;
  abstract handlePageUp($event: KeyboardEvent): void;
  abstract handleEnter($event: KeyboardEvent): void;
}
