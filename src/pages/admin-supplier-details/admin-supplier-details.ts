import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { AppDataLinkProvider } from '../../providers/app-data-link/app-data-link';
import {IUser} from '../../models/interface';


@Component({
  selector: 'page-admin-supplier-details',
  templateUrl: 'admin-supplier-details.html',
})
export class AdminSupplierDetailsPage {

  userid:any;
  supplier: IUser;
    constructor(public loadingCtrl: LoadingController, public datalink: AppDataLinkProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.userid = this.navParams.get("userid");
    }
  
    ionViewDidLoad() {
      this.getSupplierDetails(this.userid);
    }
    getSupplierDetails(userid) {
    let loading = this.loadingCtrl.create({
    });
    loading.present();
      this.datalink.getSupplierDetails(userid).subscribe(supplier => {
        this.supplier = supplier;
        loading.dismiss().catch(() => { });
      }, (err) => {
        loading.dismiss().catch(() => { });
        this.datalink.showToast('bottom', "Your internet connection appears to be offline, please try again");
        return false;
      });
  
    }

}
