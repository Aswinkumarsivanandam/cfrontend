import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EmailService } from '../email/email.service';
import * as InlineEditor from '@ckeditor/ckeditor5-build-inline';

@Component({
  selector: 'app-email-details',
  templateUrl: './email-details.component.html',
  styleUrls: ['./email-details.component.css']
})
export class EmailDetailsComponent implements OnInit {
  @Input() EmailData: any;
  AddEmailPopup: boolean = false;
  SMTPIMAPPopup: boolean = false;
  SMTPFormShow: boolean = false;
  IMAPNull: boolean = false;
  IMAPInvalid: boolean = false;
  SMTPNull: boolean = false;
  SMTPInvalid: boolean = false;
  SMTPForm: any;
  EmptyEmail: boolean = false;
  validEmail: boolean = false;
  showPassword: boolean = false;
  EmptyPassword: boolean = false;
  UserEmailData: any = [];
  EmailProviderData: any = [];
  UserId: any;
  Loader: boolean = false;
  CredorEmailProviderData: any;
  EmailPreviewPopup : boolean = false;
  EmailPreviewData: any;
  Editor: any = {};

  constructor(private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private emailService: EmailService) {
      this.Editor = InlineEditor;
     }

  ngOnInit(): void {
    this.UserId = Number(localStorage.getItem("UserId"));
    this.SMTPForm = this.formBuilder.group({
      IMAP: [''],
      SMTP: [''],
      Email: [''],
      Password: ['']
    })
  }

  onAddEmailPopup() {
    this.AddEmailPopup = true;
    this.emailService.GetEmailByUserId(this.EmailData).subscribe(data => {
      this.UserEmailData = data;
      console.log(this.UserEmailData,'useremaildata')
    })
  }

  GetCredorEmailProvider() {
    this.emailService.GetCredorEmailProvider().subscribe(data => {
      this.CredorEmailProviderData = data;
      if (this.CredorEmailProviderData != null) {
        this.SMTPForm.patchValue({
          IMAP: this.CredorEmailProviderData.imapHost,
          SMTP: this.CredorEmailProviderData.smtpHost,
          Email: this.CredorEmailProviderData.emailId,
          Password: this.CredorEmailProviderData.password,
        })
      }
    })
  }

  onSetupSMTPIMAP() {
    this.SMTPIMAPPopup = true;
    this.emailService.GetEmailProvider().subscribe(data => {
      this.EmailProviderData = data;
      this.GetCredorEmailProvider();
      this.showPassword = false;
    })
  }

  ResetSMTPIMAP() {
    this.SMTPForm.reset();
  }

  SaveSMTPIMAP() {
    if (this.SMTPForm.value.IMAP == null || this.SMTPForm.value.IMAP == '' || this.IMAPInvalid == true ||
      this.SMTPForm.value.SMTP == null || this.SMTPForm.value.SMTP == '' || this.SMTPInvalid == true ||
      this.SMTPForm.value.Email == null || this.SMTPForm.value.Email == ' ' || this.SMTPForm.value.Email == '' || this.validEmail == true ||
      this.SMTPForm.value.Password == null || this.SMTPForm.value.Password == ' ' || this.SMTPForm.value.Password == '' ||
      (this.CredorEmailProviderData.imapHost == this.SMTPForm.value.IMAP && this.CredorEmailProviderData.smtpHost == this.SMTPForm.value.SMTP &&
        this.CredorEmailProviderData.emailId == this.SMTPForm.value.Email && this.CredorEmailProviderData.password == this.SMTPForm.value.Password)) {
      this.onIMAP();
      this.onSMTP();
      this.onEmail();
      this.onPassword();
    }
    else {
      let smtpimap = {
        Id: this.CredorEmailProviderData.id,
        AdminUserId: this.UserId,
        IMAPHost: this.SMTPForm.value.IMAP,
        SMTPHost: this.SMTPForm.value.SMTP,
        EmailId: this.SMTPForm.value.Email,
        Password: this.SMTPForm.value.Password,
        Active: true
      }
      this.emailService.UpdateCredorEmailProvider(smtpimap).subscribe(data => {
        if (data == true) {
          this.Loader = false;
          this.SMTPIMAPPopup = false;
          this.toastr.success("Email provider updated successfully", "Success!");
        }
        else {
          this.Loader = false;
          this.SMTPIMAPPopup = false;
          this.toastr.error("Email provider can't be update", "Error!");
        }
      })
    }
  }

  onClickhere() {
    this.SMTPFormShow = true;
  }

  onIMAP() {
    if (this.SMTPForm.value.IMAP == null || this.SMTPForm.value.IMAP == '') {
      this.IMAPNull = true;
      this.IMAPInvalid = false;
    }
    else {
      this.IMAPNull = false;
      let x = this.EmailProviderData.filter((x: { imap: any; }) => x.imap == this.SMTPForm.value.IMAP);
      if (x.length > 0) {
        this.IMAPInvalid = false;
      }
      else {
        this.IMAPInvalid = true;
      }
    }
  }

  onSMTP() {
    if (this.SMTPForm.value.SMTP == null || this.SMTPForm.value.SMTP == '') {
      this.SMTPNull = true;
      this.SMTPInvalid = false;
    }
    else {
      this.SMTPNull = false;
      let x = this.EmailProviderData.filter((x: { smtp: any; }) => x.smtp == this.SMTPForm.value.SMTP);
      if (x.length > 0) {
        this.SMTPInvalid = false;
      }
      else {
        this.SMTPInvalid = true;
      }
    }
  }

  onEmail() {
    const validEmailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (this.SMTPForm.value.Email == null || this.SMTPForm.value.Email == ' ' || this.SMTPForm.value.Email == '') {
      this.EmptyEmail = true;
      this.validEmail = false;
    }
    else {
      this.EmptyEmail = false;
      if (validEmailRegEx.test(this.SMTPForm.value.Email)) {
        this.validEmail = false;
      } else {
        this.validEmail = true;
      }
    }
  }

  onPassword() {
    if (this.SMTPForm.value.Password == null || this.SMTPForm.value.Password == ' ' || this.SMTPForm.value.Password == '') {
      this.EmptyPassword = true;
    }
    else {
      this.EmptyPassword = false;
    }
  }

  Password() {
    this.showPassword = !this.showPassword;
  }

  onPreviewEmailPopup(val : any){
    this.EmailPreviewPopup = true;
    this.EmailPreviewData = val;
  }

}
