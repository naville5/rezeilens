import { CommonModule } from '@angular/common';
import { Component, HostBinding } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../../auth/service';
import { User } from '../../../auth/models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @HostBinding('class')

  // hostClass =
  // 'header fixed top-0 z-10 left-0 right-0 flex items-stretch shrink-0 bg-[#fefefe] dark:bg-gradient-to-r  dark:from-[#1A001A] dark:to-[#3D0066]  shadow-sm dark:border-b dark:border-b-[#3D0066]';
  hostClass =
    'header fixed top-0 left-0 right-0 flex items-stretch shrink-0 bg-[#fefefe] dark:bg-coal-500 dark:border-b dark:border-b-coal-100 z-5';
  @HostBinding('attr.role') hostRole = 'banner';
  @HostBinding('attr.data-sticky') dataSticky = 'true';
  @HostBinding('attr.data-sticky-name') dataStickyName = 'header';
  @HostBinding('id') hostId = 'header';

  notifications: any[] = [];
  breadcrumbs: { path: string; label: string }[] = [];
  user: User | null = null;
  private notificationsSubscription: Subscription;

  constructor(
    private _router: Router,
    private _authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this._router.events.subscribe(() => {
      this.updateBreadcrumbs();
    });
    this.user = this._authService.getUser();

    // Handle tab visibility change
    document.addEventListener(
      'visibilitychange',
      this.handleVisibilityChange.bind(this)
    );
  }

  private capitalize(segment: string): string {
    return segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase();
  }

  private updateBreadcrumbs(): void {
    const url = this._router.url;
    const segments = url.split('/').filter((segment) => segment);

    // Process segments containing dashes
    const processedSegments = segments.map((segment) => {
      if (segment.includes('-')) {
        // Split by dash, capitalize each part, and join without spaces
        return segment.split('-').map(this.capitalize).join(' ');
      }
      // If no dash, just capitalize the segment
      return this.capitalize(segment);
    });

    this.breadcrumbs = processedSegments.map((segment, index) => {
      const path = `/${processedSegments.slice(0, index + 1).join('/')}`;
      return {
        path,
        label: segment,
      };
    });
  }

  // Handle visibility change
  private handleVisibilityChange(): void {
    if (!document.hidden) {
      // Tab is visible
      console.log('Tab is visible. Updating notifications.');
    }
  }

  // Clean up subscriptions on destroy
  ngOnDestroy(): void {
    document.removeEventListener(
      'visibilitychange',
      this.handleVisibilityChange.bind(this)
    );
  }



  logOut() {
    // Proceed directly with logout and navigation without Firebase or notification logic
    this._authService.logout();
    this._router.navigate(['/pages/login']);
  }
}
