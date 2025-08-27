import { ExceptionModalComponent } from './../modals/exception-modals/exception.modal.component';
import { Component, ViewChild } from '@angular/core';
import { LoadingComponent } from '../loading/loading.component';
import { CommonModule } from '@angular/common';
import { ViewPolicyModalComponent } from '../modals/view-policy-modal/view-policy-modal.component';
import { ErrorModalComponent } from '../modals/error-modal/error-modal.component';
import { AuthenticationService } from '../../auth/service';
import { ModificationModalComponent } from '../modals/modification-modal/modification-modal.component';
import { stageBadgeClasses } from '../shared/enums/mappings/stage-badge-mapping';
import { FormsModule } from '@angular/forms';
import { PolicyService } from '../services/policy.service';
// import { Role } from '../../../auth/models';
/**
 * TODO: Update the import path below to the correct location of your Role enum/type.
 * For example, if Role is defined in src/app/auth/models/role.ts, use:
 * import { Role } from '../../auth/models/role';
 */
import { Role } from '../../auth/models/role';
import { RiskExceptionService } from '../services/risk.exception.service';

@Component({
  selector: 'app-my-exception',
  standalone: true,
  imports: [
    CommonModule,
    LoadingComponent,
    ExceptionModalComponent,
    FormsModule,
  ],
  templateUrl: './my.exception.component.html',
  styleUrl: './my.exception.component.scss',
})
export class MyExceptionComponent {
  @ViewChild(ViewPolicyModalComponent)
  viewOrdermodal!: ViewPolicyModalComponent;

  @ViewChild(ExceptionModalComponent)
  exceptionModal!: ExceptionModalComponent;

  @ViewChild(ErrorModalComponent) errorModal!: ErrorModalComponent;

  constructor(
    private _policyService: PolicyService,
    private _authService: AuthenticationService,
    private _riskExceptionService: RiskExceptionService
  ) {}

  public error = '';
  public loading = false;
  exceptionData: any[] = [];
  filteredExceptionData: any[] = [];

  message: string;
  selectedExceptionId: string | null = null;
  userId: string = '';
  searchTerm = ''; // Property for search input

  paginatedData: any[] = []; // Data to display in the table
  currentPage: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;
  userType: string = '';
  Role = Role;

  stageBadgeClasses = stageBadgeClasses; // Make it available to the template

  getAllRiskExceptions() {
    this.error = '';

    this.loading = true;

    this._riskExceptionService.getAllRiskExceptions().subscribe(
      (response) => {
        // console.log(response);
        this.loading = false;
        this.exceptionData = response;
        this.filteredExceptionData = this.exceptionData;
        this.onSearch();
      },
      (error) => {
        this.openErrorModal();
        console.error('Error loading customer policies:', error);
        this.message = 'Error loading customer policies.';
        this.loading = false;
        this.error = error;
      }
    );
  }

  // acknowledgePolicy(policyId: string) {
  //   this.error = '';
  //   this.loading = true;

  //   this._policyService
  //     .acknowledgePolicy(policyId, this._authService.getUser().id)
  //     .subscribe(
  //       (response) => {
  //         // console.log(response);
  //         this.loading = false;
  //         this.getAllPoliciesForUser();
  //       },
  //       (error) => {
  //         this.openErrorModal();
  //         console.error('Error acknowledging policy:', error);
  //         this.message = 'Error acknowledging policy.';
  //         this.loading = false;
  //         this.error = error;
  //       }
  //     );
  // }

  // publishPolicy(policyId: string, publish: boolean = true) {
  //   this.error = '';
  //   this.loading = true;

  //   this._policyService.publishPolicy(policyId, publish).subscribe(
  //     (response) => {
  //       this.loading = false;
  //       // Refresh policies list after publish/unpublish
  //       this.getAllRiskExceptions();
  //     },
  //     (error) => {
  //       this.openErrorModal();
  //       console.error('Error updating policy:', error);
  //       this.message = 'Error updating policy.';
  //       this.loading = false;
  //       this.error = error;
  //     }
  //   );
  // }

  updatePaginatedData(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.filteredExceptionData.slice(startIndex, endIndex);
    // console.log(this.paginatedData);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
      this.updatePaginatedData();
    }
  }

  onPageSizeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const value = +selectElement.value;
    this.pageSize = value;
    this.currentPage = 1;
    this.updatePaginatedData();
  }

  getPages(): number[] {
    const totalPages = this.getTotalPages();
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  getTotalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  onSearch(): void {
    console.log(this.filteredExceptionData);
    this.filteredExceptionData = this.exceptionData.filter(
      (exception) =>
        exception.policyTitle
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        exception.policyDescription
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        exception.exceptionReason
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        exception.status.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    // Reset current page to 1 when a new search is performed
    this.currentPage = 1;

    // console.log(this.filteredExceptionData);
    this.totalRecords = this.filteredExceptionData.length;
    this.updatePaginatedData();
  }

  openErrorModal() {
    if (this.errorModal) {
      this.errorModal.show();
    }
  }

  openExceptionModal(exceptionId: string, action: 'approve' | 'deny') {
    this.selectedExceptionId = exceptionId;
    if (this.exceptionModal) {
      this.exceptionModal.refreshData(exceptionId); // load policy/exception details
      this.exceptionModal.show(action); // pass action type
    }
  }

  refreshModalData(modalComponent: any): void {
    if (modalComponent) {
      modalComponent.refreshData(this.selectedExceptionId!);
    }
  }

  ngOnInit() {
    if (this._authService.currentUserValue) {
      this.userType = this._authService.getUser().userType[0];
      this.getAllRiskExceptions();
    }
  }

  ngAfterViewInit() {
    // Subscribe to status updates from the modal
    this.exceptionModal.statusUpdated.subscribe(() => {
      this.getAllRiskExceptions(); // Refresh the exceptions table
    });
  }

  // Optional if you want another explicit method call
  onExceptionUpdated() {
    this.getAllRiskExceptions();
  }
}
