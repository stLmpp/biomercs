import { NgModule } from '@angular/core';
import { RegionSelectComponent } from './region-select/region-select.component';
import { ModalModule } from '@shared/components/modal/modal.module';
import { ListModule } from '@shared/components/list/list.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ButtonModule } from '@shared/components/button/button.module';
import { NgLetModule } from '@shared/let/ng-let.module';
import { FormModule } from '@shared/components/form/form.module';

@NgModule({
  declarations: [RegionSelectComponent],
  imports: [ListModule, ScrollingModule, ButtonModule, ModalModule, NgLetModule, FormModule],
})
export class RegionModule {}
