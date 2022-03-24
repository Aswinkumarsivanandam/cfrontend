import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../account/account.service';

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.css']
})
export class OtpVerificationComponent implements OnInit {
  Loader: boolean = false;
  EmailId: any;
  PhoneNumber: any;
  Otp: any;
  UserId: any;
  RoleId: any;
  VerifyOtpDisabled: boolean = false;
  constructor(private accountService: AccountService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.UserId = Number(localStorage.getItem("UserId"));
    this.EmailId = localStorage.getItem("EmailId");
    this.PhoneNumber = localStorage.getItem("PhoneNumber")
    this.RoleId = localStorage.getItem("RoleId")
  }

  onOtpChange(e: any) {
    this.Otp = e;
    if (this.Otp == '' || this.Otp == null) {
      this.VerifyOtpDisabled = true;
    }
    else if (this.Otp.length == 6) {
      this.VerifyOtpDisabled = false;
    }
    else {
      this.VerifyOtpDisabled = false;
    }
  }

  ResetOtpEmail() {
    this.Loader = true;
    var Getotp = {
      Id: this.UserId,
      EmailId: this.EmailId
    }
    this.accountService.ResendOtp(Getotp).subscribe(data => {
      if (data == true) {
        this.toastr.success("OTP resent successfully", "Success!")
        this.Loader = false;
      }
      else {
        this.Loader = false;
        this.toastr.info("Can't resent otp", "Info!")
      }
    })
  }

  VerifyOtpEmailwithLogin() {
    this.Loader = true;
    if (this.Otp == null || this.Otp == '') {
      this.toastr.info("Please enter the OTP", "Info!");
      this.VerifyOtpDisabled = true;
      this.Loader = false;
    }
    else if (this.Otp.length != 6) {
      this.toastr.info("Enter a valid OTP", "Info!");
      this.VerifyOtpDisabled = true;
      this.Loader = false;
    }
    else {
      let otpVerify = {
        Id: this.UserId,
        OneTimePassword: this.Otp,
        EmailId: this.EmailId
      }
      this.accountService.VerifyTwoFactorAuthentication(otpVerify).subscribe(data => {
        if (data == true) {
          this.toastr.success("Email verified successfully", "Success!")
          localStorage.removeItem("EmailId");
          localStorage.removeItem("PhoneNumber");
          if (this.RoleId == 1) {
            this.router.navigate(['./../invest'], { relativeTo: this.route });
            localStorage.setItem("InvestorId", this.UserId);
          }
          else if (this.RoleId == 3) {
            this.router.navigate(['./../admin-dashboard'], { relativeTo: this.route });
          }
          else {
            this.router.navigate(['./../invest'], { relativeTo: this.route });
          }
        }
        else {
          this.Loader = false;
          this.toastr.error("Invalid OTP", "Error!")
        }
      })
    }
  }

}
