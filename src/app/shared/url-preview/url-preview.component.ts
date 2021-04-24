import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { UrlMetadataService } from '@shared/services/url-metadata/url-metadata.service';
import { filterNil } from '@shared/operators/filter';
import { debounceTime, finalize, switchMap } from 'rxjs/operators';
import { BooleanInput } from '@angular/cdk/coercion';
import { LocalState } from '@stlmpp/store';

@Component({
  selector: 'a[bio-url-preview]',
  templateUrl: './url-preview.component.html',
  styleUrls: ['./url-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'url-preview' },
})
export class UrlPreviewComponent extends LocalState<{ url: string | null; loading: boolean }> {
  constructor(private urlMetadataService: UrlMetadataService) {
    super({ url: null, loading: false }, { inputs: ['url'] });
  }

  @HostBinding('attr.href')
  @Input()
  url: string | null = null;

  loading$ = this.selectState('loading');

  urlMetadata$ = this.selectState('url').pipe(
    debounceTime(300),
    filterNil(),
    switchMap(url => {
      this.updateState({ loading: true });
      return this.urlMetadataService.get(url).pipe(
        finalize(() => {
          this.updateState({ loading: false });
        })
      );
    })
  );

  static ngAcceptInputType_dark: BooleanInput;
}
