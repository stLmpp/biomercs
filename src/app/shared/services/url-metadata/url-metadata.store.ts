import { Injectable } from '@angular/core';
import { EntityState, EntityStore } from '@stlmpp/store';
import { UrlMetadata } from '@model/url-metadata';

export type UrlMetadataState = EntityState<UrlMetadata>;

@Injectable({ providedIn: 'root' })
export class UrlMetadataStore extends EntityStore<UrlMetadataState> {
  constructor() {
    super({ name: 'url-metadata' });
  }
}
