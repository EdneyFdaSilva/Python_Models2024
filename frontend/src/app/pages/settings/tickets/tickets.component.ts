import { UserService } from './../../../core/services/user.service';
import { TicketsService } from '@services';
import { ITicketEntity, IUserEntity } from '@models';
import { Component, OnInit, Renderer, AfterViewInit } from '@angular/core';

import {
  tableConfig,
  ticketStatusDropDown,
  ticketStatus,
  ticketType
} from './tickets-config';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { tap, flatMap, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent implements OnInit, AfterViewInit {
  public loading = false;
  public uid;
  public allTickets: Array<ITicketEntity>;
  public ticketsData: Array<ITicketEntity>;
  public ticketsOwner: Array<ITicketEntity>;
  public columns: Array<DataTables.ColumnSettings> = tableConfig();
  public settings: DataTables.Settings = {};

  public filterForm = new FormGroup({
    ticketOwner: new FormControl(1)
  });

  public fields = {
    ticketOwner: {
      id: 'ticketStatus',
      name: 'TicketStatus',
      type: 'radio',
      options: [
        {
          id: 'allTickets',
          name: 'All Tickets',
          value: 1
        },
        {
          id: 'myTickets',
          name: 'My Tickets',
          value: 2
        }
      ]
    }
  };

  public filters = {
    status: [],
    owner: 1
  };

  public dropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'text',
    itemsShowLimit: 1
  };

  public ticketStatusDropDown = ticketStatusDropDown().options.map(
    item => item.name
  );

  public userData: IUserEntity;

  constructor(
    private readonly ticketsService: TicketsService,
    private readonly renderer: Renderer,
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly activatedRoute: ActivatedRoute
  ) {
    this.uid = Date.now();
  }

  ngOnInit() {
    this.settings.order = [8, 'desc'];
    this.getAccount()
      .pipe(
        switchMap(() => {
          return this.getTickets();
        })
      )
      .subscribe(() => {
        this.changeOwner(null);
      });
  }

  changeOwner(e) {
    this.filterForm.controls.ticketOwner.valueChanges.subscribe(value => {
      this.ticketsData = [];
      this.ticketsOwner = [];
      this.filters.status = [];
      if (value === 2) {
        this.allTickets.forEach(ticket => {
          if (ticket.userRequestEmail === this.userData.email) {
            this.ticketsOwner.push(ticket);
          }
        });
        this.ticketsData = this.ticketsOwner;
      } else {
        this.ticketsOwner = this.allTickets;
        this.ticketsData = this.ticketsOwner;
      }
      this.settings.order = [8, 'desc'];
    });
  }

  getAccount() {
    return this.userService
      .showMyInfo()
      .pipe(tap(user => (this.userData = user)));
  }

  ngAfterViewInit() {
    this.watchEditClick();
  }

  onFilterChange(value) {
    if (value.length > 0) {
      this.ticketsData = this.ticketsOwner.filter(ticket =>
        value.includes(ticket.status)
      );
    } else {
      this.ticketsData = this.ticketsOwner;
    }
  }

  getTickets() {
    return this.ticketsService.getAll().pipe(
      tap((response: ITicketEntity[]) => {
        const responseMapped = response.map(row => {
          row.status = row.status = ticketStatus.find(
            status => status.id === row.status
          ).name;

          row.ticketType = ticketType.find(type => {
            return type.id === row.ticketType;
          }).name;
          return row;
        });
        this.allTickets = responseMapped;
        this.ticketsData = responseMapped;
        this.ticketsOwner = responseMapped;
      })
    );
  }

  watchEditClick() {
    this.renderer.listenGlobal('document', 'click', event => {
      if (event.target.hasAttribute('view-ticket-id')) {
        const viewUserId = event.target.getAttribute('view-ticket-id');
        this.router.navigateByUrl(`/settings/tickets/crud?id=${viewUserId}`);
      }
    });
  }
}
