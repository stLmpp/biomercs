import { NgModule } from '@angular/core';
import { MultiSelectComponent } from './multi-select.component';
import { MultiSelectItemsComponent } from './multi-select-items.component';
import { MultiSelectItemDirective } from './multi-select-item.directive';
import { FormModule } from '@shared/components/form/form.module';
import { IconModule } from '@shared/components/icon/icon.module';
import { ListModule } from '@shared/components/list/list.module';
import { ButtonModule } from '@shared/components/button/button.module';

const DECLARATIONS = [MultiSelectComponent, MultiSelectItemsComponent, MultiSelectItemDirective];
const MODULES = [FormModule, IconModule, ListModule, ButtonModule];

@NgModule({
  imports: [...MODULES, ...DECLARATIONS],
  exports: [...DECLARATIONS, ...MODULES],
})
export class MultiSelectModule {}
