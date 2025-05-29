import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ModalRef } from '@shared/components/modal/modal-ref';
import type { RegionSelectComponent, RegionSelectData } from './region-select/region-select.component';
import { ModalService } from '@shared/components/modal/modal.service';

@Injectable({ providedIn: 'root' })
export class RegionModalService {
  private modalService = inject(ModalService);


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
