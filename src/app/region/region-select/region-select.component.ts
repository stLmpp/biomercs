import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, ViewChild } from '@angular/core';
import { RegionQuery } from '../region.query';
import { debounceTime, delay, finalize, map, startWith, tap } from 'rxjs/operators';
import { ModalRef } from '@shared/components/modal/modal-ref';
import { MODAL_DATA } from '@shared/components/modal/modal.config';
import { AbstractRegionService } from '../region-service.token';
import { trackByRegion } from '@model/region';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { combineLatest, Observable } from 'rxjs';
import { Control } from '@stlmpp/control';
import { LocalState } from '@stlmpp/store';

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
    /*
     * Need to do this to avoid circular dependency, since there's a method in the
     * service to open this component as a modal
     */
    private regionService: AbstractRegionService,
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
  loading$ = this.selectState('loading');
  saving$ = this.selectState('saving');

  searchControl = new Control<string>('');
  search$ = this.searchControl.value$.pipe(debounceTime(400));
  all$ = combineLatest([this.regionQuery.all$, this.search$.pipe(startWith(''))]).pipe(
    map(([regions, term]) => regions.search('name', term))
  );

  trackByRegion = trackByRegion;

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
