import { Component } from '@angular/core';
import {  NavController, NavParams, LoadingController } from 'ionic-angular';
import { AppDataLinkProvider } from '../../providers/app-data-link/app-data-link';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-supplier-accounts',
  templateUrl: 'supplier-accounts.html',
})
export class SupplierAccountsPage {
  UDetails: any;
  userid: any;
  transactionnumber: any;
  totalbalance: any
  PaymentPlan: any
  PaymentAmount: any
  paydate: any
  payduedate: any
  paymentStatus: any
  constructor(public datalink: AppDataLinkProvider,
    public loadingCtrl: LoadingController,
    public storage: Storage,
    public navCtrl: NavController, public navParams: NavParams) {
    this.GetAvailableBalance();
  }

  GetAvailableBalance() {
    let loading = this.loadingCtrl.create({
    });
    this.storage.ready().then(() => {
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
        } else {
          this.UDetails = loggedInUserDetails[1];
          this.userid = this.UDetails.userid;
          loading.present();
          this.datalink.GetAvailableBalance(String(this.userid), "Supplier")
            .subscribe(accounts => {
              loading.dismiss().catch(() => { });
              this.transactionnumber =  accounts[0];
              this.totalbalance =  accounts[1];
              this.PaymentPlan =  accounts[2];
              this.PaymentAmount =  accounts[3];
              this.paydate =  accounts[4];
              this.payduedate =  accounts[5];
              this.paymentStatus =  accounts[6];
            }, err => {
              loading.dismiss().catch(() => { });
              return false;
            });
        }
      });
    });

  }


}
