import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IPermissionGroup } from '@core/models/permission-group.model';
import { IUserEntity } from '@core/models/user.model';
import { PermissionGroupService } from '@core/services/permission-group.service';
import { ToastService } from '@core/services/toast.service';
import { UserService } from '@core/services/user.service';
import { sortOptions } from '@utils';
import {
  Areas,
  Companies,
  Countries,
  Managers,
  Roles
} from '../dsc-users-records.json';
import { MustMatch } from './validators';

@Component({
  selector: 'app-crud-user',
  templateUrl: './user-crud.component.html',
  styleUrls: ['./user-crud.component.scss']
})
export class UserCrudComponent implements OnInit {
  public loading = false;

  companies = Companies.sort((a, b) => sortOptions(a.id, b.id));
  managers = Managers.sort((a, b) => sortOptions(a.name, b.name));
  roles = Roles.sort((a, b) => sortOptions(a.id, b.id));
  areas = Areas.sort((a, b) => sortOptions(a.id, b.id));
  countries = Countries.sort((a, b) => sortOptions(a.name, b.name));
  selectedManager = {name: '', email: ''};
  selectedCountry = {id: '', name: ''};
  selectedRole = {id: '', name: ''};
  selectedArea = {id: '', name: ''};

  private passwordValidation =
    '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{7,}';

