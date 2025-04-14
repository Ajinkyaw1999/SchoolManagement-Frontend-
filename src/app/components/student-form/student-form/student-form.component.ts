import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Student } from '../../../models/student.model';
import { Subject } from '../../../models/subject.model';
import { StudentService } from '../../../services/student.service';
import { SubjectService } from '../../../services/subject.service';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss']
})
export class StudentFormComponent implements OnInit {
  studentForm!: FormGroup;
  isEditMode = false;
  studentId: number | null = null;
  subjects: Subject[] = [];

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private subjectService: SubjectService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadSubjects();

    // Check if we're in edit mode
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.studentId = +idParam;
      this.isEditMode = true;
      this.loadStudent(this.studentId);
    }
  }

  initForm(): void {
    this.studentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      subjectIds: [[]]
    });
  }

  loadSubjects(): void {
    this.subjectService.getAll().subscribe({
      next: (data) => {
        this.subjects = data;
      },
      error: (error) => {
        this.snackBar.open('Error loading subjects: ' + error.message, 'Close', {
          duration: 3000,
        });
      }
    });
  }

  loadStudent(id: number): void {
    this.studentService.getById(id).subscribe({
      next: (student) => {
        this.studentForm.patchValue({
          name: student.name,
          email: student.email,
          subjectIds: student.subjectIds || []
        });
      },
      error: (error) => {
        this.snackBar.open('Error loading student: ' + error.message, 'Close', {
          duration: 3000,
        });
      }
    });
  }

  onSubmit(): void {
    if (this.studentForm.valid) {
      const studentData: Student = this.studentForm.value;
      
      if (this.isEditMode && this.studentId) {
        this.studentService.update(this.studentId, studentData).subscribe({
          next: () => {
            this.snackBar.open('Student updated successfully', 'Close', {
              duration: 3000,
            });
            this.router.navigate(['/students']);
          },
          error: (error) => {
            this.snackBar.open('Error updating student: ' + error.message, 'Close', {
              duration: 3000,
            });
          }
        });
      } else {
        this.studentService.create(studentData).subscribe({
          next: () => {
            this.snackBar.open('Student created successfully', 'Close', {
              duration: 3000,
            });
            this.router.navigate(['/students']);
          },
          error: (error) => {
            this.snackBar.open('Error creating student: ' + error.message, 'Close', {
              duration: 3000,
            });
          }
        });
      }
    } else {
      this.markFormGroupTouched(this.studentForm);
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
