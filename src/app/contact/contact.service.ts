import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ContactSendMail } from '@model/contact';
import { Observable } from 'rxjs';
import { ignoreErrorContext } from '../auth/auth-error.interceptor';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private http = inject(HttpClient);

  endPoint = 'contact';

  sendMail(dto: ContactSendMail): Observable<void> {
    return this.http.post<void>(`${this.endPoint}/send-mail`, dto, { context: ignoreErrorContext() });
  }
}
