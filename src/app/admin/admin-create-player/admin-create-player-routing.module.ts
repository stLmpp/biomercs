import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminCreatePlayerComponent } from './admin-create-player.component';
import { RegionResolver } from '../../region/region.resolver';

const routes: Routes = [
  {
    path: '',
    component: AdminCreatePlayerComponent,
    resolve: [RegionResolver],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminCreatePlayerRoutingModule {}
