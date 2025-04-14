import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Teacher } from '../../../models/teacher.model';
import { TeacherService } from '../../../services/teacher.service';

@Component({
  selector: 'app-teacher-form',
  templateUrl: './teacher-form.component.html',
  styleUrls: ['./teacher-form.component.scss']
})
export class TeacherFormComponent implements OnInit {
  teacherForm!: FormGroup;
  isEditMode = false;
  teacherId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private teacherService: TeacherService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();

    // Check if we're in edit mode
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.teacherId = +idParam;
      this.isEditMode = true;
      this.loadTeacher(this.teacherId);
    }
  }

  initForm(): void {
    this.teacherForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  loadTeacher(id: number): void {
    this.teacherService.getById(id).subscribe({
      next: (teacher) => {
        this.teacherForm.patchValue({
          name: teacher.name,
          email: teacher.email
        });
      },
      error: (error) => {
        this.snackBar.open('Error loading teacher: ' + error.message, 'Close', {
          duration: 3000,
        });
      }
    });
  }

  onSubmit(): void {
    if (this.teacherForm.valid) {
      const teacherData: Teacher = this.teacherForm.value;
      
      if (this.isEditMode && this.teacherId) {
        this.teacherService.update(this.teacherId, teacherData).subscribe({
          next: () => {
            this.snackBar.open('Teacher updated successfully', 'Close', {
              duration: 3000,
            });
            this.router.navigate(['/teachers']);
          },
          error: (error) => {
            this.snackBar.open('Error updating teacher: ' + error.message, 'Close', {
              duration: 3000,
            });
          }
        });
      } else {
        this.teacherService.create(teacherData).subscribe({
          next: () => {
            this.snackBar.open('Teacher created successfully', 'Close', {
              duration: 3000,
            });
            this.router.navigate(['/teachers']);
          },
          error: (error) => {
            this.snackBar.open('Error creating teacher: ' + error.message, 'Close', {
              duration: 3000,
            });
          }
        });
      }
    } else {
      this.markFormGroupTouched(this.teacherForm);
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