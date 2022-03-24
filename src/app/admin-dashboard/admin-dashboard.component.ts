import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { InvestorService } from '../investor/investor.service';
import { LeadService } from '../lead/lead.service';
import { AdminDashboardService } from './admin-dashboard.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  LeadsData: any = [];
  OfferingData: any = [];
  config: any;
  config1: any;
  UserInvestorData: any;
  HeaderSummaryData: any;
  VerifyAccountPopup: boolean = false;
  VerifyPopupShow: boolean = false;
  Loader: boolean = false;
  VerifyAccountId: any;
  UserId: any;
  NotePopup: boolean = false;
  InvestorData: any = [];
  WriteNoteBool: boolean = false;
  InvestorNotes: any;
  EditBool: boolean = false;
  InvestorEmpty: boolean = false;
  InvestorNoteId: any;
  EditInvestorNoteId: any;
  TableView: boolean = false;
  addUpdateShow : boolean = false;
  ModalName : any;
  parentMessage: any;
  rows = [];
  selected = [];
  count = 100;
  pageSize = 3;
  limit = 5;
  offset = 0;

  public changeLimit(event: any): void {
    this.limit = parseInt(event.target.value);
    console.log(this.limit);
  }

  public onPage(event: any): void {
    console.log(event);
    this.count = event.count;
    this.pageSize = event.pageSize;
    this.limit = event.limit;
    this.offset = event.offset;
  }

  constructor(private adminDashboardService: AdminDashboardService,
    private leadService: LeadService,
    private investorService : InvestorService,
    private route : ActivatedRoute,
    private toastr : ToastrService,
    private router: Router) {
    this.config = {
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: this.LeadsData.length
    };
    this.config1 = {
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: this.OfferingData.length
    };
  }

  ngOnInit(): void {
    this.UserId = Number(localStorage.getItem("UserId"));
    this.Loader = true;
    this.GetLeads();
    this.GetOffering();
    this.GetUserInvestorDetails();
    this.GetAdminHeaderSummary();
  }

  GetLeads() {
    this.adminDashboardService.GetLeads().subscribe(data => {
      this.LeadsData = data;
      this.Loader = false;
    })
  }

  GetOffering() {
    this.adminDashboardService.GetOffering().subscribe(data => {
      this.OfferingData = data;
    })
  }

  onVerifyAccount(val: any) {
    this.VerifyAccountPopup = true;
    if (val.verifyAccount == true) {
      this.VerifyPopupShow = false;
    }
    else {
      this.VerifyPopupShow = true;
    }
    this.VerifyAccountId = val.id;
  }

  pageChanged(event: any) {
    this.config.currentPage = event;
  }

  pageChanged1(event: any) {
    this.config1.currentPage = event;
  }

  GetUserInvestorDetails() {
    this.adminDashboardService.GetUserInvestorDetails().subscribe(data => {
      this.UserInvestorData = data;
    })
  }

  GetAdminHeaderSummary() {
    this.adminDashboardService.GetAdminHeaderSummary().subscribe(data => {
      this.HeaderSummaryData = data;
    })
  }

  VerifyUser() {
    this.Loader = true;
    this.leadService.VerifyAccount(this.UserId, this.VerifyAccountId, this.VerifyPopupShow).subscribe(data => {
      if (data == true) {
        this.VerifyAccountPopup = false;
        this.GetLeads();
      }
      else {
        this.VerifyAccountPopup = false;
        this.Loader = false;
      }
    })
  }

  VerifyCancel() {
    this.VerifyAccountPopup = false;
    this.GetLeads();
  }

  ProfileReturnData() {
    this.GetLeads();
  }

  onLeadNotes(e : any){
    this.NotePopup = true;
    this.EditBool = false;
    this.InvestorNoteId = e.id;
    this.EditInvestorNoteId = 0;
    this.WriteNoteBool = false;
    this.GetNotesBYId();
  }

  GetNotesBYId() {
    this.investorService.GetInvestorNotes(this.InvestorNoteId).subscribe(data => {
      this.InvestorData = data;
      if (this.InvestorData.length > 0) {
        this.TableView = true;
        // this.InvestorNotes = this.InvestorData[0].notes
        this.InvestorNotes = ''
      }
      else {
        this.TableView = false;
        this.InvestorEmpty = true;
      }
      this.Loader = false;
    })
  }

  EditNote(e: any) {
    this.WriteNoteBool = true;
    this.TableView = false;
    this.EditBool = true;
    this.InvestorNotes = e.notes;
    this.EditInvestorNoteId = e.id
  }

  DeleteNote(e: any) {
    this.Loader = true;
    this.investorService.DeleteInvestorNotes(this.UserId, e.id).subscribe(data => {
      if (data == true) {
        this.WriteNoteBool = false;
        this.GetNotesBYId();
        this.toastr.success("Note deleted successfully","Success!")
      }
      else {
        this.Loader = false;
        this.toastr.error("Note can't be delete","Error!")
      }
    })
  }

  OnCancel() {
    this.WriteNoteBool = false;
    if (this.InvestorData.length > 0) {
      this.TableView = true;
      this.InvestorNotes = this.InvestorData[0].notes
    }
    else {
      this.InvestorEmpty = true;
    }
  }

  NoteSave() {
    this.Loader = true;
    if(this.InvestorNotes != null && this.InvestorNotes != ''){
      let notes = {
        Id: this.EditInvestorNoteId != 0 ? this.EditInvestorNoteId : 0,
        AdminUserId: this.UserId,
        UserId: this.InvestorNoteId,
        Notes: this.InvestorNotes,
        Active: true
      }
      if (this.EditInvestorNoteId == 0) {
        this.investorService.AddInvestorNotes(notes).subscribe(data => {
          if (data == true) {
            this.WriteNoteBool = false;
            this.GetNotesBYId();
            this.toastr.success("Note saved successfully","Success!")
          }
          else {
            this.Loader = false;
            this.toastr.error("Note can't be save","Error!")
          }
        })
      }
      else {
        this.investorService.UpdateInvestorNotes(notes).subscribe(data => {
          if (data == true) {
            this.WriteNoteBool = false;
            this.GetNotesBYId();
            this.toastr.success("Note updated successfully","Success!")
          }
          else {
            this.Loader = false;
            this.toastr.error("Note can't be update","Error!")
          }
        })
      }
    }
    else{
      this.Loader = false;
    }
  }

  onWriteANote() {
    this.InvestorEmpty = false;
    this.WriteNoteBool = true;
    this.EditBool = false;
    this.InvestorNotes = '';
  }

  UserNameDetails(e : any){
    localStorage.setItem("InvestorId",e.id);
    localStorage.setItem("RouteName","AdminDashboard");
    this.router.navigate(['./../user-details'], { relativeTo: this.route });
  }

  onOfferingEdit(val : any){
    localStorage.setItem("InvestorId",val.id);
    localStorage.setItem("RouteName1","AdminDashboard");
    this.router.navigate(['./../portfolio' + '/' + 'offering' + '/' + val.id], { relativeTo: this.route });
  }

  editUpdate(value : any){
    this.addUpdateShow = true;
    this.ModalName = 'Add';
    this.parentMessage = value.id;
  }

  receiveMessage() {
    this.GetOffering();
    this.addUpdateShow = false;
  }

  // onActivate(event: any) {
  //   //console.log('Activate Event', event);
  // }
}
