import { NgModule } from '@angular/core';
import { ContactRoutingModule } from './contact-routing.module';
import { ContactComponent } from './contact.component';
import { CardModule } from '@shared/components/card/card.module';
import { StControlModule } from '@stlmpp/control';
import { FormModule } from '@shared/components/form/form.module';
import { TextFieldModule } from '@angular/cdk/text-field';
import { ButtonModule } from '@shared/components/button/button.module';

@NgModule({
  imports: [
    ContactRoutingModule,
    CardModule,
    FormModule,
    ButtonModule,
    StControlModule,
    TextFieldModule,
    ContactComponent,
  ],
})
export class ContactModule {}
