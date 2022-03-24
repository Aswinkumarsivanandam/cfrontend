import { Component, OnInit } from '@angular/core';
import { UpdatesService } from './updates.service';
import InlineEditor from '@ckeditor/ckeditor5-build-inline';
import { HttpErrorResponse } from '@angular/common/http';
import * as JSZip from 'jszip';
import * as FileSaver from 'file-saver';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-updates',
  templateUrl: './updates.component.html',
  styleUrls: ['./updates.component.css']
})
export class UpdatesComponent implements OnInit {
  UpdateValue: any = [];
  Name: any;
  Subject: any;
  PreviewPopup: boolean = false;
  Date: any;
  UpdateValueId: any = 0;
  DropdownUpdateValue: any = [];
  UpdateData: any = [];
  Filter: any = [];
  config: any;
  UserId: any;
  Loader: boolean = false
  content: any = [];
  Editor: any = {};
  attachmentList : any = []
  DocumentPathList : any = [];

  constructor(private updateService: UpdatesService,private httpClient: HttpClient) {
    this.config = {
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: this.UpdateValue.length
    };
    this.Editor = InlineEditor;
  }

  ngOnInit(): void {
    this.Loader = true;
    if (window.name === 'Remote') {
      this.UserId = localStorage.getItem('InvestorId');
    }
    else {
      this.UserId = localStorage.getItem('UserId');
    }
    this.GetUpdate();
  }
  GetUpdate() {
    this.updateService.GetUpdates(this.UserId).subscribe(data => {
      if (data) {
        this.UpdateData = data;
        this.UpdateValue = data;
        console.log(this.UpdateValue,'UpdateValue')
        this.config.totalItems = this.UpdateValue.length
        this.DropdownUpdateValue.push({ id: 0, name: 'All Updates' })
        for (let i = 0; i < this.UpdateValue.length; i++) {
          let x = this.DropdownUpdateValue.filter((x: { name: any; }) => x.name == this.UpdateValue[i].name)
          if (x.length == 0) {
            this.DropdownUpdateValue.push({ id: this.UpdateValue[i].id, name: this.UpdateValue[i].name })
          }
        }
        this.Loader = false;
      }
      else {
        this.Loader = false;
      }
    })
  }

  // onPreview(value: any) {
  //   this.updateService.GetUpdateContent(value.id).subscribe(data=>{
  //     this.content =data;
  //    })
  //   this.PreviewPopup = true;
  //   this.Name = value.name
  //   this.Subject = value.subject
  //   this.content = value.content
  //   this.Date = value.createdOn
  // }

  onChange(e: any) {
    this.UpdateValueId = +e.target.value;
    console.log(this.UpdateData, 'updatedata')
    if (this.UpdateValueId == 0) {
      this.UpdateValue = this.UpdateData;
    }
    else {
      this.Filter = this.DropdownUpdateValue.filter((x: { id: any }) => x.id == this.UpdateValueId)
      this.UpdateValue = this.UpdateData.filter((x: { name: any; }) => x.name == this.Filter[0].name)
    }
    this.config.totalItems = this.UpdateValue.length
    console.log(e.target.value, 'change')
  }
  pageChanged(event: any) {
    this.config.currentPage = event;
  }
  onChooseDataPerPage(event: any) {
    if (+event.target.value == 0) {
      this.config.itemsPerPage = 5
    }
    else {
      this.config.itemsPerPage = +event.target.value
    }
  }

  downloadDocument(Id : any) {
    this.Loader = true;
    this.updateService.GetUpdateDocument(Id).subscribe(data => {
    console.log('DocumentList', data)
    if(data){
      let a : any;
      a = data;
      this.attachmentList = a.attachments;
      if(this.attachmentList.length == 1){
        this.onDownloadSingleFile(this.attachmentList);
      }
      else{
        for (var i = 0; i < this.attachmentList.length; i++) {
          this.DocumentPathList.push({
            id: this.attachmentList[i].id,
            name: this.attachmentList[i].name,
            path: this.attachmentList[i].filePath
          });
        }
        this.MultipleFileZipdownloadAll();    
     }
    }
      this.Loader = false;
    })
  }

  onDownloadSingleFile(value: any) {
    var a = document.createElement('a');
    a.href = value[0].filePath;
    a.download = value[0].name;
    a.click();
  }

  MultipleFileZipdownloadAll(){
    this.createZip(this.DocumentPathList, 'update_document');
  }

  async createZip(files: any[], zipName: string) {
    this.Loader = true;
    const zip = new JSZip();
    const name = zipName + '.zip';
    for (let counter = 0; counter < files.length; counter++) {
      const element = files[counter];
      const fileData: any = await this.getFile(element);
      const b: any = new Blob([fileData], { type: '' + fileData.type + '' });
      zip.file(element.path.substring(element.path.lastIndexOf('/') + 1), b);
    }


    zip.generateAsync({ type: 'blob' }).then((content) => {
      if (content) {
        FileSaver.saveAs(content, name);
      }
    });

    this.Loader = false;
  }

  async getFile(url: string) {
    let d: any = {};
    d = url
    const httpOptions = {
      responseType: 'blob' as 'json'
    };
    const res = await this.httpClient.get(d.path, httpOptions).toPromise().catch((err: HttpErrorResponse) => {
      const error = err.error;
      return error;
    });
    return res;
  }

}
