import { Injectable } from '@angular/core';
import { EntityQuery } from '@stlmpp/store';
import { UrlMetadataState, UrlMetadataStore } from '@shared/services/url-metadata/url-metadata.store';

@Injectable({ providedIn: 'root' })
export class UrlMetadataQuery extends EntityQuery<UrlMetadataState> {
  constructor(urlMetadataStore: UrlMetadataStore) {
    super(urlMetadataStore);
  }
}
