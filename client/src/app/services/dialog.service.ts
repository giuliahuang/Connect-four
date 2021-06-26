import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InviteDialogComponent } from '../components/game-components/invite-dialog/invite-dialog.component';
import { LobbyDialogComponent } from '../components/game-components/lobby-dialog/lobby-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(
    private dialog:MatDialog
  ) { }

  openLobbyDialog(){
    this.dialog.open(LobbyDialogComponent, { disableClose: true })
  }

  
  openInviteDialog(username:string){
    return this.dialog.open(InviteDialogComponent, {
      disableClose : true,
      data: {
        username: username
      }
    })
  }
}
