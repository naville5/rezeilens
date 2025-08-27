import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  HostBinding,
  OnInit,
  Renderer2,
  Inject,
} from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layouts/header/header.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import { SearchModalComponent } from './partials/search-modal/search-modal.component';
import KTComponents from '../metronic/core/index';
import KTLayout from '../metronic/app/layouts/demo1';
import { catchError, filter, retry, switchMap } from 'rxjs/operators';
import { CommonModule, DOCUMENT } from '@angular/common';
import { LoadingComponent } from './loading/loading.component';
import { AuthenticationService } from '../auth/service';
import { MaintenanceService } from './services/maintenance.service';
import { EMPTY, interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    SearchModalComponent,
    CommonModule,
    LoadingComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, AfterViewInit {
  private syncSubscription!: Subscription;

  title = 'rezilens';
  showLayout = false;
  public isWebsiteRoute = false;

  isSidebarCollapsed = false

  // isChatModalOpen = false; // modal visibility state

  @HostBinding('class') hostClass = 'flex grow';

  constructor(
    private router: Router,
    private _authService: AuthenticationService,
    private maintenanceService: MaintenanceService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const currentUrl = new URL(this.router.url, window.location.origin);

        this.initializeMetronicComponents();

        this.showBackgroundgImage(currentUrl.pathname); // Adjusted if showBackgroundgImage expects a string

        this.showLayout = this.getShowLayout(currentUrl);

        // Collapse sidebar if on /meeting route
        this.isSidebarCollapsed =  currentUrl.pathname.includes('/meeting')

        if (this.isSidebarCollapsed) {
            KTLayout.collapseSidebar();
        }

        if (currentUrl.pathname.includes('/website')) {
          this.isWebsiteRoute = true;

          this.loadStyle('assets/website/css/vendor.css');
          this.loadStyle('assets/website/css/wa.css');
          this.loadFontCSS();
          this._authService.logout();
          console.log(this.isWebsiteRoute);
        } else {
          this.isWebsiteRoute = false;
        }
      });


  }

  loadStyle(href: string) {
    const link = this.renderer.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    this.renderer.appendChild(this.document.head, link);
  }

  loadFontCSS() {
    const existingLink = document.querySelector(
      "link[href='https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap']"
    );
    if (!existingLink) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href =
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
      document.head.appendChild(link);
    }
  }


  ngOnDestroy(): void {
    if (this.syncSubscription) {
      console.log('destroy service');
      this.syncSubscription.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    this.initializeMetronicComponents();
  }

  initializeMetronicComponents(): void {
    KTComponents.init();
    KTLayout.init();
    KTLayout.isCollapsed = true
  }

  showBackgroundgImage(currentUrl): void {
    if (
      currentUrl.includes('/login') ||
      currentUrl.includes('/customer-document-upload') ||
      currentUrl.includes('/sign-up')


    ) {
      document.body.classList.add('app-bg');
      this.unloadStyle('assets/website/css/styles.css');
    }  else {
      document.body.classList.remove('app-bg');
      document.body.classList.remove('styleOne');
    }
  }

  getShowLayout(currentUrl: URL) {
    let showLayout: boolean;
    if (this._authService.getUser()) {
      if (!currentUrl.pathname.includes('/pages') ) {
        showLayout = true;
      }
    } else {
      showLayout = false;
    }

    return showLayout;
  }

  unloadStyle(href: string) {
    const linkElement = document.querySelector(`link[href="${href}"]`);
    if (linkElement) {
      linkElement.parentNode?.removeChild(linkElement);
    }
  }


}
