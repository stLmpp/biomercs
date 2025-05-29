import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, inject } from '@angular/core';
import { debounceTime, finalize, Observable, tap } from 'rxjs';
import { ModalRef } from '@shared/components/modal/modal-ref';
import { MODAL_DATA } from '@shared/components/modal/modal.config';
import { Region } from '@model/region';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  Control,
  StControlValueModule,
  StControlCommonModule,
  StControlModule,
  StControlModelModule,
} from '@stlmpp/control';
import { trackById } from '@util/track-by';
import { RegionService } from '../region.service';
import { LoadingComponent } from '../../shared/components/spinner/loading/loading.component';
import { ModalTitleDirective } from '../../shared/components/modal/modal-title.directive';
import { LabelDirective } from '../../shared/components/form/label.directive';
import { InputDirective } from '../../shared/components/form/input.directive';
import { ListDirective, ListControlValue } from '../../shared/components/list/list.directive';
import { ModalContentDirective } from '../../shared/components/modal/modal-content.directive';
import { ɵɵCdkVirtualScrollViewport, ɵɵCdkFixedSizeVirtualScroll, ɵɵCdkVirtualForOf } from '@angular/cdk/overlay';
import { ListItemComponent } from '../../shared/components/list/list-item.component';
import { FlagComponent } from '../../shared/components/icon/flag/flag.component';
import { PrefixDirective } from '../../shared/components/common/prefix.directive';
import { ModalActionsDirective } from '../../shared/components/modal/modal-actions.directive';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AsyncPipe } from '@angular/common';
import { StUtilsArrayModule } from '@stlmpp/utils';

export interface RegionSelectData {
  idRegion: number;
  onSelect: (idRegion: number) => Observable<any>;
}

@Component({
  selector: 'bio-region-select',
  templateUrl: './region-select.component.html',
  styleUrls: ['./region-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LoadingComponent,
    ModalTitleDirective,
    LabelDirective,
    InputDirective,
    StControlValueModule,
    StControlCommonModule,
    StControlModule,
    ListDirective,
    ListControlValue,
    ModalContentDirective,
    StControlModelModule,
    ɵɵCdkVirtualScrollViewport,
    ɵɵCdkFixedSizeVirtualScroll,
    ɵɵCdkVirtualForOf,
    ListItemComponent,
    FlagComponent,
    PrefixDirective,
    ModalActionsDirective,
    ButtonComponent,
    AsyncPipe,
    StUtilsArrayModule,
  ],
})
export class RegionSelectComponent implements OnInit, AfterViewInit {
  private modalRef = inject(ModalRef);
  private regionService = inject(RegionService);
  private changeDetectorRef = inject(ChangeDetectorRef);

  constructor() {
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
