import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './spinner.component';
import { LoadingComponent } from './loading/loading.component';
import { LoadingDirective } from './loading/loading.directive';

@NgModule({
  declarations: [SpinnerComponent, LoadingComponent, LoadingDirective],
  exports: [SpinnerComponent, LoadingComponent, LoadingDirective],
  imports: [CommonModule],
})
export class SpinnerModule {}
