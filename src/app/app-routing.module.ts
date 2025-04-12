// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home/home.component';
import { StudentListComponent } from './components/student-list/student-list/student-list.component';
import { StudentFormComponent } from './components/student-form/student-form/student-form.component';
import { TeacherListComponent } from './components/teacher-list/teacher-list/teacher-list.component';
import { TeacherFormComponent } from './components/teacher-form/teacher-form/teacher-form.component';
import { SubjectListComponent } from './components/subject-list/subject-list/subject-list.component';
import { SubjectFormComponent } from './components/subject-form/subject-form/subject-form.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'students', component: StudentListComponent },
  { path: 'students/new', component: StudentFormComponent },
  { path: 'students/edit/:id', component: StudentFormComponent },
  { path: 'teachers', component: TeacherListComponent },
  { path: 'teachers/new', component: TeacherFormComponent },
  { path: 'teachers/edit/:id', component: TeacherFormComponent },
  { path: 'subjects', component: SubjectListComponent },
  { path: 'subjects/new', component: SubjectFormComponent },
  { path: 'subjects/edit/:id', component: SubjectFormComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }