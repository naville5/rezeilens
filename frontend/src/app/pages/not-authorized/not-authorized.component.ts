import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from '../../../auth/service';
import { Subject } from 'rxjs';
import { LoadingComponent } from '../../loading/loading.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-not-authorized',
  standalone: true,
  imports: [RouterLink, LoadingComponent, CommonModule],
  templateUrl: './not-authorized.component.html',
  styleUrl: './not-authorized.component.scss',
})
export class NotAuthorizedComponent {
  private _unsubscribeAll: Subject<any>;
  public loading = false;

  constructor(
    private _authService: AuthenticationService,
    private _router: Router,
  ) {}

  ngOnInit(): void {}

  // ngOnDestroy(): void {
  //   // Unsubscribe from all subscriptions
  //   this._unsubscribeAll.next(null);
  //   this._unsubscribeAll.complete();
  // }

  //End Session
  endSession() {
    this.loading = true;



    this._authService.logout();
    this._router.navigate(['/pages/login']);
  }
}
