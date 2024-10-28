import { Component, EventEmitter } from '@angular/core';
import { IScheduleFilters } from '@core/models/schedule-agile.model';

@Component({
  selector: 'app-schedule-agile',
  templateUrl: './schedule-agile.component.html',
  styleUrls: ['./schedule-agile.component.scss']
})
export class ScheduleAgileComponent {
  public updateChart = new EventEmitter<IScheduleFilters>();
  public clearFiltersEvent = new EventEmitter<IScheduleFilters>();

  onFilterChange(filter: IScheduleFilters) {
    this.updateChart.next(filter);
  }

  onClearFiltersChange(filter: IScheduleFilters) {
    this.clearFiltersEvent.next(filter);
  }
}
