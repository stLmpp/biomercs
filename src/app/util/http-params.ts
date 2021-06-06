import { HttpParams as OriginHttpParams } from '@angular/common/http';
import { isDate, isNil } from 'st-utils';

export class HttpParams extends OriginHttpParams {
  constructor(fromObject?: { [id: string]: any }, excludeNil?: boolean) {
    if (fromObject) {
      let entries = Object.entries(fromObject);
      if (excludeNil) {
        entries = entries.filter(([_, value]) => !isNil(value) && value !== '');
      }
      fromObject = entries.reduce(
        (obj, [key, value]) => ({ ...obj, [key]: isDate(value) ? value.toISOString() : value }),
        {}
      );
      super({ fromObject });
    } else {
      super();
    }
  }
}
