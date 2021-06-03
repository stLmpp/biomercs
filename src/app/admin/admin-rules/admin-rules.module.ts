import { NgModule } from '@angular/core';
import { AdminRulesRoutingModule } from './admin-rules-routing.module';
import { AdminRulesComponent } from './admin-rules.component';
import { CardModule } from '@shared/components/card/card.module';
import { FormModule } from '@shared/components/form/form.module';
import { StControlModule } from '@stlmpp/control';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ButtonModule } from '@shared/components/button/button.module';
import { TextFieldModule } from '@angular/cdk/text-field';

@NgModule({
  declarations: [AdminRulesComponent],
  imports: [
    AdminRulesRoutingModule,
    CardModule,
    FormModule,
    StControlModule,
    DragDropModule,
    ButtonModule,
    TextFieldModule,
  ],
})
export class AdminRulesModule {}
