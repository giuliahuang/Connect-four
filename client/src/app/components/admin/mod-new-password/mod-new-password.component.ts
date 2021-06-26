import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { SudoService } from 'src/app/services/sudo.service'

@Component({
  selector: 'app-mod-new-password',
  templateUrl: './mod-new-password.component.html',
  styleUrls: ['./mod-new-password.component.scss']
})
export class ModNewPasswordComponent implements OnInit {

  constructor(private sudoService: SudoService, private router: Router) { }

  ngOnInit(): void {
  }

  changePassword(email: string, tempPass: string, newPass: string, newPassVerify: string) {
    if (newPass === newPassVerify) {
      this.sudoService.changePasswordMod(email, tempPass, newPass).subscribe()
      this.router.navigate(['/home'])
    }
  }

}
