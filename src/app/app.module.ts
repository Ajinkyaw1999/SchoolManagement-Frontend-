// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Material components
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

// Components (these will be created in the next steps)
import { HeaderComponent } from './components/header/header/header.component';
import { StudentListComponent } from './components/student-list/student-list/student-list.component';
import { StudentFormComponent } from './components/student-form/student-form/student-form.component';
import { TeacherListComponent } from './components/teacher-list/teacher-list/teacher-list.component';
import { TeacherFormComponent } from './components/teacher-form/teacher-form/teacher-form.component';
import { SubjectListComponent } from './components/subject-list/subject-list/subject-list.component';
import { SubjectFormComponent } from './components/subject-form/subject-form/subject-form.component';
import { HomeComponent } from './components/home/home/home.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    StudentListComponent,
    StudentFormComponent,
    TeacherListComponent,
    TeacherFormComponent,
    SubjectListComponent,
    SubjectFormComponent,
    HomeComponent,
    ConfirmDialogComponent,
    DashboardComponent,
  ],
  imports: [
    BrowserModule,
AppRoutingModule,
HttpClientModule,
FormsModule,
ReactiveFormsModule,
BrowserAnimationsModule,
MatToolbarModule,
MatButtonModule,
MatCardModule,
MatInputModule,
MatFormFieldModule,
MatTableModule,
MatSelectModule,
MatSnackBarModule,
MatIconModule,
MatSortModule,
MatPaginatorModule,
MatDialogModule,
MatTooltipModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }