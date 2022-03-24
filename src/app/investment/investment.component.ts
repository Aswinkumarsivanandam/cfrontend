// import { CurrencyPipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import * as JSZip from 'jszip';
import { ToastrService } from 'ngx-toastr';
import { AddProfileComponent } from '../add-profile/add-profile.component';
import { InvestService } from '../invest/invest.service';
import { InvestorProfileService } from '../investor-profile/investor-profile.service';
import { InvestmentService } from './investment.service';

@Component({
  selector: 'app-investment',
  templateUrl: './investment.component.html',
  styleUrls: ['./investment.component.css'],
  // providers : [CurrencyPipe]
})
export class InvestmentComponent implements OnInit {
  @ViewChild(AddProfileComponent) addProfileComponent: any;
  @ViewChild(AddProfileComponent) ProfileValueData: any = [];
  Profile: any
  token: any;
  UserId: any;
  InvestmentData: any;
  KeyHighlights: any = [];
  DiligenceShow: boolean = false;
  InvestShow: boolean = false;
  ESignShow: boolean = false;
  FundInvestmentShow: boolean = false;
  InvestorTerms: any;
  InvestorTermsDisabled: boolean = false;
  EsignCheckDisabled: boolean = false;
  ProfileValue: any = [];
  InvestingProfile: any = 0;
  MinInvestment: any;
  InvestmentAmount: any;
  InvestError: boolean = false;
  InsAmtError: boolean = false;
  MinimumError: boolean = false;
  Offeringtoken: any;
  InvestmentTab: any;
  OfferingtokenName: any;
  ChooseProfileValue: any = [];
  Chooseprofile: any = '1';
  Iraname: any;
  StateorProvince: any;
  Province: any = [];
  Llcname: any;
  Firstname: any;
  LastName: any;
  ArrayLastnameError: boolean = false;
  ArrayEmail: boolean = false;
  ArrayvalidEmail: boolean = false;
  ArrayPhone: any;
  ArrayPhonelength: boolean = false;
  ArrayEmailValue: any;
  ArrayPhoneEmpty: boolean = false;
  Retirementname: any;
  Titlesignor: any;
  BankDetails: any = [];
  profile: any;
  ProfileId: any = 0;
  BankId: any = 0;
  DeleteBankPopup: boolean = false;
  Accountnumber: any;
  Bankname: any;
  showAccount: boolean = false;
  UserData: any;
  Loader: boolean = false;
  diligenceshow: boolean = false;
  diligencedone: boolean = false
  investshow: boolean = false;
  investdone: boolean = false
  esignshow: boolean = false;
  esigndone: boolean = false
  fundshow: boolean = false;
  funddone: boolean = false
  EsignCheck: any;
  InvestmentId: any;
  WireTransferDate: any;
  StepNavShow: boolean = true;
  FundingDataDetails: any;
  DownloadDoc: any = [];
  AmounttoFund: any = 0;
  commitmentTerms: any;
  pdf: JSZip | any;
  commitmentTermsDisabled: boolean = false;
  CommitmentVisibility: boolean = false;
  wireTransfer: any;
  byCheck: any;
  wireTransferDetailsBool: boolean = false;
  WireTransferBool: boolean = false;
  MailCheckBool: boolean = false;
  allowedFileExtensions: any = [];
  filesToUpload: any = [];
  files: any = [];
  EmailPopup: boolean = false;
  OfferingProfileIdExists: any = [];
  OfferingProfileIdExistsBool: boolean = false;


  constructor(private router: Router,
    private investService: InvestService,
    private profileService: InvestorProfileService,
    private investmentService: InvestmentService,
    private formbuilder: FormBuilder,
    private toastr: ToastrService,
    private httpClient: HttpClient,
    // private currencyPipe : CurrencyPipe,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.Loader = true;
    this.allowedFileExtensions = ['pdf', 'docx', 'doc', 'xlsx', 'csv', 'pptx', 'xls'];
    this.token = +this.route.snapshot.params['id'];
    this.Offeringtoken = +this.route.snapshot.params['offId']
    this.OfferingtokenName = this.route.snapshot.params['name']
    this.UserId = Number(localStorage.getItem('UserId'))
    this.DiligenceShow = true;
    this.diligenceshow = true
    this.GetMarketplaceById();
    this.GetProfile();
    this.GetChooseProfile();
    this.GetUserById();
    this.GetFundingDetails();
    if (this.OfferingtokenName == null || this.OfferingtokenName == 'undefined') {
      this.Loader = false;
    }
    else {
      this.GetInvestmentByTab();
    }
  }

