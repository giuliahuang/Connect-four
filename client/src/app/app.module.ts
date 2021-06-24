import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { NgModule } from '@angular/core'

// Modules
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatDialogModule } from '@angular/material/dialog'
import { HttpClientJsonpModule } from '@angular/common/http'
import { MatTableModule } from '@angular/material/table'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatSortModule } from '@angular/material/sort'

//Components
import { AppComponent } from './app.component'
import { LoginComponent } from './components/login/login.component'
import { MatchComponent } from './components/match/match.component'
import { SignupComponent } from './components/signup/signup.component'
import { UserComponent } from './components/user/user.component'
import { GamechatComponent } from './components/gamechat/gamechat.component'
import { LobbyDialogComponent } from './components/lobby-dialog/lobby-dialog.component'
import { EndgameDialogComponent } from './components/endgame-dialog/endgame-dialog.component'
import { CellComponent } from './components/cell/cell.component'
import { FriendtmpComponent } from './components/friendtmp/friendtmp.component'
import { RankingComponent } from './components/ranking/ranking.component'
import { RankTableComponent } from './components/rank-table/rank-table.component'

//Services
import { UserHttpService } from './services/user-http.service'

import { AuthInterceptor } from './auth-interceptor/auth-interceptor.service';
import { ProfileComponent } from './components/profile/profile.component'

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    MatchComponent,
    LoginComponent,
    SignupComponent,
    GamechatComponent,
    LobbyDialogComponent,
    EndgameDialogComponent,
    CellComponent,
    FriendtmpComponent,
    RankingComponent,
    RankTableComponent,
    ProfileComponent,
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
    HttpClientJsonpModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  providers: [
    { provide: UserHttpService, useClass: UserHttpService },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    BrowserAnimationsModule,
    MatSnackBarModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
