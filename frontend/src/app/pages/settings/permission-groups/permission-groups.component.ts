import { AfterViewInit, Component, OnInit, Renderer } from '@angular/core';
import { Router } from '@angular/router';
import { IPermissionGroup } from '@core/models/permission-group.model';
import { ConfirmationDialogService } from '@core/services/confirmation-dialog.service';
import { PermissionGroupService } from '@core/services/permission-group.service';
import { ToastService } from '@core/services/toast.service';

import { permissionGroupColumns } from './permission-groups-columns';

@Component({
  selector: 'app-permission-groups',
  templateUrl: './permission-groups.component.html',
  styleUrls: ['./permission-groups.component.scss'],
})
export class PermissionGroupsComponent implements OnInit, AfterViewInit {
  public columns = permissionGroupColumns();

  listPermissionGroups: IPermissionGroup[] = [];
  isLoading = {
    table: false,
  };

  settings = {
    // Callback used when the user clicks over the delete button into
    // the table
    rowCallback: (row: Node, data: any, index: number) => {
      const self = this;
      jQuery('.fa-trash', row).unbind('click');
      jQuery('.fa-trash', row).bind('click', row => {
        this.confirmService
          .confirm('Confirm', 'Are you sure you want to remove ' + data.name)
          .then(confirmed => {
            if (confirmed) {
              self.delete(data);
            }
          })
          .catch(() => console.log('User dismissed the dialog'));
      });
      return row;
    },
  };

  constructor(
    private readonly confirmService: ConfirmationDialogService,
    private readonly toastService: ToastService,
    private permissionGroupService: PermissionGroupService,
    private readonly renderer: Renderer,
    private readonly router: Router,
  ) {}

  ngOnInit() {
    this.loadPermissionGroup();
  }

  ngAfterViewInit() {
    this.watchUserEditClick();
  }

  watchUserEditClick() {
    this.renderer.listenGlobal('document', 'click', event => {
      const attribute = 'view-permission-group-id';
      if (event.target.hasAttribute(attribute)) {
        const viewPermissionGroupId = event.target.getAttribute(attribute);
        this.router.navigateByUrl(
          `/settings/permission-groups/crud?id=${viewPermissionGroupId}`,
        );
      }
    });
  }

  loadPermissionGroup() {
    this.isLoading.table = true;
    this.permissionGroupService
      .getAll()
      .toPromise()
      .then(val => {
        this.listPermissionGroups = val;
        this.isLoading.table = false;
      });
  }

  delete(permission: any) {
    this.permissionGroupService.delete(permission.id).subscribe(
      () => this.deleteSuccessCallBack(),
      () => this.deleteErrorCallBack(),
    );
  }

  deleteSuccessCallBack() {
    this.toastService.show('Permission group removed successfully', {
      type: 'success',
    });
    this.loadPermissionGroup();
  }

  deleteErrorCallBack() {
    this.toastService.show('Error removing permission group', {
      type: 'danger',
    });
  }
}
