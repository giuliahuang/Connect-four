import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { LoginComponent } from './login/login.component'
import { SignupComponent } from './signup/signup.component'

import { UserComponent } from './user/user.component'
import { MatchComponent } from './match/match.component'
import { RankingComponent } from './ranking/ranking.component'

const routes: Routes = [
  { path: 'user', component: UserComponent },
  { path: 'match', component: MatchComponent },
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'ranking' , component: RankingComponent}

]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
