import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ReportService } from './report.service';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
import { ColumnMode } from '@swimlane/ngx-datatable';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  ColumnMode = ColumnMode;
  Selected: any;
  tabSelectId: any;
  ReportList: any = [];
  adminUserId: any;
  viewNotesBtnShow: boolean = false;
  NotesList: any = [];
  Loader: boolean = false;
  config: any;
  @ViewChild('tableInput') tableInput!: ElementRef;
  StatusTypeId: any = 0;
  ReportSearchList: any = [];
  NameTypeId: any = 0;
  OfferingNameList: any = [];
  FromDate: any;
  ToDate: any;
  TaxFromDate: any;
  TaxToDate: any;
  TaxofferingId: any = 0;
  FormDOfferingId: any = 0;
  ActiveOfferingId: any = 0;

  StatusList: any = [
    { id: 0, value: 'All' },
    { id: 1, value: 'Lead' },
    { id: 2, value: 'Investor' },
  ];
  InvestorProfileUpdate: any = [];
  InvestorProfileUpdateValue: any = [];
  ActiveOfferingDetails: any = [];
  ActiveOfferingDetailsValue: any = [];
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







  constructor(private _report: ReportService, public datepipe: DatePipe) {
    this.config = {
      itemsPerPage: 100,
      currentPage: 1,
      totalItems: this.ReportList.length
    };




    this.fetch((data: any) => {
      this.rows = data;
    });




  }

  ngOnInit(): void {
    this.adminUserId = Number(localStorage.getItem('UserId'));
    this.selectUserTab(1);
    this.getOfferingName();
    this.GetInvestorProfileUpdates();
  }

  pageChanged(event: any) {
    this.config.currentPage = event;
  }

  selectUserTab(id: any) {
    this.FromDate = '';
    this.ToDate = '';
    this.Selected = 'Users';
    this.tabSelectId = id;
    this.getUserList();
  }

  selectInvestmentTab(id: any) {
    this.NameTypeId = 0;
    this.Selected = 'Investments';
    this.tabSelectId = id;
    this.getInvestmentList();
  }

  selectDistributionTab(id: any) {
    this.NameTypeId = 0;
    this.Selected = 'Distributions';
    this.tabSelectId = id;
    this.getDistributionList();
  }

  selectTaxTab(id: any) {
    this.TaxofferingId = 0;
    this.ReportList = [];
    this.NameTypeId = 0;
    this.Selected = 'Tax';
    this.tabSelectId = id;
  }

  selectFormDTab(id: any) {
    this.FormDOfferingId = 0;
    this.ReportList = [];
    this.NameTypeId = 0;
    this.Selected = 'FormD';
    this.tabSelectId = id;
  }

  selectInvestorProfileTab(id: any) {
    this.ReportList = [];
    this.NameTypeId = 0;
    this.Selected = 'InvestorProfileUpdates';
    this.tabSelectId = id;
    this.GetActiveOfferingDetails();
  }

  getUserList() {
    this.StatusTypeId = 0;
    this.Loader = true;
    this.ReportList = [];
    this.ReportSearchList = [];
    this._report.getReportUser(this.adminUserId).subscribe(data => {
      if (data) {
        // this.ReportList = data;
        this.ReportSearchList = data;
        for (let i = 0; i < this.ReportSearchList.length; i++) {
          this.ReportList.push({
            'name': this.ReportSearchList[i].name,
            'email': this.ReportSearchList[i].email,
            'phone': this.ReportSearchList[i].phone,
            'state': this.ReportSearchList[i].state,
            'status': this.ReportSearchList[i].status,
            'verified': this.ReportSearchList[i].isVerified,
            'selfAcc': this.ReportSearchList[i].isSelfAccredited,
            'verifiedAcc': this.ReportSearchList[i].isSelfAccredited,
            'registered': this.ReportSearchList[i].registered,
            'signUpDate': this.ReportSearchList[i].signUpDate,
            'investmentCapacity': this.ReportSearchList[i].investmentCapacity,
            'leadSource': this.ReportSearchList[i].leadSource,
            'additionalUsers': this.ReportSearchList[i].additionalUsers,
            'notes': this.ReportSearchList[i].notes,
          })
        }

        for (var i = 0; i < this.ReportSearchList.length; i++) {
          //   var date = new Date(this.ReportSearchList[i].createdOn);
          this.ReportSearchList[i].createdOn = this.datepipe.transform(this.ReportSearchList[i].createdOn, 'yyyy-MM-dd');
        }
        this.Loader = false;
      }
      else {
        this.Loader = false;
      }
    })
  }

  getOfferingName() {
    this.Loader = true;
    this._report.GetPortfolioOfferings().subscribe(data => {
      if (data != null) {
        this.OfferingNameList = data;
        this.OfferingNameList.unshift({
          'id': 0,
          'name': 'Select'
        })
        this.Loader = false;
      }
      else {
        this.Loader = false;
      }
    })
  }

  getInvestmentList() {
    this.Loader = true;
    this.ReportList = [];
    this.ReportSearchList = [];
    this._report.getInvestment(this.adminUserId).subscribe(data => {
      if (data) {
        // this.ReportList = data;
        this.ReportSearchList = data;
        for (let i = 0; i < this.ReportSearchList.length; i++) {
          this.ReportList.push({
            'offeringName': this.ReportSearchList[i].offeringName,
            'status': this.ReportSearchList[i].status,
            'name': this.ReportSearchList[i].name,
            'email': this.ReportSearchList[i].email,
            'phone': this.ReportSearchList[i].phone,
            'profileName': this.ReportSearchList[i].profileName,
            'profileId': this.ReportSearchList[i].profileId,
            'addressLine1': this.ReportSearchList[i].addressLine1,
            'addressLine2': this.ReportSearchList[i].addressLine2,
            'city': this.ReportSearchList[i].city,
            'state': this.ReportSearchList[i].state,
            'zipCode': this.ReportSearchList[i].zipCode,
            'disdegratedEntity': this.ReportSearchList[i].disregardedEntity,
            'irallc': this.ReportSearchList[i].irallc,
            'profileTaxId': this.ReportSearchList[i].profileTaxId,
            'investmentAmount': this.ReportSearchList[i].investmentAmount,
            'funded': this.ReportSearchList[i].percentageFunded,
            'ownership': this.ReportSearchList[i].percentageOwnership,
            'signedDate': this.ReportSearchList[i].signedUpDate,
            'fundedDate': this.ReportSearchList[i].fundedDate,
            'verified': this.ReportSearchList[i].isVerified,
          })
        }
        this.Loader = false;
      }
      else {
        this.Loader = false;
      }
    })
  }

  getDistributionList() {
    this.Loader = true;
    this.ReportList = [];
    this.ReportSearchList = [];
    this._report.getDistribution().subscribe(data => {
      if (data) {
        // this.ReportList = data;
        this.ReportSearchList = data;
        for (let i = 0; i < this.ReportSearchList.length; i++) {
          this.ReportList.push({
            'offeringName': this.ReportSearchList[i].offeringName,
            'status': this.ReportSearchList[i].status,
            'name': this.ReportSearchList[i].name,
            'email': this.ReportSearchList[i].email,
            'phone': this.ReportSearchList[i].phone,
            'profileName': this.ReportSearchList[i].profileName,
            'profileId': this.ReportSearchList[i].profileId,
            'addressLine1': this.ReportSearchList[i].addressLine1,
            'addressLine2': this.ReportSearchList[i].addressLine2,
            'city': this.ReportSearchList[i].city,
            'state': this.ReportSearchList[i].state,
            'zipCode': this.ReportSearchList[i].zipCode,
            'disdegratedEntity': this.ReportSearchList[i].disregardedEntity,
            'irallc': this.ReportSearchList[i].irallc,
            'profileTaxId': this.ReportSearchList[i].profileTaxId,
            'investmentAmount': this.ReportSearchList[i].investmentAmount,
            'funded': this.ReportSearchList[i].percentageFunded,
            'ownership': this.ReportSearchList[i].percentageOwnership,
            'signedDate': this.ReportSearchList[i].signedUpDate,
            'fundedDate': this.ReportSearchList[i].fundedDate,
            'verified': this.ReportSearchList[i].isVerified,
            'paymentDate': this.ReportSearchList[i].paymentDate,
            'percentageFunded': this.ReportSearchList[i].percentageFunded,
            'percentageOwnership': this.ReportSearchList[i].percentageOwnership,
          })
        }
        this.Loader = false;
      }
      else {
        this.Loader = false;
      }
    })
  }

  onchangeTaxType(e: any) {
    this.Loader = true;
    this._report.GetTax(e.target.value).subscribe(data => {
      if (data != null) {
        // this.ReportList = data;
        this.ReportSearchList = data;
        for (let i = 0; i < this.ReportSearchList.length; i++) {
          this.ReportList.push({
            'offering': this.ReportSearchList[i].offeringName,
            'name': this.ReportSearchList[i].name,
            'profileName': this.ReportSearchList[i].profileName,
            'profileType': this.ReportSearchList[i].profileType,
            'disregardedEntity': this.ReportSearchList[i].isDisregardedEntity,
            'irallc': this.ReportSearchList[i].isIRALLC,
            'profileId': this.ReportSearchList[i].profileDisplayId,
            'profileTaxId': this.ReportSearchList[i].profileTaxId,
            'investmentAmount': this.ReportSearchList[i].investmentAmount,
            'operatingIncome': this.ReportSearchList[i].operatingIncome,
            'retainedEarnings': this.ReportSearchList[i].retainedEarnings,
            'proceedsFromRefi': this.ReportSearchList[i].proceedsFromrRefi,
            'gainFromSales': this.ReportSearchList[i].gainFromSales,
            'totalReturnOfCapital': this.ReportSearchList[i].totalReturnOfCapital,
            'preferredReturn': this.ReportSearchList[i].preferredReturn,
            'interest': this.ReportSearchList[i].interest,
            'investmentBalance': this.ReportSearchList[i].investmentBalance,
            'fundedDate': this.ReportSearchList[i].fundedDate,
            'funded': this.ReportSearchList[i].percentageFunded,
            'ownership': this.ReportSearchList[i].percentageOwnerShip,
            'addressLine1': this.ReportSearchList[i].addressLine1 != null ? this.ReportSearchList[i].addressLine1 : '-',
            'addressLine2': this.ReportSearchList[i].addressLine2 != null ? this.ReportSearchList[i].addressLine2 : '-',
            'city': this.ReportSearchList[i].city,
            'state': this.ReportSearchList[i].state,
            'zipCode': this.ReportSearchList[i].zipCode,
          })
        }
        console.log(this.ReportList,'ReportListtab')
        this.Loader = false;
      }
      else {
        this.Loader = false;
      }
    })
  }

  onchangeFormDType(e: any) {
    this.Loader = true;
    this._report.GetFormD(e.target.value).subscribe(data => {
      if (data != null) {
        // this.ReportList = data;
        this.ReportSearchList = data;
        for (let i = 0; i < this.ReportSearchList.length; i++) {
          this.ReportList.push({
            'state': this.ReportSearchList[i].state,
            'noOfInvestors': this.ReportSearchList[i].noOfInvestors,
            'amountFunded': this.ReportSearchList[i].amountFunded,
            'dateFirstFundReceived': this.ReportSearchList[i].dateFirstFundReceived,
            'nonAccreditedInvestors': this.ReportSearchList[i].nonAccreditedInvestors,
          })
        }
        this.Loader = false;
      }
      else {
        this.Loader = false;
      }
    })

  }

  onViewNotes(value: any) {
    this.viewNotesBtnShow = true;
    this.NotesList = value;
  }

  ExcelTableExport() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.tableInput.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    if (this.Selected == 'Users') {
      XLSX.writeFile(wb, 'UserReports.xlsx');
    }
    else if (this.Selected == 'Investments') {
      XLSX.writeFile(wb, 'InvestmentsReports.xlsx');
    }
    else if (this.Selected == 'Distributions') {
      XLSX.writeFile(wb, 'DistributionsReports.xlsx');
    }
    else if (this.Selected == 'Tax') {
      XLSX.writeFile(wb, 'TaxReports.xlsx');
    }
    else if (this.Selected == 'FormD') {
      XLSX.writeFile(wb, 'FormDReports.xlsx');
    }
  }

  onchangeNameType(e: any) {
    let ChangeName: any;
    for (var i = 0; i < this.OfferingNameList.length; i++) {
      if (e.target.value == this.OfferingNameList[i].id) {
        ChangeName = this.OfferingNameList[i].name;
        this.ReportList = [];
        const List = this.ReportSearchList.filter((x: any) => x.offeringName == ChangeName);
        this.ReportList = List
      }
    }
  }

  onchangeStatusType(e: any) {
    if (e.target.value == 1) {
      const statusList = this.ReportSearchList.filter((x: any) => x.status == 'Lead');
      this.ReportList = [];
      this.ReportList = statusList;
    }
    else if (e.target.value == 2) {
      const statusList = this.ReportSearchList.filter((x: any) => x.status == 'Investor');
      this.ReportList = [];
      this.ReportList = statusList;
    }
    else {
      this.ReportList = [];
      this.ReportList = this.ReportSearchList;
    }
  }

  SearchDate() {
    let StartDate: any;
    let EndDate: any;
    if ((this.FromDate != null || this.FromDate != "") && (this.ToDate == null || this.ToDate == "")) {
      StartDate = this.datepipe.transform(this.FromDate, 'yyyy-MM-dd')
      var resultProductData = this.ReportSearchList.filter((a: any) => a.createdOn >= StartDate);
      this.ReportList = [];
      this.ReportList = resultProductData;
    }
    else if ((this.FromDate == null || this.FromDate == "") && (this.ToDate != null || this.ToDate != "")) {
      EndDate = this.datepipe.transform(this.ToDate, 'yyyy-MM-dd')
      var resultProductData = this.ReportSearchList.filter((a: any) => a.createdOn >= EndDate);
      this.ReportList = [];
      this.ReportList = resultProductData;
    }
    else {
      StartDate = this.datepipe.transform(this.FromDate, 'yyyy-MM-dd')
      EndDate = this.datepipe.transform(this.ToDate, 'yyyy-MM-dd')
      var resultProductData = this.ReportSearchList.filter((a: any) => (a.createdOn >= StartDate && a.createdOn <= EndDate));
      this.ReportList = [];
      this.ReportList = resultProductData;
    }
  }

  GetInvestorProfileUpdates() {
    this._report.GetInvestorProfileUpdates().subscribe(data => {
      this.InvestorProfileUpdate = data;
      this.InvestorProfileUpdateValue = [];
      for (let i = 0; i < this.InvestorProfileUpdate.length; i++) {
        this.InvestorProfileUpdateValue.push({
          offeringIds: this.InvestorProfileUpdate[i].offeringIds.map((x: any) => x).filter((value: any, index: any, self: string | any[]) => self.indexOf(value) === index),
          investments: this.InvestorProfileUpdate[i].investments.map((x: any) => x).filter((value: any, index: any, self: string | any[]) => self.indexOf(value) === index),
          investorName: this.InvestorProfileUpdate[i].investorName,
          profileName: this.InvestorProfileUpdate[i].profileName,
          newDetails: this.InvestorProfileUpdate[i].newDetails,
          oldDetails: this.InvestorProfileUpdate[i].oldDetails,
          profileType: this.InvestorProfileUpdate[i].profileType,
          updatedBy: this.InvestorProfileUpdate[i].updatedBy,
          updatedOn: this.datepipe.transform(this.InvestorProfileUpdate[i].updatedOn, 'MM/dd/yyyy'),
        })
      }
    })
  }

  GetActiveOfferingDetails() {
    this._report.GetActiveOfferingDetails().subscribe(data => {
      this.ActiveOfferingDetails = data;
      this.ActiveOfferingDetailsValue =[];
      for (let i = 0; i < this.ActiveOfferingDetails.length; i++) {
        let x = this.ActiveOfferingDetailsValue.filter((x: { name: any; }) => x.name == this.ActiveOfferingDetails[i].name)
        if (x.length == 0) {
          this.ActiveOfferingDetailsValue.push({
            id: this.ActiveOfferingDetails[i].id,
            name: this.ActiveOfferingDetails[i].name,
          })
        }
      }
      this.ActiveOfferingDetailsValue.unshift({ id: 0, name: 'Select' });
    })
  }

  onInvestorProfileUpdateChange(e: any) {
    var activeId = +e.target.value
    if(activeId != 0){
      this.InvestorProfileUpdateValue = []
      for (let i = 0; i < this.InvestorProfileUpdate.length; i++) {
        let x = this.InvestorProfileUpdate[i].offeringIds.filter((x: number) => x == activeId)
        if (x[0] == activeId) {
          this.InvestorProfileUpdateValue.push({
            offeringIds: this.InvestorProfileUpdate[i].offeringIds.map((x: any) => x).filter((value: any, index: any, self: string | any[]) => self.indexOf(value) === index),
            investments: this.InvestorProfileUpdate[i].investments.map((x: any) => x).filter((value: any, index: any, self: string | any[]) => self.indexOf(value) === index),
            investorName: this.InvestorProfileUpdate[i].investorName,
            profileName: this.InvestorProfileUpdate[i].profileName,
            newDetails: this.InvestorProfileUpdate[i].newDetails,
            oldDetails: this.InvestorProfileUpdate[i].oldDetails,
            profileType: this.InvestorProfileUpdate[i].profileType,
            updatedBy: this.InvestorProfileUpdate[i].updatedBy,
            updatedOn: this.datepipe.transform(this.InvestorProfileUpdate[i].updatedOn, 'MM/dd/yyyy'),
          })
        }
      }
    }
    else{
      this.GetInvestorProfileUpdates();
    }
  }










  fetch(cb: { (data: any): void; (arg0: any): void; }) {
    const req = new XMLHttpRequest();
    req.open('GET', `assets/data/company.json`);

    req.onload = () => {
      cb(JSON.parse(req.response));
    };

    req.send();
  }

  // onSelect({ selected }) {
  //   console.log('Select Event', selected, this.selected);

  //   this.selected.splice(0, this.selected.length);
  //   this.selected.push(...selected);
  // }

  onActivate(event: any) {
    //console.log('Activate Event', event);
  }

  add() {
    this.selected.push(this.rows[1], this.rows[3]);
  }

  update() {
    this.selected = [this.rows[1], this.rows[3]];
  }

  remove() {
    this.selected = [];
  }

  displayCheck(row: { name: string; }) {
    return row.name !== 'Ethel Price';
  }














}
