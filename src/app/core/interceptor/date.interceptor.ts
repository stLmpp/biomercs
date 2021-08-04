import { Injectable } from '@angular/core';
import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { isArray, isObject, isString } from 'st-utils';

@Injectable({ providedIn: 'root' })
export class DateInterceptor implements HttpInterceptor {
  private readonly _dateRegexp =
    /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/;

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      map(resp => {
        if (resp.type === HttpEventType.Response && resp.body) {
          return resp.clone({ body: this.handleAny(resp.body) });
        }
        return resp;
      })
    );
  }

  handleAny(value: any): any {
    if (isArray(value)) {
      return this.handleArray(value);
    } else if (isObject(value)) {
      return this.handleObject(value);
    }
    return value;
  }

  handleObject(object: Record<any, any>): any {
    return Object.entries(object).reduce((newObject, [key, value]) => {
      if (isArray(value)) {
        value = this.handleArray(value);
      } else if (isObject(value)) {
        value = this.handleObject(value);
      } else if (this.isIsoDate(key, value)) {
        value = new Date(value);
      }
      return { ...newObject, [key]: value };
    }, {});
  }

  handleArray(value: any[]): any {
    return value.map(item => {
      if (isArray(item)) {
        return this.handleArray(item);
      } else if (isObject(item)) {
        return this.handleObject(item);
      } else {
        return item;
      }
    });
  }

  isIsoDate(key: string, value: any): boolean {
    return key && value && isString(value) && this._dateRegexp.test(value);
  }
}
