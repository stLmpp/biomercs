import { Directive, ElementRef, HostBinding, HostListener, Input, OnInit, Optional } from '@angular/core';
import { ModalRef } from './modal-ref';
import { ModalService } from './modal.service';

@Directive({
  selector: '[bioModalClose]',
})
export class ModalCloseDirective<T = any> implements OnInit {
  constructor(
    private elementRef: ElementRef,
    private modalService: ModalService,
    @Optional() private modalRef?: ModalRef
  ) {}

  @Input() @HostBinding('attr.type') type = 'button';

  @Input() modalClose?: T | '';

  @HostListener('click')
  onClick(): void {
    this.modalRef?.close(this.modalClose);
  }

  ngOnInit(): void {
    if (!this.modalRef) {
      this.modalRef = this.modalService.findClosestModal(this.elementRef);
    }
  }
}
