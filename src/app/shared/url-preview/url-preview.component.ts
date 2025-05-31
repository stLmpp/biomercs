import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  Renderer2,
  inject,
} from '@angular/core';
import { UrlMetadataService } from '@shared/services/url-metadata/url-metadata.service';
import { filterNil } from '@util/operators/filter';
import { debounceTime, finalize, ReplaySubject, switchMap } from 'rxjs';
import { NgLetModule } from '@stlmpp/utils';
import { IconComponent } from '../components/icon/icon.component';
import { SpinnerComponent } from '../components/spinner/spinner.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'a[bio-url-preview]',
  templateUrl: './url-preview.component.html',
  styleUrls: ['./url-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'url-preview' },
  imports: [NgLetModule, IconComponent, SpinnerComponent, AsyncPipe],
})
export class UrlPreviewComponent {
  private urlMetadataService = inject(UrlMetadataService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private renderer2 = inject(Renderer2);
  private elementRef = inject<ElementRef<HTMLAnchorElement>>(ElementRef);

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
