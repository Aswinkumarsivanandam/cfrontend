import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from '../login/login.service';
import { JoyrideService }from 'ngx-joyride';
@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {
  RoleId: any;
  RoleMapping: any = [];
  UserId: any;

  constructor(private loginService: LoginService, private joyride: JoyrideService) { 
    
  }

  ngOnInit(): void {
    if (window.name === 'Remote') {
      this.RoleId = 1;
    } else {
      this.RoleId = Number(localStorage.getItem("RoleId"))
    }
    this.UserId = Number(localStorage.getItem("UserId"))
    this.loginService.GetRoleMapping(this.UserId,this.RoleId).subscribe(data => {
      this.RoleMapping = data;
    })

    this.joyride.startTour(
      { steps: ['box1', 'box2']}
    )
  }



}
