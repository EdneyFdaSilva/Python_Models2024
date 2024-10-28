import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '@core/services/toast.service';
import { UserService } from '@core/services/user.service';
import { IMenu, IUserEntity } from '@models';
import { AuthService } from '@services';
import { DomSanitizer } from '@angular/platform-browser';

import { sortOptions } from '@utils';

import {
  Areas, 
  Companies,
  Countries,
  Managers,
  Roles } from '../users/dsc-users-records.json';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  loading = false;
  fileData: File = null;
  previewUrl: any = null;
  retrievedImage;
  dafaultImgUrl = '../../../../assets/images/defaultProfileImage.jpg';
  base64Data: any;
  message: string;
  imageName: any;
  userData: IUserEntity;

  companies = Companies.sort((a, b) => sortOptions(a.id, b.id));
  managers = Managers.sort((a, b) => sortOptions(a.name, b.name));
  roles = Roles.sort((a, b) => sortOptions(a.id, b.id));
  areas = Areas.sort((a, b) => sortOptions(a.id, b.id));
  countries = Countries.sort((a, b) => sortOptions(a.name, b.name));
  selectedManager = {"name": '', "email": ''};
  selectedCountry = {"id": '', "name": ''};
  selectedRole = {"id": '', "name": ''};
  selectedArea = {"id": '', "name": ''};

  private passwordValidation =
    '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{7,}';

  public loginForm = new FormGroup({
    id: new FormControl(0),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(this.passwordValidation)
    ]),
    passwordConfirm: new FormControl('', [
      Validators.required,
      Validators.pattern(this.passwordValidation)
    ]),
    userRealName: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    functionSelector: new FormControl('', [Validators.required]),
    function: new FormControl({value: '', disabled: true}, [Validators.required]),
    company: new FormControl('', [Validators.required]),
    areaSelector: new FormControl('', [Validators.required]),
    area: new FormControl({value: '', disabled: true}, [Validators.required]),
    countrySelector: new FormControl('', [Validators.required]),
    country: new FormControl({value: '', disabled: true}, [Validators.required]),
    managerEmail: new FormControl({value: '', disabled: true}, [Validators.email]),
    managerSelector: new FormControl('', [Validators.required]),
    managerName: new FormControl({value: '', disabled: true}, [Validators.required]),
    photos: new FormControl(null),
    email: new FormControl({ value: '', disabled: true }, [
      Validators.required,
      Validators.email
    ])
  });

  public permissions: Array<IMenu> = [];

  get areaSelector(){
    return this.loginForm.get('areaSelector');
  }
  get countrySelector(){
    return this.loginForm.get('countrySelector');
  }
  get functionSelector(){
    return this.loginForm.get('functionSelector');
  }
  get managerSelector(){
    return this.loginForm.get('managerSelector');
  }

  constructor(
    private readonly toastService: ToastService,
    private readonly userService: UserService,
    private readonly locationService: Location,
    private readonly sanitizer: DomSanitizer
  ) {}

  public get canChangeEmailAndUsername(): boolean {
    return this.userData.roles.indexOf('Admin') > -1;
  }

  ngOnInit() {
    this._loadMyInfo();
    this._loadAccessPermission();
  }

  private _loadMyInfo() {
    this.getImage();
    this.userService.showMyInfo().subscribe(user => {
      this.userData = user;
      this.loginForm.setValue({
        id: user.id,
        userRealName: user.userRealName,
        email: user.email,
        phone: user.phone,
        functionSelector: this.roles.find(
          role => (role.name == user.function) || (role.id == 'other')
        ).name,
        function: user.function,
        company: user.company,
        areaSelector: this.areas.find(
          area => (area.name == user.area) || (area.id == 'other')
        ).name,
        area: user.area,
        countrySelector: this.countries.find(
          country => (country.name == user.country) || (country.id == 'other')
        ).name,
        country: user.country,
        managerSelector: this.managers.find(
          manager => (manager.name == user.managerName) || (manager.email == '')
        ).name,
        managerName: user.managerName,
        managerEmail: user.managerEmail,
        photos: null,
        password: '',
        passwordConfirm: ''
      });
      this.getSelectedManager();
        if (this.selectedManager.email == '') {
          this.loginForm.controls.managerName.enable();
          this.loginForm.controls.managerEmail.enable();
        } else {
          this.loginForm.controls.managerName.setValue('');
        }
        this.getSelectedCountry();
        if (this.selectedCountry.id == 'other')
          this.loginForm.controls.country.enable();
        else
          this.loginForm.controls.country.setValue('');
        this.getSelectedArea();
        if (this.selectedArea.id == 'other')
          this.loginForm.controls.area.enable();
        else
          this.loginForm.controls.area.setValue('');
        this.getSelectedFunction();
        if (this.selectedRole.id == 'other')
          this.loginForm.controls.function.enable();
        else
          this.loginForm.controls.function.setValue('');
    });
  }

  private _loadAccessPermission() {
    this.userService.getMenu().subscribe(permissions => {
      this.permissions = permissions;
      const enableOrDisable = this.canChangeEmailAndUsername
        ? 'enable'
        : 'disable';
      const fieldsToLock = ['email'];
      fieldsToLock.forEach(field => {
        this.loginForm.controls[field][enableOrDisable]();
      });
    });
  }

  private validateForm(userParams: FormGroup) {
    let ret = true;

    if (!userParams.controls.phone.valid) {
      this.toastService.show("Phone field can't be empty", {
        type: 'danger'
      });
      ret = false;
    }
    if (!userParams.controls.functionSelector.valid) {
      this.toastService.show("A function must be selected", {
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
      this.toastService.show("A manager must be selected", {
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
      this.toastService.show("An area must be selected", {
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
      this.toastService.show("A country must be selected", {
        type: 'danger'
      })
    }
    if (!userParams.controls.country.disabled){
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
      userParams.controls.password.value ||
      userParams.controls.passwordConfirm.value
    ) {
      if (
        userParams.controls.password.value !==
        userParams.controls.passwordConfirm.value
      ) {
        this.toastService.show('Password and Repeat password do not match', {
          type: 'danger'
        });
        ret = false;
      } else if (!userParams.controls.password.valid) {
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
    }

    if (!this.loginForm.controls.email.disabled) {
      if (!this.loginForm.controls.email.valid) {
        this.toastService.show('Please enter a valid email address.', {
          type: 'danger'
        });
        ret = false;
      }
    }

    if (!this.loginForm.controls.managerEmail.disabled) {
      if (!this.loginForm.controls.email.valid) {
        this.toastService.show("Manager Email field can't be empty", {
          type: 'danger'
        });
        ret = false;
      }
    } 

    return ret;
  }

  update() {
    if (!this.validateForm(this.loginForm)) {
      return false;
    }
    this.loading = true;
    this.loginForm.value.managerEmail = this.loginForm.controls.managerEmail.disabled ?
      this.selectedManager.email : this.loginForm.get('managerEmail').value;
    this.loginForm.value.area = this.loginForm.controls.area.disabled ?
      this.selectedArea.name : this.loginForm.get('area').value;
    this.loginForm.value.country = this.loginForm.controls.country.disabled ?
      this.selectedCountry.name : this.loginForm.get('country').value;
    this.loginForm.value.function = this.loginForm.controls.function.disabled ?
      this.selectedRole.name : this.loginForm.get('function').value;
    this.loginForm.value.managerName = this.loginForm.controls.managerName.disabled ?
      this.selectedManager.name : this.loginForm.get('managerName').value;
    this.userService.updateInfo(this.loginForm.value).subscribe(
      () => {
        this.loginForm.controls.password.setValue('');
        this.loginForm.controls.passwordConfirm.setValue('');
        this.onFileSubmit();
      },
      res => {
        this.loading = false;
        if (Array.isArray(res.error)) {
          Object.keys(res.error).forEach(key => {
            res.error[key].forEach(error => {
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

  fileProgress(fileInput: any) {
    this.fileData = fileInput.target.files[0];
  }

  onFileSubmit() {
    if (this.fileData) {
      this.userService.savePhoto(this.fileData).subscribe(res => {
        this.loginForm.get('photos').setValue([]);
        this._loadMyInfo();
        this.toastService.show('Profile updated', {
          type: 'success'
        });
        this.loading = false;
      });
    } else {
      this._loadMyInfo();
      this.toastService.show('Profile updated', {
        type: 'success'
      });
      this.loading = false;
    }
  }

  getImage() {
    this.userService.getMyPhoto().subscribe(res => {
      if (res) {
        this.createImageFromBlob(res);
      }
    });
  }

  createImageFromBlob(image: Blob) {
    const reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        this.retrievedImage = reader.result;
      },
      false
    );

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  getSelectedFunction(){
    this.selectedRole = this.roles.find(
      role => role.name == this.loginForm.value.functionSelector
    );
  }

  functionChanged(){
    this.getSelectedFunction();
    if ( this.selectedRole.id == 'other' ) {
      this.loginForm.controls.function.reset();
      this.loginForm.controls.function.enable();
    } else {
      this.loginForm.controls.function.reset();
      this.loginForm.controls.function.disable();
    }
  }

  getSelectedArea(){
    this.selectedArea = this.areas.find(
      area => area.name == this.loginForm.value.areaSelector
    );
  }

  areaChanged(){
    this.getSelectedArea();
    if ( this.selectedArea.id == 'other' ) {
      this.loginForm.controls.area.reset();
      this.loginForm.controls.area.enable();
    } else {
      this.loginForm.controls.area.reset();
      this.loginForm.controls.area.disable();
    }
  }

  getSelectedCountry(){
    this.selectedCountry = this.countries.find(
      country => country.name == this.loginForm.value.countrySelector
    );
  }

  countryChanged(){
    this.getSelectedCountry();
    if ( this.selectedCountry.id == 'other'){
      this.loginForm.controls.country.reset();
      this.loginForm.controls.country.enable();
    } else {
      this.loginForm.controls.country.reset();
      this.loginForm.controls.country.disable();
    }
  }

  getSelectedManager(){
    this.selectedManager = this.managers.find(
      manager => manager.name == this.loginForm.value.managerSelector
    );
  }

  setManagerEmail(){
    this.getSelectedManager();
    if ( this.selectedManager.email === '') {
      this.loginForm.controls.managerEmail.reset();
      this.loginForm.controls.managerEmail.enable();
      this.loginForm.controls.managerName.reset();
      this.loginForm.controls.managerName.enable();
    } else {
      this.loginForm.controls.managerName.reset();
      this.loginForm.controls.managerName.disable();
      this.loginForm.controls.managerEmail.disable();
      this.loginForm.patchValue({managerEmail: this.selectedManager.email});
    }
  }
}
