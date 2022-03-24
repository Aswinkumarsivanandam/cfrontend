import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../account/account.service';
import { DistributionService } from '../distributions/distribution.service';
import { DocumentService } from '../documents/document.service';
import { InvestorProfileService } from '../investor-profile/investor-profile.service';
import { LeadService } from '../lead/lead.service';
import { InvestorService } from './investor.service';
import { InvestService } from '../invest/invest.service';
import { Thumbs } from 'swiper';
import { elementAt } from 'rxjs-compat/operator/elementAt';
import { FileHandle } from '../documents/file.directive';
import { AddProfileComponent } from '../add-profile/add-profile.component';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { AddReservationComponent } from '../add-reservation/add-reservation.component';
import { AddInvestmentComponent } from '../add-investment/add-investment.component';
import { AccountStatementComponent } from '../account-statement/account-statement.component';

@Component({
  selector: 'app-investor',
  templateUrl: './investor.component.html',
  styleUrls: ['./investor.component.css']
})
export class InvestorComponent implements OnInit {
  @ViewChild(AccountStatementComponent) accountStatementComponent: any;
  @Output() messageEvent = new EventEmitter<string>();
  @ViewChild(AddProfileComponent) ProfileValueData: any = [];
  Profile: any;
  config: any;
  InvestorDetailsData: any = [];
  InvestorDetails: any = [];
  TagInvestors: any = [];
  SelectAllCheckbox: boolean = false;
  TagDetailsList: any = [];
  ChooseBool: boolean = false;
  AddTagPopup: boolean = false;
  TagName: any;
  TagDetails: any = [];
  TagDetails1: any = [];
  dropdownSettings: any = {};
  ShowFilter = false;
  selectedItems: any = [];
  selectedMultiTagItems: any = [];
  MultiTag: any = [];
  disabled = false;
  Tagdetail: any = [];
  TagDetailsId: any = 0;
  UserId: any;
  TagUserId: any;
  Loader: boolean = false;
  TagId: any = 0;
  NotePopup: boolean = false;
  TableView: boolean = false;
  InvestorNotes: any;
  DocumentTypes: any = [];
  DocumentTypeId: any = 0;
  DocumentProfileId: any = 0;
  DocumentUserId: any = 0;
  NameDelimiters: any = [];
  NameDelimiterId: any = 0;
  NamePositions: any = [];
  NamePositionId: any = 0;
  NameSeparators: any = [];
  NameSeparatorId: any = 0;
  UploadFile: boolean = false;
  batchName: any;
  batchStatus: any = 1;
  batchNameError: boolean = false;
  delimiterSeparatorError: boolean = false;
  delimiterError: boolean = false;
  namePositionError: boolean = false;
  nameSeparatorError: boolean = false;
  documentTypeError: boolean = false;
  ReservationId: any = 0;
  InvestmentId: any = 0;
  ReservationActive: boolean = true;
  WriteNoteBool: boolean = false;
  TagDetailsViewPopup: boolean = false;
  DeleteTagInvestorsPopup: boolean = false;
  TagDeleteButton: boolean = false;
  MultiTagDeleteButton: boolean = false;
  InvestorData: any = [];
  EditBool: boolean = false;
  InvestorNoteId: any;
  EditInvestorNoteId: any;
  InvestorEmpty: boolean = false;
  ShowBulkDocumentUpload: boolean = false;
  ShowDocumentBatchDetail: boolean = false;
  BulkDocumentUploadPopUp: boolean = false;
  PublishDocumentsConfirmPopup: boolean = false;
  DocumentBatches: any = [];
  ArchiveShow: boolean = false;
  FirstnameError: boolean = false;
  LastnameError: boolean = false;
  AddEmailError: boolean = false;
  validEmail: boolean = false;
  AccreditedInvestor: any = [
    { id: 0, value: 'Select' },
    { id: 1, value: 'Yes' },
    { id: 2, value: 'No' },
  ];
  LookingInvest: any = [
    { id: 0, value: 'Select' },
    { id: 1, value: 'Less than $10,000' },
    { id: 2, value: '$10,000 to $50,000' },
    { id: 3, value: '$50,000 to $100,000' },
    { id: 4, value: '$100,000 to $250,000' },
    { id: 5, value: 'More than $250,000' },
  ];
  verifyuser: boolean = false;
  VerifyAccountBool: boolean = false;
  VerifyAccreditBool: boolean = false;
  Accreditverifyuser: boolean = false;
  ShowHeaderSummary: boolean = true;
  InvestorsHeaderSummary: any;
  Investors: any = [];
  InvestorId: any;
  AddEditReservationPopup: boolean = false;
  MinInvestment: any = 0;
  ProfileValue: any = [];
  ReservationListId: any = 0;
  ReservationList: any = [];
  OfferingList: any = [];
  ProfilePopup: boolean = false;
  ChooseProfileValue: any = [];
  Chooseprofile: any = '1';
  IRAForm: any;
  LLCForm: any;
  IndividualForm: any;
  TrustForm: any;
  JointForm: any;
  RetirementForm: any;
  IRAShow: boolean = false;
  LLCShow: boolean = false;
  Individualhow: boolean = false;
  TrustShow: boolean = false;
  JointShow: boolean = false;
  RetirementShow: boolean = false;
  IranameError: boolean = false;
  LlcnameError: boolean = false;
  StateProvinceId: any = '0'
  StateProvinceId1: any = '0'
  Iraname: any;
  StateorProvince: any;
  CountryStateShow: boolean = false;
  StateError: boolean = false;
  Province: any = [];
  USAddressError: boolean = false;
  CheckProvince: any = [];
  TaxError: boolean = false;
  Llcname: any;
  DisregardedEntity: any = null;
  Disregardedentity: any = '0';
  IRALLC: any = null;
  Irallc: any = '0';
  Firstname: any;
  Lastname: any;
  Trustname: any;
  TrustnameError: boolean = false;
  Registrationname: any;
  RegistrationnameError: boolean = false;
  ArrayForm: any = [];
  FirstName: any;
  ArrayFirstnameError: boolean = false;
  LastName: any;
  ArrayLastnameError: boolean = false;
  ArrayEmail: boolean = false;
  ArrayvalidEmail: boolean = false;
  ArrayPhone: any;
  ArrayPhonelength: boolean = false;
  ArrayEmailValue: any;
  ArrayPhoneEmpty: boolean = false;
  Retirementname: any;
  RetirementnameError: boolean = false;
  Titlesignor: any;
  TitlesignorError: boolean = false;
  DistributionMethodId: any;
  Distributionmethod: any;
  BankAccountId: any = 0;
  CheckForm: any;
  OtherDetails: any;
  ACHBool: boolean = false;
  CheckBool: boolean = false;
  OtherBool: boolean = false;
  DistrubutionId: any = '0';
  DistributionValue: any = [];
  BankDetails: any = [];
  BankDetailsData: any = [];
  StreetBool: boolean = false;
  CityBool: boolean = false;
  ZipcodeBool: boolean = false;
  profile: any;
  ProfileId: any = 0;
  BankId: any = 0;
  DeleteBankPopup: boolean = false;
  BankPopup: boolean = false;
  BankTitleShow: boolean = false;
  BanknameError: boolean = false;
  AccounttypeError: boolean = false;
  RoutingnumberError: boolean = false;
  RoutingnumberLength: boolean = false;
  ConfirmroutingnumberError: boolean = false;
  ConfirmRoutingMatch: boolean = false;
  Accountnumber: any;
  AccountnumberError: boolean = false;
  Confirmaccountnumber: any;
  ConfirmaccountnumberError: boolean = false;
  ConfirmAccountMatch: boolean = false;
  BankForm: any;
  Accounttype: any = 0;
  Bankname: any;
  Routingnumber: any;
  Confirmroutingnumber: any;
  ExistProfileShow: boolean = false;
  ExistProfileHide: boolean = false;
  UserData: any;
  ConfidenceLevelId: any = 0;
  InvestorparentMessage: any;
  ConfidenceLevel: any = [
    { id: 0, value: 'Select' },
    { id: 1, value: 'Very Likely' },
    { id: 2, value: 'Likely' },
    { id: 3, value: 'Unlikely' }
  ];
  InvestmentStatus: any = [
    { id: 0, value: 'Select' },
    { id: 1, value: 'Approved' },
    { id: 2, value: 'Pending' },
    { id: 5, value: 'Waitlisted' },
    { id: 6, value: 'Declined' },
    { id: 7, value: 'Ownership Sold' },
  ];

