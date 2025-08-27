import { Component, ViewChild } from '@angular/core';
import { LoadingComponent } from '../loading/loading.component';
import { CommonModule } from '@angular/common';
import { ViewPolicyModalComponent } from '../modals/view-policy-modal/view-policy-modal.component';
import { ErrorModalComponent } from '../modals/error-modal/error-modal.component';
import { AuthenticationService } from '../../auth/service';
import { ModificationModalComponent } from '../modals/modification-modal/modification-modal.component';
import { stageBadgeClasses } from '../shared/enums/mappings/stage-badge-mapping';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { PolicyService } from '../services/policy.service';
// import { Role } from '../../../auth/models';
/**
 * TODO: Update the import path below to the correct location of your Role enum/type.
 * For example, if Role is defined in src/app/auth/models/role.ts, use:
 * import { Role } from '../../auth/models/role';
 */
import { Role } from '../../auth/models/role';

@Component({
  selector: 'app-my-policies',
  standalone: true,
  imports: [
    ViewPolicyModalComponent,
    CommonModule,
    LoadingComponent,
    ModificationModalComponent,
    FormsModule
  ],
  templateUrl: './my-policies.component.html',
  styleUrl: './my-policies.component.scss',
})
export class MyPoliciesComponent {
  @ViewChild(ViewPolicyModalComponent)
  viewOrdermodal!: ViewPolicyModalComponent;

  @ViewChild(ModificationModalComponent)
  modificationOrderModal!: ModificationModalComponent;

  @ViewChild(ErrorModalComponent) errorModal!: ErrorModalComponent;

  constructor(
    private _policyService: PolicyService,
    private _authService: AuthenticationService
  ) { }

  public error = '';
  public loading = false;
  policyData: any[] = [];
  filteredPolicyData: any[] = [];

  message: string;
  selectedPolicyId: string | null = null;
  userId: string = '';
  searchTerm = ''; // Property for search input

  paginatedData: any[] = []; // Data to display in the table
  currentPage: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;
  userType: string = '';
  Role = Role;


  stageBadgeClasses = stageBadgeClasses; // Make it available to the template

  getAllPolicies() {
    this.error = '';

    this.loading = true;


    this._policyService.getAllPolicies().subscribe(
      (response) => {
        // console.log(response);
        this.loading = false;
        this.policyData = response;
        this.filteredPolicyData = this.policyData;
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
  getAllPoliciesForUser() {
    this.error = '';

    this.loading = true;


    this._policyService.getAllPoliciesForUser().subscribe(
      (response) => {
        // console.log(response);
        this.loading = false;
        this.policyData = response;
        this.filteredPolicyData = this.policyData;
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

  acknowledgePolicy(policyId: string) {
    this.error = '';
    this.loading = true;

    this._policyService.acknowledgePolicy(policyId, this._authService.getUser().id).subscribe(
      (response) => {
        // console.log(response);
        this.loading = false;
        this.getAllPoliciesForUser();
      },
      (error) => {
        this.openErrorModal();
        console.error('Error acknowledging policy:', error);
        this.message = 'Error acknowledging policy.';
        this.loading = false;
        this.error = error;
      }
    );
  }

  publishPolicy(policyId: string, publish: boolean = true) {
  this.error = '';
  this.loading = true;

  this._policyService.publishPolicy(policyId, publish).subscribe(
    (response) => {
      this.loading = false;
      // Refresh policies list after publish/unpublish
      this.getAllPolicies();
    },
    (error) => {
      this.openErrorModal();
      console.error('Error updating policy:', error);
      this.message = 'Error updating policy.';
      this.loading = false;
      this.error = error;
    }
  );
}


  updatePaginatedData(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.filteredPolicyData.slice(startIndex, endIndex);
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
    console.log(this.filteredPolicyData);
          this.filteredPolicyData = this.policyData.filter(
      (policy) =>
        policy.policyTitle
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        policy.policyDescription.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    // Reset current page to 1 when a new search is performed
    this.currentPage = 1;

    // console.log(this.filteredPolicyData);
    this.totalRecords = this.filteredPolicyData.length;
    this.updatePaginatedData();
  }

  openErrorModal() {
    if (this.errorModal) {
      this.errorModal.show();
    }
  }

  openViewOrderModal(policyId: string) {
    this.selectedPolicyId = policyId;
      console.log("here policy id ", this.selectedPolicyId);
    this.viewOrdermodal.show();
    this.refreshModalData(this.viewOrdermodal);
  }

  openModificationOrderModal(policyId: string) {
    this.selectedPolicyId = policyId;
    this.modificationOrderModal.show();
    this.refreshModalData(this.modificationOrderModal);
  }

  refreshModalData(modalComponent: any): void {
    if (modalComponent) {
      modalComponent.refreshData(this.selectedPolicyId!);
    }
  }

  ngOnInit() {

    if (this._authService.currentUserValue) {
      this.userType = this._authService.getUser().userType[0];
      if(this.userType === Role.User) {
        this.getAllPoliciesForUser();
      }else {
        this.getAllPolicies();
      }
    }
  }

  ngAfterViewInit() {
    this.modificationOrderModal.statusUpdated.subscribe(() => {
      this.getAllPolicies();
    });
  }

  onPolicyUpdated() {
  // Call the method to refresh your table's data
  this.getAllPolicies();  // Replace this with the actual method you're using to reload the table data
}


}


