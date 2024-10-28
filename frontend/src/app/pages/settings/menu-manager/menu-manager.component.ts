import { ToastService } from '@core/services/toast.service';
import { MenuService } from '@core/services/menu.service';
import { Component, OnInit } from '@angular/core';
import { IMenu } from '@core/models/menu.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-menu-manager',
  templateUrl: './menu-manager.component.html',
  styleUrls: ['./menu-manager.component.scss']
})
export class MenuManagerComponent implements OnInit {
  public menuList: Array<IMenu> = [];
  public menuForm: FormGroup;
  public loading = false;
  public editMode = false;

  constructor(
    private readonly menuService: MenuService,
    private readonly formBuilder: FormBuilder,
    private readonly toastService: ToastService
  ) {}

  ngOnInit() {
    this.menuForm = this.formBuilder.group({
      id: [0],
      name: ['', Validators.required],
      iconClass: [''],
      route: [''],
      menuId: [0],
      orderMenu: ['', Validators.required],
      version: [''],
      module: [''],
      pageName: ['']
    });

    this.getMenuTree();
  }

  getMenuTree() {
    this.loading = true;
    this.menuService
      .getAllMenus()
      .subscribe(
        res => {
          this.menuList = res;
        },
        err => {
          this.toastService.show('Error loading menus', {
            type: 'danger'
          });
        }
      )
      .add(() => (this.loading = false));
  }

  editMenu(menu: IMenu) {
    if (this.menuForm.touched) {
      const r = confirm('You can lose changes');
      if (!r) {
        return false;
      }
    }
    this.editMode = true;
    this.menuForm.setValue({
      ...this.menuForm.value,
      id: menu.id,
      name: menu.name,
      iconClass: menu.iconClass,
      route: menu.route,
      menuId: menu.menuId,
      orderMenu: menu.order,
      module: menu.module,
      pageName: menu.pageName
    });
  }

  clear() {
    this.editMode = false;
    this.menuForm.reset();
  }

  private valid() {
    let ret = true;

    if (!this.menuForm.controls.name.valid) {
      this.toastService.show("Name field can't be empty", {
        type: 'danger'
      });
      ret = false;
    }

    if (!this.menuForm.controls.orderMenu.valid) {
      this.toastService.show("Order field can't be empty", {
        type: 'danger'
      });
      ret = false;
    }

    return ret;
  }

  save() {
    if (!this.valid) {
      return false;
    }
    this.loading = true;

    const menu = {
      id: parseInt(this.menuForm.value.id, 10) || 0,
      name: this.menuForm.value.name,
      iconClass: this.menuForm.value.iconClass,
      route: this.menuForm.value.route || '',
      menuId: parseInt(this.menuForm.value.menuId, 10) || 0,
      order: parseInt(this.menuForm.value.orderMenu, 10),
      version: this.menuForm.value.version,
      module: this.menuForm.value.module || '',
      pageName: this.menuForm.value.pageName || ''
    };

    this.menuService
      .save(menu)
      .subscribe(
        res => {
          this.toastService.show('Menu saved', {
            type: 'success'
          });
          this.getMenuTree();
          this.clear();
        },
        err => {
          this.toastService.show('Error saving menu', {
            type: 'danger'
          });
        }
      )
      .add(() => {
        this.loading = false;
      });
  }

  delete() {
    const r = confirm('Confirm Delete');
    if (!r) {
      return false;
    }
    this.loading = true;
    this.menuService
      .delete(this.menuForm.value.id)
      .subscribe(
        res => {
          this.toastService.show('Menu Deleted', {
            type: 'success'
          });
          this.getMenuTree();
          this.clear();
        },
        err => {
          this.toastService.show('Error deleting menu', {
            type: 'danger'
          });
        }
      )
      .add(() => {
        this.loading = false;
      });
  }
}
