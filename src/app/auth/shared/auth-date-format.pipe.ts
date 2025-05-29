import { Injectable, LOCALE_ID, Pipe, PipeTransform, inject } from '@angular/core';
import { AuthQuery } from '../auth.query';
import { DatePipe } from '@angular/common';

@Pipe({ name: 'authDateFormat' })
@Injectable({ providedIn: 'root' })
export class AuthDateFormatPipe implements PipeTransform {
  private authQuery = inject(AuthQuery);

  constructor() {
    const locale = inject(LOCALE_ID);

    this.datePipe = new DatePipe(locale);
  }

  datePipe: DatePipe;

  transform(value: string | Date | null | undefined): string | null {
    return this.datePipe.transform(value, this.authQuery.getUser()?.dateFormat ?? 'dd/MM/yyyy');
  }
}
