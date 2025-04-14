// // src/app/components/student-list/student-list.component.ts
// import { Component, OnInit } from '@angular/core';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { Student } from '../../../models/student.model';
// import { Subject } from '../../../models/subject.model';
// import { StudentService } from '../../../services/student.service';
// import { SubjectService } from '../../../services/subject.service';

// @Component({
//   selector: 'app-student-list',
//   templateUrl: './student-list.component.html',
//   styleUrls: ['./student-list.component.scss']
// })
// export class StudentListComponent implements OnInit {
//   students: Student[] = [];
//   subjects: Subject[] = [];
//   displayedColumns: string[] = ['id', 'name', 'email', 'subjects', 'actions'];

//   constructor(
//     private studentService: StudentService,
//     private subjectService: SubjectService,
//     private snackBar: MatSnackBar
//   ) {}

//   ngOnInit(): void {
//     this.loadStudents();
//     this.loadSubjects();
//   }

//   loadStudents(): void {
//     this.studentService.getAll().subscribe({
//       next: (data) => {
//         this.students = data;
//       },
//       error: (error) => {
//         this.snackBar.open('Error loading students: ' + error.message, 'Close', {
//           duration: 3000,
//         });
//       }
//     });
//   }

//   loadSubjects(): void {
//     this.subjectService.getAll().subscribe({
//       next: (data) => {
//         this.subjects = data;
//       },
//       error: (error) => {
//         this.snackBar.open('Error loading subjects: ' + error.message, 'Close', {
//           duration: 3000,
//         });
//       }
//     });
//   }

//   getSubjectNames(subjectIds: number[] | undefined): string {
//     if (!subjectIds || subjectIds.length === 0) return 'None';
    
//     return subjectIds
//       .map(id => this.subjects.find(subject => subject.id === id)?.name || '')
//       .filter(name => name !== '')
//       .join(', ');
//   }

//   deleteStudent(id: number | undefined): void {
//     if (!id) return;
    
//     if (confirm('Are you sure you want to delete this student?')) {
//       this.studentService.delete(id).subscribe({
//         next: () => {
//           this.snackBar.open('Student deleted successfully', 'Close', {
//             duration: 3000,
//           });
//           this.loadStudents();
//         },
//         error: (error) => {
//           this.snackBar.open('Error deleting student: ' + error.message, 'Close', {
//             duration: 3000,
//           });
//         }
//       });
//     }
//   }
// }

// src/app/components/student-list/student-list.component.ts
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Student } from '../../../models/student.model';
import { Subject } from '../../../models/subject.model';
import { StudentService } from '../../../services/student.service';
import { SubjectService } from '../../../services/subject.service';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';



@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent implements OnInit, AfterViewInit {
  students: Student[] = [];
  subjects: Subject[] = [];
  displayedColumns: string[] = ['id', 'name', 'email', 'subjects', 'actions'];
  dataSource: MatTableDataSource<Student>;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;

  constructor(
    private studentService: StudentService,
    private subjectService: SubjectService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    // Initialize dataSource
    this.dataSource = new MatTableDataSource<Student>([]);
  }

  ngOnInit(): void {
    this.loadStudents();
    this.loadSubjects();
  }
  
  ngAfterViewInit() {
    // Set up paginator and sort after view initialization
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  loadStudents(): void {
    this.studentService.getAll().subscribe({
      next: (data) => {
        this.students = data;
        this.dataSource.data = this.students;
      },
      error: (error) => {
        this.snackBar.open('Error loading students: ' + error.message, 'Close', {
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

  getSubjectNames(subjectIds: number[] | undefined): string {
    if (!subjectIds || subjectIds.length === 0) return 'None';
    
    return subjectIds
      .map(id => this.subjects.find(subject => subject.id === id)?.name || '')
      .filter(name => name !== '')
      .join(', ');
  }
  
  getSubjectsArray(subjectIds: number[] | undefined): string[] {
    if (!subjectIds || subjectIds.length === 0) return [];
    
    return subjectIds
      .map(id => this.subjects.find(subject => subject.id === id)?.name || '')
      .filter(name => name !== '');
  }
  
  confirmDelete(student: Student): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px'
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteStudent(student.id);
      }
    });
  }

  deleteStudent(id: number | undefined): void {
    if (!id) return;
    
    this.studentService.delete(id).subscribe({
      next: () => {
        this.snackBar.open('Student deleted successfully', 'Close', {
          duration: 3000,
        });
        this.loadStudents();
      },
      error: (error) => {
        this.snackBar.open('Error deleting student: ' + error.message, 'Close', {
          duration: 3000,
        });
      }
    });
  }
}