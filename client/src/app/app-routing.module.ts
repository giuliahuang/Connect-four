import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent} from './signup/signup.component'
import { HomepageComponent } from './homepage/homepage.component'

const routes: Routes = [
  {path: '', component:LoginComponent},
  {path: 'signup', component: SignupComponent },
  {path: 'login', component: LoginComponent },
  {path: 'homepage', component: HomepageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
