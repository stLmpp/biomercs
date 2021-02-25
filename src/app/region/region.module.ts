import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegionSelectComponent } from './region-select/region-select.component';
import { FlagModule } from '@shared/components/icon/flag/flag.module';
import { SpinnerModule } from '@shared/components/spinner/spinner.module';
import { ModalModule } from '@shared/components/modal/modal.module';
import { ListModule } from '@shared/components/list/list.module';
import { StControlModule } from '@stlmpp/control';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ButtonModule } from '@shared/components/button/button.module';
import { NgLetModule } from '@shared/let/ng-let.module';
import { FormModule } from '@shared/components/form/form.module';

@NgModule({
  declarations: [RegionSelectComponent],
  imports: [
    CommonModule,
    FlagModule,
    SpinnerModule,
    ModalModule,
    ListModule,
    StControlModule,
    ScrollingModule,
    ButtonModule,
    NgLetModule,
    FormModule,
  ],
})
export class RegionModule {}
