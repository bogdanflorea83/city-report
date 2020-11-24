import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs-page';
import { ProblemsPage } from '../problems/problems';


const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'problems',
        children: [
          {
            path: '',
            component: ProblemsPage,
          },
          {
            path: 'session/:sessionId',
            loadChildren: () => import('../session-detail/session-detail.module').then(m => m.SessionDetailModule)
          },
          {
            path: 'edit-patient-appointment/:sessionId',
            loadChildren: () => import('../edit-patient-appointment/edit-patient-appointment.module').then(m => m.EditPatientAppointmentPageModule)
          }
        ]
      },
      {
        path: 'public-problems',
        children: [
          {
            path: '',
            loadChildren: () => import('../public-problems/public-problems.module').then(m => m.PublicProblemsModule)
          },
          {
            path: 'session/:sessionId',
            loadChildren: () => import('../session-detail/session-detail.module').then(m => m.SessionDetailModule)
          },
          {
            path: 'patient-details/:speakerId',
            loadChildren: () => import('../patient-detail/patient-detail.module').then(m => m.PatientDetailModule)
          },
          {
            path: 'add-patient',
            loadChildren: () => import('../add-patient/add-patient.module').then(m => m.AddPatientPageModule)
          }
        ]
      },
      {
        path: 'map',
        children: [
          {
            path: '',
            loadChildren: () => import('../map/map.module').then(m => m.MapModule)
          }
        ]
      },
      {
        path: 'about',
        children: [
          {
            path: '',
            loadChildren: () => import('../about/about.module').then(m => m.AboutModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/app/tabs/problems',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }

