import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer.component';
import { ButtonModule } from '@shared/components/button/button.module';
import { RouterModule } from '@angular/router';

@NgModule({
  exports: [FooterComponent],
  imports: [CommonModule, ButtonModule, RouterModule, FooterComponent],
})
export class FooterModule {}
