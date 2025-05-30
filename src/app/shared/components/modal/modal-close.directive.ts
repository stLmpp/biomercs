import { Directive, ElementRef, HostBinding, HostListener, OnInit, inject, input } from '@angular/core';
import { ModalRef } from './modal-ref';
import { ModalService } from './modal.service';

@Directive({ selector: '[bioModalClose]' })
export class ModalCloseDirective<T = any> implements OnInit {
  private elementRef = inject(ElementRef);
  private modalService = inject(ModalService);
  private modalRef = inject(ModalRef, { optional: true });

  @HostBinding('attr.type')
  readonly type = input('button');

  readonly bioModalClose = input<T | ''>();

  @HostListener('click')
  onClick(): void {
    this.modalRef?.close(this.bioModalClose());
  }

  ngOnInit(): void {
    if (!this.modalRef) {
      this.modalRef = this.modalService.findClosestModal(this.elementRef) ?? null;
    }
  }
}
