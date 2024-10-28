import { Component, EventEmitter, OnInit } from '@angular/core';
import { IAgileFilters } from '@core/models/agile.model';
import { ThemeService } from '@core/services/theme-service';

@Component({
  selector: 'app-agile-summary',
  templateUrl: './agile-summary.component.html',
  styleUrls: ['./agile-summary.component.scss']
})
export class AgileSummaryComponent implements OnInit {
  public updateChart = new EventEmitter<IAgileFilters>();
  constructor(themeService: ThemeService) {}

  ngOnInit() {}
}
