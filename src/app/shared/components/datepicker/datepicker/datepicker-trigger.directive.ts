import { Directive, ElementRef, HostListener, OnInit, inject, input } from '@angular/core';
import { DatepickerComponent } from '@shared/components/datepicker/datepicker/datepicker.component';

@Directive({ selector: '[bioDatepickerTrigger]' })
export class DatepickerTriggerDirective implements OnInit {
  elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly bioDatepickerTrigger = input.required<DatepickerComponent>();

  @HostListener('click')
  onClick(): void {
    this.bioDatepickerTrigger().open();
  }

  ngOnInit(): void {
    this.bioDatepickerTrigger().setTrigger(this);
  }
}
