import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { RegionStore } from './region.store';
import { setLoading, useCache } from '@stlmpp/store';
import { AbstractRegionService } from './region-service.token';
import { ModalRef } from '@shared/components/modal/modal-ref';
import { RegionSelectComponent, RegionSelectData } from './region-select/region-select.component';
import { ModalService } from '@shared/components/modal/modal.service';
import { Region } from '@model/region';

@Injectable({ providedIn: 'root' })
export class RegionService extends AbstractRegionService {
  constructor(private http: HttpClient, private regionStore: RegionStore, private modalService: ModalService) {
    super();
  }

  endPoint = 'region';

  get(): Observable<Region[]> {
    return this.http.get<Region[]>(this.endPoint).pipe(
      useCache(this.regionStore),
      setLoading(this.regionStore),
      tap(regions => {
        this.regionStore.setEntities(regions);
      })
    );
  }

  async showSelectModal(
    idRegion: number,
    onSelect: (idRegion: number) => Observable<any>
  ): Promise<ModalRef<RegionSelectComponent, RegionSelectData>> {
    return this.modalService.openLazy<RegionSelectComponent, RegionSelectData>(
      () => import('./region-select/region-select.component').then(c => c.RegionSelectComponent),
      {
        data: { idRegion, onSelect },
        width: 500,
        module: () => import('./region.module').then(m => m.RegionModule),
      }
    );
  }
}
