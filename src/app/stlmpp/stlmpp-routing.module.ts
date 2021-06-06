import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StlmppComponent } from './stlmpp.component';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { createMeta } from '@shared/meta/meta';

const routes: Routes = [
  {
    path: '',
    component: StlmppComponent,
    data: {
      [RouteDataEnum.title]: 'stLmpp',
      [RouteDataEnum.meta]: createMeta({
        title: 'stLmpp page',
        description: 'Info about the creator of biomercs, stLmpp',
      }),
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StlmppRoutingModule {}
