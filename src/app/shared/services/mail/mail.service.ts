import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MailStatusQueue } from '@model/mail';

@Injectable({ providedIn: 'root' })
export class MailService {
  constructor(private http: HttpClient) {}

  endPoint = 'mail';

  statusQueue(): Observable<MailStatusQueue> {
    return this.http.get<MailStatusQueue>(`${this.endPoint}/status-queue`);
  }

  restartQueue(): Observable<MailStatusQueue> {
    return this.http.put<MailStatusQueue>(`${this.endPoint}/restart-queue`, undefined);
  }
}
