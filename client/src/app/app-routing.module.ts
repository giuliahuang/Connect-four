import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserComponent } from './user/user.component'
import { MatchComponent } from './match/match.component'

const routes: Routes = [
  { path: 'user', component: UserComponent},
  { path: 'match', component: MatchComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
