import { Router, ActivatedRoute } from '@angular/router';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  flatMap,
  pairwise,
  startWith
} from 'rxjs/operators';
import { ToastService, TicketsService } from '@services';
import { ITicketEntity, IUserEntity } from '@models';
import {
  ticketTypeDropDown,
  ticketStatusDropDown,
  ticketPriorityDropDown,
  ticketResolutionDropDown
} from '../tickets-config';
import { UserService } from '@core/services/user.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { isNullOrUndefined } from 'util';
import { MenuService } from '@core/services/menu.service';
import { IMenu } from '@core/models/menu.model';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs';
import { debounce } from 'lodash';

export interface Email {
  emailcopy: string;
}

@Component({
  selector: 'app-tickets-crud',
  templateUrl: './tickets-crud.component.html',
  styleUrls: ['./tickets-crud.component.scss']
})
export class TicketsCrudComponent implements OnInit, OnDestroy, AfterViewInit {
  public loading = false;
  public ticketForm: FormGroup;
  public fileData: Array<any> = [];
  public filesToDelete: Array<any> = [];
  public menuList: Array<IMenu>;
  public id: number;
  public sendEmail: boolean = false;
  public resolved: boolean = false;
  public editMode = true;
  public history = false;
  public ticket: ITicketEntity;
  public ticketType: number;
  public screenIsVisible: boolean = false;
  public operationIsVisible: boolean = false;

