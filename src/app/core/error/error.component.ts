import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { HttpError } from '@model/http-error';
import { MODAL_DATA } from '@shared/components/modal/modal.config';

@Component({
    selector: 'bio-error',
    templateUrl: './error.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ErrorComponent {
  constructor(@Inject(MODAL_DATA) public httpError: HttpError) {}
}
