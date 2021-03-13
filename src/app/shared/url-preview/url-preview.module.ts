import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UrlPreviewComponent } from './url-preview.component';
import { IconModule } from '@shared/components/icon/icon.module';
import { NgLetModule } from '@shared/let/ng-let.module';
import { SpinnerModule } from '@shared/components/spinner/spinner.module';

@NgModule({
  declarations: [UrlPreviewComponent],
  exports: [UrlPreviewComponent],
  imports: [CommonModule, IconModule, NgLetModule, SpinnerModule],
})
export class UrlPreviewModule {}