  GetMarketplaceById() {
    this.investService.GetMarketplaceById(this.token).subscribe(data => {
      this.InvestmentData = data;
      for (let i = 0; i < this.InvestmentData.keyHighlights.length; i++) {
        if (i == 0 || i == 1 || i == 2) {
          this.KeyHighlights.push(this.InvestmentData.keyHighlights[i])
        }
      }
      this.MinInvestment = this.InvestmentData.minimumInvestment;
      this.StepNavShow = true;
      if (this.InvestmentData.type == 2) {
        this.CommitmentVisibility = true;
      }
      else {
        this.CommitmentVisibility = false;
        this.commitmentTerms = true;
        this.commitmentTermsDisabled = true;
      }
    })
  }
  onBack() {
    if (this.OfferingtokenName != null) {
      this.router.navigate(['./../../../../myinvestment'], { relativeTo: this.route });
    }
    else {
      this.router.navigate(['./../../invest'], { relativeTo: this.route });
    }
  }
  onInvestorTermsChanges(e: any) {
    if (this.InvestorTerms == true) {
      this.InvestorTermsDisabled = true;
    }
    else {
      this.InvestorTermsDisabled = false;
    }
  }
  oncommitmentTermsChanges(e: any) {
    if (this.commitmentTerms == true) {
      this.commitmentTermsDisabled = true;
    }
    else {
      this.commitmentTermsDisabled = false;
    }
  }
  DiligenceNext() {
    this.DiligenceShow = false;
    this.InvestShow = true;
    this.ESignShow = false;
    this.FundInvestmentShow = false;
    this.diligencedone = true;
    this.investshow = true;
    this.investdone = false;
    this.InvestmentId = 0;
  }
  GetProfile() {
    this.profileService.GetProfileById(this.UserId).subscribe(data => {
      let x: any = data;
      this.ProfileValue = [];
      this.ProfileValue.push({ id: 0, name: 'Select', active: true })
      for (let i = 0; i < x.length; i++) {
        if (x[i].name != null) {
          this.ProfileValue.push({ id: x[i].id, name: x[i].name, active: x[i].active })
        }
        else if (x[i].firstName != null) {
          this.ProfileValue.push({ id: x[i].id, name: x[i].firstName, active: x[i].active })
        }
        else if (x[i].trustName != null) {
          this.ProfileValue.push({ id: x[i].id, name: x[i].trustName, active: x[i].active })
        }
        else if (x[i].retirementPlanName != null) {
          this.ProfileValue.push({ id: x[i].id, name: x[i].retirementPlanName, active: x[i].active })
        }
      }
    })
  }
  onChooseProfileChange(e: any) {
    this.InvestingProfile = +e.target.value;
    if (e.target.value == 0) {
      this.InvestError = true;
      this.OfferingProfileIdExistsBool = false;
    }
    else {
      this.InvestError = false;
      this.investmentService.OfferingWithProfileIdExists(this.UserId).subscribe(data =>{
        this.OfferingProfileIdExists = data;
        this.OfferingProfileIdExists = this.OfferingProfileIdExists.filter((x: { userProfileId: any; offeringId: any; status: number; }) => x.userProfileId == this.InvestingProfile && x.offeringId == this.token && x.status == 2);
        if(this.OfferingProfileIdExists.length > 0){
          this.OfferingProfileIdExistsBool = true;
        }
        else{
          this.OfferingProfileIdExistsBool = false;
        }
      })
    }
  }
  onInsAmt(e: any) {
    this.InvestmentAmount = +e.target.value
    // this.InvestmentAmount = this.currencyPipe.transform(e.target.value)
    if (this.InvestmentAmount == null || this.InvestmentAmount == '') {
      this.InsAmtError = true;
      this.MinimumError = false;
    }
    else if (this.InvestmentAmount < this.MinInvestment) {
      this.MinimumError = true;
      this.InsAmtError = false;
    }
    else {
      this.InsAmtError = false;
      this.MinimumError = false;
    }
    this.AmounttoFund = (this.InvestmentAmount / 100) * 25
  }
  InvestBack(e: any) {
    if (e == 1) {
      this.DiligenceShow = true;
      this.InvestShow = false;
      this.ESignShow = false;
      this.FundInvestmentShow = false;
    }
    if (e == 2) {
      this.DiligenceShow = false;
      this.InvestShow = true;
      this.ESignShow = false;
      this.FundInvestmentShow = false;
    }
    if (e == 3) {
      this.DiligenceShow = false;
      this.InvestShow = false;
      this.ESignShow = true;
      this.FundInvestmentShow = false;
    }
  }
  InvestNext() {
    this.Loader = true;
    if (this.InvestingProfile == 0 || this.InvestmentAmount == null || this.InvestmentAmount == '' || this.InvestmentAmount < this.MinInvestment
      || this.commitmentTerms == false || this.OfferingProfileIdExistsBool == true) {
      if (this.InvestingProfile == 0) {
        this.InvestError = true;
      }
      else {
        this.InvestError = false;
      }
      if (this.InvestmentAmount == null || this.InvestmentAmount == '') {
        this.InsAmtError = true;
        this.MinimumError = false;
      }
      else if (this.InvestmentAmount < this.MinInvestment) {
        this.MinimumError = true;
        this.InsAmtError = false;
      }
      else {
        this.InsAmtError = false;
        this.MinimumError = false;
      }
      if (this.commitmentTerms == true) {
        this.commitmentTermsDisabled = true;
      }
      else {
        this.commitmentTermsDisabled = false;
      }
      this.Loader = false;
    }
    else {
      let invest = {
        Id: this.InvestmentId != 0 ? this.InvestmentId : 0,
        UserId: this.UserId,
        UserProfileId: this.InvestingProfile,
        OfferingId: this.token,
        Amount: +this.InvestmentAmount,
        Status: 2, //pending - investmentstatus table
        IsConfirmed: this.InvestorTerms
      }
      if (this.InvestmentId == 0) {
        this.investmentService.CreateInvestment(invest).subscribe(data => {
          let x: any = data;
          if (x.statusCode != 0) {
            this.InvestmentId = x.statusCode;
            this.DiligenceShow = false;
            this.InvestShow = false;
            this.ESignShow = true;
            this.FundInvestmentShow = false;
            this.investdone = true;
            this.esignshow = true;
            // this.toastr.success(x.message, 'Success!')
            this.Loader = false;
          }
          else {
            this.toastr.error(x.message, 'Error!')
            this.Loader = false;
          }
        })
      }
      else {
        this.investmentService.UpdateInvestment(invest).subscribe(data => {
          let x: any = data;
          if (x.statusCode != 0) {
            this.InvestmentId = x.statusCode;
            this.DiligenceShow = false;
            this.InvestShow = false;
            this.ESignShow = true;
            this.FundInvestmentShow = false;
            this.investdone = true;
            this.esignshow = true;
            // this.toastr.success(x.message, 'Success!')
            this.Loader = false;
          }
          else {
            this.toastr.error(x.message, 'Error!')
            this.Loader = false;
          }
        })
      }
    }
  }
  EsignNext() {
    this.Loader = true;
    // let invest = {
    //   Id: this.InvestmentId,
    //   UserId: this.UserId,
    //   OfferingId: this.token,
    //   Status: 3,
    //   IsConfirmed: this.InvestorTerms,
    //   IseSignCompleted : this.EsignCheckDisabled
    // }
    // this.investmentService.UpdateInvestment(invest).subscribe(data => {
    //   let x: any = data;
    //   if (x.statusCode == 1) {
    //     this.EsignSkip();
    //   }
    // })
    if (this.filesToUpload?.length > 0) {
      const formData = new FormData();
      this.filesToUpload.forEach((item: string | Blob) => {
        formData.append('files', item);
      });
      formData.append('AdminUserId', this.UserId);
      formData.append('UserId', this.UserId);
      formData.append('InvestmentId', this.token);
      this.investmentService.UpdateESign(formData).subscribe(data => {
        if (data == true) {
          this.EsignSkip();
        }
      })
    }
  }

