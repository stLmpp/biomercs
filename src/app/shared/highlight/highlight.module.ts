import { ModuleWithProviders, NgModule } from '@angular/core';
import { HIGHLIGHT_OPTIONS, HighlightModule as NgxHighlightModule, HighlightOptions } from 'ngx-highlightjs';

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
