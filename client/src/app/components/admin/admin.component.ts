import { Component, OnInit } from '@angular/core';
import { SudoService } from 'src/app/services/sudo.service';
import { UserHttpService } from 'src/app/services/user-http.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor(private sudo: SudoService, private userHttpService: UserHttpService) { }

  mods: string[] = []

  users: any[] = []

  ngOnInit(): void {
    this.getMods()
  }

  search(username: string) {
    this.userHttpService.searchUser(username).subscribe((res: any) => {
      if (res.username) {
        this.users = []
        this.users.push(res.username)
      }
    })
  }

  getMods(){
    this.sudo.getMods().subscribe((res) => {
      console.log(res)
      res.forEach((element: any) => {
        console.log(element.username)
        this.mods.push(element.username)
      });
    })
  }

  removeUser(username: string){
    this.sudo.deleteMod(username).subscribe(() => {
      for(var i = 0; i < this.users.length; i++){
        if(this.users[i] === username){
          this.users.splice(i, 1)
        }
      }
      console.log("eliminato")
    })
  }

  removeMod(username: string){
    this.sudo.deleteMod(username).subscribe(() => {
      for(var i = 0; i < this.mods.length; i++){
        if(this.mods[i] === username){
          this.mods.splice(i, 1)
        }
      }
      console.log("eliminato")
    })
  }

  createNewMod(username: string, email: string ,password: string){
    this.sudo.createMod(username, email ,password).subscribe(()=>{
      this.mods = []
      this.getMods()
    })
  }

}
