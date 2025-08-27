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
import { RiskExceptionService } from '../../services/risk.exception.service';
export type ExceptionAction = 'approve' | 'deny';

@Component({
  selector: 'app-exception-modal',
  standalone: true,
  imports: [
    LoadingComponent,
    ReactiveFormsModule,
    ErrorModalComponent,
    SuccessComponent,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './exception.modal.component.html',
  styleUrl: './exception.modal.component.scss',
})
export class ExceptionModalComponent {
  @Output() statusUpdated = new EventEmitter<void>();

  @ViewChild('modalElement') modalElement!: ElementRef;
  @ViewChild(SuccessComponent) successModal!: SuccessComponent;
  @ViewChild(ErrorModalComponent) errorModal!: ErrorModalComponent;

  @Input() exceptionId!: string;
  @Input() actionType: ExceptionAction = 'approve'; // default
  private baseUrl: string;

  public loading = false;
  public loadingIndicator = false;
  policyDetails: any = {};
  approvalStages: any[] = [];
  public exceptionUpdateForm: FormGroup;
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
    private _riskService: RiskExceptionService,
    private fb: FormBuilder,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.exceptionUpdateForm = this.fb.group({
      exceptionComments: [''], // readonly
    });
  }

  show(action: ExceptionAction) {
    this.actionType = action;
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






  private handleSuccess(response: any) {
  this.loadingIndicator = false;

  // Show success modal
  this.message = this.actionType === 'approve'
                 ? 'Exception approved successfully!'
                 : 'Exception rejected successfully!';
  this.openSuccessModal();

  // Reset the form and internal states
  this.exceptionUpdateForm.reset();
  this.submitted = false;

  // Close the modal after 3 seconds
  setTimeout(() => {
    this.hideSuccessModal();
    this.hide(); // close the exception modal
  }, 3000);

  // Notify parent to refresh data
  this.statusUpdated.emit();
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

  refreshData(exceptionId: string): void {
    this.exceptionId = exceptionId;

  }

 resetState() {
  // Don't reset the form entirely, just patch the existing values
  this.exceptionUpdateForm.patchValue({
    exceptionComments: '', // Reset to empty or default value
  });

  // Reset other component properties
  this.error = '';
  this.message = '';
  this.loading = false;
  this.loadingIndicator = false;
}

onSubmit(): void {
  this.submitted = true;

  if (this.exceptionUpdateForm.invalid) return;

  this.loadingIndicator = true;

  const payload = {
    RiskExceptionId: this.exceptionId,
    AdminComments: this.exceptionUpdateForm.get('exceptionComments')?.value,
    IsApproved: this.actionType === 'approve' ? 1 : 2,
    ApprovedBy: this._authService.getUser().id
  };

  this._riskService.updateRiskExceptionStatus(payload).subscribe({
    next: (res) => this.handleSuccess(res),
    error: (err) => this.handleError(err)
  });
}




//   updatePolicyDetails() {
//   // Ensure form values are up-to-date before submission
//   const policyTitle = this.exceptionUpdateForm.get('policyTitle')?.value;
//   const policyDescription = this.exceptionUpdateForm.get('policyDescription')?.value;

//   const payload = {
//     exceptionId: this.exceptionId,  // existing id
//     policyTitle: policyTitle,  // updated title
//     description: policyDescription,  // updated description
//     createdBy: this.policyDetails.createdBy,  // keep same createdBy
//   };

//   console.log('Payload for update:', payload);
//   this._policyService.updatePolicy(payload).subscribe(
//     (response) => {
//       this.policyDetails = response;
//       this.openSuccessModal();
//       this.message = 'Policy updated successfully.';
//       setTimeout(() => {
//         this.hideSuccessModal();
//       }, 3000);
//          // Emit an event to notify the parent component
//       this.statusUpdated.emit();  // <-- Emit event after success
//       this.loading = false;
//       this.resetState();

//     },
//     (error) => {
//       this.loading = false;
//       this.error = error;
//       this.message = 'Error loading policy details.';
//       console.error('Error loading policy details:', error);
//     }
//   );
// }


  ngOnInit(): void {
    console.log('Initializing Exception Modal with exceptionId:', this.exceptionId);
    if (this.exceptionId) {

      }
  }

  ngAfterViewInit() {}
}
