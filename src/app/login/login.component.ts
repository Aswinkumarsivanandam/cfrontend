import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../account/account.service';
import { LoginService } from './login.service';
import { DOCUMENT, Location } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: any;
  submitted = false;
  logindisabledBool: boolean = false;
  LoginValue: any;
  Resetlogin: boolean = false;
  routeUrl: string | undefined;
  profileDropdown: boolean = false;
  UserId: any;
  showPassword: boolean = false;
  Loader: boolean = false;
  parentObj: any;
  forgotPwd = false;
  constructor(@Inject(DOCUMENT) private document: Document, private formBuilder: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private toastr: ToastrService,
    private accountService: AccountService,
    private location: Location,
    private route: ActivatedRoute) {
    localStorage.clear();
  }

  ngOnInit(): void {
    this.parentObj = this;
    this.document.body.classList.add('loginnav');
    this.UserId = localStorage.getItem('UserId');
    this.routeUrl = this.route.snapshot.routeConfig?.path;
    if (this.routeUrl == 'resetlogin') {
      this.Resetlogin = true
    }

    this.loginForm = this.formBuilder.group({
      Email: ['', Validators.required],
      Password: ['', Validators.required]
    })
  }
  get f() { return this.loginForm.controls }

  onSubmit(logindata: any) {
    if (this.loginForm.invalid) {
      this.submitted = true;
      this.logindisabledBool = false;
    }
    else {
      this.Loader = true;
      this.logindisabledBool = true;
      this.submitted = false;
      let loginData = {
        EmailId: this.loginForm.value.Email,
        Password: this.loginForm.value.Password
      }
      this.loginService.LoginData(loginData).subscribe(data => {
        this.LoginValue = data;
        if (data != null) {
          this.logindisabledBool = false;
          if (data.statusCode == 0) {
            this.toastr.info('Invalid credentials', 'Info!')
            this.submitted = false;
            this.loginForm.reset();
            this.Loader = false;
          }
          else if (this.LoginValue.data.isTwoFactorAuthEnabled == true) {
            this.onVerifyEmail();
            localStorage.setItem("UserId", this.LoginValue.data.id)
            localStorage.setItem("RoleId", this.LoginValue.data.roleId)
            localStorage.setItem("Token", this.LoginValue.accessToken)
            localStorage.setItem("ProfileImg", this.LoginValue.data.profileImageUrl)
            localStorage.setItem("EmailId", this.LoginValue.data.emailId)
            localStorage.setItem("PhoneNumber", this.LoginValue.data.phoneNumber)
            localStorage.setItem("UserName", this.LoginValue.data.firstName + ' ' + this.LoginValue.data.lastName)
          }
          else {
            localStorage.setItem("UserId", this.LoginValue.data.id)
            localStorage.setItem("RoleId", this.LoginValue.data.roleId)
            localStorage.setItem("Token", this.LoginValue.accessToken)
            localStorage.setItem("ProfileImg", this.LoginValue.data.profileImageUrl)
            localStorage.setItem("UserName", this.LoginValue.data.firstName + ' ' + this.LoginValue.data.lastName)
            this.toastr.success('Login Successfully', 'Success!');
            if (this.LoginValue.data.roleId == 1) {
              this.router.navigate(['./../invest'], { relativeTo: this.route });
              localStorage.setItem("InvestorId", this.LoginValue.data.id);
              // this.router.navigate(['./../myinvestment'], { relativeTo: this.route });
            }
            else if (this.LoginValue.data.roleId == 3) {
              this.router.navigate(['./../admin-dashboard'], { relativeTo: this.route });
            }
            else {
              this.router.navigate(['./../invest'], { relativeTo: this.route });
            }
            this.Loader = false;
          }
        }
      })
    }
  }

  goToForgetPassword() {
    //this.router.navigate(['./../forgot-password'], { relativeTo: this.route });
    this.location.replaceState('/forgotpassword');
    this.forgotPwd = true;
  }
  backToLogin() {
    this.location.replaceState('/login');
    this.forgotPwd = false;
  }
  Password() {
    this.showPassword = !this.showPassword;
  }

  onLogo() {
    this.router.navigate(['/login'], { relativeTo: this.route });
  }

  register() {
    this.router.navigate(['./../register'], { relativeTo: this.route });
  }

  Onexplore() {
    this.router.navigate(['./../invest'], { relativeTo: this.route });
  }
  logout() {
    this.router.navigate(['/login'], { relativeTo: this.route });
    localStorage.clear();
  }

  onVerifyEmail() {
    var Getotp = {
      Id: this.LoginValue.data.id,
      EmailId: this.LoginValue.data.emailId
    }
    this.accountService.SendOtp(Getotp).subscribe(data => {
      if (data == true) {
        this.toastr.success("OTP send your respective emailid", 'Success!')
        this.router.navigate(['./../otp-verification'], { relativeTo: this.route });
      }
      else {
        this.toastr.info("Otp can't send for this email", "Info!")
      }
      this.Loader = false;
    })
  }

}
