import { Component, OnInit } from '@angular/core';
import { SudoService } from 'src/app/services/sudo.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor(private sudo: SudoService) { }

  admins: string[] = []

  ngOnInit(): void {
    this.sudo.getMods().subscribe(admins => {
      this.admins = admins
    })
  }

}
