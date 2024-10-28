import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgileSummaryComponent } from './agile-summary/agile-summary.component';
import { AgileComponent } from './agile.component';
import { RequestsBurndownComponent } from './requests-burndown/requests-burndown.component';
import { ScheduleAgileComponent } from './schedule-agile/schedule-agile.component';
import { SprintsPlanningComponent } from './sprints-planning/sprints-planning.component';

const routes: Routes = [
  {
    path: '',
    component: AgileComponent,
    children: [
      {
        path: 'requests-burndown',
        children: [
          {
            path: '',
            component: RequestsBurndownComponent
          }
        ]
      },
      {
        path: 'sprints-planning',
        children: [
          {
            path: '',
            component: SprintsPlanningComponent
          }
        ]
      },
      {
        path: 'agile-summary',
        children: [
          {
            path: '',
            component: AgileSummaryComponent
          }
        ]
      },
      {
        path: 'schedule-agile',
        children: [
          {
            path: '',
            component: ScheduleAgileComponent
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgileRoutingModule {}
