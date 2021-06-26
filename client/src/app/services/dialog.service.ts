import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EndgameDialogComponent } from '../components/game/endgame-dialog/endgame-dialog.component';
import { InviteDialogComponent } from '../components/game/invite-dialog/invite-dialog.component';
import { LobbyDialogComponent } from '../components/game/lobby-dialog/lobby-dialog.component';

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

  openEndGameDialog(message:string){
    this.dialog.open(EndgameDialogComponent, { data: { message: message } })
  }
}
