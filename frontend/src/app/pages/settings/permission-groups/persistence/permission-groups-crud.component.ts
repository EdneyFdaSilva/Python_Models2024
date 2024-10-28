import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Injectable, OnInit } from '@angular/core';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';
import {
  FormControl,
  FormGroup,
  FormArray,
  FormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
  FormBuilder,
} from '@angular/forms';
import { IMenuTreeView } from '@core/models/menu.model';
import { MenuService } from '@core/services/menu.service';
import {
  IPermissionGroupMenu,
  IPermissionGroup,
} from '@core/models/permission-group.model';
import { ToastService } from '@core/services/toast.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PermissionGroupService } from '@core/services/permission-group.service';
import { IUser, IUserEntity } from '@models';
import { UserService } from '@core/services/user.service';

/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable()
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<IMenuTreeView[]>([]);

  get data(): IMenuTreeView[] {
    return this.dataChange.value;
  }

  constructor(private menuService: MenuService) {}

  loadData(callback) {
    this.menuService.getAllMenuTreeView().subscribe(
      val => {
        // Build the tree nodes from Json object. The result is a list of `IMenuTreeView` with nested
        // file node as children.
        const data = this.buildFileTree(val, 0);

        // Notify the change.
        this.dataChange.next(data);

        if (callback != null) {
          callback(data);
        }
      },
      () => console.log('Error loading permission group tree view')
    );
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `IMenuTreeView`.
   */
  buildFileTree(obj: { [key: string]: any }, level: number): IMenuTreeView[] {
    return Object.keys(obj).reduce<IMenuTreeView[]>((accumulator, key) => {
      const value = obj[key];
      const node = new IMenuTreeView();
      node.id = value.id;
      node.name = value.name;

      if (value != null) {
        if (value.menus.length !== 0) {
          node.menus = this.buildFileTree(value.menus, level + 1);
        } else {
          node.name = value.name;
        }
      }

      return accumulator.concat(node);
    }, []);
  }
}

/**
 * @title Tree with checkboxes
 */
@Component({
  selector: 'app-permission-groups-crud',
  templateUrl: 'permission-groups-crud.component.html',
  styleUrls: ['permission-groups-crud.component.scss'],
  providers: [ChecklistDatabase],
})
export class PermissionGroupsCrudComponent implements OnInit {
  selectedUsers: IUserEntity[] = [];
  listUsers: IUserEntity[] = [];
  public loading = false;
  public permissionForm: FormGroup;
  id: number;

  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<IMenuTreeView, IMenuTreeView>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<IMenuTreeView, IMenuTreeView>();

  /** A selected parent node to be inserted */
  selectedParent: IMenuTreeView | null = null;

  treeControl: FlatTreeControl<IMenuTreeView>;

  treeFlattener: MatTreeFlattener<IMenuTreeView, IMenuTreeView>;

  dataSource: MatTreeFlatDataSource<IMenuTreeView, IMenuTreeView>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<IMenuTreeView>(true /* multiple */);

