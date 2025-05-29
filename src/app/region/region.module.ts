import { NgModule } from '@angular/core';
import { RegionSelectComponent } from './region-select/region-select.component';
import { ModalModule } from '@shared/components/modal/modal.module';
import { ListModule } from '@shared/components/list/list.module';
import { ButtonModule } from '@shared/components/button/button.module';
import { StUtilsArrayModule } from '@stlmpp/utils';
import { FormModule } from '@shared/components/form/form.module';
import { StControlModelModule, StControlModule } from '@stlmpp/control';
import { FlagModule } from '@shared/components/icon/flag/flag.module';
import { SpinnerModule } from '@shared/components/spinner/spinner.module';

@NgModule({
  imports: [
    ListModule,
    SpinnerModule,
    ModalModule,
    FormModule,
    ButtonModule,
    FlagModule,
    StControlModelModule,
    StControlModule,
    StUtilsArrayModule,
    RegionSelectComponent,
  ],
})
export class RegionModule {}
