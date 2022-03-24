import { Component, Input, OnInit } from '@angular/core';
import { UpdatesService } from '../updates/updates.service';
import * as InlineEditor from '@ckeditor/ckeditor5-build-inline';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-view-updates',
  templateUrl: './view-updates.component.html',
  styleUrls: ['./view-updates.component.css']
})
export class ViewUpdatesComponent implements OnInit {
  @Input() UpdateData : any
  content: any;
  Editorcontent: any;
  PreviewPopup: boolean = false;
  Editor:any={};
  Loader: boolean = false;
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

  constructor(private updateService: UpdatesService) {
    this.Editor = InlineEditor;
   }

  ngOnInit(): void {
  }

  onPreview() {
    this.Loader = true;
    this.PreviewPopup = true;
    this.updateService.GetUpdateContent(this.UpdateData).subscribe(data => {
      this.content = data;
      this.Editorcontent = '';
      this.Editorcontent = this.content.content;
      this.Loader = false;
    })
  }

}
