import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/sign-up/register.component';
import { ErrorComponent } from './pages/error/error.component';
import { AuthGuard, NoAuthGuard } from '../auth/helpers';
import { Role } from '../auth/models';
import { ForbiddenComponent } from './pages/forbidden/forbidden.component';
import { NotAuthorizedComponent } from './pages/not-authorized/not-authorized.component';
import { ReportsComponent } from './report/report.component';
import { AdminComponent } from './dashboard/admin/admin.component';
import { PolicyComponent } from './policy-management/policy.component';
import { MyPoliciesComponent } from './my-policies/my-policies.component';
import { NewExceptionComponent } from './new exception/new.exception.component';
import { MyExceptionComponent } from './my-exception/my.exception.component';

export const routes: Routes = [
  // Dashboard routes (protected by AuthGuard)
  {
    path: 'dashboard/admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: { role: [Role.Admin] },
  },

  {
    path: 'dashboard/report',
    component: ReportsComponent,
    canActivate: [AuthGuard],
    data: { role: [Role.Admin] },
  },

  {
    path: 'dashboard/new-submission',
    component: NewExceptionComponent,
    canActivate: [AuthGuard],
    data: { role: Role.User },
  },
  {
    path: 'dashboard/new-policy',
    component: PolicyComponent,
    canActivate: [AuthGuard],
    data: { role: Role.Admin },
  },

  {
    path: 'dashboard/my-policies',
    component: MyPoliciesComponent,
    canActivate: [AuthGuard],
    data: { role: [Role.User, Role.Admin] },
  },

  {
    path: 'dashboard/my-exceptions',
    component: MyExceptionComponent,
    canActivate: [AuthGuard],
    data: { role: [Role.User, Role.Admin] },
  },
  // Pages routes (protected by NoAuthGuard)

  {
    path: 'pages/login',
    component: LoginComponent,
    canActivate: [NoAuthGuard], // when uncomment this line it show just empty white screen
  },
  {
    path: 'pages/sign-up',
    component: RegisterComponent,
    canActivate: [NoAuthGuard],
  },
  {
    path: 'pages/error',
    component: ErrorComponent,
  },
  {
    path: 'pages/forbidden',
    component: ForbiddenComponent,
  },
  {
    path: 'pages/not-authorized',
    component: NotAuthorizedComponent,
  },

  // Redirect to login if root is accessed
  {
    path: '',
    redirectTo: '/pages/login',
    pathMatch: 'full',
  },

  // Fallback route for undefined paths
  {
    path: '**',
    redirectTo: 'pages/error',
  },
];