  GetInvestmentByTab() {
    this.investmentService.GetInvestmentDetailsById(this.UserId, this.Offeringtoken).subscribe(data => {
      this.InvestmentTab = data;
      this.InvestorTerms = this.InvestmentTab.isConfirmed
      this.InvestingProfile = this.InvestmentTab.userProfileId
      this.InvestmentAmount = this.InvestmentTab.amount
      this.InvestmentId = this.InvestmentTab.id
      this.WireTransferDate = this.InvestmentTab.wireTransferDate;
      this.StepNavShow = true;
      if (this.InvestmentTab.isConfirmed == false) {
        this.DiligenceShow = true;
        this.InvestShow = false;
        this.ESignShow = false;
        this.FundInvestmentShow = false;
        this.Loader = false;
      }
      else if (this.InvestmentTab.iseSignCompleted == false && this.OfferingtokenName == 'esign') {
        this.DiligenceShow = false;
        this.InvestShow = false;
        this.ESignShow = true;
        this.FundInvestmentShow = false;
        this.diligencedone = true;
        this.investdone = true;
        this.esignshow = true;
        this.Loader = false;
      }
      else if (this.InvestmentTab.wireTransferDate == null && this.OfferingtokenName == 'fund') {
        this.DiligenceShow = false;
        this.InvestShow = false;
        this.ESignShow = false;
        this.FundInvestmentShow = true;
        this.diligencedone = true;
        this.investdone = true;
        this.esigndone = true;
        this.fundshow = true;
        this.Loader = false;
      }
    })
  }
  EsigncheckValue(e: any) {
    // this.EsignCheck = e.target.value
    if (this.EsignCheck == true) {
      this.EsignCheckDisabled = true;
    }
    else {
      this.EsignCheckDisabled = false;
    }
  }
  EsignSkip() {
    this.DiligenceShow = false;
    this.InvestShow = false;
    this.ESignShow = false;
    this.FundInvestmentShow = true;
    this.esigndone = true;
    this.Loader = false
  }
  onFundInvestmentSubmit() {
    this.Loader = true;
    if (this.WireTransferDate == null) {
      this.Loader = false;
    }
    else {
      let invest = {
        Id: this.InvestmentId,
        UserId: this.UserId,
        OfferingId: this.token,
        Status: 2,
        IsConfirmed: this.InvestorTerms,
        WireTransferDate: this.WireTransferDate,
        ModeofTransfer: +this.wireTransfer
      }
      this.investmentService.UpdateInvestment(invest).subscribe(data => {
        let x: any = data;
        if (x.statusCode != 0) {
          this.funddone = true;
          if(this.Offeringtoken != null && this.Offeringtoken != NaN && this.Offeringtoken == 'undefined'){
            this.router.navigate(['./../../../../myinvestment'], { relativeTo: this.route });
          }
          else{
            this.router.navigate(['./../../myinvestment'], { relativeTo: this.route });
          }
          this.toastr.success(x.message, 'Success!')
          this.Loader = false;
        }
        else {
          this.Loader = false;
        }
      })
    }
  }

