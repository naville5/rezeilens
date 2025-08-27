import { CommonModule } from '@angular/common';
import { Component, HostBinding } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthenticationService } from '../../../auth/service';
import { Role } from '../../../auth/models';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})

export class SidebarComponent {

  @HostBinding('class')
  hostClass =
  'sidebar bg-light border-r border-r-white-200 dark:bg-gradient-to-b dark:from-coal-600 dark:to-coal-600 dark:border-r-coal-100 fixed z-20 hidden lg:flex flex-col items-stretch shrink-0';

  // hostClass =
  //   'sidebar dark:bg-[#140024] bg-light border-r border-r-gray-200 dark:border-r-[#140024] fixed z-20 hidden lg:flex flex-col items-stretch shrink-0';
  @HostBinding('attr.data-drawer') drawer = 'true';
  @HostBinding('attr.data-drawer-class') drawerClass =
    'drawer drawer-start top-0 bottom-0';
  @HostBinding('attr.data-drawer-enable') drawerEnable = 'true|lg:false';
  @HostBinding('attr.id') id = 'sidebar';

  Role = Role;

  userType: string = '';

  constructor(private authService: AuthenticationService) {}

  ngOnInit(): void {
    if (this.authService.currentUserValue) {
      this.userType = this.authService.getUser().userType[0];
    }
  }
}
