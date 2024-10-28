import { Component, OnInit } from '@angular/core';
import { darkPallete, IPallete, lightPallete } from '@config/theme-pallete';
import { RequestsBurndownService } from '@core/services/requests-burndown.service';
import { ThemeService } from '@core/services/theme-service';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { SprintsPlanningConfig } from './sprints-planning-config-table';

@Component({
  selector: 'app-sprints-planning',
  templateUrl: './sprints-planning.component.html',
  styleUrls: ['./sprints-planning.component.scss']
})
export class SprintsPlanningComponent implements OnInit {
  public titleFilter: string = '';
  public settings = {};
  public tableData: Array<any>;
  public columns;
  public isLoading = true;
  public sprintList: any = [];

  public pallete: IPallete;
  public subscribers: Array<Subscription> = [];

  constructor(
    private requestsBurndownService: RequestsBurndownService,
    public themeService: ThemeService
  ) {
    this.setCustomSetting();
  }

  ngOnDestroy() {
    this.subscribers.forEach(s => s.unsubscribe());
  }

  ngOnInit(): void {
    this.pallete = this.themeService.isDarkTheme ? darkPallete : lightPallete;
    this.columns = SprintsPlanningConfig();
    this.isLoading = true;
    this.builDataTableSample();
  }

  builDataTableSample(): void {
    this.isLoading = true;

    this.requestsBurndownService.GetSprintsPlanning().subscribe((data: any) => {
      let sprintList = [];
      data.forEach(x => {
        if (sprintList.find(y => y.sprint === x.sprint) === undefined) {
          sprintList.push({
            sprint: x.sprint,
            sprintName: `${x.sprint} (${moment(x.sprintDateStart).format(
              'DD-MM-YYYY'
            )} - ${moment(x.sprintDateEnd).format('DD-MM-YYYY')})`
          });
        }
      });
      sprintList.forEach(sprint => {
        this.sprintList.push({
          name: sprint.sprintName,
          tableData: data.filter(x => x.sprint === sprint.sprint)
        });
      });
      // this.tableData = data;
      this.isLoading = false;
    });
  }

  setCustomSetting() {
    this.settings['fixedColumns'] = {
      leftColumns: 1
    };
    this.settings['order'] = [4, 'asc'];
    this.settings['paging'] = false;
    this.settings['searching'] = false;
    this.settings['jqueryEvents'] = () => {
      $(document).on('click', '#dataEcobinTable tbody tr', e => {
        const parentRow = $(e.target).parent('tr');
        const isSelected = parentRow.hasClass('selected');

        $(e.target)
          .parents('tbody')
          .find('tr')
          .removeClass('selected');
        if (!isSelected) {
          parentRow.addClass('selected');
        }
      });
    };
    // this.settings['buttons'] = [
    //   {
    //     extend: 'excelHtml5',
    //     title: 'Sprints Planning Table',
    //     filename: `Mfg. Ops. DigitalSC - Agile Reports - Sprints Planning Table - ${moment()
    //       .toDate()
    //       .getFullYear()}-${(
    //       moment()
    //         .toDate()
    //         .getMonth() + 1
    //     )
    //       .toString()
    //       .padStart(2, '0')}-${moment()
    //       .toDate()
    //       .getDate()
    //       .toString()
    //       .padStart(2, '0')} ${moment()
    //       .toDate()
    //       .getHours()
    //       .toString()
    //       .padStart(2, '0')}h${moment()
    //       .toDate()
    //       .getMinutes()
    //       .toString()
    //       .padStart(2, '0')}m${moment()
    //       .toDate()
    //       .getSeconds()
    //       .toString()
    //       .padStart(2, '0')}s`,
    //     className: `btn btn-modal excelButton btn-${
    //       this.themeService.isDarkTheme ? 'dark' : 'light'
    //     }`,
    //     text: '<i class="fas fa-download"></i>',
    //     exportOptions: {
    //       columns: ':visible',
    //       format: {
    //         body: function(data) {
    //           //remove the thousands separator so the value is recognized as a number in the worksheet
    //           data = $('<p>' + data + '</p>').text();
    //           data = data.replace('.', '');
    //           return data.replace(',', '.');
    //         }
    //       }
    //     }
    //   },
    //   {
    //     extend: 'colvis',
    //     columns: ':gt(0)',
    //     className: `btn btn-${
    //       this.themeService.isDarkTheme ? 'dark' : 'light'
    //     }`,
    //     text: '<i class="fas fa-eye"></i>'
    //   }
    // ];
  }
}
