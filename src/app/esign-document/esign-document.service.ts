import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EsignDocumentService {
  APIURL = environment.BASE_URL;

  constructor(private http : HttpClient) { }

  getProfile(){
    return this.http.get(this.APIURL + '/Profile/getuserprofiletypes' ,{responseType : 'json'});
  }

  getSponsor(){
    return this.http.get(this.APIURL + '/portfolio/getsponsers' ,{responseType : 'json'});
  }

  getTemplate(Id: any){
    return this.http.get(this.APIURL + '/portfolio/getcredoresigntemplates/' + Id ,{responseType : 'json'});
  }
  
  saveTemplate(data: any){
    return this.http.post(this.APIURL + '/portfolio/addcredoresigntemplate', data,{responseType : 'json'});
  }

  updateTemplate(data: any){
    return this.http.post(this.APIURL + '/portfolio/utpdatecredoresigntemplateprofilemapping', data,{responseType : 'json'});
  }
  
  deleteTemplate(Id : any, OfferingId: any, UserId : any){
    return this.http.delete(this.APIURL + '/portfolio/deletecredoresigntemplate/' + Id + '/' + OfferingId + '/' + UserId, {responseType : 'json'})
  }
}
