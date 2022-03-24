import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import InlineEditor from '@ckeditor/ckeditor5-build-inline';
import { ToastrService } from 'ngx-toastr';
import { PortfolioService } from '../portfolio/portfolio.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';


class UploadAdapter {
  private loader;
  constructor(loader: any) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file
      .then((file: any) => new Promise((resolve, reject) => {
        var myReader = new FileReader();
        myReader.onloadend = (e) => {
          resolve({ default: myReader.result });
        }

        myReader.readAsDataURL(file);
      }));

  };
}
@Component({
  selector: 'app-add-update',
  templateUrl: './add-update.component.html',
  styleUrls: ['./add-update.component.css']
})
export class AddUpdateComponent implements OnInit {
  UpdateDate: any;
  UpdateSubject: any;
  UpdateDateError: boolean = false;
  UpdateSubjectError: boolean = false;
  UpdateFromName: any;
  UpdateReplyTo: any;
  UpdateValue: any;
  htmlContent = '';
  EmailList: any = [];
  filesToUpload: any = [];
  files: any = [];
  allowedFileExtensionsDocument: any = [];
  ModalName: any = 'Add';
  UpdateFromEmail: any = 0;
  updateEmail: any;
  Editor: any = {};
  Markers: any = [];
  lat: any;
  lng: any;
  zoom: any;
  byCheckEmail: any;
  byCheckAccount: any;
  byCheckCopy: any;
  Id: any;
  IsDocumentPrivate: boolean = false;
  adminUserid: any;
  updateId: any;
  UpdateStatus: any;
  @Output() messageEvent = new EventEmitter<string>();
  @Input() childMessage: any = {};
  @Input() ChildMessageId: any;
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold']
    ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };
  Loader: boolean = false;
  PreviousAttachment: any = [];
  previousFiles: any = [];
  UpdateFromNameError : boolean = false;
  UpdateReplyToError : boolean = false;

  constructor(private _portfolio: PortfolioService, private toastr: ToastrService, private route: ActivatedRoute) {
    this.Editor = InlineEditor;
    this.lat = 0;
    this.lng = 0;
    this.zoom = 2;
    this.Markers = [];
  }

  ngOnInit(): void {
    this.getEmailList();
    this.adminUserid = Number(localStorage.getItem('UserId'))
    this.allowedFileExtensionsDocument = ['pdf', 'PDF'];
    if (this.ChildMessageId == undefined) {
      this.Id = +this.route.snapshot.params['id'];
    }
    else {
      this.Id = this.ChildMessageId;
      this.ModalName = 'Add'
    }
    if ((this.childMessage != null || this.childMessage != undefined) && Object.keys(this.childMessage).length != 0) {
      this.ModalName = 'Edit';
      this.UpdateDate = (new Date(this.childMessage.UpdateDate)).toISOString().substring(0, 10),
        this.UpdateSubject = this.childMessage.UpdateSubject,
        this.UpdateFromName = this.childMessage.UpdateFromName,
        this.UpdateFromEmail = this.childMessage.UpdateFromEmail,
        this.UpdateReplyTo = this.childMessage.UpdateReplyTo,
        this.UpdateValue = this.childMessage.UpdateValue,
        this.htmlContent = this.childMessage.UpdateValue,
        this.updateId = this.childMessage.updateId,
        this.byCheckEmail = this.childMessage.UpdatebyCheckEmail,
        this.byCheckAccount = this.childMessage.UpdatebyCheckAccount,
        this.byCheckCopy = this.childMessage.UpdatebyCheckCopy
      this.UpdateStatus = this.childMessage.UpdateStatus
      if (this.childMessage.UpdateFiles.length > 0) {
        for (var i = 0; i < this.childMessage.UpdateFiles.length; i++) {
          this.files.push({
            name: this.childMessage.UpdateFiles[i].name,
            type: this.childMessage.UpdateFiles[i].extension
          });
          this.previousFiles.push({
            'id': this.childMessage.UpdateFiles[i].id,
            'name': this.childMessage.UpdateFiles[i].name
          })
        }
      }
    }
  }

  UpdateSubjectchange() {
    if (this.UpdateSubject == '' || this.UpdateSubject == null) {
      this.UpdateSubjectError = true;
    }
    else {
      this.UpdateSubjectError = false;
    }
  }

  UpdateFromNamechange() {
    if (this.UpdateFromName == '' || this.UpdateFromName == null) {
      this.UpdateFromNameError = true;
    }
    else {
      this.UpdateFromNameError = false;
    }
  }

  UpdateReplyTochange() {
    if (this.UpdateReplyTo == '' || this.UpdateReplyTo == null) {
      this.UpdateReplyToError = true;
    }
    else {
      this.UpdateReplyToError = false;
    }
  }

  UpdateDatechange() {
    if (this.UpdateDate == '' || this.UpdateDate == null) {
      this.UpdateDateError = true;
    }
    else {
      this.UpdateDateError = false;
    }
  }

  onchangeFromEmail(e: any) {
    for (var i = 0; i < this.EmailList.length; i++) {
      if (this.EmailList[i].id == e.target.value) {
        this.UpdateFromName = this.EmailList[i].fromName;
        this.UpdateReplyTo = this.EmailList[i].emailId;
      }
      if(this.UpdateFromName != null){
        this.UpdateFromNameError = false;
      }
      if(this.UpdateReplyTo != null){
        this.UpdateReplyToError = false;
      }
    }
  }

  getEmailList() {
    this._portfolio.getfromemail().subscribe(data => {
      if (data) {
        let x = { id: 0, emailId: 'Select Email', active: true }
        this.EmailList = data;
        this.EmailList.unshift(x);
        // this.EmailList.push({
        //   'id': 0,
        //   'emailId': 'Select Email'
        // })
      }
    })
  }

  onFilesSelect(event: any) {
    //   this.filesToUpload = [];
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
        }
      });
      if (ext == null) {
        this.toastr.error(event.target.files[i].name.split('.').pop() + ' files are not accepted.', 'Error');
      }
    }
  }

  removeDocument(file: any, index: any) {
    for (let i = 0; i < this.previousFiles.length; i++) {
      if (this.previousFiles[i].name == file.name) {
        this.PreviousAttachment.push(Number(this.previousFiles[i].id))
      }
    }
    if (this.filesToUpload.length > 0) {
      var temp: any = Array.from(this.filesToUpload);
      temp = temp.filter((x: any) => x != this.filesToUpload[index]);
      this.filesToUpload = temp;
    }
    this.files = this.files.filter((x: any) => x != file);
  }

  onReady(eventData: any) {
    eventData.plugins.get('FileRepository').createUploadAdapter = function (loader: any) {
      return new UploadAdapter(loader);
    };
  }

  SaveUpdates(id: any) {
    this.Loader = true;
    if (this.UpdateDate == '' || this.UpdateDate == null) {
      this.UpdateDateError = true;
    }
    if (this.UpdateSubject == '' || this.UpdateSubject == null) {
      this.UpdateSubjectError = true;
    }
    if (this.UpdateFromName == '' || this.UpdateFromName == null) {
      this.UpdateFromNameError = true;
    }
    if (this.UpdateReplyTo == '' || this.UpdateReplyTo == null) {
      this.UpdateReplyToError = true;
    }
    else {
      this.updateEmail = Number(this.UpdateFromEmail)
      const update = new FormData();
      update.append('AdminUserId', this.adminUserid);
      update.append('offeringId', this.Id);
      update.append('Date', this.UpdateDate);
      update.append('Subject', this.UpdateSubject);
      update.append('FromName', this.UpdateFromName);
      update.append('FromEmailId', this.updateEmail);
      update.append('ReplyTo', this.UpdateReplyTo);
      update.append('SendEmailToInvestors', (this.byCheckEmail == undefined ? false : this.byCheckEmail));
      update.append('SendCopyToMe', (this.byCheckCopy == undefined ? false : this.byCheckCopy));
      update.append('AttachAccountStatement', (this.byCheckAccount == undefined ? false : this.byCheckAccount));
      update.append('Status', id);
      update.append('Content', this.htmlContent);
      this.filesToUpload.forEach((item: any) => {
        update.append('Attachments', item);
      });
      if (this.ModalName == 'Edit') {
        update.append('Id', this.updateId);
        if (this.PreviousAttachment.length > 0) {
          update.append("RemovePreviousAttachments", this.PreviousAttachment);
        }
        this._portfolio.Updatedetails(update).subscribe(data => {
          if (data) {
            this.messageEvent.emit('Success');
            this.toastr.success("Successfully Updated")
          }
          else {
            this.toastr.error("Updated Failed");
          }
        })
      }
      else {
        this._portfolio.addUpdate(update).subscribe(data => {
          if (data) {
            this.messageEvent.emit('Success');
            this.toastr.success("Successfully Added")
          }
          else {
            this.toastr.error("Added Failed");
          }
        })
      }
    }
    this.Loader = false;
  }
}
