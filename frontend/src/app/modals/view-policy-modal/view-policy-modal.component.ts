import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { SuccessComponent } from '../success/success.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthenticationService } from '../../../auth/service';
import { MaintenanceService } from '../../services/maintenance.service';
import { KTModal } from '../../../metronic/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../loading/loading.component';
import { LoadingIndicatorComponent } from '../../loading-indicator/loading-indicator.component';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { Role } from '../../../auth/models';
import { PolicyService } from '../../services/policy.service';

interface Department {
  id: string;
  departmentName: string;
}

interface Service {
  id: string;
  serviceName: string;
}



@Component({
  selector: 'app-view-policy-modal',
  standalone: true,
  imports: [
    CommonModule,
    LoadingComponent,
    LoadingIndicatorComponent,
    ReactiveFormsModule,
    ErrorModalComponent,
    SuccessComponent,
    NgxMaskDirective,
    NgxMaskPipe
  ],
  templateUrl: './view-policy-modal.component.html',
  styleUrl: './view-policy-modal.component.scss',
})
export class ViewPolicyModalComponent {
  @ViewChild('modalElement') modalElement!: ElementRef;
  @ViewChild(SuccessComponent) successModal!: SuccessComponent;
  @ViewChild(ErrorModalComponent) errorModal!: ErrorModalComponent;

  public error = '';
  userId: string = '';
  message: string;
  @Input() policyId!: string;
  policyDetails: any = {};
  departmentsData: Department[] = []; // Array of departments
  servicesData: Service[] = []; // Array of services
  serviceDetails: any = {};
  paymentTypes: any[] = []; // Property to store payment types
  public loading = true;
  public loadingIndicator = false;
  selectedDepartment: Department | null = null; // Holds the selected department object
  selectedService: Service | null = null; // Holds the selected service object
  totalAmount: number = 0;
  quantity: number = 1;
  public orderForm: FormGroup;
  showReceiptNumber: boolean = false;
  public submitted = false;
  public loadingIndicator3: boolean = false;
  mask = '(0000-0000-0000-0000)';

  Role = Role;

  userType: string = '';

  constructor(
    private _policyService: PolicyService,
    private _authService: AuthenticationService,
    private _maintenanceService: MaintenanceService,
    private fb: FormBuilder,
  ) {
    this.orderForm = this.fb.group({
      department: [''],
      service: [{ value: '', disabled: true }],
      quantity: [{ value: 1, disabled: true }],
      paymentType: [''],
      receiptNumber: [{ value: '', disabled: true }],
      remarksOne: [''],
      remarksTwo: [''],
    });
  }

  show() {
    const modalEl = document.getElementById('view_order_modal');
    const modal = KTModal.getInstance(modalEl);

    if (modal) {
      modal.show();
      this.resetState();
    } else {
      console.error('KTModal instance not found.');
    }
  }

  hide() {
    const modalEl = document.getElementById('view_order_modal');
    const modal = KTModal.getInstance(modalEl);

    if (modal) {
      modal.hide();
      this.resetState();
    } else {
      console.error('KTModal instance not found.');
    }
  }

  resetState() {
    // Reset form controls
    this.orderForm.reset({
      department: '',
      service: { value: '', disabled: true },
      quantity: { value: 1, disabled: true },
      paymentType: '',
      receiptNumber: { value: '', disabled: true },
    });

    // Reset component properties
    this.policyDetails = {};
    this.error = '';
    this.message = '';
    this.loading = true;


    // Hide loading indicators
    this.loadingIndicator = false;
  }

  // Method to check if both department and service are selected
  isSaveEnabled(): boolean {
    const formValues = this.orderForm.value;
    return (
      !!this.selectedDepartment &&
      !!this.selectedService &&
      !!formValues.paymentType
    );
  }

  getPolicyDetails() {
    this.error = '';

    this.loading = true;



    this._policyService.getPolicyById(this.policyId).subscribe(
      (response) => {
        // commented to let the laoding work for fetch amount distrbution
        this.loading = false;
        this.policyDetails = response;
        console.log("here from the policy details ", response);


        // console.log(response);
      },
      (error) => {
        this.loading = false;
        this.error = error;
        this.message = 'Error loading policy details.';
        console.error('Error loading policy details:', error);
      }
    );
  }







  openSuccessModal() {
    if (this.successModal) {
      this.successModal.show();
    }
  }

  openErrorModal() {
    if (this.errorModal) {
      this.errorModal.show();
    }
  }



  // Method to manually trigger fetching order details
  refreshData(policyId: string): void {
    this.policyId = policyId;
    this.getPolicyDetails();
  }



  ngOnInit(): void {
    if (this.policyId) {
      this.getPolicyDetails();
    }

    if (this._authService.currentUserValue) {
      this.userType = this._authService.getUser().userType[0];

    }
  }
}