  AddEditData: any = 'edit';
  IsAddReservationPopup: any = false;
  IsEditReservationPopup: any = false;
  ShowProfileDetail: any = false;
  allowedFileExtensions: any = [];
  DocumentFile: any = [];
  DocumentBatchDetail: any = [];
  filesToUpload: any = [];
  userProfiles: any = [];
  MatchedDocuments: any = [];
  FinalMatchedDocuments: any = [];
  TotalDocuments: any = 0;
  TotalMatched: any = 0;
  TotalUnmatched: any = 0;
  files: FileHandle[] = [];
  BatchId: any = 0;
  TypeId: any = 0;
  DocSizeBool: boolean = false;
  DocSizeCount: any = 0;
  BulkUploadStepNavigation: boolean = false;
  uploadFilesShow: any = true;
  uploadFilesDone: any = false;
  matchShow: any = false;
  matchDone: any = false;
  reviewShow: any = false;
  reviewDone: any = false;
  publishShow: any = false;
  publishDone: any = false
  DocumentProfiles: any = [];
  remoteWindow: Window | undefined;
  uploadFile: boolean = false;
  removedoc: any = [];
  reviewFilePath: any = [];
  pdfUrl: any;
  ReviewDocumentViewPopup: boolean = false;
  AccountStatementPopup: boolean = false;
  AccountStatementArray: any = [];
  AccountStatementDataValue: any;
  DocumentData: any = [];
  showSendEmail : boolean = false;

  constructor(private investorService: InvestorService,
    private investService: InvestService,
    private profileService: InvestorProfileService,
    private leadService: LeadService,
    private formBuilder: FormBuilder,
    private documentService: DocumentService,
    private distributionService: DistributionService,
    private accountService: AccountService,
    private toastr: ToastrService, private route: ActivatedRoute, private router: Router
  ) {
    this.config = {
      itemsPerPage: 25,
      currentPage: 1,
      totalItems: this.InvestorDetails.length
    };
  }

