import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from '../../../models/subject.model';
import { Teacher } from '../../../models/teacher.model';
import { SubjectService } from '../../../services/subject.service';
import { TeacherService } from '../../../services/teacher.service';

@Component({
  selector: 'app-subject-form',
  templateUrl: './subject-form.component.html',
  styleUrls: ['./subject-form.component.scss']
})
export class SubjectFormComponent implements OnInit {
  subjectForm!: FormGroup;
  isEditMode = false;
  subjectId: number | null = null;
  teachers: Teacher[] = [];

  constructor(
    private fb: FormBuilder,
    private subjectService: SubjectService,
    private teacherService: TeacherService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadTeachers();

    // Check if we're in edit mode
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.subjectId = +idParam;
      this.isEditMode = true;
      this.loadSubject(this.subjectId);
    }
  }

  initForm(): void {
    this.subjectForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      teacherId: [null]
    });
  }

  loadTeachers(): void {
    this.teacherService.getAll().subscribe({
      next: (data) => {
        this.teachers = data;
      },
      error: (error) => {
        this.snackBar.open('Error loading teachers: ' + error.message, 'Close', {
          duration: 3000,
        });
      }
    });
  }

  loadSubject(id: number): void {
    this.subjectService.getById(id).subscribe({
      next: (subject) => {
        this.subjectForm.patchValue({
          name: subject.name,
          teacherId: subject.teacherId
        });
      },
      error: (error) => {
        this.snackBar.open('Error loading subject: ' + error.message, 'Close', {
          duration: 3000,
        });
      }
    });
  }

  onSubmit(): void {
    if (this.subjectForm.valid) {
      const subjectData: Subject = this.subjectForm.value;
      
      if (this.isEditMode && this.subjectId) {
        this.subjectService.update(this.subjectId, subjectData).subscribe({
          next: () => {
            this.snackBar.open('Subject updated successfully', 'Close', {
              duration: 3000,
            });
            this.router.navigate(['/subjects']);
          },
          error: (error) => {
            this.snackBar.open('Error updating subject: ' + error.message, 'Close', {
              duration: 3000,
            });
          }
        });
      } else {
        this.subjectService.create(subjectData).subscribe({
          next: () => {
            this.snackBar.open('Subject created successfully', 'Close', {
              duration: 3000,
            });
            this.router.navigate(['/subjects']);
          },
          error: (error) => {
            this.snackBar.open('Error creating subject: ' + error.message, 'Close', {
              duration: 3000,
            });
          }
        });
      }
    } else {
      this.markFormGroupTouched(this.subjectForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}