  id: number;
  public userForm: FormGroup = this.formBuilder.group(
    {
      id: new FormControl(0),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(this.passwordValidation)
      ]),
      passwordConfirm: new FormControl(''),
      userRealName: new FormControl('', Validators.required),
      email: new FormControl('', Validators.email),
      enableaccount: new FormControl(true),
      functionSelector: new FormControl('', [Validators.required]),
      function: new FormControl({ value: '', disabled: true }, [
        Validators.required
      ]),
      phone: new FormControl(''),
      company: new FormControl('', [Validators.required]),
      areaSelector: new FormControl('', [Validators.required]),
      area: new FormControl({ value: '', disabled: true }, [
        Validators.required
      ]),
      countrySelector: new FormControl('', [Validators.required]),
      country: new FormControl({ value: '', disabled: true }, [
        Validators.required
      ]),
      managerEmail: new FormControl({ value: '', disabled: true }, [
        Validators.email
      ]),
      managerSelector: new FormControl('', [Validators.required]),
      managerName: new FormControl({ value: '', disabled: true }, [
        Validators.required
      ]),
      groups: new FormArray([])
    },
    {
      validator: MustMatch('password', 'passwordConfirm')
    }
  );
  listPermissionGroups: IPermissionGroup[] = [];
  selectedGroups: IPermissionGroup[] = [];

  get password() {
    return this.userForm.get('password');
  }
  get passwordConfirm() {
    return this.userForm.get('passwordConfirm');
  }
  get userRealName() {
    return this.userForm.get('userRealName');
  }
  get phone() {
    return this.userForm.get('phone');
  }
  get company() {
    return this.userForm.get('company');
  }
  get areaSelector() {
    return this.userForm.get('areaSelector');
  }
  get area() {
    return this.userForm.get('area');
  }
  get countrySelector() {
    return this.userForm.get('countrySelector');
  }
  get country() {
    return this.userForm.get('country');
  }
  get functionSelector() {
    return this.userForm.get('functionSelector');
  }
  get function() {
    return this.userForm.get('function');
  }
  get managerSelector() {
    return this.userForm.get('managerSelector');
  }
  get managerName() {
    return this.userForm.get('managerName');
  }
  get managerEmail() {
    return this.userForm.get('managerEmail');
  }
  get email() {
    return this.userForm.get('email');
  }
  get groups() {
    return this.userForm.get('groups') as FormArray;
  }

  constructor(
    private readonly toastService: ToastService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private permissionGroupService: PermissionGroupService
  ) {
    this.watchRouteQueryParams();
  }

  private watchRouteQueryParams() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.id = params.id != null ? params.id : 0;
      if (this.id > 0) {
        this.loadUserData();
      }
    });
  }

  ngOnInit() {
    this.initUserForm();
    this.loadPermissionGroup();
  }

  private initUserForm() {
    this.userForm = this.formBuilder.group(
      {
        id: new FormControl(this.id),
        password: new FormControl('', [
          Validators.required,
          Validators.pattern(this.passwordValidation)
        ]),
        passwordConfirm: new FormControl(''),
        userRealName: new FormControl('', Validators.required),
        email: new FormControl('', Validators.email),
        functionSelector: new FormControl('', [Validators.required]),
        function: new FormControl({ value: '', disabled: true }, [
          Validators.required
        ]),
        company: new FormControl('', [Validators.required]),
        areaSelector: new FormControl('', [Validators.required]),
        area: new FormControl({ value: '', disabled: true }, [
          Validators.required
        ]),
        countrySelector: new FormControl('', [Validators.required]),
        country: new FormControl({ value: '', disabled: true }, [
          Validators.required
        ]),
        managerEmail: new FormControl({ value: '', disabled: true }, [
          Validators.email
        ]),
        managerSelector: new FormControl('', [Validators.required]),
        managerName: new FormControl({ value: '', disabled: true }, [
          Validators.required
        ]),
        phone: new FormControl(''),
        enableaccount: new FormControl(true),
        groups: new FormArray([])
      },
      {
        validator: MustMatch('password', 'passwordConfirm')
      }
    );
  }

  get groupControls() {
    return (this.userForm.get('groups') as FormArray).controls;
  }

  loadPermissionGroup() {
    this.permissionGroupService.getAll().subscribe(
      data => {
        // Setting the list to show the name into view
        this.listPermissionGroups = data;
        // Creating check boxes of all Permission Groups
        const groups = this.userForm.get('groups') as FormArray;
        this.createGroups(data).controls.forEach((control, i) => {
          groups.setControl(i, control);
        });

        if (this.id > 0) {
          this.loadGroupPermissionFromUser(this.id);
        }
      },
      error =>
        this.toastService.show('Error loading permissiong group list', {
          type: 'danger'
        })
    );
  }

  createGroups(groupsInputs) {
    const arr = groupsInputs.map(group => {
      return new FormControl(group.selected || false);
    });
    return new FormArray(arr);
  }

  loadGroupPermissionFromUser(id) {
    this.userService.getGroups(id).subscribe(
      data => {
        this.selectGroupsFromUser(data);
      },
      error =>
        this.toastService.show(
          'Error loading permission group from specific user',
          { type: 'danger' }
        )
    );
  }

  selectGroupsFromUser(arrayData) {
    const controls = this.groupControls;
    for (let i = 0; i < arrayData.length; i++) {
      const index = this.listPermissionGroups.findIndex(
        element => element.id == arrayData[i].groupId
      );
      controls[index].setValue(true);
    }
  }

  loadUserData() {
    this.loading = true;
    this.userService.getById(this.id).subscribe(
      data => {
        this.loading = false;
        this.userForm.setValue({
          ...this.userForm.value,
          id: this.id,
          email: data.email,
          userRealName: data.userRealName,
          phone: data.phone,
          company: data.company,
          areaSelector: this.areas.find(
            area => area.name == data.area || area.id == 'other'
          ).name,
          area: data.area,
          countrySelector: this.countries.find(
            country => country.name == data.country || country.id == 'other'
          ).name,
          country: data.country,
          functionSelector: this.roles.find(
            role => role.name == data.function || role.id == 'other'
          ).name,
          function: data.function,
          managerEmail: data.managerEmail,
          managerSelector: this.managers.find(
            manager => manager.name == data.managerName || manager.email == ''
          ).name,
          managerName: data.managerName,
          enableaccount: !!data.enabled
        });
        this.getSelectedManager();
        if (this.selectedManager.email == '') {
          this.userForm.controls.managerName.enable();
          this.userForm.controls.managerEmail.enable();
        } else {
          this.userForm.controls.managerName.setValue('');
        }
        this.getSelectedCountry();
        if (this.selectedCountry.id == 'other') {
          this.userForm.controls.country.enable();
        } else {
          this.userForm.controls.country.setValue('');
        }
        this.getSelectedArea();
        if (this.selectedArea.id == 'other') {
          this.userForm.controls.area.enable();
        } else {
          this.userForm.controls.area.setValue('');
        }
        this.getSelectedFunction();
        if (this.selectedRole.id == 'other') {
          this.userForm.controls.function.enable();
        } else {
          this.userForm.controls.function.setValue('');
        }
      },
      error => {
        this.loading = false;
        this.toastService.show('Error loading data from user', {
          type: 'danger'
        });
      }
    );
  }

  private validateForm(userParams: FormGroup) {
    let ret = true;

    if (!userParams.controls.function.valid) {
      this.toastService.show("Function field can't be empty", {
        type: 'danger'
      });
    }
    if (!userParams.controls.function.disabled) {
      if (!userParams.controls.function.valid) {
        this.toastService.show("Function field can't be empty", {
          type: 'danger'
        });
        ret = false;
      }
    }
    if (!userParams.controls.managerSelector.valid) {
      this.toastService.show('A manager must be selected', {
        type: 'danger'
      });
    }
    if (!userParams.controls.managerName.disabled) {
      if (!userParams.controls.managerName.valid) {
        this.toastService.show("Manager Name field can't be empty", {
          type: 'danger'
        });
        ret = false;
      }
    }
    if (!userParams.controls.company.valid) {
      this.toastService.show("Company field can't be empty", {
        type: 'danger'
      });
      ret = false;
    }
    if (!userParams.controls.areaSelector.valid) {
      this.toastService.show('An area must be selected', {
        type: 'danger'
      });
    }
    if (!userParams.controls.area.disabled) {
      if (!userParams.controls.area.valid) {
        this.toastService.show("Area field can't be empty", {
          type: 'danger'
        });
        ret = false;
      }
    }
    if (!userParams.controls.countrySelector.valid) {
      this.toastService.show('A country must be selected', {
        type: 'danger'
      });
    }
    if (!userParams.controls.country.disabled) {
      if (!userParams.controls.country.valid) {
        this.toastService.show("Country field can't be empty", {
          type: 'danger'
        });
        ret = false;
      }
    }
    if (!userParams.controls.userRealName.valid) {
      this.toastService.show("Name field can't be empty", {
        type: 'danger'
      });
      ret = false;
    }

    if (
      userParams.controls.password.value !==
      userParams.controls.passwordConfirm.value
    ) {
      this.toastService.show('Password and Repeat password do not match', {
        type: 'danger'
      });
      ret = false;
    } else if (
      !userParams.controls.password.valid &&
      userParams.controls.password.value != ''
    ) {
      this.toastService.show(
        `
        Password field must contain:
          \nAt least 8 characters;
          \nLowercase letters;
          \nUppercase letters;
          \nNumbers;
          \nSpecial characters;
        `,
        {
          type: 'danger',
          delay: 10000
        }
      );
      ret = false;
    }

    if (!userParams.controls.email.disabled) {
      if (!userParams.controls.email.valid) {
        this.toastService.show('Please enter a valid email address.', {
          type: 'danger'
        });
        ret = false;
      }
    }

    if (!userParams.controls.managerEmail.disabled) {
      if (!userParams.controls.email.valid) {
        this.toastService.show("Manager Email field can't be empty", {
          type: 'danger'
        });
        ret = false;
      }
    }

    return ret;
  }

  upInsert() {
    if (!this.validateForm(this.userForm)) {
      return false;
    }

    const user = {} as IUserEntity;

    this.getSelectedGroups();

    user.id = this.userForm.get('id').value;
    user.email = this.userForm.get('email').value;
    user.password = this.userForm.get('password').value;
    user.userRealName = this.userForm.get('userRealName').value;
    user.phone = this.userForm.get('phone').value;
    user.company = this.userForm.get('company').value;

    if (this.userForm.controls.area.disabled) {
      user.area = this.userForm.get('areaSelector').value;
    } else {
      user.area = this.userForm.get('area').value;
    }
    if (this.userForm.controls.country.disabled) {
      user.country = this.userForm.get('countrySelector').value;
    } else {
      user.country = this.userForm.get('country').value;
    }
    if (this.userForm.controls.function.disabled) {
      user.function = this.userForm.get('functionSelector').value;
    } else {
      user.function = this.userForm.get('function').value;
    }
    if (this.userForm.controls.managerEmail.disabled) {
      user.managerEmail = this.selectedManager.email;
    } else {
      user.managerEmail = this.userForm.get('managerEmail').value;
    }
    if (this.userForm.controls.managerName.disabled) {
      user.managerName = this.userForm.get('managerSelector').value;
    } else {
      user.managerName = this.userForm.get('managerName').value;
    }
    user.email = this.userForm.get('email').value;
    user.enabled = this.userForm.get('enableaccount').value === true ? 1 : 0;

    this.userService.save(user, this.selectedGroups).subscribe(
      userId => {
        this.toastService.show('User updated successfully', {
          type: 'success'
        });
        if (!user.id) {
          // only redirect when registering a new user
          this.router.navigate(['/settings/users']);
        }
      },
      res => {
        if (Array.isArray(res.error)) {
          Object.keys(res.error).forEach(key => {
            res.error[key].forEach(error => {
              this.toastService.show(error, {
                type: 'danger'
              });
            });
          });
        } else if (typeof res.error === 'object') {
          Object.values(res.error).forEach(errors => {
            const errorMessages = Array.isArray(errors) ? errors : [errors];
            errorMessages.forEach(error => {
              this.toastService.show(error, {
                type: 'danger'
              });
            });
          });
        } else {
          this.toastService.show(res.error.Message, {
            type: 'danger'
          });
        }
      }
    );
  }

  getSelectedFunction() {
    this.selectedRole = this.roles.find(
      role => role.name == this.userForm.value.functionSelector
    );
  }

  functionChanged() {
    this.getSelectedFunction();
    if (this.selectedRole.id == 'other') {
      this.userForm.controls.function.reset();
      this.userForm.controls.function.enable();
    } else {
      this.userForm.controls.function.reset();
      this.userForm.controls.function.disable();
    }
  }

  getSelectedArea() {
    this.selectedArea = this.areas.find(
      area => area.name == this.userForm.value.areaSelector
    );
  }

  areaChanged() {
    this.getSelectedArea();
    if (this.selectedArea.id == 'other') {
      this.userForm.controls.area.reset();
      this.userForm.controls.area.enable();
    } else {
      this.userForm.controls.area.reset();
      this.userForm.controls.area.disable();
    }
  }

  getSelectedCountry() {
    this.selectedCountry = this.countries.find(
      country => country.name == this.userForm.value.countrySelector
    );
  }

  countryChanged() {
    this.getSelectedCountry();
    if (this.selectedCountry.id == 'other') {
      this.userForm.controls.country.reset();
      this.userForm.controls.country.enable();
    } else {
      this.userForm.controls.country.reset();
      this.userForm.controls.country.disable();
    }
  }

  getSelectedManager() {
    this.selectedManager = this.managers.find(
      manager => manager.name == this.userForm.value.managerSelector
    );
  }

  setManagerEmail() {
    this.getSelectedManager();
    if (this.selectedManager.email === '') {
      this.userForm.controls.managerEmail.reset();
      this.userForm.controls.managerEmail.enable();
      this.userForm.controls.managerName.reset();
      this.userForm.controls.managerName.enable();
    } else {
      this.userForm.controls.managerName.reset();
      this.userForm.controls.managerName.disable();
      this.userForm.controls.managerEmail.disable();
      this.userForm.patchValue({ managerEmail: this.selectedManager.email });
    }
  }

  getSelectedGroups() {
    this.selectedGroups = [];

    (this.groups.controls || []).forEach((group, i) => {
      if (group.value === true) {
        this.selectedGroups.push(this.listPermissionGroups[i]);
      }
    });
  }

  checkAll() {
    (this.groups.controls || []).forEach((group, i) => {
      group.setValue(true);
    });
  }

  uncheckAll() {
    (this.groups.controls || []).forEach((group, i) => {
      group.setValue(false);
    });
  }

  backpage() {}
}
