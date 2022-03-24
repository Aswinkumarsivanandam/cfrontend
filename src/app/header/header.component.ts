import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../account/account.service';
import * as signalR from '@aspnet/signalr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  profileDropdown: boolean = false;
  NotificationDropdown: boolean = false;
  UserId: any;
  UserData: any;
  thisUser: any;
  NotificationData: any = [];
  Notification: any = [];
  RoleId: any;
  UserName: any;
  sidemenuclick: boolean = true;

  // ProfileImg: any;
  rmode: boolean = false;
  @Input() ProfileImg: any;
  LoadMoreHide: boolean = false;

  constructor(private router: Router,
    private accountService: AccountService,
    private route: ActivatedRoute) { }


  public sidemenu() {
    // this.router.navigate(['./../side-bar'],{ relative: this.sidemenuclick});
    this.router.navigateByUrl('./../side-bar', { state: { id: 1, name: this.sidemenuclick } });
  }


  ngOnInit(): void {
    if (window.name === 'Remote') {
      this.RoleId = 1;
      this.rmode = true;
      this.UserId = Number(localStorage.getItem('InvestorId'));
      this.ProfileImg = localStorage.getItem('I_profileurl')
      this.UserName = localStorage.getItem("I_UserName");
    } else {
      this.RoleId = Number(localStorage.getItem("RoleId"))
      this.rmode = false;
      this.UserId = Number(localStorage.getItem("UserId"));
      this.ProfileImg = localStorage.getItem("ProfileImg");
      this.UserName = localStorage.getItem("UserName");
    }
    this.GetNotification();


    const connection = new signalR.HubConnectionBuilder().configureLogging(signalR.LogLevel.Information)
      .withUrl(environment.NOTIFICATION_URL + "/notificationHub")
      .build();

    connection.start().then(function () {
      console.log('Connected!');
    }).catch(function (err) {
      return console.error(err);
    });
    connection.onclose(() => {
      setTimeout(function () {
        connection.start().then(function () {
          console.log('Reconnected!');
        }).catch(function (err) {
          console.error(err)
        });
      }, 3000);
    });
    connection.on("ForceLogout", (data: any) => {
      console.clear();
    });
    connection.on("Push_Notification", (data: any) => {
      this.thisUser = [];
      let UserId = Number(localStorage.getItem('UserId'));
      if (data.userId == UserId) {
        this.NotificationData.unshift(data);
      }
    });
  }
  logout() {
    this.router.navigate(['/login'], { relativeTo: this.route });
    localStorage.clear();
    // window.location.reload();
  }
  Account() {
    if (this.RoleId == 3) {
      this.router.navigate(['./../settings'], { relativeTo: this.route });
    }
    else {
      this.router.navigate(['./../account'], { relativeTo: this.route });
    }
  }
  GetNotification() {
    this.NotificationData = [];
    this.Notification = [];
    this.accountService.GetNotification(this.UserId).subscribe(data => {
      this.NotificationData = data;
      this.NotificationData = this.NotificationData.filter((x: { status: number; }) => x.status == 1)
      for (let i = 0; i < 5; i++) {
        if (this.NotificationData[i].message != null)
          this.Notification.push(this.NotificationData[i])
      }
    })
  }
  NotificationClick() {
    this.NotificationDropdown = true;
    this.GetNotification();
  }
  Read(val: any) {
    this.NotificationDropdown = true;
    this.Notification = this.Notification.filter((x: { id: any; }) => x.id != val.id);
    let notification = {
      Id: val.id,
      UserId: this.UserId,
      Status: 2
    }
    this.accountService.UpdateNotification(notification).subscribe(data => {
      if (data == true) {
        this.NotificationDropdown = true;
      }
    })
  }
  ClearAll() {
    this.Notification = [];
    this.accountService.ClearAllNotification(this.UserId).subscribe(data => {

    })
  }
  onLoadMore() {
    let length = this.Notification.length + 5
    for (let i = this.Notification.length; i < length; i++) {
      if (this.NotificationData[i] != null) {
        this.Notification.push(this.NotificationData[i])
      }
    }
    if(this.NotificationData.length == this.Notification.length){
      this.LoadMoreHide = true;
    }
    else{
      this.LoadMoreHide = false;
    }
  }
  onLogo() {
    if (this.RoleId == 1) {
      this.router.navigate(['/invest'], { relativeTo: this.route });
    }
    else if (this.RoleId == 2) {
      this.router.navigate(['/invest'], { relativeTo: this.route });
    }
    else if (this.RoleId == 3) {
      this.router.navigate(['/admin-dashboard'], { relativeTo: this.route });
    }
  }
  backToAdmin() {
    localStorage.setItem("RoleId", '3')
    window.close();
  }

  ProfileImageUpdate(e: any) {
    if (e != null && e != this.ProfileImg) {
      if(this.RoleId == 1){
        this.router.navigateByUrl('/header', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/account']);
        })
      }
      else if(this.RoleId == 3){
        this.router.navigateByUrl('/header', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/settings']);
        });
      }
    }
  }

  onAboutUs() {
    // window.open("http://localhost:4200/aboutus")
    // window.open("https://credor-app.azurewebsites.net/aboutus")
    this.router.navigate(['/aboutus'], { relativeTo: this.route });
  }

  onContactUs() {
    // window.open("http://localhost:4200/contactus")
    // window.open("https://credor-app.azurewebsites.net/contactus")
    this.router.navigate(['/contactus'], { relativeTo: this.route });
  }
}
