import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { debounceTime, finalize, Observable, tap } from 'rxjs';
import { ModalRef } from '@shared/components/modal/modal-ref';
import { MODAL_DATA } from '@shared/components/modal/modal.config';
import { Region } from '@model/region';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Control } from '@stlmpp/control';
import { trackById } from '@util/track-by';
import { RegionService } from '../region.service';

export interface RegionSelectData {
  idRegion: number;
  onSelect: (idRegion: number) => Observable<any>;
}

@Component({
    selector: 'bio-region-select',
    templateUrl: './region-select.component.html',
    styleUrls: ['./region-select.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class RegionSelectComponent implements OnInit, AfterViewInit {
  constructor(
    private modalRef: ModalRef,
    @Inject(MODAL_DATA) { idRegion, onSelect }: RegionSelectData,
    private regionService: RegionService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.idRegion = idRegion;
    this.idRegionOrigin = idRegion;
    this.onSelect = onSelect;
  }

  private _viewInitialized = false;
  private _scrolled = false;
  @ViewChild(CdkVirtualScrollViewport) cdkVirtualScrollViewport?: CdkVirtualScrollViewport;

  regions: Region[] = [];

  idRegionOrigin: number;
  idRegion: number;
  onSelect: (idRegion: number) => Observable<any>;
  loading = true;
  saving = false;

  readonly searchControl = new Control<string>('');
  readonly search$ = this.searchControl.value$.pipe(debounceTime(400));

  readonly trackByRegion = trackById;

  private _scrollToIdRegionSelected(): void {
    const index = this.regions.findIndex(region => region.id === this.idRegion);
    if (index > -1 && this.cdkVirtualScrollViewport) {
      this.cdkVirtualScrollViewport.scrollToIndex(index);
    }
    this._scrolled = true;
  }

  onSave($event?: Event): void {
    $event?.preventDefault();
    if (this.idRegionOrigin !== this.idRegion) {
      this.saving = true;
      this.onSelect(this.idRegion)
        .pipe(
          finalize(() => {
            this.saving = false;
            this.changeDetectorRef.markForCheck();
          }),
          tap(() => {
            this.modalRef.close();
          })
        )
        .subscribe();
    } else {
      this.modalRef.close();
    }
  }

  onClose(): void {
    this.modalRef.close();
  }

  ngOnInit(): void {
    this.regionService
      .get()
      .pipe(
        finalize(() => {
          this.loading = false;
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe(regions => {
        this.regions = regions;
        if (this._scrolled || !this._viewInitialized) {
          return;
        }
        this._scrollToIdRegionSelected();
      });
  }

  ngAfterViewInit(): void {
    this._viewInitialized = true;
    if (this._scrolled) {
      return;
    }
    setTimeout(() => {
      this._scrollToIdRegionSelected();
    });
  }
}