  ngOnInit(): void {
    this.Loader = true;
    localStorage.removeItem("InvestorId");
    this.allowedFileExtensions = ['pdf'];
    this.UserId = Number(localStorage.getItem("UserId"));
    this.GetInvestor();
    this.GetTag();
    this.GetTagForMultiSelect();
    this.GetProfile();
    this.GetReservationList();
    this.GetOfferingList();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: this.ShowFilter
    };
    this.AddEditData = 'edit';
  }
  GetInvestorsSummaryHeader() {
    this.investorService.GetInvestorsHeadingSummary().subscribe(data => {
      this.InvestorsHeaderSummary = data;
      this.Loader = false
    })
  }
  GetInvestor() {
    this.investorService.GetInvestor().subscribe(data => {
      this.InvestorDetailsData = data;
      this.InvestorDetails = data;
      console.log("investr",this.InvestorDetails);
      this.GetInvestorsSummaryHeader();
    })
  }

  OnAddNewProfile() {

  }

  FilterLead(e: any) {
    let x = e.target.value
    this.InvestorDetails = [];
    if (x == null || x == '') {
      this.InvestorDetails = this.InvestorDetailsData;
    } else {
      this.InvestorDetailsData.forEach((element: { fullName: string; emailId: string; phoneNumber: string; }) => {
        if (element.fullName.toLowerCase().includes(x.toLowerCase())
          || element.emailId.toLowerCase().includes(x.toLowerCase())
          || element.phoneNumber.toLowerCase().includes(x.toLowerCase())) {
          this.InvestorDetails.push(element);
        }
      });
    }
  }
  onChooseDataPerPage(event: any) {
    if (+event.target.value == 0) {
      this.config.itemsPerPage = 50
    }
    else {
      this.config.itemsPerPage = +event.target.value
    }
  }
  pageChanged(event: any) {
    this.config.currentPage = event;
    this.TagDetailsList = [];
  }
  onItemSelect(item: any) {
    // this.selectedItems.push({ item });
    this.selectedItems.push({id : item.id,name : item.name})
  }
  SelectAll(event: any) {
    const checked = event.target.checked;
    if (event.target.checked) {
      this.InvestorDetails.forEach((item: { selected: any; }) => item.selected = checked);
      for (let i = 0; i < this.InvestorDetails.length; i++) {
        // this.DeleteArray.push({ Id: this.InvestorDetails[i].id })
        this.TagDetailsList.push({ Id: 0, TagId: 0, UserId: this.InvestorDetails[i].id, Active: true })
        // this.ResendInviteArray.push(this.LeadDetails[i])
      }
    }
    else {
      this.InvestorDetails.forEach((item: { selected: any; }) => item.selected = checked);
      this.TagDetailsList = [];
    }
    if (this.TagDetailsList.length == 0) {
      this.ChooseBool = true;
    }
    else {
      this.ChooseBool = false;
    }
  }
  Select(e: any, e1: any) {
    // this.Tagdetail = [];
    var tagList = [];
    if (e1.target.checked) {
      this.TagDetailsList.push({ Id: 0, TagId: 0, UserId: e.id, Active: true })
    }
    else {
      this.TagDetailsList = this.TagDetailsList.filter((x: { UserId: any; }) => x.UserId != e.id)
    }
    if (this.TagDetailsList.length == 0) {
      this.ChooseBool = true;
    }
    else {
      this.ChooseBool = false;
    }
    tagList = e.tags;
    console.log("tagLIst",this.Tagdetail);
    for (var i=0; i<tagList.length; i++){
      if(this.Tagdetail.length > 0){
      var id = tagList[i].id;
      let x = this.Tagdetail.filter((x: { id: any; }) => x.id == id)
      if(x[0])
      {
        console.log("true22",x[0]);
      }
      else{
        this.Tagdetail.push ({
          'id' : tagList[i].id,
          'name' : tagList[i].name
          })
      }
      }
      else{
        this.Tagdetail.push ({
        'id' : tagList[i].id,
        'name' : tagList[i].name
        })
      }
      }
      this.selectedItems = this.Tagdetail;
      // console.log("selectedItems",this.selectedItems);
    console.log("Tagdetail",this.Tagdetail);
  }
  onAddTag() {
    if (this.TagDetailsList.length == 0) {
      this.toastr.info("Please select any row from the table", "Info!")
      this.ChooseBool = true;
    }
    else {
      this.AddTagPopup = true;
      this.TagDetailsId = 0;
      this.TagName = ''
    }
  }
  GetTag() {
    this.investorService.GetInvestorTag(this.UserId).subscribe(data => {
      let x = { id: 0, name: 'Select Tag', active: true }
      this.TagDetails = data;
      this.TagDetails.unshift(x);
      this.Loader = false;
    })
  }
  GetTagForMultiSelect() {
    this.investorService.GetInvestorTag(this.UserId).subscribe(data => {
      this.TagDetails1 = data;
      this.Loader = false;
    })
  }
  onSaveTag() {
    this.Loader = true;
    // if (this.TagName == null || this.TagName == '') {
    //   this.Loader = false;
    // }
    if (this.selectedItems.length > 0) {
      for (let i = 0; i < this.selectedItems.length; i++) {
        // this.TagId = this.selectedItems[i].item.id;
        // this.TagName = this.selectedItems[i].item.name;
        this.TagId = this.selectedItems[i].id;
        this.TagName = this.selectedItems[i].name;
        // let Tag = {
        //   Id: this.TagId != 0 ? this.TagId : 0,
        //   AdminUserId: this.UserId,
        //   Name: this.TagName,
        //   Active: true,
        //   tagDetails: this.TagDetailsList
        // }
        this.MultiTag.push({
          Id: this.TagId != 0 ? this.TagId : 0, AdminUserId: this.UserId,
          Name: this.TagName, Active: true,
          tagDetails: this.TagDetailsList
        });
      }
      console.log("multitag",this.MultiTag);
      this.investorService.UpdateMultipleInvestorTag(this.MultiTag).subscribe(data => {
        if (data) {
          this.AddTagPopup = false;
          this.selectedItems = [];
          this.MultiTag = [];
          this.TagDetailsList = [];
          this.Tagdetail = [];
          this.GetInvestor();
          this.Loader = false;
        }
      })
    }
    // this.Loader = false;
    // else {
    //   let x = this.TagDetails.filter((x: { name: any; }) => x.name == this.TagName)
    //   if (x.length > 0) {
    //     this.TagId = x[0].id;
    //   }
    //   else {
    //     this.TagId = 0;
    //   }
    //   let Tag = {
    //     Id: this.TagId != 0 ? this.TagId : 0,
    //     AdminUserId: this.UserId,
    //     Name: this.TagName,
    //     Active: true,
    //     tagDetails: this.TagDetailsList
    //   }
    //   if (this.TagId == 0) {
    //     this.investorService.AddInvestorTag(Tag).subscribe(data => {
    //       if (data == true) {
    //         this.AddTagPopup = false;
    //         this.TagDetailsList = [];
    //         this.InvestorDetails.forEach((item: { selected: any; }) => item.selected = false);
    //         this.TagDetailsId = 0;
    //         this.GetTag();
    //         this.TagDetailsId = 0;
    //       }
    //       else {
    //         this.AddTagPopup = false;
    //         this.TagDetailsList = [];
    //         this.InvestorDetails.forEach((item: { selected: any; }) => item.selected = false);
    //         this.TagDetailsId = 0;
    //         this.Loader = false;
    //       }
    //     })
    //   }
    //   else if (this.TagId != 0) {
    //     this.investorService.UpdateInvestorTag(Tag).subscribe(data => {
    //       if (data == true) {
    //         this.AddTagPopup = false;
    //         this.TagDetailsList = [];
    //         this.TagDetailsId = 0;
    //         this.InvestorDetails.forEach((item: { selected: any; }) => item.selected = false);
    //         this.TagDetailsId = 0;
    //         this.GetTag();
    //       }
    //       else {
    //         this.AddTagPopup = false;
    //         this.TagDetailsList = [];
    //         this.TagDetailsId = 0;
    //         this.InvestorDetails.forEach((item: { selected: any; }) => item.selected = false);
    //         this.Loader = false;
    //       }
    //     })
    //   }
    // }
  }
  onCreateTag() {
    this.Loader = true;
    var tagName = this.TagName;
    if (this.TagName) {
      let Tag = {
            Id: 0,
            AdminUserId: this.UserId,
            Name: this.TagName,
            Active: true,
            tagDetails: this.TagDetailsList
          }
            this.investorService.AddInvestorTag(Tag).subscribe(data => {
            if(data){
              console.log("data",data);
              this.GetInvestor();
            }
            });
    }
    this.TagDetailsList = [];
    this.Loader = false;
    this.AddTagPopup = false;
  }
  
  onChooseTags(e: any) {
    let a = +e.target.value
    if (a == 0) {
      this.InvestorDetails = this.InvestorDetailsData;
    }
    else {
      let x = this.TagDetails.filter((x: { id: any; }) => x.id == a)
      let b = x[0].tagDetails;
      this.InvestorDetails = [];
      for (let i = 0; i < b.length; i++) {
        let c = this.InvestorDetailsData.filter((x: { id: any; }) => x.id == b[i].userId)
        if (c.length > 0) {
          this.InvestorDetails.push(c[0])
        }
      }
    }
  }


  OnBulkUploadStepNavigationBack() {
    this.ShowBulkDocumentUpload = true;
    this.ShowDocumentBatchDetail = true;
    this.BulkUploadStepNavigation = false;
    this.DocumentTypeId = 0;
    this.NameDelimiterId = 0;
    this.NamePositionId = 0;
    this.NameSeparatorId = 0;
    this.batchName = '';
    this.ShowHeaderSummary = false;
    this.ShowBulkDocumentUpload = true;
    this.ShowDocumentBatchDetail = true;
    this.Loader = true;
    this.investorService.GetAllDocumentBatches().subscribe(data => {
      this.DocumentBatches = data;
      this.Loader = false;
    });
  }
  onDocumentProfileChange(id: any) {
    this.DocumentProfileId = id;
  }
  onDocumentTypeChange(e: any) {
    this.DocumentTypeId = +e.target.value;
    if (this.DocumentTypeId == 0) {
      this.documentTypeError = true;
    }
    else {
      this.documentTypeError = false;
    }
  }
  onNameDelimiterChange(e: any) {
    this.NameDelimiterId = +e.target.value;
  }
  onNamePositionChange(e: any) {
    this.NamePositionId = +e.target.value;
  }
  onNameSeparatorChange(e: any) {
    this.NameSeparatorId = +e.target.value;
  }
  GetDocumentTypes() {
    this.DocumentTypes = [];
    this.investorService.GetDocumentTypes().subscribe(data => {
      let x: any = data
      this.DocumentTypes.push({ id: 0, name: 'Select', active: true })
      for (let i = 0; i < x.length; i++) {
        this.DocumentTypes.push({ id: x[i].id, name: x[i].name, active: x[i].active })
      }
    })
  }
  GetDocumentNameSeparators() {
    this.NameSeparators = [];
    this.investorService.GetDocumentNameSeparators().subscribe(data => {
      let x: any = data
      this.NameSeparators.push({ id: 0, name: 'Select', active: true })
      for (let i = 0; i < x.length; i++) {
        this.NameSeparators.push({ id: x[i].id, name: x[i].name, active: x[i].active })
      }
    })
  }
  GetDocumentNameDelimiters() {
    this.NameDelimiters = [];
    this.investorService.GetDocumentNameDelimiters().subscribe(data => {
      let x: any = data
      this.NameDelimiters.push({ id: 0, name: 'Select', active: true })
      for (let i = 0; i < x.length; i++) {
        this.NameDelimiters.push({ id: x[i].id, name: x[i].name, active: x[i].active })
      }
    })
  }
  GetDocumentNamePositions() {
    this.NamePositions = [];
    this.investorService.GetDocumentNamePositions().subscribe(data => {
      let x: any = data
      this.NamePositions.push({ id: 0, name: 'Select', active: true })
      for (let i = 0; i < x.length; i++) {
        this.NamePositions.push({ id: x[i].id, name: x[i].name, active: x[i].active })
      }
    })
  }
  OnBulkDocumentPopupCancel() {
    this.BulkDocumentUploadPopUp = false;
    this.batchNameError = false;
    this.delimiterError = false;
    this.namePositionError = false;
    this.documentTypeError = false;
    this.nameSeparatorError = false;
    this.delimiterSeparatorError = false;
    this.batchName = '';
    this.DocumentTypeId = 0;
    this.NameDelimiterId = 0;
    this.NamePositionId = 0;
    this.NameSeparatorId = 0;
  }
  OnBulkDocumentPopupNext() {
    if (this.batchName == "" || this.batchName == null) {
      this.batchNameError = true;
    }
    else {
      this.batchNameError = false;
    }

    if (this.DocumentTypeId == 0) { this.documentTypeError = true; }
    else { this.documentTypeError = false; }

    if (this.NameDelimiterId == 0) { this.delimiterError = true; }
    else { this.delimiterError = false; }

    if (this.NameSeparatorId == 0) { this.nameSeparatorError = true; }
    else { this.nameSeparatorError = false; }

    if (this.NamePositionId == 0) { this.namePositionError = true; }
    else { this.namePositionError = false; }

    if (this.batchNameError || this.documentTypeError || this.delimiterError || this.nameSeparatorError || this.namePositionError) {
      this.BulkDocumentUploadPopUp = true;
    }
    else if (this.NameDelimiterId == this.NameSeparatorId) {
      this.delimiterSeparatorError = true;
    }
    else {
      this.BulkDocumentUploadPopUp = false;
      this.delimiterSeparatorError = false;
      this.ShowHeaderSummary = false;
      this.ShowBulkDocumentUpload = false;
      this.ShowDocumentBatchDetail = false;

      this.UploadFile = true;
      this.DocumentFile = [];
      this.DocSizeBool = false;
      this.DocSizeCount = 0;
      this.BulkUploadStepNavigation = true;
      this.ShowBulkDocumentUpload = false;
      this.ShowDocumentBatchDetail = false;
    }
  }

  onFileChange(files: FileHandle[]) {
    for (var i = 0; i < files.length; i++) {
      let ext: any;
      this.allowedFileExtensions.forEach((element: any) => {
        if (element == files[i].file.name.split('.').pop()) {
          this.DocumentFile.push({ Id: this.DocumentFile.length * -1, File: files[i].file });
          this.filesToUpload.push(files[i].file);
        }
      });
      const reader = new FileReader();
      reader.readAsDataURL(files[i].file)
      reader.onload = () => {
        this.reviewFilePath.push(reader.result?.toString());
      }
    }
    for (let i = 0; i < this.DocumentFile.length; i++) {
      let size = this.DocumentFile[i].File.size / (1024 * 1024)
      if (size < 100) {
        this.DocSizeBool = false;
      }
      else {
        this.DocSizeBool = true;
        this.DocSizeCount = this.DocSizeCount + 1
      }
    }
    if (this.DocSizeCount > 0) {
      this.DocSizeBool = true;
    }
  }
  onFileChange1(event: any) {
    for (var i = 0; i < event.target.files.length; i++) {
      let ext: any;
      this.allowedFileExtensions.forEach((element: any) => {
        if (element == event.target.files[i].name.split('.').pop()) {
          this.filesToUpload.push(event.target.files[i]);
          this.DocumentFile.push({ Id: this.DocumentFile.length * -1, File: event.target.files[i] });
        }
      });
    }
    for (let i = 0; i < this.DocumentFile.length; i++) {
      let size = this.DocumentFile[i].File.size / (1024 * 1024)
      if (size < 100) {
        this.DocSizeBool = false;
      }
      else {
        this.DocSizeBool = true;
        this.DocSizeCount = this.DocSizeCount + 1
      }
    }
    if (this.DocSizeCount > 0) {
      this.DocSizeBool = true;
    }
  }
  OnRemoveDoc(id: any) {
    this.DocSizeCount = 0;
    this.removedoc = this.DocumentFile.filter((x: { Id: any; }) => x.Id == id)
    this.DocumentFile = this.DocumentFile.filter((x: { Id: any; }) => x.Id != id)
    this.filesToUpload = this.filesToUpload.filter((x: { name: any; }) => x.name != this.removedoc[0].File.name)
    this.DocSizeBool = false;
    for (let i = 0; i < this.DocumentFile.length; i++) {
      let size = this.DocumentFile[i].File.size / (1024 * 1024)
      if (size < 100) {
        this.DocSizeBool = false;
      }
      else {
        this.DocSizeBool = true;
        this.DocSizeCount = this.DocSizeCount + 1
      }
    }
    if (this.DocSizeCount > 0) {
      this.DocSizeBool = true;
    }
    else {
      this.DocSizeBool = false;
      this.DocSizeCount = 0;
    }
  }
  onDeleteDocument(e: any) {
    let documentId = e.documentId;
    this.investorService.DeleteDocument(this.UserId, this.BatchId, documentId).subscribe(data => {
      this.investorService.GetDocumentBatchDetail(this.BatchId).subscribe(data => {
        this.DocumentBatchDetail = data;
        this.DocumentTypeId = this.DocumentBatchDetail.documentType;
        this.batchName = this.DocumentBatchDetail.batchName;
        this.batchStatus = this.DocumentBatchDetail.status;
        this.FinalMatchedDocuments = [];
        this.FinalMatchedDocuments = this.DocumentBatchDetail.documents;
      })
      this.uploadFilesShow = false;
      this.uploadFilesDone = true;
      this.matchDone = true; this.matchShow = false;
      this.reviewDone = true; this.reviewShow = false;
      this.publishDone = true; this.publishShow = true;
    });
  }
  onEditDocument(e: any) { }
  onReviewDocuments() {
    this.uploadFilesShow = false;
    this.uploadFilesDone = true;
    this.matchShow = false;
    this.matchDone = true;
    this.reviewShow = true;
  }
  onDocumentUserChange(id: any) {
    if (id != 0 || id != 'undefined') {
      this.profileService.GetProfileById(id).subscribe(data => {
        this.DocumentProfiles = data;
        this.DocumentUserId = id;
      });
    }
  }
  onSaveandUpload() {
    if (this.DocumentFile.length <= 100 && this.DocumentFile.length > 0 && this.DocSizeBool == false) {
      this.Loader = true;
      const UploadDoc = new FormData();
      UploadDoc.append("Id", this.BatchId);
      UploadDoc.append("AdminUserId", this.UserId);
      UploadDoc.append("BatchName", this.batchName);
      UploadDoc.append("Status", "1");// this.batchStatus);
      UploadDoc.append("TotalDocuments", this.DocumentFile.length);
      UploadDoc.append("DocumentType", this.DocumentTypeId);
      UploadDoc.append("NameDelimiter", this.NameDelimiterId);
      UploadDoc.append("NamePosition", this.NamePositionId);
      UploadDoc.append("NameSeparator", this.NameSeparatorId);
      let Documents: any = [];
      this.filesToUpload.forEach((item: string | Blob) => {
        UploadDoc.append("Files", item);
      });
      this.investorService.BulkDocumentUpload(UploadDoc).subscribe(data => {
        if (data != null) {
          this.MatchedDocuments = data;
          this.TotalDocuments = this.filesToUpload.length;
          this.TotalMatched = this.MatchedDocuments.filter((x: { isMatchfound: any; }) => x.isMatchfound == true).length;
          this.TotalUnmatched = this.TotalDocuments - this.TotalMatched;
          this.UploadFile = false;
          this.BatchId = this.MatchedDocuments[0].batchId;
          this.uploadFilesShow = true;
          this.uploadFilesDone = true;
          this.matchShow = true;
          this.GetInvestor();
          this.Loader = false;
        }
      })
    }
  }

  onPublishDocuments(e: any) {
    let batchId = 0;
    let count = 0;
    this.Loader = true;
    if (this.filesToUpload.length <= 100 && this.filesToUpload.length > 0) {
      this.FinalMatchedDocuments = [];
      const UploadDoc = new FormData();
      let matchedFiles: any = [];
      this.MatchedDocuments.forEach((item: any) => {
        let batchId = item.batchId;
        if (item.userId != 0 || item.userId != '') {
          if (item.profileId == null)
            item.profileId = 0;
          count = count + 1;
          UploadDoc.append("BatchId", this.BatchId);
          UploadDoc.append("AdminUserId", this.UserId);
          UploadDoc.append("DocumentType", this.DocumentTypeId);
          this.filesToUpload.forEach((file: any | Blob) => {
            if (file.name == item.documentName) {
              let matchedFile: any;
              matchedFile = {
                UserId: item.userId,
                ProfileId: item.profileId,
                FileName: item.documentName
              }
              matchedFiles.push(matchedFile);
              UploadDoc.append("Files", file);
              UploadDoc.append("MatchedDocuments", JSON.stringify(matchedFile));
            }
          });
        }
      });

      this.investorService.PublishMatchedDocuments(UploadDoc).subscribe(data => {
        // this.BatchId = data;
        //this.updateBatch(count);
        if (data != null) {
          this.DocumentBatchDetail = data;
          this.DocumentTypeId = this.DocumentBatchDetail.documentType;
          this.batchName = this.DocumentBatchDetail.batchName;
          this.batchStatus = this.DocumentBatchDetail.status;
          this.FinalMatchedDocuments = [];
          this.FinalMatchedDocuments = this.DocumentBatchDetail.documents;
          this.uploadFilesShow = false;
          this.uploadFilesDone = true;
          this.matchShow = false;
          this.matchDone = true;
          this.reviewShow = false;
          this.reviewDone = true;
          this.publishDone = true;
          this.publishShow = true;
          this.Loader = false;
        }
      });
      this.filesToUpload = [];
    }
  }

  updateBatch(count: any) {
    let updateBatch: any;
    updateBatch = {
      AdminUserId: this.UserId,
      BatchId: this.BatchId,
      TotalDocuments: count,
      Status: 3
    }
    this.investorService.UpdateBatch(updateBatch).subscribe(data => {
      this.uploadFilesShow = false;
      this.uploadFilesDone = true;
      this.matchShow = false;
      this.matchDone = true;
      this.reviewShow = false;
      this.reviewDone = true;
      this.publishDone = true;
      this.publishShow = true;
    });

    this.investorService.GetDocumentBatchDetail(this.BatchId).subscribe(data => {
      this.DocumentBatchDetail = data;
      this.DocumentTypeId = this.DocumentBatchDetail.documentType;
      this.batchName = this.DocumentBatchDetail.batchName;
      this.batchStatus = this.DocumentBatchDetail.status;
      this.FinalMatchedDocuments = [];
      this.FinalMatchedDocuments = this.DocumentBatchDetail.documents;
      this.Loader = false;
    });
  }

  OnPublishDocumentsConfirmPopup() {
    this.PublishDocumentsConfirmPopup = true;
  }
  OnBulkUploadDocumentBack() {
    this.ShowHeaderSummary = true;
    this.ShowBulkDocumentUpload = false;
  }

  UploadDocuments() {
    this.BulkDocumentUploadPopUp = true;
    this.GetDocumentTypes();
    this.GetDocumentNameSeparators();
    this.GetDocumentNameDelimiters();
    this.GetDocumentNamePositions();
    this.BatchId = 0;
    this.uploadFilesShow = true;
    this.uploadFilesDone = false;
    this.reviewDone = false; this.reviewDone = false;
    this.matchDone = false; this.matchShow = false;
    this.publishDone = false; this.publishShow = false;
  }
  bulkDocumentUpload() {
    this.ShowHeaderSummary = false;
    this.ShowBulkDocumentUpload = true;
    this.ShowDocumentBatchDetail = true;
    this.Loader = true;
    this.investorService.GetAllDocumentBatches().subscribe(data => {
      this.DocumentBatches = data;
      this.Loader = false;
    })
  }
  onEditBatch(e: any) {
    this.Loader = false;
    this.BatchId = e.id;
    this.BulkUploadStepNavigation = true;
    this.ShowBulkDocumentUpload = false;
    this.UploadFile = true;
    this.GetDocumentTypes();
    this.GetDocumentNameDelimiters();
    this.GetDocumentNamePositions();
    this.GetDocumentNameSeparators();
    this.investorService.GetDocumentBatchDetail(this.BatchId).subscribe(data => {
      this.DocumentBatchDetail = data;
      this.DocumentTypeId = this.DocumentBatchDetail.documentType;
      this.NameDelimiterId = this.DocumentBatchDetail.nameDelimiter;
      this.NamePositionId = this.DocumentBatchDetail.namePosition;
      this.NameSeparatorId = this.DocumentBatchDetail.nameSeparator;
      this.batchName = this.DocumentBatchDetail.batchName;
      this.batchStatus = this.DocumentBatchDetail.status;
      if (this.batchStatus == 1 || this.batchStatus == 2) {
        this.uploadFilesShow = true;
        this.uploadFilesDone = false;
        this.matchDone = false; this.matchShow = false;
        this.reviewDone = false; this.reviewShow = false;
        this.publishDone = false; this.publishShow = false;
      }
      else if (this.batchStatus == 3) {
        this.investorService.GetDocumentBatchDetail(this.BatchId).subscribe(data => {
          this.DocumentBatchDetail = data;
          this.DocumentTypeId = this.DocumentBatchDetail.documentType;
          this.batchName = this.DocumentBatchDetail.batchName;
          this.batchStatus = this.DocumentBatchDetail.status;
          this.FinalMatchedDocuments = [];
          this.FinalMatchedDocuments = this.DocumentBatchDetail.documents;
        })
        this.uploadFilesShow = false;
        this.uploadFilesDone = true;
        this.matchDone = true; this.matchShow = false;
        this.reviewDone = true; this.reviewShow = false;
        this.publishDone = true; this.publishShow = true;
      }
      this.Loader = false;
    })
  }
  onDeleteBatch(e: any) {
    let batchId = e.id;
    this.investorService.DeleteDocumentBatch(this.UserId, batchId).subscribe(data => {
      this.investorService.GetAllDocumentBatches().subscribe(data => {
        this.DocumentBatches = data;
      });
    });
  }
  ViewDetails(e: any) {
    localStorage.setItem("InvestorId", e.id);
    localStorage.setItem("RouteName", "Investor");
    this.router.navigate(['./../user-details'], { relativeTo: this.route });
  }

  onDownloadFile(value: any, name: any) {
    var a = document.createElement('a');
    if (name == 'InvestorDoc') {
      a.href = value.filePath;
    }
    else {
      a.href = value.documentPath;
    }
    a.download = value.name;
    a.click();
  }

  OnCancelAddEditReservation() {
    this.AddEditReservationPopup = false;
  }
  GetReservationList() {
    this.investorService.GetReservationList().subscribe(data => {
      let x: any = data;
      this.ReservationList = [];
      this.ReservationList.push({ id: 0, name: 'Select', active: true })
      for (let i = 0; i < x.length; i++) {
        if (x[i].name != null) {
          this.ReservationList.push({ id: x[i].id, name: x[i].name, active: x[i].active })
        }
      }
    })
  }
  GetOfferingList() {
    this.investorService.GetOfferingList().subscribe(data => {
      let x: any = data;
      this.OfferingList = [];
      this.OfferingList.push({ id: 0, name: 'Select', active: true })
      for (let i = 0; i < x.length; i++) {
        if (x[i].name != null) {
          this.OfferingList.push({ id: x[i].id, name: x[i].name, active: x[i].active })
        }
      }
    })
  }

  GetProfile() {
    this.profileService.GetProfileById(this.InvestorId).subscribe(data => {
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

  onAddNewProfile() {
    this.ProfilePopup = true;
    this.ProfilePopup = true;
    this.IRAShow = true;
    this.LLCShow = false;
    this.Individualhow = false;
    this.TrustShow = false;
    this.JointShow = false;
    this.RetirementShow = false;
    this.Chooseprofile = 1
    this.IRAForm.reset();
    this.ArrayForm = [];
    this.StateProvinceId = 0;
    this.Distributionmethod = 0;
    this.IranameError = false;
    this.LlcnameError = false;
    this.FirstnameError = false;
    this.LastnameError = false;
    this.TrustnameError = false;
    this.RegistrationnameError = false;
    this.RetirementnameError = false;
    this.TitlesignorError = false;
    this.TaxError = false;
    this.ProfileId = 0
    this.IRAForm.enable();
    this.LLCForm.enable();
    this.IndividualForm.enable();
    this.TrustForm.enable();
    this.JointForm.enable();
    this.RetirementForm.enable();
    this.ACHBool = false;
    this.CheckBool = false;
    this.OtherBool = false
  }

  Archive() {
    this.ArchiveShow = !this.ArchiveShow;
  }


  numberValidation(event: any): Boolean {
    if (event.keyCode >= 48 && event.keyCode <= 57)
      return true;
    else
      return false;
  }

  onBatchName() {
    if (this.batchName == ' ' || this.batchName == null) {
      this.batchNameError = true;
    }
    else {
      this.batchNameError = false;
    }
  }
  onDelimiter() {
    if (this.NameDelimiterId == 0) {
      this.delimiterError = true;
    }
    else {
      this.delimiterError = false;
    }
  }
  onNamePosition() {
    if (this.NamePositionId == 0) {
      this.namePositionError = true;
    }
    else {
      this.namePositionError = false;
    }
  }
  onNameSeparator() {
    if (this.NameSeparatorId == 0) {
      this.nameSeparatorError = true;
    }
    else {
      this.nameSeparatorError = false;
    }
  }
  onDocumentType() {
    if (this.DocumentTypeId == 0) {
      this.documentTypeError = true;
    }
    else {
      this.documentTypeError = false;
    }
  }

  UploadDocument() {
    this.GetDocumentTypes();
    this.uploadFile = true;
    this.DocumentFile = [];
    this.DocSizeBool = false;
    this.DocSizeCount = 0;
    this.DocumentTypeId = 0;
  }

  onViewReviewFile(file: any) {
    let index = this.filesToUpload.findIndex((x: { name: any }) => x.name == file.documentName)
    this.pdfUrl = this.reviewFilePath[index].toString();
    this.ReviewDocumentViewPopup = true;
  }
  onReviewDownloadFile(file: any) {
    let index = this.filesToUpload.findIndex((x: { name: any }) => x.name == file.documentName);
    let url = this.reviewFilePath[index];
    var a = document.createElement('a');
    a.href = url;
    a.download = file.documentName;
    a.click();
  }
  onDeleteReviewDocument(file: any) {
    let index = this.MatchedDocuments.findIndex((x: { name: any }) => x.name = file.FileName);
    this.MatchedDocuments.splice(index, 1);
    this.reviewFilePath.splice(index, 1);
    this.FinalMatchedDocuments = this.MatchedDocuments;
  }
  OnRemoveREviewDoc(id: any) {
    this.DocSizeCount = 0;
    this.removedoc = this.DocumentFile.filter((x: { Id: any; }) => x.Id == id)
    this.DocumentFile = this.DocumentFile.filter((x: { Id: any; }) => x.Id != id)
    let index = this.filesToUpload.findIndex((x: { name: any }) => x.name == this.removedoc[0].File.name);
    this.filesToUpload = this.filesToUpload.filter((x: { name: any; }) => x.name != this.removedoc[0].File.name)
    this.reviewFilePath.splice(index, 1);
    this.DocSizeBool = false;
    for (let i = 0; i < this.DocumentFile.length; i++) {
      let size = this.DocumentFile[i].File.size / (1024 * 1024)
      if (size < 100) {
        this.DocSizeBool = false;
      }
      else {
        this.DocSizeBool = true;
        this.DocSizeCount = this.DocSizeCount + 1
      }
    }
    if (this.DocSizeCount > 0) {
      this.DocSizeBool = true;
    }
    else {
      this.DocSizeBool = false;
      this.DocSizeCount = 0;
    }
  }

  onAccountStatement() {
    if (this.TagDetailsList.length == 0) {
      this.toastr.info("Please select any row from the table", "Info!")
      this.ChooseBool = true;
    }
    else {
      this.AccountStatementArray = [];
      for (let i = 0; i < this.TagDetailsList.length; i++) {
        let x = this.InvestorDetails.filter((x: { id: any; }) => x.id == this.TagDetailsList[i].UserId)
        this.AccountStatementArray.push({
          InvestorId: x[0].id,
          Name: x[0].fullName,
          Email: x[0].emailId,
        })
      }
      this.AccountStatementPopup = true;
    }
  }

  onNotes(e: any) {
    this.NotePopup = true;
    this.EditBool = false;
    this.InvestorNoteId = e.id;
    this.EditInvestorNoteId = 0;
    this.WriteNoteBool = false;
    this.GetLeadId();
  }

  onTags(e: any) {
    this.TagId = e.id;
    this.TagName = e.name;   
    this.TagInvestors = [];
    this.TagDetailsViewPopup = true;
    this.investorService.GetTagInvestors(this.TagId).subscribe(data => {
      this.TagInvestors = data;
      // this.InvestorData = data;
      // if (this.InvestorData.length > 0) {
      //   this.TableView = true;
      //   this.InvestorNotes = ''
      // }
      // else {
      //   this.TableView = false;
      //   this.InvestorEmpty = true;
      // }
      this.Loader = false;
    })
  }

  OnLoadTags(e: any){
    this.TagInvestors = [];
    this.investorService.GetTagInvestors(e).subscribe(data => {
      this.TagInvestors = data;
      this.Loader = false;
    })
  }

  DeleteTagPopup(e: any){
    this.TagId = e.tagId;
    this.TagUserId = e.userId;
    this.DeleteTagInvestorsPopup = true;
    this.TagDeleteButton = true;
  }

  DeleteMultiTagPopup(e: any){
    this.TagId = e;
    this.DeleteTagInvestorsPopup = true;
    this.MultiTagDeleteButton = true;
  }

  DeleteTagInvstors() {
    this.Loader = true;
    // var tagId = e.tagId;
    // var userId = e.userId;
    var tagId = this.TagId;
    var userId = this.TagUserId;
    this.investorService.DeleteTagDetailInvestor(tagId, userId).subscribe(data => {
      if (data == true) {
        console.log("true");
        // this.onTags(tagId);
        this.OnLoadTags(tagId);
        this.Loader = false;
        this.toastr.success("Tags Deleted successfully", "Success!")
        this.GetInvestor();
        this.TagDetailsViewPopup = false;
      }
      else {
        console.log("false");
        this.Loader = false;
      }
      this.DeleteTagInvestorsPopup = false
      this.TagDeleteButton = false;
    })
  }

  DeleteMultiTagInvstors() {
    this.Loader = true;
    var tagId = this.TagId;
    this.investorService.DeleteTagDetailMultiInvestor(tagId).subscribe(data => {
      if (data == true) {
        // this.onTags(tagId);  
        this.OnLoadTags(tagId);     
        this.toastr.success("Tags Deleted successfully", "Success!")   
        this.GetInvestor();
        this.TagDetailsViewPopup = false;
        this.Loader = false;
      }
      else {
        this.Loader = false;
      }
      this.MultiTagDeleteButton = false;
    })
  }

  clearSelection() {
    this.AddTagPopup=false;
    this.selectedItems = [];
    this.MultiTag = [];
    this.Tagdetail = [];
    this.GetInvestor();
}

  GetLeadId() {
    this.investorService.GetInvestorNotes(this.InvestorNoteId).subscribe(data => {
      this.InvestorData = data;
      if (this.InvestorData.length > 0) {
        this.TableView = true;
        this.InvestorNotes = ''
      }
      else {
        this.TableView = false;
        this.InvestorEmpty = true;
      }
      this.Loader = false;
    })
  }

  ViewAccountSummary(val: any) {
    this.AccountStatementDataValue = {
      InvestorId: val.InvestorId,
    }
    this.accountStatementComponent.EditStatement(val)
  }

  onSendEmail() {

  }

  onSaveandUploadInvestor() {
    this.Loader = true;
    if (this.DocumentTypeId == 0 || this.DocumentFile.length >= 10 || this.DocumentFile.length == 0 || this.DocSizeBool == true) {
      if (this.DocumentTypeId == 0) {
        this.documentTypeError = true;
      }
      else {
        this.documentTypeError = false;
      }
      this.Loader = false;
    }
    else {
      if (this.DocumentFile.length <= 10 && this.DocumentFile.length > 0 && this.DocSizeBool == false) {
        const UploadDoc = new FormData();
        let userid: any = localStorage.getItem("InvestorId")
        UploadDoc.append("UserId", userid);
        UploadDoc.append("Type", this.DocumentTypeId);
        this.filesToUpload.forEach((item: string | Blob) => {
          UploadDoc.append('Files', item);
        });
        this.documentService.UploadDocument(UploadDoc).subscribe(data => {
          if (data == true) {
            this.uploadFile = false;
            this.GetDocument();
            this.DocumentFile = [];
            this.filesToUpload = [];
            this.toastr.success("Document added successfully", "Success!")
          }
        })
      }
    }
  }

  GetDocument() {
    this.documentService.GetAllDocument(this.InvestorId).subscribe(data => {
      this.DocumentData = data;
      this.Loader = false;
    })
  }

  onWriteANote() {
    this.InvestorEmpty = false;
    this.WriteNoteBool = true;
    this.EditBool = false;
    this.InvestorNotes = '';
  }

  NoteSave() {
    this.Loader = true;
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
          this.GetLeadId();
        }
        else {
          this.Loader = false;
        }
      })
    }
    else {
      this.investorService.UpdateInvestorNotes(notes).subscribe(data => {
        if (data == true) {
          this.WriteNoteBool = false;
          this.GetLeadId();
        }
        else {
          this.Loader = false;
        }
      })
    }
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

  DeleteNote(e: any) {
    this.Loader = true;
    this.investorService.DeleteInvestorNotes(this.UserId, e.id).subscribe(data => {
      if (data == true) {
        this.WriteNoteBool = false;
        this.GetLeadId();
      }
      else {
        this.Loader = false;
      }
    })
  }

  // DeleteInvestors(val: any) {
  //   this.OfferingData = '';
  //   this.DeleteConfirmationPopup = true;
  //   this.OfferingData = val;
  // }

  DeleteTagInvestors(e: any) {
    this.Loader = true;
    this.investorService.DeleteInvestorNotes(this.UserId, e.id).subscribe(data => {
      if (data == true) {
        this.WriteNoteBool = false;
        this.GetLeadId();
      }
      else {
        this.Loader = false;
      }
    })
  }

  EditNote(e: any) {
    this.WriteNoteBool = true;
    this.TableView = false;
    this.EditBool = true;
    this.InvestorNotes = e.notes;
    this.EditInvestorNoteId = e.id
  }

  SentEmail(){
    this.showSendEmail = true;
    this.InvestorparentMessage  = this.TagDetailsList;
  }

  receiveMessage() {
    this.showSendEmail = false;
    this.GetInvestor();
    }

}
