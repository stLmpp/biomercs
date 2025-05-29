import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { HttpError } from '@model/http-error';
import { MODAL_DATA } from '@shared/components/modal/modal.config';
import { ModalTitleDirective } from '../../shared/components/modal/modal-title.directive';
import { ModalContentDirective } from '../../shared/components/modal/modal-content.directive';
import { ModalActionsDirective } from '../../shared/components/modal/modal-actions.directive';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ModalCloseDirective } from '../../shared/components/modal/modal-close.directive';
import { KeyValuePipe } from '@angular/common';

@Component({
  selector: 'bio-error',
  templateUrl: './error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ModalTitleDirective,
    ModalContentDirective,
    ModalActionsDirective,
    ButtonComponent,
    ModalCloseDirective,
    KeyValuePipe,
  ],
})
export class ErrorComponent {
  constructor(@Inject(MODAL_DATA) public httpError: HttpError) {}
}
