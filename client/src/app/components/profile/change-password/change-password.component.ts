import { Component, OnInit } from '@angular/core'
import { UserHttpService } from 'src/app/services/user-http.service'

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  constructor(private userHttpService: UserHttpService) { }

  ngOnInit(): void {
  }

  changePassword(currentPassword: string, newPassword: string, newPasswordVerify: string) {
    if (newPassword === newPasswordVerify) {
      this.userHttpService.newPassword(currentPassword, newPassword).subscribe(res => console.log(res))
    }
  }
}