  constructor(
    private _database: ChecklistDatabase,
    private formBuilder: FormBuilder,
    private readonly toastService: ToastService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private permissionGroupService: PermissionGroupService,
    private menuService: MenuService,
    private userService: UserService,
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.id = params.id != null ? params.id : 0;
    });

    this.permissionForm = this.formBuilder.group({
      id: new FormControl(this.id),
      name: new FormControl('', Validators.required),
      users: new FormArray([]),
    });

    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren
    );
    this.treeControl = new FlatTreeControl<IMenuTreeView>(
      this.getLevel,
      this.isExpandable
    );
    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener
    );

    _database.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });
  }

  ngOnInit() {
    this._database.loadData(this.callback);
    this.loadUsers();
  }

  private callback = data => {
    if (this.id != null && this.id > 0) {
      this.populateDataFromDatabase(this.id);
    }
  };

  populateDataFromDatabase(id: number) {
    this.permissionGroupService.getByIdWithMenu(id).subscribe(
      data => {
        this.permissionForm.controls['id'].setValue(data.permissionGroup.id);
        this.permissionForm.controls['name'].setValue(data.permissionGroup.name);

        if (data.listMenu == null || data.listMenu.length == 0) {
          return;
        }

        for (let i = 0; i < data.listMenu.length; i++) {
          const menuTreeView = this.treeControl.dataNodes.filter(
            dn => dn.id === data.listMenu[i].id
          )[0];

          if (menuTreeView != null) {
            this.checklistSelection.toggle(menuTreeView);
          }
        }
      },
      error =>
        this.toastService.show('Error loading permission group', {
          type: 'danger',
        })
    );
  }

  getLevel = (node: IMenuTreeView) => node.level;

  isExpandable = (node: IMenuTreeView) => node.expandable;

  getChildren = (node: IMenuTreeView): IMenuTreeView[] => node.menus;

  hasChild = (_: number, _nodeData: IMenuTreeView) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: IMenuTreeView) => _nodeData.name === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: IMenuTreeView, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.name === node.name
        ? existingNode
        : new IMenuTreeView();

    flatNode.name = node.name;
    flatNode.level = level;
    flatNode.expandable = !!node.menus;
    flatNode.id = node.id;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: IMenuTreeView): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child),
    );
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: IMenuTreeView): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child =>
      this.checklistSelection.isSelected(child)
    );
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  menuItemSelectionToggle(node: IMenuTreeView): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.every(child => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  menuLeafItemSelectionToggle(node: IMenuTreeView): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: IMenuTreeView): void {
    // this.checklistSelection.select(node);

    let parent: IMenuTreeView | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: IMenuTreeView): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child),
    );
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: IMenuTreeView): IMenuTreeView | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  checkAll() {
    for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
      if (!this.checklistSelection.isSelected(this.treeControl.dataNodes[i])) {
        this.checklistSelection.toggle(this.treeControl.dataNodes[i]);
      }
    }
  }

  uncheckAll() {
    for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
      if (this.checklistSelection.isSelected(this.treeControl.dataNodes[i])) {
        this.checklistSelection.toggle(this.treeControl.dataNodes[i]);
      }
    }
  }

  upInsert() {
    let permissionGroupEntity = {} as IPermissionGroupMenu;
    permissionGroupEntity.permissionGroup = {} as IPermissionGroup;
    permissionGroupEntity.listMenu = [];
    permissionGroupEntity.listUsers = [];

    if (this.permissionForm.valid) {
      this.getSelectedUsers();

      permissionGroupEntity.permissionGroup.id = this.permissionForm.controls[
        'id'
      ].value;
      permissionGroupEntity.permissionGroup.name = this.permissionForm.controls[
        'name'
      ].value;

      if (!this.checklistSelection.hasValue) {
        // Exibir que form está invalido e precisa de uma tela pelo menos
        return;
      }

      let menuMaps = new Map<number, IMenuTreeView>();
      for (var i = 0; i < this.checklistSelection.selected.length; i++) {
        let parent = this.getParentNode(this.checklistSelection.selected[i]);
        while (parent) {
          // When there is no ID on map, add it!
          if (!menuMaps.has(parent.id)) {
            menuMaps.set(parent.id, parent);
          }
          // getting next parent menu
          parent = this.getParentNode(parent);
        }

        if (!menuMaps.has(this.checklistSelection.selected[i].id)) {
          menuMaps.set(
            this.checklistSelection.selected[i].id,
            this.checklistSelection.selected[i]
          );
        }
      }

      menuMaps.forEach((value: IMenuTreeView, key: number) => {
        permissionGroupEntity.listMenu.push(value);
      });

      permissionGroupEntity.listUsers = this.selectedUsers;

      this.permissionGroupService.save(permissionGroupEntity).subscribe(
        userId => {
          this.toastService.show('Saved permission group successfully', {
            type: 'success',
          });
          this.router.navigate(['/settings/permission-groups']);
        },
        () =>
          this.toastService.show('Error creating permission group', {
            type: 'danger',
          })
      );
    }
  }

  getControls() {
    return (this.permissionForm.controls.users as FormArray).controls;
  }

  loadUsers() {
    this.userService.getAll().subscribe(
      data => {
        data = data.sort((first, second) =>
          first.userRealName > second.userRealName ? 1 : -1
        );
        // Setting the list to show the name into view
        this.listUsers = data;
        // Creating check boxes of all Permission Groups
        this.permissionForm.controls.users = this.createUsers(data);
        if (this.id > 0) {
          this.loadGroupPermissionFromUser(this.id);
        }
      },
      error =>
        this.toastService.show('Error loading permission group list', {
          type: 'danger',
        }),
    );
  }

  loadGroupPermissionFromUser(id) {
    this.permissionGroupService.getUsers(id).subscribe(
      data => {
        this.selectUserFromGroup(data);
      },
      error =>
        this.toastService.show(
          'Error loading permission group from specific user',
          { type: 'danger' },
        ),
    );
  }

  selectUserFromGroup(permissionGroup: IPermissionGroupMenu) {
    if (permissionGroup == null || permissionGroup.listUsers == null) return;

    for (let i = 0; i < permissionGroup.listUsers.length; i++) {
      let index = this.listUsers.findIndex(
        element => element.id == permissionGroup.listUsers[i].id,
      );
      this.permissionForm.controls.users['controls'][index].setValue(true);
    }
  }

  createUsers(groupsInputs) {
    const arr = groupsInputs.map(group => {
      return new FormControl(group.selected || false);
    });
    return new FormArray(arr);
  }

  getSelectedUsers() {
    this.selectedUsers = [];

    for (let i = 0; i < this.permissionForm.controls.users['controls'].length; i++) {
      let group = this.permissionForm.controls.users['controls'][i];

      if (group.value === true) {
        this.selectedUsers.push(this.listUsers[i]);
      }
    }
  }

  get name() {
    return this.permissionForm.get('name');
  }
}
