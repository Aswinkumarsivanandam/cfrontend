import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { EmailEditorComponent } from 'angular-email-editor';
import { ToastrService } from 'ngx-toastr';
import { ManageEmailComponent } from '../manage-email/manage-email.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SendEmailService } from './send-email.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.css']
})
export class SendEmailComponent implements OnInit {
  SubjectName: any;
  subjectNameError: boolean = false;
  RecipientList: any = [];
  RecipientId: any = [];
  RecipientError: boolean = false;
  RecipientFromName: any;
  RecipientFromEmailId: any = 0;
  EmailList: any = [];
  RecipientReplyTo: any;
  RecipientEmailTypeId: any = 0;
  EmailTypeList: any = [];
  RecipientEmailTypeError: boolean = false;
  RecipientReplyToError: boolean = false;
  RecipientFromEmailError: boolean = false;
  RecipientFromNameError: boolean = false;
  @ViewChild('editor') emailEditor!: EmailEditorComponent;
  emailDesign: any;
  savedTemplateShow: boolean = false;
  TemplateList: any = [];
  showEditior: boolean = true;
  filesToUpload: any = [];
  files: any = [];
  allowedFileExtensionsDocument: any = [];
  adminUserId: any;
  value: any;
  EmailTemplateId: any;
  Id: any = [];
  SelectList: any = [];
  successShow: boolean = false;
  SaveId: any;
  SendBtnsShow: boolean = false;
  showSchedule: boolean = false;
  selectedMoment: any;
  @Input() childMessage: any = 0;
  @Input() InvestorchildMessage: any = [];
  credorEmailDetail: any = {};
  emailRecipientGroups: any = [];
  emailAttachments: any = [];
  credorEmails: any = [];
  EmailGroupList: any = [];
  testDesign: any;
  dropdownSettings:IDropdownSettings = {};
  PreviousAttachment : any = [];
 // @Input() childMessage: string;
  @Output() messageEvent = new EventEmitter<string>();
  constructor(private router: Router, private route: ActivatedRoute, private _email: SendEmailService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.adminUserId = Number(localStorage.getItem('UserId'));
    console.log('childMessage', this.childMessage);
    if ((this.childMessage != null || this.childMessage != '') && this.childMessage != 0) {
      this.ViewSendDetails(this.childMessage)
    }
    else if(this.InvestorchildMessage.length > 0){
      this.getSentEmailRecipients();
    }
    else {
      this.getRecipients();
    }
    this.getFromEmail();
    this.getEmailType();
    this.allowedFileExtensionsDocument = ['jpeg', 'JPEG', 'jpg', 'pdf', 'PDF','png', 'PNG', 'xls','xlsx','csv'];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: true,
      enableCheckAll: true,
    };
  }
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  getRecipients() {
    this._email.getRecipients().subscribe(data => {
      if (data) {
        this.RecipientList = data;
        console.log('RecipientList', data)
      }
    })
  }

  getSentEmailRecipients() {
    var UserList :any =  [];
    this._email.getRecipients().subscribe(data => {
      if (data) {
        this.RecipientList = data;
        this.RecipientId = [];
        for (var i = 0; i < this.RecipientList.length; i++) {
          if(UserList.length == 0){
            for(var j = 0; j< this.InvestorchildMessage.length; j++){
              if(this.InvestorchildMessage[j].TagId != 0){
                UserList.push('tag_' + this.InvestorchildMessage[j].TagId)
              }
              else if(this.InvestorchildMessage[j].UserId != 0){
                UserList.push('user_' + this.InvestorchildMessage[j].UserId)
              }
            }
          }
          for(var z=0; z<UserList.length;z++){
            if(this.RecipientList[i].id == UserList[z]) {
              this.RecipientId.push({ 'id' :this.RecipientList[i].id, 'name' : this.RecipientList[i].name })
            }
          }
        }
      }
    })
  }

  getFromEmail() {
    this._email.getfromemail().subscribe(data => {
      if (data) {
        let x = { id: 0, emailId: 'Select Email', active: true }
        this.EmailList = data;
        this.EmailList.unshift(x);
        // console.log('EmailList', data)
        // this.EmailList.push({
        //   'id': 0,
        //   'emailId': 'Select Email'
        // })
      }
    })
  }

  getEmailType() {
    this._email.getEmailType().subscribe(data => {
      if (data) {
        let x = { id: 0, name: 'Select Email Type', active: true }
        this.EmailTypeList = data;
        this.EmailTypeList.unshift(x);
        // console.log('EmailTypeList', data)
        // this.EmailTypeList.push({
        //   'id': 0,
        //   'name': 'Select Email'
        // })
      }
    })
  }

  onSubjectName() {
    if (this.SubjectName == '' || this.SubjectName == null) {
      this.subjectNameError = true;
    }
    else {
      this.subjectNameError = false;
    }
  }

  onReplyTo() {
    if (this.RecipientReplyTo == '' || this.RecipientReplyTo == null) {
      this.RecipientReplyToError = true;
    }
    else {
      this.RecipientReplyToError = false;
    }
  }

  onFromName() {
    if (this.RecipientFromName == '' || this.RecipientFromName == null) {
      this.RecipientFromNameError = true;
    }
    else {
      this.RecipientFromNameError = false;
    }
  }

  onchangeRecipients(e: any) {
    let a = e.target.value;
    let value1 = a.substring(a.indexOf(":") + 1);
    // let value2 =  value1.replace(/ +(?=[^']*'$)/g, "");
    let value2 = value1.replace(/'/g, '');
    let value3 = value2.trim().toLowerCase()
    this.RecipientId = value3
    if (this.RecipientId == 0) {
      this.RecipientError = true;
    }
    else {
      this.Id.push({ Id: this.RecipientId })
      this.RecipientError = false;
      console.log('ID', this.Id)
    }
  }


  onchangeEmailType(e: any) {
    this.RecipientEmailTypeId = +e.target.value;
    if (this.RecipientEmailTypeId == 0) {
      this.RecipientEmailTypeError = true;
    }
    else {
      this.RecipientEmailTypeError = false;
    }
  }

  onchangeFromEmail(e: any) {
    if (e.target.value == 0) {
      this.RecipientFromEmailError = true;
    }
    else {
      this.RecipientFromEmailError = false;
      console.log('RecipientFromName', this.EmailList)
      for (var i = 0; i < this.EmailList.length; i++) {
        if (this.EmailList[i].id == e.target.value) {
          this.RecipientFromName = this.EmailList[i].fromName;
          this.RecipientReplyTo = this.EmailList[i].emailId;
          this.RecipientFromNameError = false;
        }
      }
    }
  }

  // called when the editor is loading
  editorLoaded(e: any) {
    if (this.emailEditor != undefined) {
      console.log(this.emailEditor, '3')
      this.emailEditor.editor.loadDesign(JSON.parse(this.emailDesign))
    }
    else {
      this.emailEditor = new EmailEditorComponent();
    }
  }

  // called when the editor has finished loading
  editorReady(e: any) {
    if (this.emailDesign != undefined) {
      this.emailEditor.editor.loadDesign(JSON.parse(this.emailDesign))
    }
    else {
      this.emailEditor.editor.loadDesign(this.emailDesign);
    }
  }

  showSavedTemplate() {
    this.savedTemplateShow = true;
    this.showEditior = false;
    this.getCreatedTemplate();
  }

  cancelSavedTemplate() {
    this.savedTemplateShow = false;
    this.showEditior = true;
    this.emailDesign = undefined;
  }

  getCreatedTemplate() {
    this._email.getTemplates().subscribe(data => {
      if (data) {
        this.TemplateList = data;
        console.log('TemplateList', this.TemplateList)
      }
      else {
      }
    })
  }

  useTemplate(value: any) {
    this.showEditior = true;
    this.savedTemplateShow = false;
    this.emailDesign = value.design;
    console.log('emailDesign', this.emailDesign)
    this.testDesign = value.design;
    this.EmailTemplateId = value.id;
  }

  onFilesSelect(event: any) {
    // this.filesToUpload = [];
   // this.files = [];
    for (var i = 0; i < event.target.files.length; i++) {
      let ext: any;
      this.allowedFileExtensionsDocument.forEach((element: any) => {
        if (element == event.target.files[i].name.split('.').pop()) {
          this.filesToUpload.push(event.target.files[i]);
          ext = null;
          var temp: any = {};
          ext = event.target.files[i].name.split('.').pop();
          const file = event.target.files[i];
          const reader = new FileReader();
          reader.readAsDataURL(file);
          temp.name = event.target.files[i].name;
          temp.size = event.target.files[i].size;
          temp.type = event.target.files[i].type;
          this.files.push(temp);
          console.log('files', this.files)
        }
      });
      if (ext == null) {
        this.toastr.error(event.target.files[i].name.split('.').pop() + ' files are not accepted.', 'Error');
      }
    }
  }

  sendEmailNow() {
    if (this.SubjectName == null || this.SubjectName == '') {
      this.subjectNameError = true;
    }
    else if (this.RecipientId.length == 0) {
      this.RecipientError = true;
    }
    else if (this.RecipientFromName == null || this.RecipientFromName == '') {
      this.RecipientFromNameError = true;
    }
    else if (this.RecipientFromEmailId == 0) {
      this.RecipientFromEmailError = true
    }
    else if (this.RecipientReplyTo == null || this.RecipientReplyTo == '') {
      this.RecipientReplyToError = true
    }
    else if (this.RecipientEmailTypeId == 0) {
      this.RecipientEmailTypeError = true;
    }
    else {
      var t: any;
      var y: any;
      var design: any;
      console.log('this.Id', this.Id)
      const email = new FormData();
      design = this.emailDesign
      email.append("AdminUserId", this.adminUserId);
      email.append("FromName", this.RecipientFromName);
      email.append("ReplyTo", this.RecipientReplyTo);
      email.append("FromEmailAddressId", this.RecipientFromEmailId);
      email.append("Subject", this.SubjectName);
      email.append("EmailTypeId", this.RecipientEmailTypeId);
      email.append("FromEmail", 'prakash.madhusudhanan@excelenciaconsulting.com');
      // this.filesToUpload.forEach((item: any) => {
      //   email.append('Attachments', item);
      // });
      for (let i = 0; i < this.RecipientId.length; i++) {
        this.SelectList.push(this.RecipientId[i].id)
      }
      console.log('RecipientId',this.SelectList )
      email.append("EmailRecipientGroups", this.SelectList);
      if(this.PreviousAttachment.length > 0){
        email.append("RemovedPreviousAttachments", this.PreviousAttachment);
      }
      console.log('SelectList', this.SelectList);
      if (this.EmailTemplateId != null && this.EmailTemplateId != "") {
        email.append("EmailTemplateId", this.EmailTemplateId);
      }
      this.emailEditor.exportHtml(function (data) {
        let emailvalue: any = {};
        emailvalue = data;
        var json = emailvalue.design.counters; // design json
        var html = emailvalue.html; // final html
        t = html;
        y = json;
        console.log('t', y)
        email.append("Template", t);
        
      });
   
        this.emailEditor.saveDesign(function(data : any) {
          localStorage.setItem('testData', JSON.stringify(data));
          if(design != undefined){
            email.append("TemplateDesign", design);
          }
          else{
            email.append("TemplateDesign", JSON.stringify(data));
            console.log('saveDesign', data)
          }
        }),
      console.log('email', email),
      this.value = email;
      this.SendBtnsShow = true;
    }
  }

  save(Id: any) {
    this.SaveId = Id;
    this.filesToUpload.forEach((item: any) => {
      this.value.append('Attachments', item);
    });
    if (Id == 2) {
      this.value.append("IsTestMail", true);
    }
    else if (Id == 3) {
      this.value.append("IsScheduled", true);
      this.value.append("ScheduledOn", new Date(this.selectedMoment).toISOString());
      this.showSchedule = false;
    }
    else if (Id == 4) {
      this.value.append("IsDraft", true);
    }
    if(this.childMessage != null || this.childMessage != ''){
      this.value.append("CredorEmailDetailId", Number(this.childMessage))
    }
    console.log("this.value",this.value);
    this._email.SendEmail(this.value).subscribe(data => {
      console.log('SendEmail', data)
      if (data != null) {
        this.messageEvent.emit('Success');
        if(this.SaveId == 1){
          this.toastr.success('Mail queued successfully.')
        }
        else if(this.SaveId == 2){
          this.toastr.success('Test mail queued successfully.')
        }
        else if(this.SaveId == 3){
          this.toastr.success('Mail scheduled successfully.')
        }
        else{
          this.toastr.success('Mail drafted successfully.')
        }
        this.router.navigate(['./../email' + '/' + 3], { relativeTo: this.route });
        this.successShow = false;
        this.SubjectName = '';
        this.RecipientId = [];
        this.RecipientFromName = '';
        this.RecipientFromEmailId = 0;
        this.RecipientReplyTo = '';
        this.RecipientEmailTypeId = 0;
        this.SendBtnsShow = false;
        this.showEditior = true;
        this.emailDesign = undefined;
        this.files = [];
        this.filesToUpload = [];
        this.editorLoaded('event');
        this.SendBtnsShow = false;
        this.successShow = true;
      }
      else{
        this.messageEvent.emit('false');
      }
    })
  }

  ClosesuccessPopup() {
    this.successShow = false;
    this.SubjectName = '';
    this.RecipientId = [];
    this.RecipientFromName = '';
    this.RecipientFromEmailId = 0;
    this.RecipientReplyTo = '';
    this.RecipientEmailTypeId = 0;
    this.SendBtnsShow = false;
    this.showEditior = true;
    this.emailDesign = undefined;
    this.files = [];
    this.editorReady('event');
  }

  ShowSchedule() {
    this.showSchedule = true;
    this.selectedMoment = '';
  }

  ViewSendDetails(Id: any) {
    var that = this;
    this._email.getSendEmailDetails(Id).subscribe(data => {
      if (data) {
        let a: any = {};
        a = data;
        console.log('ViewSendDetails', a)
        this.getRecipients();
        this.getFromEmail();
        this.getEmailType();
        setTimeout(function(){
        that.credorEmailDetail = a.credorEmailDetail;
        that.emailRecipientGroups = a.emailRecipientGroups;
        console.log('emailRecipientGroups',that.emailRecipientGroups)
        that.emailAttachments = a.emailAttachments;
        that.credorEmails = a.credorEmails;
        that.EmailGroupList = that.emailRecipientGroups.filter((x: any) => x.emailRecipientGroupName == null);
        console.log('getSendEmailDetails', data)
        that.SubjectName = a.credorEmailDetail.subject;
        that.RecipientFromName = a.credorEmailDetail.fromName;
        that.RecipientReplyTo = a.credorEmailDetail.fromEmail;
        that.RecipientFromEmailId = 4;
        that.RecipientEmailTypeId = a.credorEmailDetail.emailTypeId;
        that.emailDesign = a.credorEmailDetail.emailDesign;
        that.showEditior = true;
        that.RecipientId = [];
        for (var i = 0; i < that.emailRecipientGroups.length; i++) {
          that.RecipientId.push({ 'id' :that.emailRecipientGroups[i].emailRecipientName, 'name' : (that.emailRecipientGroups[i].emailId == null ? that.emailRecipientGroups[i].emailRecipientGroupName : that.emailRecipientGroups[i].emailId) || ((that.emailRecipientGroups[i].emailId == null && that.emailRecipientGroups[i].emailRecipientGroupName == null) ? that.emailRecipientGroups[i].tagName : that.emailRecipientGroups[i].tagName)})
        }
        that.files = [];
        for (var i = 0; i < that.emailAttachments.length; i++) {
          that.files.push({ 
            'id' : that.emailAttachments[i].id,
            'name' :that.emailAttachments[i].fileName
          })
        }
        console.log('RecipientId', that.RecipientId);
        that.editorReady('event')
        },3000);
      }
    })
  }

  RemovePreviousAttachment(value : any){
    for (let i = 0; i < this.emailAttachments.length; i++) {
      if(this.emailAttachments[i].id == value.id){
        this.PreviousAttachment.push(Number(this.emailAttachments[i].id))
      }
    }
    this.files.splice(this.files.findIndex((item: any) => item.name === value.name), 1)
    this.filesToUpload.splice(this.filesToUpload.findIndex((item: any) => item.name === value.name), 1)
  }
}



