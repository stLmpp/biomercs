import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FaqComponent } from './faq.component';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { createMeta } from '@shared/meta/meta';

const routes: Routes = [
  {
    path: '',
    component: FaqComponent,
    data: {
      [RouteDataEnum.title]: 'FAQ',
      [RouteDataEnum.meta]: createMeta({ title: 'FAQ', description: 'Frequently Asked Questions' }),
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FaqRoutingModule {}
