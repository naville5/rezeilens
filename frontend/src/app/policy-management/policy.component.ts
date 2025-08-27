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
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { PolicyService } from '../services/policy.service';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    LoadingComponent,
    SuccessComponent,
    ErrorComponent,
    ErrorModalComponent,
    FormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  templateUrl: './policy.component.html',
  styleUrl: './policy.component.scss',
})
export class PolicyComponent {
  pdfUrl = 'https://pdfobject.com/pdf/sample.pdf#toolbar=0&navpanes=0';

  @ViewChild(SuccessComponent) successModal!: SuccessComponent;
  @ViewChild(ErrorModalComponent) errorModal!: ErrorModalComponent;

  public policyForm: FormGroup;
  public error = '';
  public submitted = false;
  public loading = false;
  isTermsAccepted = false;
  userId: string = '';
  message: string;
  selectedCountry: string;

  successMessage: string = '';
  mask = '(+)00 0000 000000';


  constructor(
    private _policyService: PolicyService,
    private formBuilder: FormBuilder,
    private _authService: AuthenticationService
  ) {}

  get f() {
    return this.policyForm.controls;
  }



  resetState() {
    // Reset form controls
    this.policyForm.reset({
      title: [''],
      description: [''],


    });

    this.submitted = false; // Reset the submitted flag
  }
  createPolicy() {
    this.submitted = true;
    this.error = '';

    // Stop here if form is invalid
    if (this.policyForm.invalid) {
      return;
    }

    this.loading = true;

    const payload = {
      policyTitle: this.f['title'].value,
      description: this.f['description'].value,
      createdBy: (this.userId = this._authService.getUser().id),
    };
    // console.log(payload);
    this._policyService.createPolicy(payload).subscribe(
      (response) => {
        this.openSuccessModal();
        this.message = 'Policy created successfully.';
        setTimeout(() => {
          this.hideSuccessModal();
        }, 3000);
        console.log(response);
        this.loading = false;
        this.resetState();
      },
      (error) => {
        this.openErrorModal();
        console.error('Error creating policy:', error);
        this.message = 'Error creating policy.';
        this.loading = false;
        this.error = error;
        this.resetState();
      }
    );
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





  // Lifecycle Hooks
  ngOnInit(): void {

    this.policyForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', [Validators.required]],


    });
  }


}
