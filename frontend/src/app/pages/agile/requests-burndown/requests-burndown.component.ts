import { Component, EventEmitter, OnInit } from '@angular/core';
import { IAgileFilters } from '@core/models/agile.model';
import { ThemeService } from '@core/services/theme-service';

@Component({
  selector: 'app-requests-burndown',
  templateUrl: './requests-burndown.component.html',
  styleUrls: ['./requests-burndown.component.scss']
})
export class RequestsBurndownComponent implements OnInit {
  public updateChart = new EventEmitter<IAgileFilters>();
  constructor(themeService: ThemeService) {}

  ngOnInit() {}

  onFilterChange(filter: IAgileFilters) {
    this.updateChart.next(filter);
  }
}
