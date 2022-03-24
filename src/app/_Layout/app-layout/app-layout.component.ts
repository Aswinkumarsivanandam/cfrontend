import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {Location} from '@angular/common'

@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.css']
})
export class AppLayoutComponent implements OnInit {

  constructor(private router: Router,
    private location: Location,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    if(this.router.url==='/'){
      this.router.navigate(['/login'], { relativeTo: this.route });
    }
   // this.router.navigate(['/login'], { queryParams: { redirectUrl: this.url } });
  }

}
