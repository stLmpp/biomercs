import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminCreatePlayerComponent } from './admin-create-player.component';
import { RegionResolver } from '../../region/region.resolver';
import { RouteDataEnum } from '@model/enum/route-data.enum';

const routes: Routes = [
  {
    path: '',
    component: AdminCreatePlayerComponent,
    resolve: {
      [RouteDataEnum.regions]: RegionResolver,
    },
    data: {
      [RouteDataEnum.title]: 'Create player',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminCreatePlayerRoutingModule {}
