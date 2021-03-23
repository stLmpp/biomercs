import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScoreAddComponent } from './score-add.component';
import { PlatformResolver } from '@shared/services/platform/platform.resolver';
import { AuthPlayerResolver } from '../../auth/auth-player.resolver';

const routes: Routes = [
  {
    path: '',
    component: ScoreAddComponent,
    resolve: [PlatformResolver, AuthPlayerResolver],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScoreAddRoutingModule {}
