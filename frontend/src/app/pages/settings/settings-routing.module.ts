import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobManagerComponent } from '@pages/settings/job-manager/job-manager.component';
import { ParametersComponent } from '@pages/settings/parameters/parameters.component';
import { PermissionGroupsComponent } from '@pages/settings/permission-groups/permission-groups.component';
import { SettingsComponent } from '@pages/settings/settings.component';
import { UsersComponent } from '@pages/settings/users/users.component';
import { UserCrudComponent } from '@pages/settings/users/persistence/user-crud.component';
import { AccountComponent } from '@pages/settings/account/account.component';
import { PermissionGroupsCrudComponent } from '@pages/settings/permission-groups/persistence/permission-groups-crud.component';
import { QualityTargetComponent } from './quality-target/quality-target.component';
import { QualityTargetCrudComponent } from './quality-target/persistence/quality-target-crud.component';
import { ReportAccessComponent } from './report-access/report-access.component';
import { ReportEndpointComponent } from './report-endpoint/report-endpoint.component';
import { TicketsComponent } from './tickets/tickets.component';
import { TicketsCrudComponent } from './tickets/tickets-crud/tickets-crud.component';
import { MenuManagerComponent } from './menu-manager/menu-manager.component';
import { ParametersManagerComponent } from './parameters-manager/parameters-manager.component';
import { VersioningManagerComponent } from './versioning-manager/versioning-manager.component';
import { TargetComponent } from './target/target.component';
import { TargetCrudComponent } from './target/target-crud/target-crud.component';
import { DollarRateComponent } from './dollar-rate/dollar-rate.component';
import { CapacitySetsComponent } from './capacity-sets/capacity-sets.component';
import { JobStatusComponent } from './job-status/job-status.component';
import { FileImporterStatusComponent } from './file-import-status/file-importer-status.component';
import { RcpSetsComponent } from './rcp-sets/rcp-sets.component';
import { SecondLifeStatusComponent } from './second-life-status/second-life-status.component';
import { AsiaCalendarSetsComponent } from './asia-calendar-sets/asia-calendar-sets.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      {
        path: 'job-manager',
        component: JobManagerComponent,
      },
      {
        path: 'users',
        component: UsersComponent,
      },
      {
        path: 'users/crud',
        component: UserCrudComponent,
      },
      {
        path: 'quality-target',
        component: QualityTargetComponent,
      },
      {
        path: 'quality-target/crud',
        component: QualityTargetCrudComponent,
      },
      {
        path: 'permission-groups',
        component: PermissionGroupsComponent,
      },
      {
        path: 'permission-groups/crud',
        component: PermissionGroupsCrudComponent,
      },
      {
        path: 'parameters',
        component: ParametersComponent,
      },
      {
        path: 'account',
        component: AccountComponent,
      },
      {
        path: 'report-access',
        component: ReportAccessComponent,
      },
      {
        path: 'report-endpoint',
        component: ReportEndpointComponent,
      },
      {
        path: 'tickets',
        component: TicketsComponent,
      },
      {
        path: 'tickets/crud',
        component: TicketsCrudComponent,
      },
      {
        path: 'menu-manager',
        component: MenuManagerComponent,
      },
      {
        path: 'parameters-manager',
        component: ParametersManagerComponent,
      },
      {
        path: 'versioning-manager',
        component: VersioningManagerComponent,
      },
      {
        path: 'target',
        component: TargetComponent,
      },
      {
        path: 'target/crud',
        component: TargetCrudComponent,
      },
      {
        path: 'target/crud/:id',
        component: TargetCrudComponent,
      },
      {
        path: 'dollar-rate',
        component: DollarRateComponent,
      },
      {
        path: 'dollar-rate/crud',
        component: DollarRateComponent,
      },
      {
        path: 'dollar-rate/crud/:id',
        component: DollarRateComponent,
      },
      {
        path: 'capacity-sets',
        component: CapacitySetsComponent,
      },
      {
        path: 'job-status',
        component: JobStatusComponent,
      },
      {
        path: 'file-importer-status',
        component: FileImporterStatusComponent,
      },
      {
        path: 'rcp-sets',
        component: RcpSetsComponent,
      },
      {
        path: 'second-life',
        component: SecondLifeStatusComponent,
      }, {
        path: 'asia-calendar',
        component: AsiaCalendarSetsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule { }
