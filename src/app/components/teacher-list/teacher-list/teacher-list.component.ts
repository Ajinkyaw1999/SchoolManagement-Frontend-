import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Teacher } from '../../../models/teacher.model';
import { Subject } from '../../../models/subject.model';
import { TeacherService } from '../../../services/teacher.service';
import { SubjectService } from '../../../services/subject.service';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-teacher-list',
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.scss']
})
export class TeacherListComponent implements OnInit, AfterViewInit {
  teachers: Teacher[] = [];
  subjects: Subject[] = [];
  displayedColumns: string[] = ['id', 'name', 'email', 'subjects', 'actions'];
  dataSource: MatTableDataSource<Teacher>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private teacherService: TeacherService,
    private subjectService: SubjectService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    // Initialize dataSource
    this.dataSource = new MatTableDataSource<Teacher>([]);
  }

  ngOnInit(): void {
    this.loadTeachers();
    this.loadSubjects();
  }

  ngAfterViewInit() {
    // Set up paginator and sort after view initialization
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  loadTeachers(): void {
    this.teacherService.getAll().subscribe({
      next: (data) => {
        this.teachers = data;
        this.dataSource.data = this.teachers;
      },
      error: (error) => {
        this.snackBar.open('Error loading teachers: ' + error.message, 'Close', {
          duration: 3000,
        });
      }
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

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getTeacherSubjects(teacherId: number | undefined): string {
    if (!teacherId) return 'None';

    const teacherSubjects = this.subjects.filter(subject => subject.teacherId === teacherId);
    if (teacherSubjects.length === 0) return 'None';

    return teacherSubjects.map(subject => subject.name).join(', ');
  }

  getTeacherSubjectsArray(teacherId: number): string[] {
    const subjectList = this.subjects.filter(subject => subject.teacherId === teacherId);
    return subjectList.map(subject => subject.name);
  }

  confirmDelete(teacher: Teacher): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteTeacher(teacher.id);
      }
    });
  }

  deleteTeacher(id: number | undefined): void {
    if (!id) return;

    // Check if teacher has subjects
    const hasSubjects = this.subjects.some(subject => subject.teacherId === id);
    if (hasSubjects) {
      this.snackBar.open('Cannot delete teacher with assigned subjects. Please reassign subjects first.', 'Close', {
        duration: 5000,
      });
      return;
    }

    if (confirm('Are you sure you want to delete this teacher?')) {
      this.teacherService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Teacher deleted successfully', 'Close', {
            duration: 3000,
          });
          this.loadTeachers();
        },
        error: (error) => {
          this.snackBar.open('Error deleting teacher: ' + error.message, 'Close', {
            duration: 3000,
          });
        }
      });
    }
  }
}
