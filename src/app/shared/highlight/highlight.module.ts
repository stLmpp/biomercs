import { ModuleWithProviders, NgModule } from '@angular/core';
import { HIGHLIGHT_OPTIONS, HighlightModule as NgxHighlightModule, HighlightJSOptions } from 'ngx-highlightjs';

const coreHighlightOptions: HighlightJSOptions = {
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
      providers: [
        { provide: HIGHLIGHT_OPTIONS, useValue: { ...coreHighlightOptions, languages } satisfies HighlightJSOptions },
      ],
    };
  }
}
