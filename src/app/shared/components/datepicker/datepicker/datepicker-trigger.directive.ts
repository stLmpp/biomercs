import { Directive, ElementRef, HostListener, Input, OnInit, inject } from '@angular/core';
import { DatepickerComponent } from '@shared/components/datepicker/datepicker/datepicker.component';

@Directive({ selector: '[bioDatepickerTrigger]' })
export class DatepickerTriggerDirective implements OnInit {
  elementRef = inject<ElementRef<HTMLElement>>(ElementRef);


  @Input() bioDatepickerTrigger!: DatepickerComponent;

  @HostListener('click')
  onClick(): void {
    this.bioDatepickerTrigger.open();
  }

  ngOnInit(): void {
    this.bioDatepickerTrigger.setTrigger(this);
  }
}
