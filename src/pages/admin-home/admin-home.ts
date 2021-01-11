import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AppDataLinkProvider } from '../../providers/app-data-link/app-data-link';
import { IUser, IMessage, IOrder, ISupplier } from '../../models/interface';

import { AdminAccountsPage } from '..//admin-accounts/admin-accounts';
import { AdminCustomersPage } from '..//admin-customers/admin-customers';
import { AdminMessagesPage } from '..//admin-messages/admin-messages';
import { AdminOrdersPage } from '..//admin-orders/admin-orders';
import { AdminSuppliersPage } from '../admin-suppliers/admin-suppliers';







@Component({
  selector: 'page-admin-home',
  templateUrl: 'admin-home.html',
})
export class AdminHomePage {
  userid: any;
  UDetails: any;
  totalInboxmsgs: any;
  totalSentmsgs: any;
  originalsuppliers: ISupplier[];
  totalmonthlyrateSubs: any;
  totalpercentageSubs: any;
  totalpending: any;
  totaldelivered: any;
  totalcancelled: any;
  inboxmsgs: IMessage[];
  sentmsgs: IMessage[];
  orders: IOrder[];
  suppliers: ISupplier[];
  totalbalance: any;
  totalcustomers: any;
  customers: IUser[];
  totalsuppliers: any;
  totalactivatedsuppliers: any;
  totalnonactivatedsuppliers: any;
  constructor(public storage: Storage, public loadingCtrl: LoadingController, public datalink: AppDataLinkProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.getInboxMsg();
    this.getSentMsg();
    this.getTransaction();
    this.getRate();
    this.getPending();
    this.getCancelled();
    this.getDelivered();
    this.GetAvailableBalance();
    this.getCustomers();
    this.getTotalSuppliers();
  }

