import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SettingsService } from '../settings/settings.service';
import { DOCUMENT } from '@angular/common';
declare var $: any;
@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.css']
})
export class ContactusComponent implements OnInit {
  ContactForm: any;
  submitted: any;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  Loader: boolean = false;
  GeneralData: any;

  constructor(private formBuilder: FormBuilder,
    private settingService: SettingsService,
    private toastr: ToastrService, @Inject(DOCUMENT) private document: Document) {

    $(document).ready(function () {
      $("body").removeClass("page");
    });
  }

  ngOnInit(): void {
    this.document.body.classList.remove('loginnav');
    this.ContactForm = this.formBuilder.group({
      Firstname: ['', Validators.required],
      Lastname: ['', Validators.required],
      Email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      Phone: ['', Validators.required],
      Question: ['']
    })
    this.GetGeneral();
    this.ContactForm.reset();
  }
  get CF() { return this.ContactForm.controls }

  onContactFormSubmit() {
    this.Loader = true;
    if (this.ContactForm.invalid) {
      this.submitted = true;
      this.Loader = false;
    }
    else {
      this.submitted = false;
      let contact = {
        Id: 0,
        FirstName: this.ContactForm.value.Firstname,
        LastName: this.ContactForm.value.Lastname,
        EmailId: this.ContactForm.value.Email,
        Phonenumber: this.ContactForm.value.Phone,
        Query: this.ContactForm.value.Question
      }
      this.settingService.AddContactUsQuery(contact).subscribe(data => {
        if (data == true) {
          this.ContactForm.reset();
          this.toastr.success("Your query has been submitted", "Success!");
          this.submitted = false;
        }
        else {
          this.toastr.error("Your query can't be submit", "Error!")
        }
        this.Loader = false;
      })
    }
  }

  numberValidation(event: any): Boolean {
    if (event.keyCode >= 48 && event.keyCode <= 57)
      return true;
    else
      return false;
  }

  GetGeneral() {
    this.Loader = true;
    this.settingService.GetGeneralInfo().subscribe(data => {
      this.GeneralData = data;
      this.Loader = false;
    })
  }
}
