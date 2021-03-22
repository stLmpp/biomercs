import { Component, ChangeDetectionStrategy, Input, HostBinding } from '@angular/core';
import { StateComponent } from '@shared/components/common/state-component';
import { UrlMetadataService } from '@shared/services/url-metadata/url-metadata.service';
import { filterNil } from '@shared/operators/filter';
import { finalize, switchMap } from 'rxjs/operators';
import { BooleanInput } from '@angular/cdk/coercion';

@Component({
  selector: 'a[bio-url-preview]',
  templateUrl: './url-preview.component.html',
  styleUrls: ['./url-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'url-preview' },
})
export class UrlPreviewComponent extends StateComponent<{ url: string | null; loading: boolean }> {
  constructor(private urlMetadataService: UrlMetadataService) {
    super({ url: null, loading: false });
  }

  private _url: string | null = null;

  @Input() set url(url: string | null) {
    this.updateState({ url });
    this._url = url;
  }

  @HostBinding('attr.href')
  get href(): string | null {
    return this._url;
  }

  loading$ = this.selectState('loading');

  urlMetadata$ = this.selectState('url').pipe(
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
