import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Rule, RuleAdd, RuleUpdate, RuleUpsert } from '@model/rule';
import { RuleStore } from './rule.store';
import { useCache } from '@stlmpp/store';

@Injectable({ providedIn: 'root' })
export class RuleService {
  constructor(private http: HttpClient, private ruleStore: RuleStore) {}

  endPoint = 'rule';

  add(dto: RuleAdd): Observable<Rule> {
    return this.http.post<Rule>(this.endPoint, dto).pipe(
      tap(rule => {
        this.ruleStore.upsert(rule.id, rule);
      })
    );
  }

  update(idRule: string, dto: RuleUpdate): Observable<Rule> {
    return this.http.patch<Rule>(`${this.endPoint}/${idRule}`, dto).pipe(
      tap(rule => {
        this.ruleStore.upsert(rule.id, rule);
      })
    );
  }

  upsert(dtos: RuleUpsert[]): Observable<Rule[]> {
    return this.http.post<Rule[]>(`${this.endPoint}/upsert`, dtos).pipe(
      tap(rules => {
        this.ruleStore.remove(dtos.filter(dto => dto.deleted && dto.id).map(dto => dto.id!));
        this.ruleStore.upsert(rules);
      })
    );
  }

  get(): Observable<Rule[]> {
    return this.http.get<Rule[]>(this.endPoint).pipe(
      useCache(this.ruleStore),
      tap(rules => {
        this.ruleStore.setEntities(rules);
      })
    );
  }
}
