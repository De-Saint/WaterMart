import { Component } from '@angular/core';
import {  NavController, NavParams, LoadingController } from 'ionic-angular';
import { AppDataLinkProvider } from '../../providers/app-data-link/app-data-link';
import { SupplierLocationsPage } from '../supplier-locations/supplier-locations';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-supplier-add-locations',
  templateUrl: 'supplier-add-locations.html',
})
export class SupplierAddLocationsPage {

  slideOneForm: FormGroup;
  locationid: any;
  locationname: any;
  locationfees: any;
  UDetails: any;
  userid: any;
  constructor(public loadingCtrl: LoadingController, public storage: Storage,
    public datalink: AppDataLinkProvider,
    public formBuilder: FormBuilder, public navCtrl: NavController,
    public navParams: NavParams) {
    this.slideOneForm = formBuilder.group({
      locationname: [''],
      deliveryfees: [''],
    });

  }

  ionViewDidLoad() {

  }
  AddLocation() {
    let loading = this.loadingCtrl.create({
    });
    loading.present();
    this.storage.ready().then(() => {
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
        } else {
          this.UDetails = loggedInUserDetails[1];
          this.userid = this.UDetails.userid;
          this.datalink.AddLocation(this.userid, this.slideOneForm.value.locationname, this.slideOneForm.value.deliveryfees)
            .subscribe(result => {
              loading.dismiss().catch(() => { });
              if (result == "success") {
                loading.dismiss().catch(() => { });
                this.datalink.showToast('bottom', "Location Added");
                this.navCtrl.setRoot(SupplierLocationsPage);
              } else {
                loading.dismiss().catch(() => { });
                this.datalink.showToast('bottom', "Error try again");
              }
            }, err => {
              loading.dismiss().catch(() => { });
              return false;
            });
        }
      });
    });
  }


 
}
