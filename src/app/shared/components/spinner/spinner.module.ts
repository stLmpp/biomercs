import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './spinner.component';
import { LoadingComponent } from './loading/loading.component';
import { LoadingDirective } from './loading/loading.directive';

const DECLARATIONS = [SpinnerComponent, LoadingComponent, LoadingDirective];
const MODULES = [CommonModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES],
})
export class SpinnerModule {}
