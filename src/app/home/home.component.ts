import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { AuthQuery } from '../auth/auth.query';
import { HeaderQuery } from '../header/header.query';
import { filterNil } from '@shared/operators/filter';
import { pluck } from 'rxjs/operators';

@Component({
  selector: 'bio-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements AfterViewInit {
  constructor(private authQuery: AuthQuery, private headerQuery: HeaderQuery) {}

  @ViewChildren('block') blocks!: QueryList<ElementRef<HTMLAnchorElement>>;

  isLogged$ = this.authQuery.isLogged$;
  isAdmin$ = this.authQuery.isAdmin$;
  adminApprovalCount$ = this.headerQuery.adminApprovalCount$;
  playerApprovalCount$ = this.headerQuery.playerApprovalCount$;
  playerRequestChangesCount$ = this.headerQuery.playerRequestChangesCount$;

  idUser$ = this.authQuery.user$.pipe(filterNil(), pluck('id'));

  ngAfterViewInit(): void {
    this.blocks.first.nativeElement.focus();
  }
}
