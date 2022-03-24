import { Component, OnInit, Inject } from '@angular/core';
import { SettingsService } from '../settings/settings.service';
import * as InlineEditor from '@ckeditor/ckeditor5-build-inline';
import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'app-termsandconditions',
  templateUrl: './termsandconditions.component.html',
  styleUrls: ['./termsandconditions.component.css']
})
export class TermsandconditionsComponent implements OnInit {
  CredorInfoList: any = [];
  TermsandCondition: any = [];
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
      this.TermsandCondition = this.CredorInfoList.filter((x: { credorInfoTypeId: number; }) => x.credorInfoTypeId == 2);
      this.EmailContent = this.TermsandCondition[0].bodyContent;
    })
  }

}
