import { NgModule } from '@angular/core';
import { ErrorComponent } from './error.component';
import { ModalModule } from '@shared/components/modal/modal.module';
import { ButtonModule } from '@shared/components/button/button.module';

@NgModule({
  imports: [ModalModule, ButtonModule, ErrorComponent],
})
export class ErrorModule {}
