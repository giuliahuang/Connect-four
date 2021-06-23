import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SocketioService } from '../socketio.service';

@Component({
  selector: 'app-lobby-dialog',
  templateUrl: './lobby-dialog.component.html',
  styleUrls: ['./lobby-dialog.component.scss']
})
export class LobbyDialogComponent implements OnInit {

  constructor(
    private socketioService:SocketioService,
    private dialogRef: MatDialogRef<LobbyDialogComponent>
  ) { 
    dialogRef.disableClose=true
  }

  ngOnInit(): void {
    this.startMatch()
  }

  cancelPlay(){
    this.socketioService.cancelPlay();
  }

  closeDialog(){
    console.log("close dialog")
    this.dialogRef.close()
  }

  startMatch(){
    this.socketioService.socket?.on('matched',()=>{
      this.closeDialog()
    })
  }

}
