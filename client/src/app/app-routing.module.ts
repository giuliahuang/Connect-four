import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { LoginComponent } from './components/login/login.component'
import { SignupComponent } from './components/signup/signup.component'

import { UserComponent } from './components/user/user.component'
import { MatchComponent } from './components/match/match.component'
import { RankingComponent } from './components/ranking/ranking.component'

const routes: Routes = [
  { path: 'user', component: UserComponent },
  { path: 'match', component: MatchComponent },
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'ranking', component: RankingComponent }

]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
