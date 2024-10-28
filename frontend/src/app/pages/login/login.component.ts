import { Component } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastService } from "@core/services/toast.service";
import { AuthService } from "@services";
import { filter, catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { AuthGuard } from '@core/guards/auth.guard';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent {
  loading = false;

  public loginForm = new FormGroup({
    username: new FormControl(""),
    password: new FormControl("")
  });

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly toastService: ToastService,
    private readonly authGuard: AuthGuard,
  ) {}

  private handleLoginNetworkError(error) {
    this.loading = false;
    this.toastService.show("Network error", {
      type: "danger"
    });
    return throwError(error);
  }

  private handleLoginInvalidData(res) {
    this.loading = false;
    if (!res.authenticated) {
      this.toastService.show("Username or password invalid", {
        type: "danger"
      });
    }

    return res.authenticated;
  }

  login() {
    this.loading = true;
    return this.authService
      .login(this.loginForm.value.username, this.loginForm.value.password)
      .pipe(
        catchError(this.handleLoginNetworkError.bind(this)),
        filter(this.handleLoginInvalidData.bind(this))
      )
      .subscribe(() => {
        this.loading = false;
        if (this.authGuard.intendedUrl) {
          return this.router.navigateByUrl(this.authGuard.intendedUrl);
        }
        this.router.navigate(["/home"]);
      });
  }
}
