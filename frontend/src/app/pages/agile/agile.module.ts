import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AgileOrganismModule } from '@organisms/agile-organism/agile-organism.module';
import { RequestsBurndownChartComponent } from '@organisms/agile-organism/requests-burndown-chart/requests-burndown-chart.component';
import { RequestsBurndownTableComponent } from '@organisms/agile-organism/requests-burndown-table/requests-burndown-table.component';
import { SummaryPointsByManagerChartComponent } from '@organisms/agile-organism/summary-points-by-manager-chart/summary-points-by-manager-chart.component';
import { SummaryPointsByModuleChartComponent } from '@organisms/agile-organism/summary-points-by-module-chart/summary-points-by-module-chart.component';
import { SharedModule } from '@shared/shared.module';

import { AgileRoutingModule } from './agile-routing.module';
import { AgileSummaryComponent } from './agile-summary/agile-summary.component';
import { AgileComponent } from './agile.component';
import { RequestsBurndownComponent } from './requests-burndown/requests-burndown.component';
import { ScheduleAgileComponent } from './schedule-agile/schedule-agile.component';
import { SprintsPlanningComponent } from './sprints-planning/sprints-planning.component';

@NgModule({
  declarations: [
    AgileComponent,
    RequestsBurndownComponent,
    RequestsBurndownChartComponent,
    RequestsBurndownTableComponent,
    SprintsPlanningComponent,
    AgileSummaryComponent,
    SummaryPointsByModuleChartComponent,
    SummaryPointsByManagerChartComponent,
    ScheduleAgileComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    NgbTooltipModule,
    AgileRoutingModule,
    AgileOrganismModule
  ]
})
export class AgileModule {}
