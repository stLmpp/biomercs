import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, ViewChild } from '@angular/core';
import { RegionQuery } from '../region.query';
import { combineLatest, debounceTime, delay, finalize, map, Observable, startWith, tap } from 'rxjs';
import { ModalRef } from '@shared/components/modal/modal-ref';
import { MODAL_DATA } from '@shared/components/modal/modal.config';
import { Region } from '@model/region';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Control } from '@stlmpp/control';
import { LocalState, StMapView } from '@stlmpp/store';
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
})
export class RegionSelectComponent extends LocalState<{ loading: boolean; saving: boolean }> implements AfterViewInit {
  constructor(
    private modalRef: ModalRef,
    @Inject(MODAL_DATA) { idRegion, onSelect }: RegionSelectData,
    private regionService: RegionService,
    private regionQuery: RegionQuery
  ) {
    super({ loading: false, saving: false });
    this.idRegion = idRegion;
    this.idRegionOrigin = idRegion;
    this.onSelect = onSelect;
  }

  @ViewChild(CdkVirtualScrollViewport) cdkVirtualScrollViewport!: CdkVirtualScrollViewport;

  idRegionOrigin: number;
  idRegion: number;
  onSelect: (idRegion: number) => Observable<any>;
  readonly loading$ = this.selectState('loading');
  readonly saving$ = this.selectState('saving');

  readonly searchControl = new Control<string>('');
  readonly search$ = this.searchControl.value$.pipe(debounceTime(400));
  readonly all$: Observable<StMapView<Region>> = combineLatest([
    this.regionQuery.all$,
    this.search$.pipe(startWith('')),
  ]).pipe(map(([regions, term]) => regions.search('name', term)));

  readonly trackByRegion = trackById;

  onSave($event?: Event): void {
    $event?.preventDefault();
    if (this.idRegionOrigin !== this.idRegion) {
      this.updateState('saving', true);
      this.onSelect(this.idRegion)
        .pipe(
          finalize(() => {
            this.updateState('saving', false);
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

  ngAfterViewInit(): void {
    this.updateState('loading', true);
    this.regionService
      .get()
      .pipe(
        finalize(() => {
          this.updateState('loading', false);
        }),
        // Give time to angular render the items just fetched
        delay(0)
      )
      .subscribe(regions => {
        const index = regions.findIndex(region => region.id === this.idRegion);
        if (index > -1) {
          this.cdkVirtualScrollViewport.scrollToIndex(index);
        }
      });
  }
}
