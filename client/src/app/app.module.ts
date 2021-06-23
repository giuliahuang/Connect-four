import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
//Material
import { FlexLayoutModule } from '@angular/flex-layout'
import { FormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatToolbarModule } from '@angular/material/toolbar'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { LoginComponent } from './login/login.component'
import { MatchComponent } from './match/match.component'
import { SignupComponent } from './signup/signup.component'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatDialogModule } from '@angular/material/dialog'


//Services
import { UserHttpService } from './user-http.service'
import { UserComponent } from './user/user.component';
import { ChatComponent } from './chat/chat.component';
import { LobbyDialogComponent } from './lobby-dialog/lobby-dialog.component';
import { EndgameDialogComponent } from './endgame-dialog/endgame-dialog.component';
import { CellComponent } from './cell/cell.component';


@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    MatchComponent,
    LoginComponent,
    SignupComponent,
    ChatComponent,
    LobbyDialogComponent,
    EndgameDialogComponent,
    CellComponent,
  ],
  entryComponents: [LobbyDialogComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatDialogModule,
  ],
  providers: [
    { provide: UserHttpService, useClass: UserHttpService },
    BrowserAnimationsModule,
    MatSnackBarModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
