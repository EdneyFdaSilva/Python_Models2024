import { VersioningService } from '@services';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastService } from '@core/services/toast.service';
import { IVersioning } from '@models';
import moment from 'moment';

@Component({
  selector: 'app-versioning-manager',
  templateUrl: './versioning-manager.component.html',
  styleUrls: ['./versioning-manager.component.scss']
})
export class VersioningManagerComponent implements OnInit {

  public loading = false;
  public editMode = false;
  public versions: Array<IVersioning> = [];
  public versioningForm: FormGroup;

  public fields: any;

  constructor(
    private readonly versioningService: VersioningService,
    private readonly toastService: ToastService,
    private readonly formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.versioningForm = this.formBuilder.group({
      id: [0],
      version: ['', Validators.required],
      releaseDate: ['', Validators.required]
    });

    this.fields = {
      releaseDate: {
        id: 'releaseDate',
        hasLabel: true,
        name: 'Release Date',
        type: 'date'
      }
    };

    this.getVersionings();
  }

  getVersionings() {
    this.loading = true;
    this.versioningService
      .getAll()
      .subscribe(
        res => {
          this.versions = res;
        },
        err => {
          this.toastService.show('Error loading versions', {
            type: 'danger'
          });
        }
      )
      .add(() => (this.loading = false));
  }

  editVersion(version: IVersioning) {
    if (this.versioningForm.touched) {
      const r = confirm('You can lose changes');
      if (!r) {
        return false;
      }
    }
    this.editMode = true;
    this.versioningForm.setValue({
      ...this.versioningForm.value,
      id: version.id,
      version: version.version,
      releaseDate: moment(version.releaseDate).format('YYYY-MM-DD')
    });
  }

  clear() {
    this.editMode = false;
    this.versioningForm.reset();
    this.versioningForm.setValue({
      ...this.versioningForm.value,
      id: 0
    });
  }

  valid() {
    let ret = true;

    if (!this.versioningForm.controls.version.valid) {
      this.toastService.show("Version field can't be empty", {
        type: 'danger'
      });
      ret = false;
    }

    if (!this.versioningForm.controls.releaseDate.valid) {
      this.toastService.show("Release Date field can't be empty", {
        type: 'danger'
      });
      ret = false;
    }

    return ret;
  }

  save() {
    if (!this.valid()) {
      return false;
    }
    this.loading = true;

    this.versioningService
      .save(this.versioningForm.value)
      .subscribe(
        res => {
          this.toastService.show('Version saved', {
            type: 'success'
          });
          this.getVersionings();
          this.clear();
        },
        err => {
          this.toastService.show('Error saving version', {
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
    this.versioningService
      .delete(this.versioningForm.value.id)
      .subscribe(
        res => {
          this.toastService.show('Version Deleted', {
            type: 'success'
          });
          this.getVersionings();
          this.clear();
        },
        err => {
          this.toastService.show('Error deleting version', {
            type: 'danger'
          });
        }
      )
      .add(() => {
        this.loading = false;
      });
  }
}
