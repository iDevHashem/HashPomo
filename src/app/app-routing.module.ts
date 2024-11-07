import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { TimerComponent } from './components/timer/timer.component';
import { ReportComponent } from './components/report/report.component';
import { SettingsComponent } from './components/settings/settings.component';

const routes: Routes = [
  // {
  //   path: '',
  //   component: HomeComponent,
  // },
  { path: 'settings', component: SettingsComponent },
  { path: 'timer', component: TimerComponent },
  { path: 'report', component: ReportComponent },
  { path: '', redirectTo: '/timer', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
