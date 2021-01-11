import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import {  NavController, AlertController, NavParams, LoadingController } from 'ionic-angular';
import { AppDataLinkProvider } from '../../providers/app-data-link/app-data-link';
import { IProduct, IOrder } from '../../models/interface';
import {AdminOrdersPage} from '../admin-orders/admin-orders'

@Component({
  selector: 'page-admin-order-details',
  templateUrl: 'admin-order-details.html',
})
export class AdminOrderDetailsPage {
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
            this.navCtrl.setRoot(AdminOrdersPage, { order });
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
                  this.navCtrl.setRoot(AdminOrdersPage, { order });
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
