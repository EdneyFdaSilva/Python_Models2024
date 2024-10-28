import { AfterViewInit, Component, OnInit, Renderer } from '@angular/core';
import { Router } from '@angular/router';
import { IUserEntity } from '@core/models/user.model';
import { ConfirmationDialogService } from '@core/services/confirmation-dialog.service';
import { ToastService } from '@core/services/toast.service';
import { UserService } from '@core/services/user.service';

import { hpUserColumns } from './users.columns';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, AfterViewInit {
  public columns = hpUserColumns();
  public listUsers: Array<IUserEntity> = [];

  isLoading = {
    table: false
  };

  settings = {
    // Callback used when the user clicks over the delete button into
    // the table
    rowCallback: (row: Node, data: any, index: number) => {
      const self = this;
      jQuery('.fa-trash', row).unbind('click');
      jQuery('.fa-trash', row).bind('click', row => {
        // console.log(data);

        this.confirmService
          .confirm(
            'Confirm',
            'Are you sure you want to remove ' + data.username
          )
          .then(confirmed => {
            if (confirmed) {
              self.delete(data);
            }
          })
          .catch(() => console.log('User dismissed the dialog'));
      });
      return row;
    }
  };

  constructor(
    private readonly confirmService: ConfirmationDialogService,
    private readonly toastService: ToastService,
    private readonly userService: UserService,
    private readonly renderer: Renderer,
    private readonly router: Router
  ) {
    this.loadTableData();
  }

  loadTableData() {
    this.isLoading.table = true;

    (this.settings as any).buttons = [
      {
        extend: 'excelHtml5',
        className: 'btn theme-textTertiary',
        text: '<i class="fas fa-download"></i>'
      },
      {
        extend: 'colvis',
        className: 'btn theme-textTertiary',
        text: '<i class="fas fa-eye"></i>'
      }
    ];

    this.userService
      .getAll()
      .toPromise()
      .then(val => {
        this.listUsers = val;
        this.isLoading.table = false;
      });
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.watchUserEditClick();
  }

  watchUserEditClick() {
    this.renderer.listenGlobal('document', 'click', event => {
      if (event.target.hasAttribute('view-user-id')) {
        const viewUserId = event.target.getAttribute('view-user-id');
        this.router.navigateByUrl(`/settings/users/crud?id=${viewUserId}`);
      }
    });
  }

  delete(user: any) {
    this.userService.delete(user.id).subscribe(
      () => this.deleteSuccessCallBack(),
      () => this.deleteErrorCallBack()
    );
  }

  deleteSuccessCallBack() {
    this.toastService.show('User removed successfully', { type: 'success' });
    this.loadTableData();
  }

  deleteErrorCallBack() {
    this.toastService.show('Error removing user', { type: 'danger' });
  }
}
