import { Component } from '@angular/core';
import {  NavController, NavParams, LoadingController } from 'ionic-angular';
import { AppDataLinkProvider } from '../../providers/app-data-link/app-data-link';
import { Storage } from '@ionic/storage';
import { IUser } from '../../models/Interface';

@Component({
  selector: 'page-admin-accounts',
  templateUrl: 'admin-accounts.html',
})
export class AdminAccountsPage {
  availablebalance: any;
  UDetails: any;
  userid: any;
  transactionnumber: any;
  totalbalance: any
  totalmonthlybal: any;
  bal:string;
  suppliers: IUser[];
  originalsuppliers: IUser[];
  error: any;
  nouser: any;
  constructor(public datalink: AppDataLinkProvider,
    public loadingCtrl: LoadingController,
    public storage: Storage,
    public navCtrl: NavController, public navParams: NavParams) {
    this.GetAvailableBalance();
    this.bal = navParams.get("balcheck");
    if(this.bal === "ppt"){
      this.getTransaction();
    }else if(this.bal === "mfr"){
      this.getRate();
    }else{
      this.getTransaction();
    }
   
    
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
          this.datalink.GetAvailableBalance(String(this.userid), "Admin")
            .subscribe(accounts => {
              loading.dismiss().catch(() => { });
              this.transactionnumber =  accounts[0];
              this.totalbalance =  accounts[1];
              this.totalmonthlybal =  accounts[7];
            }, err => {
              loading.dismiss().catch(() => { });
              return false;
            });
        }
      });
    });

  }
  getTransaction(){
    this.bal = 'ppt';
    this.datalink.GetPPTransactionSuppliers().subscribe(suppliers => {
      if (suppliers[0] === "400") {
        this.error = suppliers[1];
        this.nouser = "nouser";
        this.suppliers = [];
      } else {
        this.nouser = "full";
        this.suppliers = suppliers[1];
      }
    }, (err) => {
      this.datalink.showToast('bottom', "Your internet connection appears to be offline, please try again");
      return false;
    });
  }
  getRate(){
    this.bal = 'mfr';
    this.datalink.GetMFRateSuppliers().subscribe(suppliers => {
      if (suppliers[0] === "400") {
        this.error = suppliers[1];
        this.nouser = "nouser";
        this.originalsuppliers = [];
      } else {
        this.nouser = "full";
        this.originalsuppliers = suppliers[1];
      }
    }, (err) => {
      this.datalink.showToast('bottom', "Your internet connection appears to be offline, please try again");
      return false;
    });
  }
}