  numberValidation(event: any): Boolean {
    if (event.keyCode >= 48 && event.keyCode <= 57)
      return true;
    else
      return false;
  }
  GetChooseProfile() {
    this.profileService.GetChooseProfile().subscribe(data => {
      this.ChooseProfileValue = data
    })
  }

  GetUserById() {
    this.profileService.GetUserById(this.UserId).subscribe(data => {
      this.UserData = data;
    })
  }
  onDownloadFile(value: any) {
    var a = document.createElement('a');
    a.href = value.filePath;
    a.download = value.name;
    a.click();
  }

  GetFundingDetails() {
    this.investmentService.GetFundinginstructiondetails(this.token).subscribe(data => {
      this.FundingDataDetails = data;
      if (this.FundingDataDetails != null) {
        if (this.FundingDataDetails.fundingType == 3) {
          this.wireTransferDetailsBool = true;
        }
        else if (this.FundingDataDetails.fundingType == 1) {
          this.wireTransferDetailsBool = false;
          this.WireTransferBool = true;
          this.MailCheckBool = false;
          this.wireTransfer = 1;
        }
        else if (this.FundingDataDetails.fundingType == 2) {
          this.wireTransferDetailsBool = false;
          this.WireTransferBool = false;
          this.MailCheckBool = true;
          this.wireTransfer = 2;
        }
      }
      else {
        this.wireTransfer = 0;
      }

    })
  }
  receiveMessage(e: any) {
    this.ProfileValue = [];
    this.ProfileValue.push({ id: 0, name: 'Select', active: true })
    for (let i = 0; i < e.length; i++) {
      if (e[i].name != null) {
        this.ProfileValue.push({ id: e[i].id, name: e[i].name, active: e[i].active })
      }
      else if (e[i].firstName != null) {
        this.ProfileValue.push({ id: e[i].id, name: e[i].firstName, active: e[i].active })
      }
      else if (e[i].trustName != null) {
        this.ProfileValue.push({ id: e[i].id, name: e[i].trustName, active: e[i].active })
      }
      else if (e[i].retirementPlanName != null) {
        this.ProfileValue.push({ id: e[i].id, name: e[i].retirementPlanName, active: e[i].active })
      }
    }
  }

