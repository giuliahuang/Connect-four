import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { LoginComponent } from './components/login/login.component'
import { SignupComponent } from './components/signup/signup.component'

import { UserComponent } from './components/user/user.component'
import { MatchComponent } from './components/match/match.component'
import { RankingComponent } from './components/ranking/ranking.component'
import { ProfileComponent } from './components/profile/profile.component'
import { SearchComponent } from './components/search/search.component'
import { AdminComponent } from './components/admin/admin.component'

const routes: Routes = [
  { path: 'user', component: UserComponent },
  { path: 'match', component: MatchComponent },
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'ranking', component: RankingComponent },
  { path: 'profile/:username', component: ProfileComponent },
  { path: 'search', component: SearchComponent },
  { path: 'admin', component: AdminComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
