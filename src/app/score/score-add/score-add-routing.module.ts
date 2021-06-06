import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScoreAddComponent } from './score-add.component';
import { PlatformResolver } from '@shared/services/platform/platform.resolver';
import { AuthPlayerResolver } from '../../auth/auth-player.resolver';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { createMeta } from '@shared/meta/meta';

const routes: Routes = [
  {
    path: '',
    component: ScoreAddComponent,
    resolve: [PlatformResolver, AuthPlayerResolver],
    data: {
      [RouteDataEnum.title]: 'Submit score',
      [RouteDataEnum.meta]: createMeta({ title: 'Submit score', description: 'Submit new score for approval' }),
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScoreAddRoutingModule {}
