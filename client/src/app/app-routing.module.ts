import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { NotFoundComponent } from './components/error/not-found/not-found.component'
import { MatchComponent } from './components/game/match/match.component'
import { HomeComponent } from './components/home/home.component'
import { LoginComponent } from './components/login/login.component'
import { ProfileResolver } from './components/profile/profile-resolver'
import { RankingComponent } from './components/player-ranking/ranking/ranking.component'
import { SearchComponent } from './components/global/header/search/search.component'
import { SignupComponent } from './components/signup/signup.component'
import { AuthGuardService } from './services/auth/auth-guard.service'

import { ProfileComponent } from './components/profile/profile.component'
import { AdminComponent } from './components/admin/admin.component'

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: 'home', component: HomeComponent, canActivate: [AuthGuardService], resolve: {
      profile: ProfileResolver
    }
  },
  {
    path: 'match', component: MatchComponent, canActivate: [AuthGuardService]
  },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'ranking', component: RankingComponent, canActivate: [AuthGuardService] },
  {
    path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService], resolve: {
      profile: ProfileResolver
    }
  },
  {
    path: 'profile/:username', component: ProfileComponent, canActivate: [AuthGuardService], resolve: {
      profile: ProfileResolver
    }
  },
  { path: 'search', component: SearchComponent, canActivate: [AuthGuardService] },
  { path: 'admin', component: AdminComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', component: NotFoundComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
