import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../services/student.service';
import { TeacherService } from '../../services/teacher.service';
import { SubjectService } from '../../services/subject.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  totalStudents: number = 0;
  totalTeachers: number = 0;
  totalSubjects: number = 0;

  constructor(
    private studentService: StudentService,
    private teacherService: TeacherService,
    private subjectService: SubjectService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Get total students
    this.studentService.getAll().subscribe({
      next: (students) => {
        this.totalStudents = students.length;
      },
      error: (error) => {
        this.snackBar.open('Error loading students data', 'Close', { duration: 3000 });
      }
    });

    // Get total teachers
    this.teacherService.getAll().subscribe({
      next: (teachers) => {
        this.totalTeachers = teachers.length;
      },
      error: (error) => {
        this.snackBar.open('Error loading teachers data', 'Close', { duration: 3000 });
      }
    });

    // Get total subjects
    this.subjectService.getAll().subscribe({
      next: (subjects) => {
        this.totalSubjects = subjects.length;
      },
      error: (error) => {
        this.snackBar.open('Error loading subjects data', 'Close', { duration: 3000 });
      }
    });
  }
}
