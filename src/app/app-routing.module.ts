import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './security/auth.guard';
import {LoginPageComponent} from './login-page/login-page.component';
import {LiveControllerComponent} from './live-controller/live-controller.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {TemplatesComponent} from './templates/templates.component';
import {ScheduleComponent} from './schedule/schedule.component';
import {AdminPanelComponent} from './admin-panel/admin-panel.component';
import {AdminGuard} from './security/admin.guard';
import {OperatorGuard} from './security/operator.guard';
import {EditingToolComponent} from './editing-tool/editing-tool.component';
import {DashboardResolverService} from "./resolvers/dashboard-resolver.service";
import {AdminPanelResolverService} from "./resolvers/admin-panel-resolver.service";
import {RefreshResolverService} from "./resolvers/refresh-resolver.service";

const routes: Routes = [
  {path: 'login', component: LoginPageComponent},
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    resolve: {
      resolvedData: DashboardResolverService
    }
  },
  {
    path: 'liveControl',
    component: LiveControllerComponent,
    canActivate: [AuthGuard, OperatorGuard]
  },
  {
    path: 'templates',
    component: TemplatesComponent,
    canActivate: [AuthGuard],
    resolve: {
      resolvedData: RefreshResolverService
    }
  },
  {
    path: 'schedules',
    component: ScheduleComponent,
    canActivate: [AuthGuard],
    resolve: {
      resolvedData: RefreshResolverService
    }
  },
  {
    path: 'adminPanel',
    component: AdminPanelComponent,
    canActivate: [AuthGuard, AdminGuard],
    resolve: {
      resolvedData: AdminPanelResolverService,
      nextResolvedData: RefreshResolverService
    }
  },
  {path: 'editingTool', component: EditingToolComponent},

  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: '**', pathMatch: 'full', component: NotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
