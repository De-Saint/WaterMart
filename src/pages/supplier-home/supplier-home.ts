import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AppDataLinkProvider } from '../../providers/app-data-link/app-data-link';
import { ILocation, IMessage, IOrder, ISupplier, IProduct } from '../../models/interface';

import { SupplierAccountsPage } from '../supplier-accounts/supplier-accounts';
import { SupplierLocationsPage } from '../supplier-locations/supplier-locations';
import { SupplierMessagesPage } from '../supplier-messages/supplier-messages';
import { SupplierOrdersPage } from '../supplier-orders/supplier-orders';
import { SupplierProductsPage } from '../supplier-products/supplier-products';


@Component({
  selector: 'page-supplier-home',
  templateUrl: 'supplier-home.html',
})
export class SupplierHomePage {
  userid: any;
  UDetails: any;
  totalInboxmsgs: any;
  totalSentmsgs: any;
  originalsuppliers: ISupplier[];
  totalpending: any;
  totaldelivered: any;
  totalcancelled: any;
  inboxmsgs: IMessage[];
  sentmsgs: IMessage[];
  orders: IOrder[];
  suppliers: ISupplier[];
  totalbalance: any;
  totallocations: any;
  locations: ILocation[];
  totalproducts: any;
  products: IProduct[];
  constructor(public storage: Storage, public loadingCtrl: LoadingController, public datalink: AppDataLinkProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.getInboxMsg();
    this.getSentMsg();
    this.getPending();
    this.getCancelled();
    this.getDelivered();
    this.GetAvailableBalance();
    this.getLocations();
    this.getProducts();
  }

  ionViewDidLoad() {

  }

  getProducts() {
    this.storage.ready().then(() => {
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
        } else {
          this.UDetails = loggedInUserDetails[1];
          this.userid = this.UDetails.userid;
          this.datalink.getProducts(String(this.userid), "Supplier").subscribe(products => {

            if (products[0] === "400") {
              this.products = [];
              this.totalproducts = 0;
            } else {
              this.products = products[1];
              this.totalproducts = this.products.length;
            }
          }, (err) => {
            this.datalink.showToast('bottom', "Server error");
            return false;
          });
        }
      });
    });
  }

  getLocations() {
    let loading = this.loadingCtrl.create({
    });
    loading.present();
    this.storage.ready().then(() => {
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
        } else {
          this.UDetails = loggedInUserDetails[1];
          this.userid = this.UDetails.userid;
          this.datalink.getLocation("Supplier", this.userid).subscribe(locations => {
            loading.dismiss().catch(() => { });
            if (locations[0] === "400") {
              this.totallocations = 0;
              this.locations = [];
            } else {
              this.locations = locations[1];
              this.totallocations = this.locations.length;
            }
          }, (err) => {
            loading.dismiss().catch(() => { });
            this.datalink.showToast('bottom', "Server error");
            return false;
          });
        }
      });
    });

  }
  getInboxMsg() {
    this.storage.ready().then(() => {
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
        } else {
          this.UDetails = loggedInUserDetails[1];
          this.userid = this.UDetails.userid;
          this.datalink.GetInboxMessages(this.userid)
            .subscribe(inboxmsgs => {
              if (inboxmsgs == null) {
                this.totalInboxmsgs = 0;
              } else {
                this.totalInboxmsgs = inboxmsgs;
              }
            }, (err) => {
              return false;
            });
        }
      });
    });
  }

  getSentMsg() {
    this.storage.ready().then(() => {
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
        } else {
          this.UDetails = loggedInUserDetails[1];
          this.userid = this.UDetails.userid;
          this.datalink.GetSentMessages(this.userid)
            .subscribe(sentmsgs => {
              if (sentmsgs == null) {
                this.totalSentmsgs = 0;
              } else {
                this.totalSentmsgs = sentmsgs;
              }
            }, (err) => {
              return false;
            });
        }
      });
    });
  }

  getPending() {
    this.storage.ready().then(() => {
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
        } else {
          this.UDetails = loggedInUserDetails[1];
          this.userid = this.UDetails.userid;
          this.datalink.getPlacedOrders(this.userid, "Pending", "Admin")
            .subscribe(result => {
              if (result[0] === "200") {
                this.orders = result[1];
                this.totalpending = this.orders.length;
              } else {
                this.orders = [];
                this.totalpending = 0;
              }
            }, err => {
              return false;
            });
        }
      });
    });

  }
  getDelivered() {
    this.storage.ready().then(() => {
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
        } else {
          this.UDetails = loggedInUserDetails[1];
          this.userid = this.UDetails.userid;
          this.datalink.getPlacedOrders(this.userid, "Delivered", "Admin")
            .subscribe(result => {
              if (result[0] === "200") {
                this.orders = result[1];
                this.totaldelivered = this.orders.length;
              } else {
                this.orders = [];
                this.totaldelivered = 0;
              }
            }, err => {
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


  GetAvailableBalance() {
    this.storage.ready().then(() => {
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
        } else {
          this.UDetails = loggedInUserDetails[1];
          this.userid = this.UDetails.userid;
          this.datalink.GetAvailableBalance(String(this.userid), "Admin")
            .subscribe(accounts => {
              this.totalbalance = accounts[1];
            }, err => {
              return false;
            });
        }
      });
    });

  }


  getBal(){
    this.navCtrl.setRoot(SupplierAccountsPage);
  }
  getPend(){
    let order = "pending";
    this.navCtrl.setRoot(SupplierOrdersPage, {order});
  }
  getCanc(){
    let order = "cancelled";
    this.navCtrl.setRoot(SupplierOrdersPage, {order});
  }
  getDeli(){
    let order = "delivered";
    this.navCtrl.setRoot(SupplierOrdersPage, {order});
  }
  getLoca(){
    this.navCtrl.setRoot(SupplierLocationsPage);
  }
  getProd(){
    this.navCtrl.setRoot(SupplierProductsPage);
  }
  getInbox(){
    let msg = "inbox";
    this.navCtrl.setRoot(SupplierMessagesPage, {msg});
  }
  getSent(){
    let msg = "sent";
    this.navCtrl.setRoot(SupplierMessagesPage, {msg});
  }
}
