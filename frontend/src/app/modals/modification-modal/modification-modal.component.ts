import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { KTModal } from '../../../metronic/core';
import { LoadingComponent } from '../../loading/loading.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { SuccessComponent } from '../success/success.component';
import { AuthenticationService } from '../../../auth/service';
import { CommonModule, DOCUMENT } from '@angular/common';
import { catchError, of, switchMap } from 'rxjs';
import { Policy, PolicyService } from '../../services/policy.service';

@Component({
  selector: 'app-modification-modal',
  standalone: true,
  imports: [
    LoadingComponent,
    ReactiveFormsModule,
    ErrorModalComponent,
    SuccessComponent,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './modification-modal.component.html',
  styleUrl: './modification-modal.component.scss',
})
export class ModificationModalComponent {
  @Output() statusUpdated = new EventEmitter<void>();

  @ViewChild('modalElement') modalElement!: ElementRef;
  @ViewChild(SuccessComponent) successModal!: SuccessComponent;
  @ViewChild(ErrorModalComponent) errorModal!: ErrorModalComponent;

  @Input() policyId!: string;
  private baseUrl: string;

  public loading = false;
  public loadingIndicator = false;
  policyDetails: any = {};
  approvalStages: any[] = [];
  public policyUpdateForm: FormGroup;
  message: string;
  public error = '';
  userId: string = '';
  public submitted = false;
  files: File[] = [];
  requiredDocuments: any[] = [{ attachmentName: '' }];
  isDocumentUploadMandatory: number;
  decimalValue: string = '';
  isClosedStage: boolean = false;

  constructor(
    private _policyService: PolicyService,
    private _authService: AuthenticationService,
    private fb: FormBuilder,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.policyUpdateForm = this.fb.group({
      policyTitle: [''], // readonly
      policyDescription: [''], // readonly
      // Add editable fields if needed later
    });
  }

  show() {
    const modalEl = document.getElementById('modification_order_modal');
    const modal = KTModal.getInstance(modalEl);

    if (modal) {
      modal.show();
      this.resetState();
    } else {
      console.error('KTModal instance not found.');
    }
  }

  hide() {
    const modalEl = document.getElementById('modification_order_modal');
    const modal = KTModal.getInstance(modalEl);

    if (modal) {
      modal.hide();
      this.resetState();
    } else {
      console.error('KTModal instance not found.');
    }
  }

getPolicyDetails() {
  this.isClosedStage = false;
  this.error = '';

  this._policyService.getPolicyById(this.policyId).subscribe(
    (response) => {
      this.loading = false;
      this.policyDetails = response;
      // Ensure patching only after policy details are loaded
      this.patchFormValues();
    },
    (error) => {
      this.loading = false;
      this.error = error;
      this.message = 'Error loading policy details.';
      console.error('Error loading policy details:', error);
    }
  );
}


  patchFormValues(): void {
  if (this.policyDetails) {
    this.policyUpdateForm.patchValue({
      policyTitle: this.policyDetails.policyTitle,
      policyDescription: this.policyDetails.policyDescription,
    });
  }
}

  // Method to handle success response
  private handleSuccess(response: any) {
    this.loadingIndicator = false;
    if (response && response.length > 0) {
      this.message = 'Modification completed successfully!';
      this.openSuccessModal();

      setTimeout(() => {
        this.hideSuccessModal();
      }, 3000);

      this.statusUpdated.emit();
    }
    // console.log(response);
  }

  // Method to handle errors
  private handleError(error: any) {
    this.loadingIndicator = false;
    this.error = error;
    this.message = 'Error updating policy with service details.';
    this.openErrorModal();
    console.error('Error updating policy with service details:', error);
    return of(null); // Return an empty observable to continue the stream
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

  refreshData(policyId: string): void {
    this.policyId = policyId;
    this.getPolicyDetails();

  }

 resetState() {
  // Don't reset the form entirely, just patch the existing values
  this.policyUpdateForm.patchValue({
    policyTitle: this.policyDetails.policyTitle,
    policyDescription: this.policyDetails.policyDescription,
  });

  // Reset other component properties
  this.error = '';
  this.message = '';
  this.loading = false;
  this.loadingIndicator = false;
}

 onSubmit(): void {
  this.submitted = true;
  this.policyUpdateForm.updateValueAndValidity();

  if (this.policyUpdateForm.invalid) {
    console.log('Form Errors:', this.policyUpdateForm.errors);
    Object.keys(this.policyUpdateForm.controls).forEach((controlName) => {
      const controlErrors = this.policyUpdateForm.get(controlName)?.errors;
      if (controlErrors) {
        console.log(`Control ${controlName} Errors:`, controlErrors);
      }
    });
  } else {
    this.updatePolicyDetails();
  }
}


  updatePolicyDetails() {
  // Ensure form values are up-to-date before submission
  const policyTitle = this.policyUpdateForm.get('policyTitle')?.value;
  const policyDescription = this.policyUpdateForm.get('policyDescription')?.value;

  const payload = {
    policyId: this.policyId,  // existing id
    policyTitle: policyTitle,  // updated title
    description: policyDescription,  // updated description
    createdBy: this.policyDetails.createdBy,  // keep same createdBy
  };

  console.log('Payload for update:', payload);
  this._policyService.updatePolicy(payload).subscribe(
    (response) => {
      this.policyDetails = response;
      this.openSuccessModal();
      this.message = 'Policy updated successfully.';
      setTimeout(() => {
        this.hideSuccessModal();
      }, 3000);
         // Emit an event to notify the parent component
      this.statusUpdated.emit();  // <-- Emit event after success
      this.loading = false;
      this.resetState();

    },
    (error) => {
      this.loading = false;
      this.error = error;
      this.message = 'Error loading policy details.';
      console.error('Error loading policy details:', error);
    }
  );
}


  ngOnInit(): void {
    if (this.policyId) {
      this.getPolicyDetails();
    }
  }

  ngAfterViewInit() {}
}
