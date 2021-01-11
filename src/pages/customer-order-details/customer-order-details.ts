import { Component } from '@angular/core';
import {  NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { AppDataLinkProvider } from '../../providers/app-data-link/app-data-link';
import { IProduct, IOrder } from '../../models/interface';
import { CustomerOrdersPage } from '../customer-orders/customer-orders';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-customer-order-details',
  templateUrl: 'customer-order-details.html',
})
export class CustomerOrderDetailsPage {
  orderid: any;
  UDetails: any;
  userid: any;
  products: IProduct[];
  order: IOrder = new IOrder;
  constructor(public storage: Storage,
    public alertCtrl: AlertController, public loadingCtrl: LoadingController,
    public navCtrl: NavController, public navParams: NavParams, public datalink: AppDataLinkProvider) {
    this.orderid = this.navParams.get("orderid");
    this.getOrderDetails();
  }

  getOrderDetails() {
    let loading = this.loadingCtrl.create({
    });
    loading.present();
    this.datalink.GetOrderDetails(String(this.orderid))
      .subscribe(result => {
        loading.dismiss().catch(() => { });
        this.order = result[0];
        this.products = result[1];
      }, err => {
        this.datalink.showToast("bottom", "Your internet appears to be offline");
        loading.dismiss().catch(() => { });
        return false;
      });
  }

  ConfirmOrder(customerid) {
    let loading = this.loadingCtrl.create({
    });
    let confirm = this.alertCtrl.create({
      title: 'Confirm Delivered Order',
      message: 'Confirm this Order has been delivered and you have made payment?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            let order = "pending";
            this.navCtrl.setRoot(CustomerOrdersPage, { order });
          }
        },
        {
          text: 'Yes',
          handler: () => {
            loading.present();
            this.datalink.ConfirmOrder(String(this.orderid), String(customerid), "Admin")
              .subscribe(result => {
                loading.dismiss().catch(() => { });
                if (result[0] == "200") {
                  loading.dismiss().catch(() => { });
                  this.datalink.showToast('bottom', "Delivered");
                  this.datalink.appRate.promptForRating(true);
                  let order = "delivered";
                  this.navCtrl.setRoot(CustomerOrdersPage, { order });
                } else {
                  loading.dismiss().catch(() => { });
                  this.datalink.showToast('bottom', "Error try again");
                }
              }, err => {
                loading.dismiss().catch(() => { });
                this.datalink.showToast('bottom', 'Your internet appears to be offline');
                return false;
              });
          }
        }
      ]
    });
    loading.dismiss().catch(() => { });
    confirm.present();
  }

  CancelOrder() {
    let loading = this.loadingCtrl.create({
    });
    let confirm = this.alertCtrl.create({
      title: 'Cancel Order',
      message: 'Are you sure you want to cancel this order?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            let order = "cancelled";
            this.navCtrl.setRoot(CustomerOrdersPage, { order });
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.storage.ready().then(() => {
              this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
                if (loggedInUserDetails == null) {
                } else {
                  this.UDetails = loggedInUserDetails[1];
                  this.userid = this.UDetails.userid;
                  loading.present();
                  this.datalink.CancelOrder(String(this.userid), String(this.orderid))
                    .subscribe(result => {
                      loading.dismiss().catch(() => { });
                      if (result[0] == "200") {
                        loading.dismiss().catch(() => { });
                        this.datalink.showToast('bottom', "Cancelled");
                        let order = "cancelled";
                        this.navCtrl.setRoot(CustomerOrdersPage, { order });
                      } else {
                        loading.dismiss().catch(() => { });
                        this.datalink.showToast('bottom', "Error try again");
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
        }
      ]
    });
    loading.dismiss().catch(() => { });
    confirm.present();
  }

  DeleteOrder() {
    let loading = this.loadingCtrl.create({
    });
    let confirm = this.alertCtrl.create({
      title: 'Delete Order',
      message: 'Are you sure you want to Delete this order?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            let order = "pending";
            this.navCtrl.setRoot(CustomerOrdersPage, { order });
          }
        },
        {
          text: 'Yes',
          handler: () => {
            loading.present();
            this.storage.ready().then(() => {
              this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
                if (loggedInUserDetails == null) {
                } else {
                  this.UDetails = loggedInUserDetails[1];
                  this.userid = this.UDetails.userid;
                  loading.present();
                  this.datalink.DeleteOrder(String(this.orderid), String(this.userid))
              .subscribe(result => {
                loading.dismiss().catch(() => { });
                if (result[0] == "200") {
                  loading.dismiss().catch(() => { });
                  this.datalink.showToast('bottom', "Your order has been Deleted");
                  let order = "pending";
                  this.navCtrl.setRoot(CustomerOrdersPage, { order });
                } else {
                  loading.dismiss().catch(() => { });
                  this.datalink.showToast('bottom', "Error try again");
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
        }
      ]
    });
    loading.dismiss().catch(() => { });
    confirm.present();
  }


}
