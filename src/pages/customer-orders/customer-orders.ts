import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { AppDataLinkProvider } from '../../providers/app-data-link/app-data-link';
import { IProduct, IOrder } from '../../models/interface';
import { CustomerOrderDetailsPage } from '../customer-order-details/customer-order-details';


@Component({
  selector: 'page-customer-orders',
  templateUrl: 'customer-orders.html',
})
export class CustomerOrdersPage {
  ORDER: string = 'pend';
  orderSegment: any;
  orderid: any;
  UDetails: any;
  products: IProduct[];
  orders: IOrder[];
  originalorders: IOrder[];
  userid: any;
  noprod: any;
  constructor(public storage: Storage, public loadingCtrl: LoadingController, public navCtrl: NavController, public datalink: AppDataLinkProvider, public navParams: NavParams) {
    this.orderSegment = this.navParams.get('order');
    this.orderid = navParams.get('orderid');
    if (this.orderSegment == undefined || this.orderSegment == null) {
      this.ORDER = 'pending';
      this.getPending();
    } else if (this.orderSegment == "pending") {
      this.ORDER =  'pending';
      this.getPending();
    } else if (this.orderSegment == "delivered") {
      this.ORDER = 'delivered';
      this.getDelivered();
    } else if (this.orderSegment == "cancelled") {
      this.ORDER = 'cancelled';
      this.getCancelled();
    }
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
          this.datalink.getPlacedOrders(this.userid, "Pending", "Customer")
            .subscribe(result => {
              loading.dismiss().catch(() => { });
              if (result[0] === "200") {
                this.originalorders = result[1];
                if (this.originalorders.length > 0) {
                  this.orders = result[1];
                  this.noprod = "prod";
                } else {
                  this.orders = [];
                  this.noprod = "noprod";
                }
              } else {
                this.orders = [];
                this.noprod = "noprod";
                return false;
              }
            }, err => {
              loading.dismiss().catch(() => { });
              this.datalink.showToast('bottom', 'Your internet appears to be offline');
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
          this.datalink.getPlacedOrders(this.userid, "Delivered", "Customer")
            .subscribe(result => {
              loading.dismiss().catch(() => { });
              if (result[0] === "200") {
                this.originalorders = result[1];
                if (this.originalorders.length > 0) {
                  this.orders = result[1];
                  this.noprod = "prod";
                } else {
                  this.orders = [];
                  this.noprod = "noprod";
                }
              } else {
                this.orders = [];
                this.noprod = "noprod";
                return false;
              }
            }, err => {
              loading.dismiss().catch(() => { });
              this.datalink.showToast('bottom', 'Your internet appears to be offline');
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
          this.datalink.getPlacedOrders(this.userid, "Cancelled", "Customer")
            .subscribe(result => {
              loading.dismiss().catch(() => { });
              if (result[0] === "200") {
                this.originalorders = result[1];
                if (this.originalorders.length > 0) {
                  this.orders = result[1];
                  this.noprod = "prod";
                } else {
                  this.orders = [];
                  this.noprod = "noprod";
                }
              } else {
                this.orders = [];
                this.noprod = "noprod";
                return false;
              }
            }, err => {
              loading.dismiss().catch(() => { });
              this.datalink.showToast('bottom', 'Your internet appears to be offline');
              return false;
            });
        }
      });
    });
  }

  GotoOrderDetails(orderid) {
    this.navCtrl.push(CustomerOrderDetailsPage, { orderid });
  }


}
