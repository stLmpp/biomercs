import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'ckeditor-view,[ckeditorView]',
    template: `<div class="ck-content" [innerHTML]="safeContent"></div>`,
    host: { class: 'ck ck-view' },
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class CKEditorView implements AfterViewInit {
  constructor(private domSanitizer: DomSanitizer, private elementRef: ElementRef<HTMLElement>) {}

  private _afterViewInit = false;

  @Input()
  set content(content: string | null | undefined) {
    this.safeContent = this.domSanitizer.bypassSecurityTrustHtml(content ?? '');
    this._setEmbed();
  }

  safeContent: SafeHtml = '';

  private _setEmbed(): void {
    if (!this._afterViewInit) {
      return;
    }
    const oembedList = this.elementRef.nativeElement.querySelectorAll('oembed');
    oembedList.forEach(oembed => {
      const url = oembed.getAttribute('url');
      if (!url || !url.includes('youtube')) {
        return;
      }
      const media = oembed.parentElement;
      if (!media) {
        return;
      }
      const videoId = new URL(url).searchParams.get('v');
      oembed.remove();
      media.innerHTML = `
        <div class="ck-media__wrapper">
          <div style="position: relative; height: 500px;">
            <iframe 
              src="https://www.youtube.com/embed/${videoId}" 
              style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;" 
              frameborder="0" 
              allow="autoplay; encrypted-media" 
              allowfullscreen="">
            </iframe>
          </div>
        </div>
      `;
    });
  }

  ngAfterViewInit(): void {
    this._afterViewInit = true;
    this._setEmbed();
  }
}