  public ticketTypeDropDown = ticketTypeDropDown();
  public ticketStatusDropDown = ticketStatusDropDown();
  public ticketPriorityDropDown = ticketPriorityDropDown();
  public ticketResolutionDropDown = ticketResolutionDropDown();
  public ticketModuleDropDown = {};
  public ticketScreenDropDown = {};
  public ticketOperationDropDown = {};
  public subscriptions: Array<Subscription> = [];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  emails: Email[] = [];

  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required])
  });

  public optionsMenuDefaultDropdown: Array<any> = [
    {
      name: 'Select the option',
      value: null,
      id: null,
      order: 0
    }
  ];

  getTicketModuleDropDown() {
    return {
      id: 'id',
      name: 'Module',
      hasLabel: false,
      type: 'select',
      options: this.optionsMenuDefaultDropdown.concat(
        this.menuList
          .filter(m => !m.menuId)
          .map(x => ({
            name: x.name,
            value: x.id,
            id: x.id
          }))
      )
    };
  }

  getTicketScreenDropDown() {
    return {
      id: 'id',
      name: 'Screen',
      hasLabel: false,
      type: 'select',
      options: this.optionsMenuDefaultDropdown.concat(
        this.menuList
          .filter(m => m.menuId == this.ticketForm.controls.menuModuleId.value)
          .map(x => ({
            name: x.name,
            value: x.id,
            id: x.id
          }))
      )
    };
  }

  getTicketOperationDropDown() {
    return {
      id: 'id',
      name: 'Operation',
      hasLabel: false,
      type: 'select',
      options: this.optionsMenuDefaultDropdown.concat(
        this.menuList
          .filter(m => m.menuId == this.ticketForm.controls.menuScreenId.value)
          .map(x => ({
            name: x.name,
            value: x.id,
            id: x.id
          }))
      )
    };
  }

  loadMenuAll() {
    this.menuService.getAllMenus().subscribe(menus => {
      this.menuList = menus;
      this.ticketModuleDropDown = this.getTicketModuleDropDown();
    });
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our email
    if ((value || '').trim()) {
      this.emails.push({ emailcopy: value.trim() });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(email: Email): void {
    const index = this.emails.indexOf(email);

    if (index >= 0) {
      this.emails.splice(index, 1);
    }
  }
  public userData: IUserEntity;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly toastService: ToastService,
    private readonly ticketsService: TicketsService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly userService: UserService,
    private readonly menuService: MenuService
  ) {}

  watchStatusChange() {
    this.subscriptions.push(
      this.ticketForm.controls.status.valueChanges
        .pipe(distinctUntilChanged())
        .subscribe(status => {
          this.sendEmail = true;
          if (status == 4) {
            this.resolved = true;
          } else {
            this.resolved = false;
          }
        })
    );
  }

  handleModuleDropDown(e) {
    this.screenIsVisible = false;
    this.operationIsVisible = false;
    this.ticketForm.controls.menuScreenId.setValue(null);
    this.ticketForm.controls.menuOperationId.setValue(null);
    this.ticketOperationDropDown = {};
    if (e.target.selectedIndex > 0) {
      this.ticketScreenDropDown = this.getTicketScreenDropDown();
      if (this.ticketScreenDropDown['options'].length > 1)
        this.screenIsVisible = true;
    }
  }

  handleScreenDropDown(e) {
    this.operationIsVisible = false;
    this.ticketForm.controls.menuOperationId.setValue(null);
    if (e.target.selectedIndex > 0) {
      this.ticketOperationDropDown = this.getTicketOperationDropDown();
      if (this.ticketOperationDropDown['options'].length > 1) {
        this.operationIsVisible = true;
        this.applyValidatorsForMenuOperationId();
        return;
      }
    }
    this.applyValidatorsForMenuOperationId(false);
  }

  ngAfterViewInit() {
    this.watchStatusChange();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe);
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.loadMenuAll();
      this.id = params.id != null ? params.id : 0;
      this.sendEmail = this.id == 0;

      this.ticketForm = this.formBuilder.group(
        {
          id: [0],
          title: ['', Validators.required],
          description: ['', Validators.required],
          priority: ['', Validators.required],
          ticketType: ['', Validators.required],
          emailcopy: [''],
          openDate: [''],
          status: ['', Validators.required],
          releaseVersion: [''],
          resolution: [''],
          userRequestName: [''],
          manager: [''],
          ticketAttachments: ['', Validators.required],
          bugVersion: [''],
          informationUpdate: ['', Validators.required],
          objectives: ['', Validators.required],
          expectedBenefits: ['', Validators.required],
          inputs: ['', Validators.required],
          outputs: ['', Validators.required],
          process: ['', Validators.required],
          menuModuleId: [null, [Validators.required]],
          menuScreenId: [null, [Validators.required]],
          menuOperationId: [null, [Validators.required]]
        },
        {
          emitEvent: false
        }
      );

      if (this.id > 0) {
        this.loadTicket();
      }

      if (this.id > 0) {
        this.ticketForm.disable();
        this.form.disable();
        this.editMode = false;
        this.removable = false;
      }
    });

    this.getAccount();
  }

  applyValidatorsForMenuOperationId(actives: boolean = true) {
    if (actives) {
      this.ticketForm.controls.menuOperationId.setValidators([
        Validators.required,
        Validators.min(1)
      ]);
    }
  }

  get email() {
    return this.form.get('email');
  }

  emailListHasError(): Boolean {
    let hasError: boolean = false;
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    for (var i = 0, len = this.emails.length; i < len; i++) {
      if (
        this.emails[i].emailcopy !== '' &&
        !re.test(String(this.emails[i].emailcopy).toLowerCase())
      ) {
        hasError = true;
        break;
      }
    }

    return hasError;
  }

  getEmailError() {
    if (this.emailListHasError()) {
      return 'Please enter a valid email address.';
    }
  }

  getAccount() {
    this.userService.showMyInfo().subscribe(user => (this.userData = user));
  }

  private validateForm() {
    let ret = true;
    if (!this.ticketForm.controls.title.valid) {
      this.toastService.show("Title field can't be empty", {
        type: 'danger'
      });
      ret = false;
    }
    if (!this.ticketForm.controls.priority.valid) {
      this.toastService.show("Priority field can't be empty", {
        type: 'danger'
      });
      ret = false;
    }
    if (!this.ticketForm.controls.ticketType.valid) {
      this.toastService.show("Type field can't be empty", {
        type: 'danger'
      });
      ret = false;
    }
    if (!this.ticketForm.controls.description.valid) {
      this.toastService.show(
        `${
          this.ticketType === 3 ? 'Overall description' : 'Description'
        } field can't be empty`,
        {
          type: 'danger'
        }
      );
      ret = false;
    }
    if (
      this.ticketForm.controls.ticketAttachments.invalid &&
      this.fileData.length == 0
    ) {
      this.toastService.show("Attachments can't be empty", {
        type: 'danger'
      });
      ret = false;
    }

    if (this.ticketType === 3) {
      if (!this.ticketForm.controls.objectives.valid) {
        this.toastService.show("Objectives can't be empty", {
          type: 'danger'
        });
        ret = false;
      }
      if (!this.ticketForm.controls.expectedBenefits.valid) {
        this.toastService.show("Expected benefits can't be empty", {
          type: 'danger'
        });
        ret = false;
      }
      if (!this.ticketForm.controls.inputs.valid) {
        this.toastService.show("Inputs can't be empty", {
          type: 'danger'
        });
        ret = false;
      }
      if (!this.ticketForm.controls.outputs.valid) {
        this.toastService.show("Outputs can't be empty", {
          type: 'danger'
        });
        ret = false;
      }

      if (!this.ticketForm.controls.process.valid) {
        this.toastService.show("Process can't be empty", {
          type: 'danger'
        });
        ret = false;
      }
    }
    if (
      !this.ticketForm.controls.releaseVersion.value &&
      this.ticketForm.value.status == 4
    ) {
      this.toastService.show("Release Version can't be empty", {
        type: 'danger'
      });
      ret = false;
    }

    if (!this.ticketForm.controls.menuModuleId.valid && this.ticketType !== 3) {
      this.toastService.show("Module field can't be empty", {
        type: 'danger'
      });
      ret = false;
    }

    if (!this.ticketForm.controls.menuScreenId.valid && this.ticketType !== 3) {
      this.toastService.show("Screen field can't be empty", {
        type: 'danger'
      });
      ret = false;
    }
    if (this.operationIsVisible) {
      if (
        !this.ticketForm.controls.menuOperationId.valid &&
        this.ticketType !== 3
      ) {
        this.toastService.show("Operation field can't be empty", {
          type: 'danger'
        });
        ret = false;
      }
    }

    if (this.id > 0) {
      if (
        !this.ticketForm.controls.informationUpdate.valid &&
        this.ticketForm.value.status == 4
      ) {
        this.toastService.show("Resolution description can't be empty", {
          type: 'danger'
        });
        ret = false;
      }

      if (this.fileData.length == 0) {
        this.toastService.show("Attachments can't be empty", {
          type: 'danger'
        });
        ret = false;
      }
    }

    if (this.emailListHasError()) {
      this.toastService.show('Email Cc must be valid', {
        type: 'danger'
      });
      ret = false;
    }

    return ret;
  }

  save() {
    if (!this.validateForm()) {
      return false;
    }

    this.ticketForm.disable({
      emitEvent: false
    });

    this.form.disable();

    this.loading = true;

    const ticket: ITicketEntity = this.ticketConstructor();

    const isNewTicket = ticket.id ? false : true;
    let ticketId = 0;
    this.ticketsService
      .save(ticket)
      .pipe(
        flatMap(res => {
          ticketId = res.id;
          if (this.filesToDelete.length > 0) {
            this.deleteFiles();
          }
          if (this.fileData.length > 0) {
            const files = [];
            this.fileData.forEach(file => {
              if (!file.id) {
                files.push(file);
              }
            });
            return this.ticketsService.uploadAttachments(res.id, files);
          }
          // flatMap doesn't accept null return
          return [res.id];
        })
      )
      .subscribe(
        res => {
          if (this.sendEmail) {
            this.ticketsService
              .markTicketSaveCompleted(ticketId)
              .subscribe(res => {});
          }

          this.toastService.show('Ticket Saved', {
            type: 'success'
          });
          this.router.navigate(['/settings/tickets']);
        },
        err => {
          this.toastService.show(
            'An error has ocurred while saving the ticket',
            {
              type: 'danger'
            }
          );
          this.loading = false;
        }
      );
  }

  fileProgress(event: any) {
    for (const file of event.target.files) {
      this.fileData.push(file);
    }
  }

  displayInfoMenusDropdown(ticket: ITicketEntity) {
    if (ticket.menuScreenId) {
      this.screenIsVisible = true;
      this.ticketScreenDropDown = this.getTicketScreenDropDown();
    }
    if (ticket.menuOperationId) {
      this.operationIsVisible = true;
      this.ticketOperationDropDown = this.getTicketOperationDropDown();
    }
  }

  loadTicket() {
    this.loading = true;

    this.ticketsService.getOne(this.id).subscribe(
      res => {
        this.ticket = res;
        this.fileData = res.ticketsAttachments;

        this.ticketForm.setValue(
          {
            ...this.ticketForm.value,
            id: this.id,
            title: res.title,
            description: res.description,
            priority: res.priority,
            ticketType: res.ticketType,
            openDate: res.openDate,
            status: res.status,
            releaseVersion: res.releaseVersion,
            resolution: res.resolution,
            userRequestName: res.userRequestName,
            manager: res.manager,
            bugVersion: res.bugVersion,
            objectives: res.objectives,
            expectedBenefits: res.expectedBenefits,
            inputs: res.inputs,
            outputs: res.outputs,
            process: res.process,
            emailcopy: res.emailcopy,
            menuModuleId: res.menuModuleId,
            menuScreenId: res.menuScreenId,
            menuOperationId: res.menuOperationId
          },
          {
            emitEvent: false
          }
        );

        this.displayInfoMenusDropdown(this.ticket);
        this.resolved = this.ticketForm.controls.status.value == 4;

        if (this.resolved) {
          this.ticketForm.controls.informationUpdate.setValue(
            this.ticket.ticketHistories.slice()[0].information,
            {
              emitEvent: false
            }
          );
        }

        this.emails = [];
        if (this.ticketForm.controls.emailcopy.value) {
          const emaillist: string[] = this.ticketForm.controls.emailcopy.value.split(
            ';'
          );
          emaillist.forEach(element => {
            this.emails.push({ emailcopy: element.trim() });
          });
        }

        this.handleTypeChange();
        this.loading = false;
      },
      error => {
        this.loading = false;
        this.toastService.show('Error loading ticket', {
          type: 'danger'
        });
      }
    );
  }

  setEditMode() {
    if (this.canEdit()) {
      this.editMode = true;
      this.removable = true;

      this.ticketForm.enable({
        emitEvent: false
      });

      this.form.enable();

      this.ticketForm.controls.bugVersion.disable();

      if (!this.userData.roles.includes('Admin')) {
        this.ticketForm.controls.status.disable();
        this.ticketForm.controls.resolution.disable();
        this.ticketForm.controls.releaseVersion.disable();
        this.ticketForm.controls.informationUpdate.disable();
      }
    }
  }

  canEdit() {
    let canEdit = false;
    if (this.userData.roles.includes('Admin')) {
      canEdit = true;
    }
    if (this.ticketForm.value.status === 1) {
      canEdit = true;
    }

    if (!canEdit) {
      this.toastService.show(
        'The ticket can only be edited if its status is open',
        {
          type: 'info'
        }
      );
    }
    return canEdit;
  }

  ticketConstructor(): ITicketEntity {
    const ticket = {} as ITicketEntity;
    const form = this.ticketForm.value;

    ticket.title = form.title;
    ticket.description = form.description;
    ticket.priority = form.priority;
    ticket.ticketType = form.ticketType;
    ticket.menuModuleId = form.menuModuleId;
    ticket.menuScreenId = form.menuScreenId;
    ticket.menuOperationId = form.menuOperationId;

    let list: string[] = [];
    this.emails.forEach(element => {
      list.push(element.emailcopy);
    });
    ticket.emailcopy = list.join(';');

    if (this.ticketType === 3) {
      ticket.objectives = form.objectives;
      ticket.expectedBenefits = form.expectedBenefits;
      ticket.inputs = form.inputs;
      ticket.outputs = form.outputs;
      ticket.process = form.process;
      ticket.menuModuleId = undefined;
      ticket.menuScreenId = undefined;
      ticket.menuOperationId = undefined;
    }

    if (this.id > 0) {
      ticket.id = this.id;
      ticket.manager = form.manager;
      ticket.openDate = form.openDate;
      ticket.releaseVersion = form.releaseVersion;
      ticket.resolution = form.resolution;

      ticket.status = form.status;
      ticket.informationUpdate = form.informationUpdate;
    }

    return ticket;
  }

  downloadFile(index) {
    this.ticketsService.downloadAttachment(this.fileData[index].id).subscribe(
      res => {
        const file = new Blob([res], {
          type: res.type
        });

        const blob = window.URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = blob;
        link.download = this.fileData[index].fileName;
        link.click();

        window.URL.revokeObjectURL(blob);
        link.remove();
      },
      err => {
        this.toastService.show('An error ocurred while downloading the file', {
          type: 'danger'
        });
      }
    );
  }

  removeFile(index: number) {
    if (this.fileData[index].id) {
      this.filesToDelete.push(this.fileData[index]);
    }
    this.fileData.splice(index, 1);
  }

  deleteFiles() {
    this.ticketsService
      .deleteAttachments(this.filesToDelete.map(file => file.id))
      .subscribe();
  }

  handleTypeChange() {
    this.ticketType = this.ticketForm.value.ticketType;
  }
}
