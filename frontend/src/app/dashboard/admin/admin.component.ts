import { Component } from '@angular/core';
import { MaintenanceService } from '../../services/maintenance.service';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { AuthenticationService } from '../../../auth/service';
import { User } from '../../../auth/models';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [NgChartsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  public error = '';
  public loading = false;
  public userRolesData: any[] = [];
  public statsData: any;
  message: string;
  user: User | null = null;

  public pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    }
  };

  public pieChartData1: ChartConfiguration<'pie'>['data'] = {
    labels: ['Completed', 'Pending', 'Rejected'],
    datasets: [
      {
        data: [340, 120, 65],
        backgroundColor: ['#242f6a', '#D3D3D3', '#F44336'],
      },
    ],
  };

  public pieChartData2: ChartConfiguration<'pie'>['data'] = {
    labels: ['UK', 'Other Regions'],
    datasets: [
      {
        data: [200, 160],
        backgroundColor: ['#242f6a', '#D3D3D3'],
      },
    ],
  };

  public pieChartType: ChartType = 'pie';

  constructor(
        private _dashboardService: DashboardService,
        private _authService: AuthenticationService,
        private _maintenanceService: MaintenanceService
  ) {}

  // Lifecycle Hooks
  ngOnInit(): void {
    // this.getUserRoles();
    this.user = this._authService.getUser();
    this.getStats();
  }

  ngAfterViewInit() {

  }

  getStats() {
    this.error = '';


    this._dashboardService.getStats().subscribe(
      (response) => {
        this.loading = false;
        this.statsData = response;
      },
      (error) => {
        this.loading = false;
        this.error = error;
        this.message = 'Error loading departments.';
        console.error('Error loading departments:', error);
      }
    );
  }



}
