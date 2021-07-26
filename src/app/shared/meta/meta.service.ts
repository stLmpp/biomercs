import { Injectable, KeyValueDiffers } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { Destroyable } from '@shared/components/common/destroyable-component';
import { distinctUntilChanged, map, takeUntil } from 'rxjs';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { RouterQuery } from '@stlmpp/router';
import { isMap } from 'st-utils';

@Injectable({ providedIn: 'root' })
export class MetaService extends Destroyable {
  constructor(private meta: Meta, private routerQuery: RouterQuery, private keyValueDiffers: KeyValueDiffers) {
    super();
  }

  readonly keyValueDiffer = this.keyValueDiffers.find(new Map<string, string>()).create<string, string>();

  init(): void {
    this.routerQuery
      .selectData<Map<string, string> | undefined>(RouteDataEnum.meta)
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged(),
        map(metaMap => (isMap(metaMap) ? metaMap : new Map()))
      )
      .subscribe(metaMap => {
        const diff = this.keyValueDiffer.diff(metaMap);
        if (!diff) {
          return;
        }
        diff.forEachAddedItem(item => {
          this.meta.addTag({ name: item.key, content: item.currentValue! });
        });
        diff.forEachChangedItem(item => {
          this.meta.updateTag({ name: item.key, content: item.currentValue! });
        });
        diff.forEachRemovedItem(item => {
          this.meta.removeTag(`name='${item.key}'`);
        });
      });
  }
}
