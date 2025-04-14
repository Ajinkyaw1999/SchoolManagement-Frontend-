import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SubjectService } from '../../../services/subject.service';
import { TeacherService } from '../../../services/teacher.service';
import { Subject } from '../../../models/subject.model';
import { Teacher } from '../../../models/teacher.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-subject-list',
  templateUrl: './subject-list.component.html',
  styleUrls: ['./subject-list.component.scss']
})
export class SubjectListComponent implements OnInit {
  subjects: Subject[] = [];
  teachers: Teacher[] = [];
  displayedColumns: string[] = ['id', 'name', 'teacher', 'actions'];
  dataSource = new MatTableDataSource<Subject>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  

  constructor(
    private subjectService: SubjectService,
    private teacherService: TeacherService,
    private snackBar: MatSnackBar  ,
    private dialog: MatDialog
  )
  {
      // Initialize dataSource
      this.dataSource = new MatTableDataSource<Subject>([]);
    }

  ngOnInit(): void {
    this.loadSubjects();
    this.loadTeachers();
  }

  ngAfterViewInit() {
    // Set up paginator and sort after view initialization
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  loadSubjects(): void {
    this.subjectService.getAll().subscribe({
      next: (data) => {
        this.subjects = data;
        this.dataSource.data = this.subjects;
      },
      error: (error) => {
        this.snackBar.open('Error loading subjects: ' + error.message, 'Close', { duration: 3000 });
      }
    });
  }

  loadTeachers(): void {
    this.teacherService.getAll().subscribe({
      next: (data) => {
        this.teachers = data;
      },
      error: (error) => {
        this.snackBar.open('Error loading teachers: ' + error.message, 'Close', { duration: 3000 });
      }
    });
  }

  getTeacherName(teacherId: number | undefined): string {
    if (!teacherId) return 'Not Assigned';
    const teacher = this.teachers.find(t => t.id === teacherId);
    return teacher ? teacher.name : 'Unknown';
  }

  confirmDelete(subject: Subject): void {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '350px'
      });
      
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          this.deleteSubject(subject.id);
        }
      });
    }

    deleteSubject(id: number | undefined): void {
      if (!id) return;
      
      this.subjectService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Subject deleted successfully', 'Close', {
            duration: 3000,
          });
          this.loadSubjects();
        },
        error: (error) => {
          this.snackBar.open('Error deleting Subject: ' + error.message, 'Close', {
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


}
