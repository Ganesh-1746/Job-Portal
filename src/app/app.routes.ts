import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { UserDashboard } from './user-dashboard/user-dashboard';
import { Home } from './user/home/home';
import { Jobs } from './user/jobs/jobs';
import { AppliedJobs} from './user/applied-jobs/applied-jobs';
import { profile } from './user/profile/profile';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { AdminHome } from './admin/admin-home/admin-home';
import { Companies } from './admin/companies/companies';
import { Users } from './admin/users/users';
import { AdminJobs } from './admin/admin-jobs/admin-jobs';
import { Applications } from './admin/applications/applications';
import { UserGuard } from './guards/user-guard';
import { AdminGuard } from './guards/admin-guard';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  {
    path: 'dashboard',
    component: UserDashboard,
    canActivate: [UserGuard],
    children: [
      { path: 'home', component: Home },
      { path: 'jobs', component: Jobs },
      { path: 'applied-jobs', component: AppliedJobs },
      { path: 'profile', component: profile },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboard,
    canActivate: [AdminGuard],
    children: [
      { path: 'admin-home', component: AdminHome },
      { path: 'companies', component: Companies },
      { path: 'users', component: Users },
      { path: 'jobs', component: AdminJobs },
      { path: 'applications', component: Applications }
    ]
  }
];
