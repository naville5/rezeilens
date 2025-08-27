import { Component, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoadingComponent } from '../loading/loading.component';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../../auth/service';
import { SuccessComponent } from '../modals/success/success.component';
import { ErrorComponent } from '../pages/error/error.component';
import { ErrorModalComponent } from '../modals/error-modal/error-modal.component';
import { PolicyService } from '../services/policy.service';
import { RiskExceptionService } from '../services/risk.exception.service';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    LoadingComponent,
    SuccessComponent,
    ErrorModalComponent,
    FormsModule,
  ],
  templateUrl: './new.exception.component.html',
  styleUrl: './new.exception.component.scss',
})
export class NewExceptionComponent {
  @ViewChild(SuccessComponent) successModal!: SuccessComponent;
  @ViewChild(ErrorModalComponent) errorModal!: ErrorModalComponent;

  public error = '';

  message: string;

  riskExceptionForm: FormGroup;
  submitted = false;
  loading = false;
  policies: any[] = [];

  constructor(
    private fb: FormBuilder,
    private policyService: PolicyService,
    private riskService: RiskExceptionService,
    private _authService: AuthenticationService
  ) {}

  ngOnInit() {
    this.riskExceptionForm = this.fb.group({
      policyId: ['', Validators.required],
      reason: ['', Validators.required],
      durationInDays: [1, [Validators.required, Validators.min(1)]],
      riskRating: ['', Validators.required],
    });

    this.loadPolicies();
  }

  get f() {
    return this.riskExceptionForm.controls;
  }

  loadPolicies() {
    this.riskService.getPublishedPoliciesForException().subscribe(
      (res) => (this.policies = res),
      (err) => console.error(err)
    );
  }

  submitRiskException() {
    this.submitted = true;

    // Stop if form is invalid
    if (this.riskExceptionForm.invalid) return;

    this.loading = true;

    // Add SubmittedBy to the payload
    const payload = {
      ...this.riskExceptionForm.value,
      submittedBy: this._authService.getUser().id, // Add the logged-in user's ID
    };
    console.log('Submitting Risk Exception:', payload);
    this.riskService.submitRiskException(payload).subscribe({
      next: (res) => {
        this.loading = false;

        this.openSuccessModal();
        this.message = 'Risk Exception created successfully.';
        setTimeout(() => {
          this.hideSuccessModal();
        }, 3000);

        // Reset form and submission state
        this.riskExceptionForm.reset();
        this.submitted = false;

        // Optionally refresh policies for raising exceptions if you have a method for that
        this.loadPolicies();
      },
      error: (err) => {
        this.loading = false;
        console.error('Error submitting Risk Exception:', err);
        this.openErrorModal();
        console.error('Error submitting Risk Exception:', err);
        this.message = 'Error submitting Risk Exception.';
        this.loading = false;
        this.error = err;
      },
    });
  }

  openSuccessModal() {
    if (this.successModal) {
      this.successModal.show();
    }
  }

  hideSuccessModal() {
    if (this.successModal) {
      this.successModal.hide();
    }
  }

  openErrorModal() {
    if (this.errorModal) {
      this.errorModal.show();
    }
  }
}
