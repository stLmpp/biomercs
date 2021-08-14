import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, Renderer2 } from '@angular/core';
import { UrlMetadataService } from '@shared/services/url-metadata/url-metadata.service';
import { filterNil } from '@shared/operators/filter';
import { debounceTime, finalize, ReplaySubject, switchMap } from 'rxjs';

@Component({
  selector: 'a[bio-url-preview]',
  templateUrl: './url-preview.component.html',
  styleUrls: ['./url-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'url-preview' },
})
export class UrlPreviewComponent {
  constructor(
    private urlMetadataService: UrlMetadataService,
    private changeDetectorRef: ChangeDetectorRef,
    private renderer2: Renderer2,
    private elementRef: ElementRef<HTMLAnchorElement>
  ) {}

  private readonly _url$ = new ReplaySubject<string | null>();

  @Input()
  set url(url: string | null) {
    this._url$.next(url);
    this.renderer2.setAttribute(this.elementRef.nativeElement, 'href', url ?? '');
  }

  loading = false;

  readonly urlMetadata$ = this._url$.pipe(
    debounceTime(300),
    filterNil(),
    switchMap(url => {
      this.loading = true;
      this.changeDetectorRef.markForCheck();
      return this.urlMetadataService.get(url).pipe(
        finalize(() => {
          this.loading = false;
          this.changeDetectorRef.markForCheck();
        })
      );
    })
  );
}
