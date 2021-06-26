import { HttpClientJsonpModule, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { ErrorHandler, NgModule } from '@angular/core'

// Modules
import { FlexLayoutModule } from '@angular/flex-layout'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
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
import { SimpleNotificationsModule } from 'angular2-notifications'

//Services
import { AuthInterceptorService } from './services/auth-interceptor/auth-interceptor.service'
import { GlobalErrorHandlerService } from './services/global-error-handler.service'
import { UserHttpService } from './services/user-http.service'

//Components
import { AppComponent } from './app.component'
import { NotFoundComponent } from './components/error/not-found/not-found.component'
import { CellComponent } from './components/game/cell/cell.component'
import { EndgameDialogComponent } from './components/game/endgame-dialog/endgame-dialog.component'
import { GamechatComponent } from './components/game/gamechat/gamechat.component'
import { LobbyDialogComponent } from './components/game/lobby-dialog/lobby-dialog.component'
import { MatchComponent } from './components/game/match/match.component'
import { FooterComponent } from './components/global/footer/footer.component'
import { HeaderComponent } from './components/global/header/header.component'
import { HomeComponent } from './components/home/home.component'
import { ChangePasswordComponent } from './components/profile/change-password/change-password.component'
import { FileUploadComponent } from './components/profile/file-upload/file-upload.component'
import { LoginComponent } from './components/login/login.component'
import { ProfileResolver } from './components/profile/profile-resolver'
import { ProfileComponent } from './components/profile/profile.component'
import { RankTableComponent } from './components/home/rank-table/rank-table.component'
import { RankingComponent } from './components/home/ranking/ranking.component'
import { SearchComponent } from './components/search/search.component'
import { SignupComponent } from './components/signup/signup.component'
import { FriendListComponent } from './components/home/friend-list/friend-list.component'
import { FriendComponent } from './components/home/friend/friend.component'
import { ChatComponent } from './components/home/chat/chat.component'
import { AdminComponent } from './components/admin/admin.component'


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
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    FriendComponent,
    FriendListComponent,
    ChatComponent
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
    ReactiveFormsModule,
    SimpleNotificationsModule.forRoot(),
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
