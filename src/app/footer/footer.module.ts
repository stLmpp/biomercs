import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer.component';
import { ButtonModule } from '@shared/components/button/button.module';
import { NgLetModule } from '@shared/let/ng-let.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [FooterComponent],
  exports: [FooterComponent],
  imports: [CommonModule, ButtonModule, NgLetModule, RouterModule],
})
export class FooterModule {}
