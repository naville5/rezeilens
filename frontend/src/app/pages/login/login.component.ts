import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthenticationService } from '../../../auth/service';
import { first, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../loading/loading.component';
import { Role } from '../../../auth/models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // HttpClientModule,
    LoadingComponent,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  // Public
  public loginForm: FormGroup;
  public loading = false;
  public submitted = false;
  public returnUrl: string;
  public error = '';
  public passwordTextType: boolean;

  // Private
  private _unsubscribeAll: Subject<any>;

  @ViewChild(LoadingComponent) loadingComponent!: LoadingComponent;

  constructor(
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private _router: Router,
  ) {
    this._unsubscribeAll = new Subject();
  }

  // Convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.error = '';

    // Stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    // Login
    this.loading = true;

    this.authService
      .login(this.f['email'].value, this.f['password'].value)
      .pipe(first())
      .subscribe(
        (data) => {
          // this._router.navigate([this.returnUrl]);
          // console.log(data);
          // console.log("here from login response ", data)
            ;



          if (data.userType == Role.User)
            this._router.navigate(['/dashboard/new-submission']);
          else if (data.userType == Role.Admin) {
            this._router.navigate(['/dashboard/admin']);
          }

          else {
            this.loading = false;
            this.error = 'User type mismatch';
          }
        },
        (error) => {
          this.loading = false;
          this.error = error;
        }
      );
  }

  // Lifecycle Hooks
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });

    // Get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