  onDownloadAll(data: any) {
    this.DownloadDoc = [];
    this.createZip(data, 'Investment_Document')

  }

  async createZip(files: any[], zipName: string) {
    this.Loader = true;
    const zip = new JSZip();
    const name = zipName + '.zip';
    for (let i = 0; i < files.length; i++) {
      const element = files[i];
      const fileData: any = await this.getFile(element);
      const b: any = new Blob([fileData], { type: '' + fileData.type + '' });
      zip.file(element.filePath.substring(element.filePath.lastIndexOf('/') + 1), b);
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
    const res = await this.httpClient.get(d.filePath, httpOptions).toPromise().catch((err: HttpErrorResponse) => {
      const error = err.error;
      return error;
    });
    return res;
  }

  onWireTransfer() {
    if (this.wireTransfer == "1") {
      this.WireTransferBool = true;
      this.MailCheckBool = false;
    }
    else if (this.wireTransfer == "2") {
      this.MailCheckBool = true;
      this.WireTransferBool = false;
    }
    else {
      this.MailCheckBool = false;
      this.WireTransferBool = false;
    }
  }

  selectFiles(event: any) {
    for (var i = 0; i < event.target.files.length; i++) {
      let ext: any;
      this.filesToUpload = [];
      this.files = [];
      this.allowedFileExtensions.forEach((element: any) => {
        if (element == event.target.files[i].name.split('.').pop()) {
          this.filesToUpload.push(event.target.files[i]);
          ext = null;
          ext = event.target.files[i].name.split('.').pop();
          var temp: any = {};
          var Extension = '';
          var name = '';
          name = event.target.files[i].name.split('.')[0];
          Extension = event.target.files[i].name.split('.').pop();
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

  printPage() {
    var divContents = document.getElementById("fundingdetails")?.innerHTML;
    // printWindow.document.write('<html><head><title>Print DIV Content</title>');
    // printWindow.document.write('</head><body >');
    var printWindow: any = window.open('', '', 'height=auto,width=auto');
    printWindow.document.write(divContents);
    printWindow.document.close();
    printWindow.print();
  }

  onEmail(){
    this.EmailPopup = true;
  }

  onSend(){
    this.Loader = true;
    this.investmentService.PrintFundingInstruction(this.Offeringtoken).subscribe(data =>{
      if(data == true){
        this.toastr.success("Email sent successfully",'Success!');
      }
      else{
        this.toastr.error("Email can't be sent","Error!")
      }
      this.EmailPopup = false;
      this.Loader = false;
    })
  }

}