  getInboxMsg() {
    let loading = this.loadingCtrl.create({
    });
    this.storage.ready().then(() => {
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
        } else {
          this.UDetails = loggedInUserDetails[1];
          this.userid = this.UDetails.userid;
          loading.present();
          this.datalink.GetInboxMessages(this.userid)
            .subscribe(inboxmsgs => {
              loading.dismiss().catch(() => { });
              if (inboxmsgs == null) {
                this.totalInboxmsgs = 0;
              } else {
                this.totalInboxmsgs = inboxmsgs;
              }
            }, (err) => {
              loading.dismiss().catch(() => { });
              return false;
            });
        }
      });
    });
  }

  getSentMsg() {
    let loading = this.loadingCtrl.create({
    });
    this.storage.ready().then(() => {
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
        } else {
          this.UDetails = loggedInUserDetails[1];
          this.userid = this.UDetails.userid;
          loading.present();
          this.datalink.GetSentMessages(this.userid)
            .subscribe(sentmsgs => {
              loading.dismiss().catch(() => { });
              this.totalSentmsgs = sentmsgs;
            }, (err) => {
              loading.dismiss().catch(() => { });
              return false;
            });
        }
      });
    });
  }

  getPending() {
    let loading = this.loadingCtrl.create({
    });
    this.storage.ready().then(() => {
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
        } else {
          this.UDetails = loggedInUserDetails[1];
          this.userid = this.UDetails.userid;
          loading.present();
          this.datalink.getPlacedOrders(this.userid, "Pending", "Admin")
            .subscribe(result => {
              loading.dismiss().catch(() => { });
              if (result[0] === "200") {
                this.orders = result[1];
                this.totalpending = this.orders.length;
              } else {
                this.orders = [];
                this.totalpending = 0;
              }
            }, err => {
              loading.dismiss().catch(() => { });
              return false;
            });
        }
      });
    });

  }
  getDelivered() {
    let loading = this.loadingCtrl.create({
    });
    this.storage.ready().then(() => {
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
        } else {
          this.UDetails = loggedInUserDetails[1];
          this.userid = this.UDetails.userid;
          loading.present();
          this.datalink.getPlacedOrders(this.userid, "Delivered", "Admin")
            .subscribe(result => {
              loading.dismiss().catch(() => { });
              if (result[0] === "200") {
                this.orders = result[1];
                this.totaldelivered = this.orders.length;
              } else {
                this.orders = [];
                this.totaldelivered = 0;
              }
            }, err => {
              loading.dismiss().catch(() => { });
              return false;
            });
        }
      });
    });
  }
  getCancelled() {
    let loading = this.loadingCtrl.create({
    });
    this.storage.ready().then(() => {
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
        } else {
          this.UDetails = loggedInUserDetails[1];
          this.userid = this.UDetails.userid;
          loading.present();
          this.datalink.getPlacedOrders(this.userid, "Cancelled", "Admin")
            .subscribe(result => {
              loading.dismiss().catch(() => { });
              if (result[0] === "200") {
                this.orders = result[1];
                this.totalcancelled = this.orders.length;
              } else {
                this.orders = [];
                this.totalcancelled = 0;
              }
            }, err => {
              loading.dismiss().catch(() => { });
              return false;
            });
        }
      });
    });
  }

  getTransaction() {
    this.datalink.GetPPTransactionSuppliers().subscribe(suppliers => {
      if (suppliers[0] === "400") {
        this.suppliers = [];
        this.totalpercentageSubs = 0;
      } else {
        this.suppliers = suppliers[1];
        this.totalpercentageSubs = this.suppliers.length;
      }
    }, (err) => {
      this.datalink.showToast('bottom', "Your internet connection appears to be offline, please try again");
      return false;
    });
  }
  getRate() {
    this.datalink.GetMFRateSuppliers().subscribe(originalsuppliers => {
      if (originalsuppliers[0] === "400") {
        this.totalmonthlyrateSubs = 0
        this.originalsuppliers = [];
      } else {
        this.originalsuppliers = originalsuppliers[1];
        this.totalmonthlyrateSubs = this.originalsuppliers.length;
      }
    }, (err) => {
      this.datalink.showToast('bottom', "Your internet connection appears to be offline, please try again");
      return false;
    });
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
              this.totalbalance = accounts[1];
            }, err => {
              loading.dismiss().catch(() => { });
              return false;
            });
        }
      });
    });

  }

  getCustomers() {
    let firstCount = "0";
    this.datalink.getCustomers(firstCount).subscribe(customers => {
      if (customers[0] === "400") {
        this.totalcustomers = 0;
      } else {
        this.customers = customers[1];
        this.totalcustomers = this.customers.length;
      }
    }, (err) => {
      return false;
    });
  }
  getTotalSuppliers() {
    this.datalink.GetAllSuppliers().subscribe(total => {
      this.totalsuppliers = total[0];
      this.totalactivatedsuppliers = total[1];
      this.totalnonactivatedsuppliers = total[2];
    }, (err) => {
      return false;
    });
  }

  getBal(){
    this.navCtrl.setRoot(AdminAccountsPage);
  }
  getSupp(){
    this.navCtrl.setRoot(AdminSuppliersPage);
  }
  getCust(){
    this.navCtrl.setRoot(AdminCustomersPage);
  }
  getPend(){
    let order = "pending";
    this.navCtrl.setRoot(AdminOrdersPage, {order});
  }
  getCanc(){
    let order = "cancelled";
    this.navCtrl.setRoot(AdminOrdersPage, {order});
  }
  getDeli(){
    let order = "delivered";
    this.navCtrl.setRoot(AdminOrdersPage, {order});
  }
  getMFRBal(){
    let balcheck = "mfr";
    this.navCtrl.setRoot(AdminAccountsPage, {balcheck});
  }
  getPPTBal(){
    let balcheck = "ppt";
    this.navCtrl.setRoot(AdminAccountsPage, {balcheck});
  }
  getInbox(){
    let msg = "inbox";
    this.navCtrl.setRoot(AdminMessagesPage, {msg});
  }
  getSent(){
    let msg = "sent";
    this.navCtrl.setRoot(AdminMessagesPage, {msg});
  }
}
