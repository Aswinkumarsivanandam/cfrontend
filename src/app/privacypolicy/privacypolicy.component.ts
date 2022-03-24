import { Component, OnInit,Inject } from '@angular/core';
import { SettingsService } from '../settings/settings.service';
import * as InlineEditor from '@ckeditor/ckeditor5-build-inline';
import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'app-privacypolicy',
  templateUrl: './privacypolicy.component.html',
  styleUrls: ['./privacypolicy.component.css']
})
export class PrivacypolicyComponent implements OnInit {
  CredorInfoList: any = [];
  PrivacyPolicy: any = [];
  Editor: any = {};
  EmailContent: any;

  constructor(private settingService : SettingsService, @Inject(DOCUMENT) private document: Document,) {
    this.Editor = InlineEditor;
   }

  ngOnInit(): void {
    this.document.body.classList.remove('loginnav');
    this.GetCredorInfo();
  }

  GetCredorInfo() {
    this.settingService.GetCredorInfo().subscribe(data => {
      this.CredorInfoList = data;
      this.PrivacyPolicy = this.CredorInfoList.filter((x: { credorInfoTypeId: number; }) => x.credorInfoTypeId == 1);
      this.EmailContent = this.PrivacyPolicy[0].bodyContent;
    })
  }

}
