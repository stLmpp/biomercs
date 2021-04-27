import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScoreSearchComponent } from './score-search.component';
import { AuthPlayerResolver } from '../../auth/auth-player.resolver';

const routes: Routes = [
  {
    path: '',
    component: ScoreSearchComponent,
    resolve: [AuthPlayerResolver],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScoreSearchRoutingModule {}
