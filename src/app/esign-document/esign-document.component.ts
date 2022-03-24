import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { EsignDocumentService } from './esign-document.service';

@Component({
  selector: 'app-esign-document',
  templateUrl: './esign-document.component.html',
  styleUrls: ['./esign-document.component.css']
})
export class EsignDocumentComponent implements OnInit {
  esignDocumentList: any = [];
  filesToUpload: any = [];
  files: any = [];
  allowedFileExtensionsDocument: any = [];
  uploadEsignDocumentShow: boolean = false;
  ProfileId: any = [];
  sponsorId: any = 0;
  ProfileList: any = [];
  SponsorList: any = [
    { id: 0, name: 'Select' },
    { id: 1, name: 'Sponsor signed the template already.' },
    { id: 2, name: 'Sponsor will esign after the investor(s)' },
  ];
  InvestorSigningList: any = [
    { id: 0, value: 'Select' },
    { id: 1, value: '1' },
    { id: 2, value: '2' },
    { id: 3, value: '3' }
  ]
  SponsorSigningList: any = [
    { id: 0, value: 'Select' },
    { id: 1, value: '1' },
    { id: 2, value: '2' },
    { id: 3, value: '3' }
  ]
  SponsorError: boolean = false;
  dropdownSettings: IDropdownSettings = {};
  SponsorSelectedList: any = [];
  InvestorSignId: any = 0;
  InvestorSigningIdError: boolean = false;
  SponsorsigningShow: boolean = false;
  SponsorSignId: any = 0;
  SponsorSigningIdError: boolean = false;
  SponsorName1Id: any = 0;
  SponsorName2Id: any = 0;
  SponsorName3Id: any = 0;
  SponsorNameList: any = [];
  SponsorName1List: any = [];
  SponsorName2List: any = [];
  SponsorName3List: any = [];
  editProfileShow: boolean = false;
  editProfileSponsorCount: any;
  editProfileSponsorSigningOrder: any;
  editProfileSponsorInvestorCount: any;
  editProfileSponsor1: any;
  ProfileList1: any = [];
  DocumentViewShow: boolean = false;
  delTemplateConformationShow: boolean = false;
  adminUserId: any;
  SelectList: any = [];
  offeringId: any;
  documentView: any;
  deleteTemplateValue: any;
  SeletedProfileValue: any = [];
  editProfileId: any;
  esignDocumentProfile: any = [];
  collectedValue: any = [];
  signeddocument: any;
  errorShow: boolean = false;
  Selectedprofilevalue: any = [];
  Selectprofilevalue: any = [];
  listofName: any = [];
  constructor(private toastr: ToastrService, private _esigndocument: EsignDocumentService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.allowedFileExtensionsDocument = ['pdf', 'PDF'];
    this.adminUserId = Number(localStorage.getItem('UserId'));
    this.offeringId = +this.route.snapshot.params['id'];
    this.getProfileList();
    this.getSponsorList();
    this.getesignTemplate();
    // this.offeringId = +this.route.snapshot.params['id'];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      enableCheckAll: true,
    };
  }

  onItemSelect(item: any) {
    this.SponsorSelectedList.push(item);
    this.SeletedProfileValue.push
      ({
        'Id': 0,
        'AdminUserId': this.adminUserId,
        'CredoreSignTemplateId': this.editProfileId,
        'ProfileTypeId': item.id,
        'ProfileTypeName': item.name,
        'Active': true
      });
    for (var i = 0; i < this.esignDocumentProfile.length; i++) {
      for (var j = 0; j < this.esignDocumentProfile[i].profileTypes.length; j++) {
        if (this.esignDocumentProfile[i].profileTypes[j] == item.name) {
          this.collectedValue.push({
            'id': item.id,
            'name': this.esignDocumentProfile[i].profileTypes[j],
            'Active': true,
            'countId': this.esignDocumentProfile[i].investorCount
          });
          this.listofName.push(this.esignDocumentProfile[i].profileTypes[j]);
        }
        else {
          this.listofName.push(this.esignDocumentProfile[i].profileTypes[j]);
        }
      }
    }
    this.Selectprofilevalue.push(this.listofName.filter((data: any) => data != item.name));
  }

  onDeSelect(value: any) {
    this.SponsorSelectedList.splice(this.SponsorSelectedList.findIndex((item: any) => item.id === value.id), 1)
    this.collectedValue.splice(this.collectedValue.findIndex((item: any) => item.id === value.id), 1)
    let value1 = this.SeletedProfileValue.filter((item: any) => item.ProfileTypeId == value.id)
    if (value1.length > 0) {
      for (var i = 0; i < this.SeletedProfileValue.length; i++) {
        if (this.SeletedProfileValue[i].ProfileTypeId == value1[0].ProfileTypeId) {
          this.SeletedProfileValue[i].Active = false;
        }
      }
    }
  }

  onSelectAll(items: any) {
    console.log(items);
  }

  getProfileList() {
    this._esigndocument.getProfile().subscribe(data => {
      if (data) {
        this.ProfileList = data;
        this.ProfileList.push({
          'id': 0,
          'name': 'Select Profile'
        })
      }
    })
  }

  getesignTemplate() {
    this.esignDocumentList = [];
    this._esigndocument.getTemplate(this.offeringId).subscribe(data => {
      if (data) {
        this.esignDocumentList = data;
        for (var i = 0; i < this.esignDocumentList.length; i++) {
          let profilevalue = this.esignDocumentList[i].profileTypes.join(',');
          this.esignDocumentList[i].profileList = profilevalue
        }
      }
    })
  }

  getSponsorList() {
    this.SponsorNameList = [];
    this.SponsorName1List = [];
    this.SponsorName2List = [];
    this.SponsorName3List = [];
    this._esigndocument.getSponsor().subscribe(data => {
      if (data) {
        this.SponsorNameList = data;
        this.SponsorName1List = data;
        this.SponsorName2List = data;
        this.SponsorName3List = data;
        this.SponsorNameList.push({
          'id': 0,
          'emailId': 'Select Sponsor'
        })
      }
    })
  }


  onFilesSelect(event: any) {
    this.filesToUpload = [];
    // this.files = [];
    for (var i = 0; i < event.target.files.length; i++) {
      let ext: any;
      this.allowedFileExtensionsDocument.forEach((element: any) => {
        if (element == event.target.files[i].name.split('.').pop()) {
          this.filesToUpload.push(event.target.files[i]);
          ext = null;
          var temp: any = {};
          ext = event.target.files[i].name.split('.').pop();
          const file = event.target.files[i];
          const reader = new FileReader();
          reader.readAsDataURL(file);
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

  uploadDocument() {
    this.uploadEsignDocumentShow = true;
    for (var i = 0; i < this.esignDocumentList.length; i++) {
      this.esignDocumentProfile.push({
        'profileTypes': this.esignDocumentList[i].profileTypes,
        'investorCount': this.esignDocumentList[i].investorCount
      })
    }
  }

  RemoveAttachment(value: any) {
    this.files.splice(this.files.findIndex((item: any) => item.name === value.name), 1)
    this.filesToUpload.splice(this.filesToUpload.findIndex((item: any) => item.name === value.name), 1)
  }

  onchangeSponsorList(e: any) {
    if (+e.target.value == 0) {
      this.SponsorError = true;
    }
    else {
      this.SponsorError = false;
    }
    if (+e.target.value == 2) {
      this.SponsorsigningShow = true;
    }
  }

  onchangeInvestorSignId(e: any) {
    this.signeddocument = 0;
    this.Selectedprofilevalue = [];
    if (+e.target.value == 0) {
      this.InvestorSigningIdError = true;
    }
    else {
      this.InvestorSigningIdError = false;
    }
    for (var i = 0; i < this.collectedValue.length; i++) {
      if (this.collectedValue[i].countId == +e.target.value) {
        this.signeddocument = i + 1;
        this.Selectedprofilevalue.push(this.collectedValue[i].name);
      }
    }
    if (this.signeddocument != 0) {
      this.errorShow = true
    }
    else {
      this.errorShow = false;
    }
  }

  onchangeSponsorSignId(e: any) {
    if (+e.target.value == 0) {
      this.SponsorSigningIdError = true;
    }
    else {
      this.SponsorSigningIdError = false;
    }
  }

  openEsignTutorial() {
    var Url = 'https://syndicationprohelp.freshdesk.com/support/solutions/articles/47000875346-set-up-esign-templates';
    window.open(Url, "_blank");
  }

  onchangeSponsor1(e: any) {
    var sponsorId = +e.target.value;
    this.SponsorName2List = this.SponsorName2List.filter((item: any) => item.id !== sponsorId);
    this.SponsorName3List = this.SponsorName3List.filter((item: any) => item.id !== sponsorId);
  }

  onchangeSponsor2(e: any) {
    var sponsorId = +e.target.value;
    this.SponsorName1List = this.SponsorName1List.filter((item: any) => item.id !== sponsorId);
    this.SponsorName3List = this.SponsorName3List.filter((item: any) => item.id !== sponsorId);
  }

  onchangeSponsor3(e: any) {
    var sponsorId = +e.target.value;
    this.SponsorName1List = this.SponsorName1List.filter((item: any) => item.id !== sponsorId);
    this.SponsorName2List = this.SponsorName2List.filter((item: any) => item.id !== sponsorId);
  }

  editProfile(value: any) {
    this.editProfileId = value.id;
    this.SeletedProfileValue = [];
    this.ProfileId = [];
    if (value.getCredoreSignTemplateProfileMappings.length > 0) {
      for (var i = 0; i < value.getCredoreSignTemplateProfileMappings.length; i++) {
        this.SeletedProfileValue.push({
          'Id': value.getCredoreSignTemplateProfileMappings[i].id,
          'AdminUserId': this.adminUserId,
          'CredoreSignTemplateId': value.getCredoreSignTemplateProfileMappings[i].credoreSignTemplateId,
          'ProfileTypeId': value.getCredoreSignTemplateProfileMappings[i].profileTypeId,
          'ProfileTypeName': value.getCredoreSignTemplateProfileMappings[i].profileTypeName,
          'Active': true
        })
        this.ProfileId.push({ 'id': value.getCredoreSignTemplateProfileMappings[i].profileTypeId, 'name': value.getCredoreSignTemplateProfileMappings[i].profileTypeName })
      }
    }
    this.ProfileList1 = [];
    this._esigndocument.getProfile().subscribe(data => {
      if (data) {
        this.ProfileList1 = data;
        this.ProfileList1.push({
          'id': 0,
          'name': 'Select Profile'
        })
        for (var i = 0; i < this.esignDocumentList.length; i++) {
          if (this.esignDocumentList[i].id != value.id) {
            let index = this.ProfileList1.findIndex((item: any) => item.id == this.esignDocumentList[i].id);
            this.ProfileList1.splice(index, 1);
          }
        }
      }
    })
    this.editProfileShow = true;
    this.editProfileSponsorCount = 2;
    this.editProfileSponsorSigningOrder = 'Sponsor will esign after the investor(s)';
    this.editProfileSponsorInvestorCount = 1;
    this.editProfileSponsor1 = 'ashwin@gmail.com';
  }

  onDownloadFile(value: any) {
    var a = document.createElement('a');
    a.href = value.documentPath;
    a.download = value.documentName;
    a.click();
  }

  viewDocument(value: any) {
    this.documentView = value.documentPath;
    this.DocumentViewShow = true;
  }


  deleteTemplateConformation(value: any) {
    this.deleteTemplateValue = value;
    this.delTemplateConformationShow = true;
  }

  saveandUpload() {
    const emailSign = new FormData();
    emailSign.append("OfferingId", this.offeringId);
    emailSign.append("AdminUserId", this.adminUserId);
    for (let i = 0; i < this.SponsorSelectedList.length; i++) {
      this.SelectList.push(this.SponsorSelectedList[i].id)
    }
    emailSign.append("ProfileTypes", this.SelectList);
    this.filesToUpload.forEach((item: any) => {
      emailSign.append('eSignTemplateDocument', item);
    });
    emailSign.append("SponserSigningOrder", this.sponsorId);
    emailSign.append("SponserCount", this.SponsorSignId);
    emailSign.append("InvestorCount", this.InvestorSignId);
    emailSign.append("FirstSponserId", this.SponsorName1Id)
    emailSign.append("SecondSponserId", this.SponsorName2Id)
    emailSign.append("ThirdSponserId", this.SponsorName3Id)
    emailSign.append("DocumentId", '0')
    emailSign.append("Active", 'true')
    emailSign.append("Status", '0')
    this._esigndocument.saveTemplate(emailSign).subscribe(data => {
      if (data) {
        this.uploadEsignDocumentShow = false;
        this.files = [];
        this.filesToUpload = [];
        this.ProfileId = [];
        this.sponsorId = 0;
        this.InvestorSignId = 0;
        this.SponsorSignId = 0;
        this.SponsorName1Id = 0;
        this.SponsorName2Id = 0;
        this.SponsorName3Id = 0;
        this.errorShow = false;
        this.toastr.success('Template saved sucessfully');
        this.getesignTemplate();
      }
      else {
        this.toastr.error('Template saved Failed')
      }
    })
  }

  deleteTemplate() {
    this._esigndocument.deleteTemplate(this.deleteTemplateValue.id, this.offeringId, this.adminUserId).subscribe(data => {
      if (data) {
        this.delTemplateConformationShow = false;
        this.toastr.success('Template deleted sucessfully');
        this.getesignTemplate();
      }
      else {
        this.toastr.error('Template deleted failed');
      }
    })
  }

  UpdateTemplate() {
    this._esigndocument.updateTemplate(this.SeletedProfileValue).subscribe(data => {
      if (data) {
        this.toastr.success('Template Updated Sucessfully');
        this.editProfileShow = false;
        this.getesignTemplate();
      }
      else {
        this.toastr.error("Template Updated Failed")
      }
    })
  }

  CloseuploadEsignDocumentShow() {
    this.uploadEsignDocumentShow = false;
    this.files = [];
    this.filesToUpload = [];
    this.ProfileId = [];
    this.sponsorId = 0;
    this.InvestorSignId = 0;
    this.SponsorSignId = 0;
    this.SponsorName1Id = 0;
    this.SponsorName2Id = 0;
    this.SponsorName3Id = 0;
    this.errorShow = false;
  }

}
