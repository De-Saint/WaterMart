import { Component } from '@angular/core';
import {  NavController, NavParams, LoadingController } from 'ionic-angular';
import { AppDataLinkProvider } from '../../providers/app-data-link/app-data-link';
import { SupplierLocationsPage } from '../supplier-locations/supplier-locations';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-supplier-edit-location',
  templateUrl: 'supplier-edit-location.html',
})
export class SupplierEditLocationPage {
  slideOneForm: FormGroup;
  locationid: any;
  locationname: any;
  locationfees: any;

  constructor(public loadingCtrl: LoadingController, public storage: Storage,
    public datalink: AppDataLinkProvider,
    public formBuilder: FormBuilder, public navCtrl: NavController,
    public navParams: NavParams) {
    this.slideOneForm = formBuilder.group({
      locationname: [''],
      deliveryfees: [''],
    });
    this.locationid = navParams.get('locationid');
    this.locationname = navParams.get('locationname');
    this.locationfees = navParams.get('locationfees');

  }
  ionViewDidLoad() {
    if(this.locationid !== undefined){
      this.slideOneForm.controls['locationname'].setValue(this.locationname);
      this.slideOneForm.controls['deliveryfees'].setValue(this.locationfees);
       }
  }
  UpdateLocation() {
      let loading = this.loadingCtrl.create({
      });
      loading.present();
      this.datalink.UpdateLocation(this.locationid, this.slideOneForm.value.locationname, this.slideOneForm.value.deliveryfees)
      .subscribe(result => {
        loading.dismiss().catch(() => { });
        if(result == "success"){
          loading.dismiss().catch(() => { });
          this.datalink.showToast('bottom', "Location Updated");
          this.navCtrl.setRoot(SupplierLocationsPage);
        }else{
          loading.dismiss().catch(() => { });
          this.datalink.showToast('bottom', "Error try again");
        }
      }, err => {
         loading.dismiss().catch(() => { });
         return false;
      });
    
  }
}
