import { ModuleWithProviders, NgModule } from '@angular/core';
import { HIGHLIGHT_OPTIONS, HighlightModule as NgxHighlightModule } from 'ngx-highlightjs';
import { HighlightOptions } from 'ngx-highlightjs/lib/highlight.model';

const coreHighlightOptions: HighlightOptions = {
  coreLibraryLoader: () => import('highlight.js/lib/core'),
};

@NgModule({
  imports: [NgxHighlightModule],
  exports: [NgxHighlightModule],
})
export class HighlightModule {
  static forRoot(languages: Record<string, () => Promise<any>>): ModuleWithProviders<HighlightModule> {
    return {
      ngModule: HighlightModule,
      providers: [{ provide: HIGHLIGHT_OPTIONS, useValue: { ...coreHighlightOptions, languages } as HighlightOptions }],
    };
  }
}
