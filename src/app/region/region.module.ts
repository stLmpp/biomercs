import { NgModule } from '@angular/core';
import { RegionSelectComponent } from './region-select/region-select.component';
import { ModalModule } from '@shared/components/modal/modal.module';
import { ListModule } from '@shared/components/list/list.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ButtonModule } from '@shared/components/button/button.module';
import { NgLetModule } from '@stlmpp/utils';
import { FormModule } from '@shared/components/form/form.module';
import { StControlModelModule, StControlModule } from '@stlmpp/control';
import { FlagModule } from '@shared/components/icon/flag/flag.module';

@NgModule({
  declarations: [RegionSelectComponent],
  imports: [
    ListModule,
    ScrollingModule,
    ButtonModule,
    ModalModule,
    NgLetModule,
    FormModule,
    StControlModule,
    StControlModelModule,
    FlagModule,
  ],
})
export class RegionModule {}
