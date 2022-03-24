import { Component, OnInit,Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
declare var $: any;
@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.css']
})
export class SiteLayoutComponent implements OnInit {

  constructor(@Inject(DOCUMENT) private document: Document) {

    $(document).ready(function () {
      $("body").removeClass("loginnav");
      $("app-header .menuicon").click(function () {
        $('app-side-bar').toggleClass('active');
      
      });
    });
  }

  ngOnInit(): void {
    this.document.body.classList.remove('loginnav');
    
  }



}
