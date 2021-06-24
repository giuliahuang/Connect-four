import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-endgame-dialog',
  templateUrl: './endgame-dialog.component.html',
  styleUrls: ['./endgame-dialog.component.scss']
})
export class EndgameDialogComponent implements OnInit {

  constructor(
    private router:Router,
    private dialogRef: MatDialogRef<EndgameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
  ) { 
    dialogRef.disableClose=true
  }

  ngOnInit(): void {
  }

  exit(){
    this.router.navigate(['/user']);
  }

}
