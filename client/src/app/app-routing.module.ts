import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { LoginComponent } from './components/users/login/login.component'
import { SignupComponent } from './components/users/signup/signup.component'

import { UserComponent } from './components/users/user/user.component'
import { MatchComponent } from './components/game-components/match/match.component'
import { RankingComponent } from './components/users/ranking/ranking.component'
import { ProfileComponent } from './components/users/profile/profile.component'
import { SearchComponent } from './components/users/search/search.component'
import { NotFoundComponent } from './components/error-components/not-found/not-found.component'
import { FriendtmpComponent } from './components/users/friendtmp/friendtmp.component'

const routes: Routes = [
  { path: 'user', component: UserComponent},
  { path: 'match', component: MatchComponent },
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'ranking', component: RankingComponent },
  { path: 'profile/:username', component: ProfileComponent },
  { path: 'search', component: SearchComponent },
  { path: '**', component: NotFoundComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
