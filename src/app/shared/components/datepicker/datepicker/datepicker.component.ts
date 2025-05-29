import { ChangeDetectionStrategy, Component, HostBinding, Input, LOCALE_ID, TemplateRef, ViewChild, ViewContainerRef, inject, input } from '@angular/core';
import { CalendarViewModeEnum } from '@shared/components/datepicker/calendar-view-mode.enum';
import { coerceBooleanProperty } from 'st-utils';
import { Animations } from '@shared/animations/animations';
import { Overlay, OverlayRef, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { DatepickerTriggerDirective } from '@shared/components/datepicker/datepicker/datepicker-trigger.directive';
import { DatepickerDirective } from '@shared/components/datepicker/datepicker/datepicker.directive';
import { cdkOverlayTransparentBackdrop } from '@util/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { CALENDAR_LOCALE } from '@shared/components/datepicker/calendar-locale.token';
import { Destroyable } from '@shared/components/common/destroyable-component';
import { take, takeUntil } from 'rxjs';
import { AnimationEvent } from '@angular/animations';
import { getDatepickerOverlayPositions } from '@shared/components/datepicker/datepicker/datepicker';
import { CalendarComponent } from '../calendar/calendar.component';
import { CdkTrapFocus } from '@angular/cdk/a11y';

@Component({
  selector: 'bio-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [Animations.fade.inOut(), Animations.scale.in()],
  imports: [CalendarComponent, CdkTrapFocus],
})
export class DatepickerComponent extends Destroyable {
  private overlay = inject(Overlay);
  private scrollStrategyOptions = inject(ScrollStrategyOptions);
  private viewContainerRef = inject(ViewContainerRef);

  constructor() {
    const localeId = inject(LOCALE_ID);
    const locale = inject(CALENDAR_LOCALE, { optional: true });

    super();
    this.locale = locale ?? localeId;
  }

  private _input?: DatepickerDirective;
  private _trigger?: DatepickerTriggerDirective;
  private _disabled = false;
  private _overlayRef?: OverlayRef;

  @ViewChild(TemplateRef) templateRef!: TemplateRef<any>;

  readonly value = input<Date | null>();
  readonly viewMode = input<CalendarViewModeEnum>(CalendarViewModeEnum.day);
  readonly locale = input<string>();

  @Input()
  @HostBinding('attr.aria-disabled')
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(disabled: boolean) {
    this._disabled = coerceBooleanProperty(disabled);
  }

  private _getRelativeElement(): HTMLElement {
    const element = this._input?.elementRef.nativeElement ?? this._trigger?.elementRef.nativeElement;
    if (!element) {
      throw Error('Trigger or input is required to open the datepicker');
    }
    return element;
  }

  setInput(input: DatepickerDirective): void {
    this._input = input;
  }

  setTrigger(trigger: DatepickerTriggerDirective): void {
    this._trigger = trigger;
  }

  close(): void {
    this._overlayRef?.detach();
  }

  open(): void {
    this.close();
    const element = this._getRelativeElement();
    this._overlayRef = this.overlay.create({
      backdropClass: cdkOverlayTransparentBackdrop,
      hasBackdrop: true,
      panelClass: 'bio-datepicker-panel',
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(element)
        .withPositions(getDatepickerOverlayPositions()),
      scrollStrategy: this.scrollStrategyOptions.block(),
    });
    const portal = new TemplatePortal(this.templateRef, this.viewContainerRef);
    this._overlayRef.attach(portal);
    this._overlayRef
      .backdropClick()
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe(() => {
        this.close();
        this._input?.onTouched$.next();
      });
  }

  onValueChange($event: Date | null | undefined): void {
    if (!this._input) {
      return;
    }
    this._input.setValue($event);
    this._input.onChange$.next($event);
    this.close();
  }

  onFadeDone($event: AnimationEvent): void {
    if (this._overlayRef && $event.toState === 'void') {
      this._overlayRef.dispose();
    }
  }
}
