import { HttpClientJsonpModule, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { ErrorHandler, NgModule } from '@angular/core'
// Modules
import { FlexLayoutModule } from '@angular/flex-layout'
import { FormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatDialogModule } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatSortModule } from '@angular/material/sort'
import { MatTableModule } from '@angular/material/table'
import { MatToolbarModule } from '@angular/material/toolbar'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { AppRoutingModule } from './app-routing.module'
//Components
import { AppComponent } from './app.component'
import { NotAuthorizedComponent } from './components/error/not-authorized/not-authorized.component'
import { NotFoundComponent } from './components/error/not-found/not-found.component'
import { CellComponent } from './components/game/cell/cell.component'
import { EndgameDialogComponent } from './components/game/endgame-dialog/endgame-dialog.component'
import { GamechatComponent } from './components/game/gamechat/gamechat.component'
import { LobbyDialogComponent } from './components/game/lobby-dialog/lobby-dialog.component'
import { MatchComponent } from './components/game/match/match.component'
import { FooterComponent } from './components/global/footer/footer.component'
import { HeaderComponent } from './components/global/header/header.component'
import { HomeComponent } from './components/home/home.component'
import { ChangePasswordComponent } from './components/users/change-password/change-password.component'
import { FileUploadComponent } from './components/users/file-upload/file-upload.component'
import { LoginComponent } from './components/users/login/login.component'
import { ProfileResolver } from './components/users/profile/profile-resolver'
import { ProfileComponent } from './components/users/profile/profile.component'
import { RankTableComponent } from './components/users/rank-table/rank-table.component'
import { RankingComponent } from './components/users/ranking/ranking.component'
import { SearchComponent } from './components/users/search/search.component'
import { SignupComponent } from './components/users/signup/signup.component'

//Services
import { AuthInterceptorService } from './services/auth-interceptor/auth-interceptor.service'
import { GlobalErrorHandlerService } from './services/global-error-handler.service'
import { AdminComponent } from './components/admin/admin.component';
import { UserHttpService } from './services/user-http.service';
import { FriendListComponent } from './components/users/friend-list/friend-list.component';
import { FriendComponent } from './components/users/friend/friend.component';
import { SearchAdminComponent } from './components/admin/search-admin/search-admin.component'

@NgModule({
  declarations: [
    AppComponent,
    MatchComponent,
    LoginComponent,
    SignupComponent,
    GamechatComponent,
    LobbyDialogComponent,
    EndgameDialogComponent,
    CellComponent,
    RankingComponent,
    RankTableComponent,
    ProfileComponent,
    FileUploadComponent,
    SearchComponent,
    AdminComponent,
    ChangePasswordComponent,
    NotFoundComponent,
    NotAuthorizedComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    FriendComponent,
    FriendListComponent,
    SearchAdminComponent
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
    MatIconModule
  ],
  providers: [
    { provide: UserHttpService, useClass: UserHttpService },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
    { provide: ErrorHandler, useClass: GlobalErrorHandlerService },
    BrowserAnimationsModule,
    MatSnackBarModule,
    ProfileResolver
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
