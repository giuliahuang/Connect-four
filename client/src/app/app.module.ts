import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { ErrorHandler, NgModule } from '@angular/core'

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
import { MatIconModule } from '@angular/material/icon'

//Components
import { AppComponent } from './app.component'
import { LoginComponent } from './components/users/login/login.component'
import { MatchComponent } from './components/game-components/match/match.component'
import { SignupComponent } from './components/users/signup/signup.component'
import { UserComponent } from './components/users/user/user.component'
import { GamechatComponent } from './components/game-components/gamechat/gamechat.component'
import { LobbyDialogComponent } from './components/game-components/lobby-dialog/lobby-dialog.component'
import { EndgameDialogComponent } from './components/game-components/endgame-dialog/endgame-dialog.component'
import { CellComponent } from './components/game-components/cell/cell.component'
import { FriendtmpComponent } from './components/users/friendtmp/friendtmp.component'
import { RankingComponent } from './components/users/ranking/ranking.component'
import { RankTableComponent } from './components/users/rank-table/rank-table.component'

//Services
import { UserHttpService } from './services/user-http.service'
import { AuthInterceptorService } from './services/auth-interceptor/auth-interceptor.service'
import { ProfileComponent } from './components/users/profile/profile.component'
import { FileUploadComponent } from './components/users/file-upload/file-upload.component'
import { SearchComponent } from './components/users/search/search.component'
import { ChangePasswordComponent } from './components/users/change-password/change-password.component'
import { GlobalErrorHandlerService } from './services/global-error-handler.service';
import { NotFoundComponent } from './components/error-components/not-found/not-found.component';
import { NotAuthorizedComponent } from './components/error-components/not-authorized/not-authorized.component';
import { ObserverComponent } from './components/game-components/observer/observer.component';
import { InviteDialogComponent } from './components/game-components/invite-dialog/invite-dialog.component'

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
    FileUploadComponent,
    SearchComponent,
    ChangePasswordComponent,
    NotFoundComponent,
    NotAuthorizedComponent,
    ObserverComponent,
    InviteDialogComponent,
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
    MatIconModule,
    MatSnackBarModule,
  ],
  providers: [
    { provide: UserHttpService, useClass: UserHttpService },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
    { provide: ErrorHandler, useClass: GlobalErrorHandlerService },
    BrowserAnimationsModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
