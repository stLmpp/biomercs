import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { DatepickerComponent } from '@shared/components/datepicker/datepicker/datepicker.component';

@Directive({
    selector: '[bioDatepickerTrigger]',
    standalone: false
})
export class DatepickerTriggerDirective implements OnInit {
  constructor(public elementRef: ElementRef<HTMLElement>) {}

  @Input() bioDatepickerTrigger!: DatepickerComponent;

  @HostListener('click')
  onClick(): void {
    this.bioDatepickerTrigger.open();
  }

  ngOnInit(): void {
    this.bioDatepickerTrigger.setTrigger(this);
  }
}
