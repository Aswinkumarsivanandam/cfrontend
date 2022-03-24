import { Component, OnInit,Inject} from '@angular/core';
import * as InlineEditor from '@ckeditor/ckeditor5-build-inline';
import { SettingsService } from '../settings/settings.service';
import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.css']
})
export class AboutusComponent implements OnInit {
  CredorInfoList: any = [];
  AboutUs: any = [];
  Editor: any = {};
  EmailContent: any;
  Loader: boolean = false;

  constructor(private settingService : SettingsService,@Inject(DOCUMENT) private document: Document) {
    this.Editor = InlineEditor;
  }

  ngOnInit(): void {
    this.document.body.classList.remove('loginnav');
    this.GetCredorInfo();
  }

  GetCredorInfo() {
    this.Loader = true;
    this.settingService.GetCredorInfo().subscribe(data => {
      this.CredorInfoList = data;
      this.AboutUs = this.CredorInfoList.filter((x: { credorInfoTypeId: number; }) => x.credorInfoTypeId == 3);
      this.EmailContent = this.AboutUs[0].bodyContent;
      this.Loader = false;
    })
  }
}
