import { Component } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastService } from "@core/services/toast.service";
import { AuthService } from "@services";
import { filter, catchError, debounceTime } from "rxjs/operators";
import { throwError } from "rxjs";
import { ForgotPasswordService } from "@core/services/index.js";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"]
})
export class ForgotPasswordComponent {
  loading = false;

  public forgotPasswordForm = new FormGroup({
    username: new FormControl(""),
    email: new FormControl("")
  });

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly toastService: ToastService,
    private forgotPasswordService: ForgotPasswordService
  ) {}

  cancel() {
    this.router.navigate(["/login"]);
  }

  reset() {
    this.loading = true;
    if (this.forgotPasswordForm.value.email == "") {
      this.toastService.show("E-mail field can't be empty", {
        type: "danger"
      });
    } else if (!this.forgotPasswordForm.controls["email"].valid) {
      this.toastService.show("Please enter a valid e-mail address.", {
        type: "danger"
      });
    } else {
      this.forgotPasswordService
        .ResetPassword(this.forgotPasswordForm.value.email)
        .pipe(catchError(this.handleLoginNetworkError.bind(this)))
        .subscribe(res => {
          this.loading = false;
          this.router.navigate(["/login"]);
        });
    }
    this.loading = false;
  }

  private handleLoginNetworkError(error) {
    this.loading = false;
    this.toastService.show(error.error, {
      type: "danger"
    });
    return throwError(error);
  }
}
