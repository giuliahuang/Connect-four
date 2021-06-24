import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { LoginComponent } from './components/users/login/login.component'
import { SignupComponent } from './components/users/signup/signup.component'

import { HomeComponent } from './components/home/home.component'
import { MatchComponent } from './components/game-components/match/match.component'
import { RankingComponent } from './components/users/ranking/ranking.component'
import { ProfileComponent } from './components/users/profile/profile.component'
import { SearchComponent } from './components/users/search/search.component'
import { NotFoundComponent } from './components/error-components/not-found/not-found.component'
import { AuthGuardService } from './services/auth/auth-guard.service'

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuardService] },
  { path: 'match', component: MatchComponent, canActivate: [AuthGuardService] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'ranking', component: RankingComponent, canActivate: [AuthGuardService] },
  { path: 'profile/:username', component: ProfileComponent, canActivate: [AuthGuardService] },
  { path: 'search', component: SearchComponent, canActivate: [AuthGuardService] },
  { path: '**', component: NotFoundComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
