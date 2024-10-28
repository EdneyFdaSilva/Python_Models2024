import { CdkTreeModule } from '@angular/cdk/tree';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatCheckboxModule,
  MatFormFieldModule,
  MatIconModule,
  MatSlideToggleModule,
  MatTreeModule,
  MAT_CHIPS_DEFAULT_OPTIONS,
} from '@angular/material';
import { CoreModule } from '@core/core.module';
import { AccountComponent } from '@pages/settings/account/account.component';
import { JobManagerComponent } from '@pages/settings/job-manager/job-manager.component';
import { ParametersComponent } from '@pages/settings/parameters/parameters.component';
import { PermissionGroupsComponent } from '@pages/settings/permission-groups/permission-groups.component';
import { SettingsRoutingModule } from '@pages/settings/settings-routing.module';
import { SettingsComponent } from '@pages/settings/settings.component';
import { UsersComponent } from '@pages/settings/users/users.component';
import { SharedModule } from '@shared/shared.module';
import { NgxMaskModule } from 'ngx-mask';
import { PermissionGroupsCrudComponent } from './permission-groups/persistence/permission-groups-crud.component';
import { QualityTargetCrudComponent } from './quality-target/persistence/quality-target-crud.component';
import { QualityTargetComponent } from './quality-target/quality-target.component';
import { ReportAccessComponent } from './report-access/report-access.component';
import { ReportEndpointComponent } from './report-endpoint/report-endpoint.component';
import { UserCrudComponent } from './users/persistence/user-crud.component';
import { TicketsComponent } from './tickets/tickets.component';
import { TicketsCrudComponent } from './tickets/tickets-crud/tickets-crud.component';
import { MenuManagerComponent } from './menu-manager/menu-manager.component';
import { ParametersManagerComponent } from './parameters-manager/parameters-manager.component';
import { VersioningManagerComponent } from './versioning-manager/versioning-manager.component';
import { DemoMaterialModule } from './tickets/tickets-crud/material-module';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { TargetComponent } from '@pages/settings/target/target.component';
import { TargetCrudComponent } from '@pages/settings/target/target-crud/target-crud.component';
import { TargetFiltersComponent } from '@pages/settings/target/target-filters/target-filters.component';
import { DollarRateComponent } from './dollar-rate/dollar-rate.component';
import { DollarRateFilterComponent } from './dollar-rate/dollar-rate-filter/dollar-rate-filter.component';
import { CapacitySetsComponent } from './capacity-sets/capacity-sets.component';
import { CapacitySetsFilterComponent } from './capacity-sets/capacity-sets-filter/capacity-sets-filter.component';
import { CapacitySetsModule } from '@organisms/capacity-sets-organism/capacity-sets.module';
import { JobStatusComponent } from './job-status/job-status.component';
import { FileImporterStatusComponent } from './file-import-status/file-importer-status.component';
import { RcpSetsComponent } from './rcp-sets/rcp-sets.component';
import { RcpFilterComponent } from './rcp-sets/rcp-filter/rcp-filter.component';
import { RcpSetsModule } from '@organisms/rcp-sets-organism/rcp-sets.module';
import { SecondLifeStatusComponent } from './second-life-status/second-life-status.component';
import { AsiaCalendarSetsComponent } from './asia-calendar-sets/asia-calendar-sets.component';
import { AsiaCalendarSetsModule } from '@organisms/asia-calendar-sets-organism/asia-calendar-sets.module';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    SettingsComponent,
    JobManagerComponent,
    UsersComponent,
    UserCrudComponent,
    QualityTargetComponent,
    QualityTargetCrudComponent,
    PermissionGroupsComponent,
    PermissionGroupsCrudComponent,
    ParametersComponent,
    AccountComponent,
    ReportAccessComponent,
    ReportEndpointComponent,
    TicketsComponent,
    TicketsCrudComponent,
    MenuManagerComponent,
    ParametersManagerComponent,
    VersioningManagerComponent,
    TargetComponent,
    TargetCrudComponent,
    TargetFiltersComponent,
    DollarRateComponent,
    DollarRateFilterComponent,
    CapacitySetsComponent,
    CapacitySetsFilterComponent,
    JobStatusComponent,
    FileImporterStatusComponent,
    RcpSetsComponent,
    RcpFilterComponent,
    SecondLifeStatusComponent,
    AsiaCalendarSetsComponent,
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
    CdkTreeModule,
    MatTreeModule,
    MatIconModule,
    MatCheckboxModule,
    MatFormFieldModule,
    SharedModule,
    MatSlideToggleModule,
    NgxMaskModule,
    DemoMaterialModule,
    CapacitySetsModule,
    RcpSetsModule,
    AsiaCalendarSetsModule,
    NgbCollapseModule,
  ],
  providers: [
    {
      provide: MAT_CHIPS_DEFAULT_OPTIONS,
      useValue: {
        separatorKeyCodes: [ENTER, COMMA],
      },
    },
  ],
})
export class SettingsModule { }
