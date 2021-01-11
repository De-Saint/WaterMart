import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { AppDataLinkProvider } from '../../providers/app-data-link/app-data-link';
import {IUser} from '../../models/interface';

@Component({
  selector: 'page-admin-customer-details',
  templateUrl: 'admin-customer-details.html',
})
export class AdminCustomerDetailsPage {
  userid:any;
  customer: IUser;
    constructor(public loadingCtrl: LoadingController, public datalink: AppDataLinkProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.userid = this.navParams.get("userid");
    }
  
    ionViewDidLoad() {
      this.getCustomerDetails(this.userid);
    }
   getCustomerDetails(userid) {
    let loading = this.loadingCtrl.create({
    });
    loading.present();
      this.datalink.getCustomerDetails(userid).subscribe(customer => {
        this.customer = customer;
        loading.dismiss().catch(() => { });
      }, (err) => {
        loading.dismiss().catch(() => { });
        this.datalink.showToast('bottom', "Your internet connection appears to be offline, please try again");
        return false;
      });
  
    }
}
