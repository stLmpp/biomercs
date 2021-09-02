import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiSelectComponent } from './multi-select/multi-select.component';
import { MultiSelectItemsComponent } from './multi-select-items/multi-select-items.component';
import { FormModule } from '@shared/components/form/form.module';
import { IconModule } from '@shared/components/icon/icon.module';
import { ListModule } from '@shared/components/list/list.module';
import { ButtonModule } from '@shared/components/button/button.module';
import { SearchIfPipe } from './search-if.pipe';

@NgModule({
  declarations: [MultiSelectComponent, MultiSelectItemsComponent, SearchIfPipe],
  imports: [CommonModule, FormModule, IconModule, ListModule, ButtonModule],
  exports: [MultiSelectComponent],
})
export class MultiSelectModule {}
